const db = require('../models');

const layThongTinCaNhan = async (req, res) => {
    try {
        const { id: SinhVien_id } = req.user;

        const sinhVien = await db.SinhVien.findByPk(SinhVien_id, {
            attributes: { exclude: ['password'] }
        });


        if (!sinhVien) {
            return res.status(404).json({ message: 'Sinh viên không tồn tại' });
        }

        res.status(200).json({
            message: 'Lấy thông tin cá nhân thành công!',
            data: sinhVien
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const taoDonDangKy = async (req, res) => {
    try {
        // 1. Lấy id sinh viên từ middleware (đã được xác thực)
        const { id: SinhVien_id } = req.user;
        // 2. lấy id lớp tín chỉ từ req.body
        const { LopTinChi_id } = req.body;

        if (!LopTinChi_id) {
            return res.status(400).json({ message: 'Vui lòng cung cấp LopTinChi_id.' });
        }

        const donMoi = await db.DangKyHoc.create({
            SinhVien_id: SinhVien_id,
            LopTinChi_id: LopTinChi_id,
            trangThai: 'Chờ duyệt', // trạng thái default 
            ngayDangKy: new Date()
        });

        res.status(201).json({ message: 'Gửi yêu cầu đăng ký thành công!', data: donMoi });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const layCacLopDangMo = async (req, res) => {
    try {
        const danhSachLop = await db.LopTinChi.findAll({
            include: [
                {
                    model: db.GiangVien,
                    attributes: ['hoTen']
                },
                {
                    model: db.MonHoc,
                    attributes: ['ten', 'soTinChi']
                }
            ],
            attributes: {
                exclude: ['GiangVien_id']
            }
        });

        res.status(200).json({
            message: 'Lấy danh sách lớp học thành công!',
            data: danhSachLop
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const layLichHoc = async (req, res) => {
    try {
        const { id: SinhVien_id } = req.user;

        const lichHoc = await db.DangKyHoc.findAll({
            where: {
                SinhVien_id: SinhVien_id,
                trangThai: 'Đã duyệt'
            },
            // Chỉ cần ID của DangKyHoc để làm khóa tham chiếu
            attributes: ['id'],
            include: [
                {
                    model: db.LopTinChi,
                    // Lấy tất cả thông tin lịch
                    attributes: ['ngayHoc', 'kipHoc', 'phongHoc', 'toaNha'],
                    include: {
                        model: db.MonHoc,
                        attributes: ['ten']
                    }
                }
            ]
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const xemDiem = async (req, res) => {
    try {
        const { id: SinhVien_id } = req.user;

        const diemThanhPhan = await db.KetQua.findAll({
            attributes: [
                'dangkyhoc_id',
                'diemChuyenCan',
                'diemBaiTap',
                'diemThiGiuaKy',
                'diemThiCuoiKy'
            ],
            include: {
                model: db.DangKyHoc,
                // Lọc kết quả dựa trên bảng DangKyHoc
                where: { SinhVien_id: SinhVien_id },
                attributes: ['id'],
                include: { // Lồng 2 cấp để lấy tên môn và học kỳ
                    model: db.LopTinChi,
                    attributes: ['kyHoc', 'namHoc'],
                    include: {
                        model: db.MonHoc,
                        attributes: ['ten', 'soTinChi'] // Lấy tên môn và số tín chỉ
                    }
                }
            }
        });

        res.status(200).json({
            message: "Lấy kết quả học tập thành công",
            data: diemThanhPhan
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};




module.exports = {
    taoDonDangKy,
    layCacLopDangMo,
    layLichHoc,
    xemDiem,
    layThongTinCaNhan
};