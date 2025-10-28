const db = require('../models');
const sequelize = require('../config/database');

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
    const { id: SinhVien_id } = req.user;
    const { danhSachLopIds } = req.body;

    if (!Array.isArray(danhSachLopIds) || danhSachLopIds.length === 0) {
        return res.status(400).json({ message: 'Vui lòng cung cấp danh sách ID lớp tín chỉ hợp lệ.' });
    }

    const t = await db.sequelize.transaction(); // Bắt đầu transaction

    try {
        // --- BƯỚC 1: Lấy thông tin các lớp mới và xác định kỳ/năm ---
        const thongTinLopMoi = await db.LopTinChi.findAll({
            where: { id: danhSachLopIds },
            attributes: ['id', 'kyHoc', 'namHoc', 'ngayHoc', 'kipHoc', 'soLuongToiDa', 'MonHoc_id'],
            transaction: t
        });

        // Kiểm tra xem có tìm thấy tất cả lớp không
        if (thongTinLopMoi.length !== danhSachLopIds.length) {
            throw new Error('Một hoặc nhiều ID lớp tín chỉ không hợp lệ.');
        }

        // --- BƯỚC 1.5: KIỂM TRA ĐĂNG KÝ TRÙNG MÔN HỌC ---
        const monHocDaChon = new Set();
        for (const lop of thongTinLopMoi) {
            if (monHocDaChon.has(lop.MonHoc_id)) {
                // Nếu MonHoc_id này đã có trong Set -> Sinh viên đang cố đăng ký 2 lớp của cùng 1 môn
                throw new Error(`Không thể đăng ký hai lớp tín chỉ khác nhau (ví dụ: ${lop.id}) cho cùng một môn học trong một lần.`);
            }
            monHocDaChon.add(lop.MonHoc_id); // Thêm MonHoc_id vào Set
        }

        // Giả sử tất cả lớp đăng ký phải cùng kỳ/năm
        const kyHocDangKy = thongTinLopMoi[0].kyHoc;
        const namHocDangKy = thongTinLopMoi[0].namHoc;

        // --- BƯỚC 2: Lấy lịch học hiện tại đã duyệt của SV trong kỳ ---
        const lichHocHienTai = await db.DangKyHoc.findAll({
            where: {
                SinhVien_id: SinhVien_id,
                trangThai: 'Đã duyệt'
            },
            include: [{
                model: db.LopTinChi,
                where: {
                    kyHoc: kyHocDangKy,
                    namHoc: namHocDangKy
                },
                attributes: ['ngayHoc', 'kipHoc'],
                required: true // INNER JOIN
            }],
            attributes: [], // Chỉ cần thông tin từ LopTinChi
            transaction: t
        });

        // Tạo một Set để lưu các slot thời gian đã đăng ký (vd: "Thứ2_1-3")
        const slotsDaDangKy = new Set(
            lichHocHienTai.map(item => `${item.LopTinChi.ngayHoc}_${item.LopTinChi.kipHoc}`)
        );

        // --- BƯỚC 3 & 4: Kiểm tra slot và trùng lịch cho các lớp MỚI ---
        const slotsMoi = new Set(); // Lưu slot của các lớp mới để kiểm tra trùng lặp nội bộ
        for (const lop of thongTinLopMoi) {
            // --- Kiểm tra slot (Giữ nguyên logic cũ) ---
            if (lop.soLuongToiDa !== null && lop.soLuongToiDa > 0) {
                const soLuongHienTai = await db.DangKyHoc.count({
                    where: { LopTinChi_id: lop.id, trangThai: 'Đã duyệt' },
                    transaction: t
                });
                if (soLuongHienTai >= lop.soLuongToiDa) {
                    throw new Error(`Lớp tín chỉ '${lop.id}' đã hết slot trống.`);
                }
            }

            // --- Kiểm tra trùng lịch ---
            if (lop.ngayHoc && lop.kipHoc) { // Chỉ kiểm tra nếu lớp có lịch cố định
                const slotHoc = `${lop.ngayHoc}_${lop.kipHoc}`;

                // Kiểm tra trùng với lịch hiện tại
                if (slotsDaDangKy.has(slotHoc)) {
                    throw new Error(`Lịch học của lớp '${lop.id}' (${lop.ngayHoc} - ${lop.kipHoc}) bị trùng với lịch học hiện tại của bạn.`);
                }
                // Kiểm tra trùng với các lớp mới khác trong cùng request
                if (slotsMoi.has(slotHoc)) {
                    throw new Error(`Bạn đăng ký hai lớp bị trùng lịch học (${lop.ngayHoc} - ${lop.kipHoc}).`);
                }
                slotsMoi.add(slotHoc); // Thêm slot mới vào để kiểm tra cho các lớp sau
            }
        }
        // --- KẾT THÚC KIỂM TRA ---

        // --- TIẾP TỤC TẠO ĐƠN ĐĂNG KÝ ---
        const promises = danhSachLopIds.map(LopTinChi_id => {
            return db.DangKyHoc.create({
                SinhVien_id: SinhVien_id,
                LopTinChi_id: LopTinChi_id,
                trangThai: 'Chờ duyệt',
                ngayDangKy: new Date()
            }, { transaction: t });
        });
        const ketQua = await Promise.all(promises);

        await t.commit();
        res.status(201).json({ message: 'Gửi yêu cầu đăng ký thành công!', data: ketQua });

    } catch (error) {
        await t.rollback();

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Bạn đã đăng ký một hoặc nhiều lớp trong danh sách này rồi.', error: error.message });
        }
        // Bắt lỗi hết slot, trùng lịch, hoặc lớp không hợp lệ
        if (error.message.includes('hết slot') || error.message.includes('trùng lịch') || error.message.includes('ID lớp tín chỉ không hợp lệ')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Lỗi server khi đăng ký', error: error.message });
    }
};

