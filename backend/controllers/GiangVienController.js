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
        const { kyHoc, namHoc } = req.query;

        if (!kyHoc || !namHoc) {
            return res.status(400).json({ message: 'Vui lòng cung cấp kyHoc và namHoc trong query parameters.' });
        }

        const danhSachLop = await db.LopTinChi.findAll({
            where: {
                GiangVien_id: GiangVien_id,
                kyHoc: kyHoc,
                namHoc: namHoc
            },
            include: [
                {
                    model: db.MonHoc,
                    attributes: ['id', 'ten', 'soTinChi']
                }
            ],
            attributes: { exclude: ['MonHoc_id', 'GiangVien_id'] }
        });

        res.status(200).json({
            message: `Lấy danh sách lớp cho kỳ ${kyHoc}, năm ${namHoc} thành công!`,
            data: danhSachLop
        });

    } catch (error) {
        res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};

const layDSSinhVienVaDiem = async (req, res) => {
    try {
        const { id: GiangVien_id } = req.user;
        const { id: LopTinChi_id } = req.params;

        const lop = await db.LopTinChi.findOne({
            where: { id: LopTinChi_id, GiangVien_id: GiangVien_id }
        });
        if (!lop) {
            return res.status(403).json({ message: 'Bạn không có quyền xem danh sách sinh viên của lớp này.' });
        }

        const dsSinhVienVaDiem = await db.DangKyHoc.findAll({
            where: {
                LopTinChi_id: LopTinChi_id,
                trangThai: 'Đã duyệt'
            },
            // Select only the ID needed for grade entry
            attributes: ['id'], // This is the dangkyhoc_id

            // Include Student details
            include: [
                {
                    model: db.SinhVien,
                    attributes: ['id', 'hoTen', 'email']
                },
                // --- ADDED: Include KetQua (grades) ---
                {
                    model: db.KetQua,
                    attributes: ['diemChuyenCan', 'diemBaiTap', 'diemThiGiuaKy', 'diemThiCuoiKy'],
                    required: false // Use LEFT JOIN - important to show students even if they don't have grades yet
                }
                // ------------------------------------
            ],
            // Order by student name or ID for consistency
            order: [[db.SinhVien, 'hoTen', 'ASC']]
        });

        // Optional: Reformat the data slightly for easier frontend use
        const formattedData = dsSinhVienVaDiem.map(dk => ({
            dangkyhoc_id: dk.id,
            sinhVien: dk.SinhVien,
            // If KetQua exists, use its values, otherwise use nulls
            diemChuyenCan: dk.KetQua?.diemChuyenCan ?? null,
            diemBaiTap: dk.KetQua?.diemBaiTap ?? null,
            diemThiGiuaKy: dk.KetQua?.diemThiGiuaKy ?? null,
            diemThiCuoiKy: dk.KetQua?.diemThiCuoiKy ?? null
        }));


        res.status(200).json({
            message: 'Lấy danh sách sinh viên và điểm thành công!',
            data: formattedData // Send the formatted data
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// redundant function, replaced by nhapDiemNhieu
// const nhapKetQua2 = async (req, res) => {
//     try {
//         // 1. lấy thông tin
//         const { id: GiangVien_id } = req.user;
//         const {
//             dangkyhoc_id,
//             diemChuyenCan,
//             diemBaiTap,
//             diemThiGiuaKy,
//             diemThiCuoiKy
//         } = req.body;

//         // xác thực từ token
//         if (!dangkyhoc_id) {
//             return res.status(400).json({ message: 'Vui lòng cung cấp dangkyhoc_id.' });
//         }

//         // 2. Kiểm tra đơn đăng ký - 
//         const donDangKy = await db.DangKyHoc.findOne({
//             where: {
//                 id: dangkyhoc_id,
//                 trangThai: 'Đã duyệt' // Chỉ nhập điểm cho sinh viên đã được duyệt
//             },
//             // join với bảng LopTinChi để lấy thông tin giảng viên, phục vụ Authorization Check
//             include: {
//                 model: db.LopTinChi,
//                 attributes: ['GiangVien_id']
//             }
//         });

//         // Integrity Check (thứ mình sửa có tồn tại trong  csdl k, hoặc có legit k - trạng thái "Đã duyệt")
//         if (!donDangKy) {
//             return res.status(404).json({ message: 'Không tìm thấy đơn đăng ký hợp lệ.' });
//         }

//         // Authorization Check (giảng viên có quyền nhập điểm cho lớp này k):
//         // check GiangVien_id của lớp tín chỉ trong cái đơn đăng ký, xem có 
//         // trùng với GiangVien_id từ token k
//         if (donDangKy.LopTinChi.GiangVien_id !== GiangVien_id) {
//             return res.status(403).json({ message: 'Bạn không có quyền nhập điểm cho lớp học này.' });
//         }

//         // 3. Cập nhật điểm
//         // array destructuring: upsert trả về [instance, created(boolean)]
//         const [ketQua, created] = await db.KetQua.upsert({
//             dangkyhoc_id: dangkyhoc_id, // Đây là khóa chính của bảng KetQua
//             diemChuyenCan: diemChuyenCan,
//             diemBaiTap: diemBaiTap,
//             diemThiGiuaKy: diemThiGiuaKy,
//             diemThiCuoiKy: diemThiCuoiKy
//         });

//         const message = created ? 'Nhập điểm thành công.' : 'Cập nhật điểm thành công.';
//         res.status(200).json({ message: message, data: ketQua });

//     } catch (error) {
//         res.status(500).json({
//             message: 'Lỗi server',
//             error: error.message
//         });
//     }
// };


const nhapKetQua = async (req, res) => {
    const { id: GiangVien_id } = req.user;
    const { id: LopTinChi_id } = req.params;
    const { grades } = req.body; // Expect an array named 'grades'

    if (!Array.isArray(grades)) {
        return res.status(400).json({ message: 'Dữ liệu điểm gửi lên không hợp lệ (cần một mảng grades).' });
    }
    if (grades.length === 0) {
        return res.status(200).json({ message: 'Không có điểm nào được gửi để cập nhật.', data: [] });
    }

    // Authorization check: Does the teacher own this class?
    const lop = await db.LopTinChi.findOne({
        where: { id: LopTinChi_id, GiangVien_id: GiangVien_id }
    });
    if (!lop) {
        return res.status(403).json({ message: 'Bạn không có quyền nhập điểm cho lớp học này.' });
    }

    const t = await db.sequelize.transaction(); // Use transaction for bulk operation
    try {
        const results = [];
        const errors = [];

        // Validate all dangkyhoc_ids belong to this class FIRST (optional but good)
        const validDangKyHocIds = await db.DangKyHoc.findAll({
            where: { id: grades.map(g => g.dangkyhoc_id), LopTinChi_id: LopTinChi_id, trangThai: 'Đã duyệt' },
            attributes: ['id'],
            transaction: t
        });
        const validIdSet = new Set(validDangKyHocIds.map(dk => dk.id));

        for (const gradeData of grades) {
            if (!gradeData.dangkyhoc_id || !validIdSet.has(gradeData.dangkyhoc_id)) {
                errors.push({ dangkyhoc_id: gradeData.dangkyhoc_id, error: 'ID đăng ký không hợp lệ hoặc không thuộc lớp này.' });
                continue; // Skip this one
            }

            try {
                // Perform upsert for each valid entry
                const [ketQua, created] = await db.KetQua.upsert({
                    dangkyhoc_id: gradeData.dangkyhoc_id,
                    diemChuyenCan: gradeData.diemChuyenCan,
                    diemBaiTap: gradeData.diemBaiTap,
                    diemThiGiuaKy: gradeData.diemThiGiuaKy,
                    diemThiCuoiKy: gradeData.diemThiCuoiKy
                }, { transaction: t });
                results.push(ketQua); // Collect successful results
            } catch (upsertError) {
                errors.push({ dangkyhoc_id: gradeData.dangkyhoc_id, error: upsertError.message });
            }
        }

        if (errors.length > 0 && results.length === 0) {
            // If ALL failed, rollback
            await t.rollback();
            return res.status(400).json({ message: 'Nhập điểm thất bại cho tất cả sinh viên.', errors: errors });
        } else {
            // If at least some succeeded, commit
            await t.commit();
            return res.status(200).json({
                message: `Nhập/cập nhật điểm hoàn tất. Thành công: ${results.length}. Thất bại: ${errors.length}.`,
                successData: results,
                errorData: errors
            });
        }

    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Lỗi server khi nhập điểm.', error: error.message });
    }
};


module.exports = {
    layThongTinCaNhan,
    layLopCuaGiangVien,
    layDSSinhVienVaDiem,
    nhapKetQua
};
