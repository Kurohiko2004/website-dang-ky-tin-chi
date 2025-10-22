const db = require('../models');

const layThongTinCaNhan = async (req, res) => {
    try {
        const { id: GiangVien_id } = req.user;

        const giangVien = await db.GiangVien.findByPk(GiangVien_id, {
            attributes: { exclude: ['password'] }
        });

        if (!giangVien) {
            return res.status(404).json({ message: 'Giảng viên không tồn tại' });
        }

        res.status(200).json({
            message: 'Lấy thông tin cá nhân thành công!',
            data: giangVien
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const layLopCuaGiangVien = async (req, res) => {
    try {
        const { id: GiangVien_id } = req.user;

        const danhSachLop = await db.LopTinChi.findAll({
            where: {
                GiangVien_id: GiangVien_id
            },
            include: [
                {
                    model: db.MonHoc,
                    attributes: ['ten', 'soTinChi']
                }
            ]
        });

        res.status(200).json({
            message: 'Lấy danh sách lớp thành công!',
            data: danhSachLop
        });

    } catch (error) {
        res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};

const layDSSinhVienCuaLop = async (req, res) => {
    try {
        const { id: GiangVien_id } = req.user;

        // 2. Lấy id của Lớp Tín Chỉ từ URL
        // Tên 'id' ở đây phải khớp với tên bạn đặt trong route: /lop/:id/sinh-vien
        const { id: LopTinChi_id } = req.params;

        // --- Bước 3: Kiểm tra bảo mật (Authorization Check) ---
        // xem GV có quyền xem lớp này k
        const lop = await db.LopTinChi.findOne({
            where: {
                id: LopTinChi_id,
                GiangVien_id: GiangVien_id // Phải là lớp do chính GV này dạy
            }
        });

        if (!lop) {
            return res.status(403).json({ message: 'Bạn không có quyền xem danh sách sinh viên của lớp này.' });
        }

        // --- Bước 4: Lấy danh sách sinh viên đã được duyệt ---
        const dsSinhVien = await db.DangKyHoc.findAll({
            where: {
                LopTinChi_id: LopTinChi_id,
                trangThai: 'Đã duyệt'
            },
            // Chỉ lấy ID của đơn đăng ký (đây chính là 'dangkyhoc_id' 
            // mà bạn cần để nhập điểm)
            attributes: ['id'],

            // Lấy thông tin sinh viên tương ứng
            include: {
                model: db.SinhVien,
                attributes: ['id', 'hoTen', 'email'] // Lấy các thông tin cần hiển thị
            }
        });

        res.status(200).json({
            message: 'Lấy danh sách sinh viên thành công!',
            data: dsSinhVien
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const nhapDiem = async (req, res) => {
    try {
        // 1. lấy thông tin
        const { id: GiangVien_id } = req.user;
        const {
            dangkyhoc_id,
            diemChuyenCan,
            diemBaiTap,
            diemThiGiuaKy,
            diemThiCuoiKy
        } = req.body;

        // xác thực từ token
        if (!dangkyhoc_id) {
            return res.status(400).json({ message: 'Vui lòng cung cấp dangkyhoc_id.' });
        }

        // 2. Kiểm tra đơn đăng ký - 
        const donDangKy = await db.DangKyHoc.findOne({
            where: {
                id: dangkyhoc_id,
                trangThai: 'Đã duyệt' // Chỉ nhập điểm cho sinh viên đã được duyệt
            },
            // join với bảng LopTinChi để lấy thông tin giảng viên, phục vụ Authorization Check
            include: {
                model: db.LopTinChi,
                attributes: ['GiangVien_id']
            }
        });

        // Integrity Check (thứ mình sửa có tồn tại trong  csdl k, hoặc có legit k - trạng thái "Đã duyệt")
        if (!donDangKy) {
            return res.status(404).json({ message: 'Không tìm thấy đơn đăng ký hợp lệ.' });
        }

        // Authorization Check (giảng viên có quyền nhập điểm cho lớp này k):
        // check GiangVien_id của lớp tín chỉ trong cái đơn đăng ký, xem có 
        // trùng với GiangVien_id từ token k
        if (donDangKy.LopTinChi.GiangVien_id !== GiangVien_id) {
            return res.status(403).json({ message: 'Bạn không có quyền nhập điểm cho lớp học này.' });
        }

        // 3. Cập nhật điểm
        // array destructuring: upsert trả về [instance, created(boolean)]
        const [ketQua, created] = await db.KetQua.upsert({
            dangkyhoc_id: dangkyhoc_id, // Đây là khóa chính của bảng KetQua
            diemChuyenCan: diemChuyenCan,
            diemBaiTap: diemBaiTap,
            diemThiGiuaKy: diemThiGiuaKy,
            diemThiCuoiKy: diemThiCuoiKy
        });

        const message = created ? 'Nhập điểm thành công.' : 'Cập nhật điểm thành công.';
        res.status(200).json({ message: message, data: ketQua });

    } catch (error) {
        res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};


module.exports = {
    layThongTinCaNhan,
    layLopCuaGiangVien,
    layDSSinhVienCuaLop,
    nhapDiem
};