const layCacLopDangMo = async (req, res) => {
    try {
        // Lấy kỳ học và năm học hiện tại (ví dụ từ query params, hoặc cần API. hardcode 
        // là đơn giản nhất)
        const { kyHoc, namHoc } = req.query;
        if (!kyHoc || !namHoc) {
            return res.status(400).json({ message: 'Vui lòng cung cấp thông tin kỳ học (kyHoc) và năm học (namHoc) trong query parameters.' });
        }

        const danhSachLop = await db.LopTinChi.findAll({
            // where: whereLop,
            attributes: [
                // 1. Liệt kê rõ các cột cần từ LopTinChi
                'id', 'kyHoc', 'namHoc', 'ngayHoc', 'kipHoc', 'phongHoc', 'toaNha', 'soLuongToiDa',

                // 2. Giữ nguyên subquery để đếm số lượng
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM DangKyHoc
                        WHERE
                            DangKyHoc.LopTinChi_id = LopTinChi.id 
                            AND DangKyHoc.trangThai = 'Đã duyệt'
                    )`),
                    'soLuongDaDangKy'
                ]
            ],
            include: [
                { model: db.GiangVien, attributes: ['hoTen'] },
                { model: db.MonHoc, attributes: ['id', 'ten', 'soTinChi'] }
            ],
            raw: true,
            nest: true
        });

        // Xử lý kết quả để tính số slot còn lại
        const danhSachLopVoiSlot = danhSachLop.map(lop => {
            const soDaDangKy = parseInt(lop.soLuongDaDangKy, 10);
            let soSlotConLai = null;

            // Truy cập trực tiếp lop.soLuongToiDa
            if (lop.soLuongToiDa !== null && lop.soLuongToiDa > 0) {
                soSlotConLai = lop.soLuongToiDa - soDaDangKy;
                if (soSlotConLai < 0) soSlotConLai = 0;
            }

            // Tạo cấu trúc kết quả trả về, không cần spread lop.lopTinChi
            return {
                id: lop.id, // Các trường của LopTinChi giờ nằm trực tiếp
                kyHoc: lop.kyHoc,
                namHoc: lop.namHoc,
                ngayHoc: lop.ngayHoc,
                kipHoc: lop.kipHoc,
                phongHoc: lop.phongHoc,
                toaNha: lop.toaNha,
                soLuongToiDa: lop.soLuongToiDa,
                MonHoc: lop.MonHoc,         // Include MonHoc vẫn được lồng
                GiangVien: lop.GiangVien,     // Include GiangVien vẫn được lồng
                soSlotConLai: soSlotConLai // Thêm thông tin slot
            };
        });

        res.status(200).json({
            message: 'Lấy danh sách lớp học thành công!',
            data: danhSachLopVoiSlot
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const layLichHoc = async (req, res) => {
    try {
        const { id: SinhVien_id } = req.user;
        const { kyHoc, namHoc } = req.query;

        if (!kyHoc || !namHoc) {
            return res.status(400).json({ message: 'Vui lòng cung cấp thông tin kỳ học (kyHoc) và năm học (namHoc) trong query parameters.' });
        }

        // --- UPDATED: Build the where clause dynamically ---
        const whereClause = {
            SinhVien_id: SinhVien_id,
            trangThai: 'Đã duyệt'
        };

        // Find the associated LopTinChi records matching the semester and year
        const lichHoc = await db.DangKyHoc.findAll({
            where: whereClause,
            attributes: ['id'],
            include: [
                {
                    model: db.LopTinChi,
                    where: { kyHoc, namHoc },
                    required: true,
                    attributes: ['id', 'ngayHoc', 'kipHoc', 'phongHoc', 'toaNha'],
                    include: [
                        {
                            model: db.MonHoc,
                            attributes: ['ten']
                        },
                        {
                            model: db.GiangVien,
                            attributes: ['hoTen']
                        }
                    ]
                }
            ]
        });


        res.status(200).json({
            message: `Lấy lịch học cho kỳ ${kyHoc}, năm học ${namHoc} thành công`, // Updated message
            data: lichHoc
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const xemDiem = async (req, res) => {
    try {

        const { id: SinhVien_id } = req.user;
        const { kyHoc, namHoc } = req.query;
        if (!kyHoc || !namHoc) {
            return res.status(400).json({ message: 'Vui lòng cung cấp thông tin kỳ học (kyHoc) và năm học (namHoc) trong query parameters.' });
        }

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
                    where: {
                        kyHoc: kyHoc,
                        namHoc: namHoc
                    },
                    required: true,
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

const layDonDangKyHienTai = async (req, res) => {
    try {
        const { id: SinhVien_id } = req.user;
        const { kyHoc, namHoc } = req.query;

        if (!kyHoc || !namHoc) {
            return res.status(400).json({ message: 'Vui lòng cung cấp kỳ học và năm học.' });
        }

        // Lấy TẤT CẢ các đơn đăng ký (cả chờ duyệt và đã duyệt)
        const dangKyHienTai = await db.DangKyHoc.findAll({
            where: {
                SinhVien_id: SinhVien_id,
                trangThai: ['Chờ duyệt', 'Đã duyệt'] // Quan trọng: lấy cả 2 trạng thái
            },
            include: [
                {
                    model: db.LopTinChi,
                    where: {
                        kyHoc: kyHoc,
                        namHoc: namHoc
                    },
                    required: true, // Chỉ lấy các đơn đăng ký thuộc kỳ/năm học này
                    include: {
                        model: db.MonHoc,
                        attributes: ['id', 'ten', 'soTinChi'] // Lấy thông tin môn học
                    },
                    attributes: ['id', 'ngayHoc', 'kipHoc'] // Lấy thông tin lớp
                }
            ],
            attributes: ['id', 'trangThai'] // Thông tin từ đơn đăng ký
        });

        // Format lại dữ liệu cho frontend dễ sử dụng
        const formattedData = dangKyHienTai.map(dk => ({
            id: dk.LopTinChi.id, // ID của Lớp Tín Chỉ
            classCode: dk.LopTinChi.id,
            courseName: dk.LopTinChi.MonHoc.ten,
            courseCode: dk.LopTinChi.MonHoc.id, // ID của Môn Học
            credits: dk.LopTinChi.MonHoc.soTinChi,
            schedule: dk.LopTinChi.ngayHoc,
            shift: dk.LopTinChi.kipHoc,
            trangThai: dk.trangThai // 'Đã duyệt' hoặc 'Chờ duyệt'
        }));

        res.status(200).json({
            message: 'Lấy thông tin đăng ký hiện tại thành công',
            data: formattedData
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
    layThongTinCaNhan,
    layDonDangKyHienTai
};