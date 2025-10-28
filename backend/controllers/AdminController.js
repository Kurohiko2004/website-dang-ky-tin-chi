const db = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize"); //crud tạo sv, gv

const layThongTinCaNhan = async (req, res) => {
    try {
        const { id: Admin_id } = req.user;

        const admin = await db.Admin.findByPk(Admin_id, {
            attributes: { exclude: ['password'] }
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin không tồn tại' });
        }

        res.status(200).json({
            message: 'Lấy thông tin cá nhân thành công!',
            data: admin
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const layDonDangKyHoc = async (req, res) => {
    try {
        const danhSachCho = await db.DangKyHoc.findAll({
            where: {
                trangThai: 'Chờ duyệt'
            },
            // Thêm include để lấy thông tin SinhVien và LopTinChi
            include: [
                { model: db.SinhVien, attributes: ['id', 'hoTen'] },
                {
                    model: db.LopTinChi,
                    attributes: ['id', 'kyHoc', 'namHoc'],
                    include: [{
                        model: db.MonHoc,
                        attributes: ['ten', 'soTinChi']
                    }]
                },

            ]
        });
        res.status(200).json(danhSachCho);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Duyệt một đơn đăng ký:
// lấy id trong req để biết là đơn nào
// ấn submit --> trangThaiMoi = duyệt, lấy trangThaiMoi trong request body
// tìm donDangKy trong csdl theo id, nếu tìm được thì gán trangThaiMoi vao DonDangKy.trangThai
const xuLyDonDangKyHoc = async (req, res) => {
    // Start a transaction for consistency
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { trangThaiMoi } = req.body;

        // Input validation for trangThaiMoi
        if (!['Đã duyệt', 'Từ chối'].includes(trangThaiMoi)) {
            await t.rollback(); // Rollback immediately on invalid input
            return res.status(400).json({ message: 'Trạng thái mới không hợp lệ. Chỉ chấp nhận "Đã duyệt" hoặc "Từ chối".' });
        }

        // Find the registration request within the transaction
        const donDangKy = await db.DangKyHoc.findByPk(id, {
            transaction: t,
            lock: t.LOCK.UPDATE // Lock the row during the transaction
        });

        if (!donDangKy) {
            await t.rollback();
            return res.status(404).json({ message: 'Không tìm thấy đơn đăng ký!' });
        }

        // --- ADDED CHECK: Only perform check if APPROVING ---
        if (trangThaiMoi === 'Đã duyệt' && donDangKy.trangThai !== 'Đã duyệt') { // Also check if it's not already approved
            // Get the class (LopTinChi) information
            const lopTinChi = await db.LopTinChi.findByPk(donDangKy.LopTinChi_id, {
                attributes: ['id', 'soLuongToiDa'],
                transaction: t // Ensure consistent read
            });

            // Should not happen if data is consistent, but good to check
            if (!lopTinChi) {
                throw new Error(`Lớp tín chỉ ${donDangKy.LopTinChi_id} liên kết với đơn đăng ký không tồn tại.`);
            }

            // Check capacity if soLuongToiDa is set
            if (lopTinChi.soLuongToiDa !== null && lopTinChi.soLuongToiDa > 0) {
                const soLuongHienTai = await db.DangKyHoc.count({
                    where: {
                        LopTinChi_id: donDangKy.LopTinChi_id,
                        trangThai: 'Đã duyệt' // Count only approved students
                    },
                    transaction: t // Count within the transaction
                });

                // If the class is full or over capacity
                if (soLuongHienTai >= lopTinChi.soLuongToiDa) {
                    await t.rollback(); // Rollback the transaction
                    return res.status(400).json({ // Use 400 Bad Request as the action cannot be fulfilled
                        message: `Không thể duyệt đơn đăng ký. Lớp tín chỉ '${lopTinChi.id}' đã đạt số lượng tối đa (${lopTinChi.soLuongToiDa}).`
                    });
                }
            }
            // If capacity check passes (or no limit), proceed to update status
        }
        // --- END OF ADDED CHECK ---

        // Update the status (works for both 'Đã duyệt' and 'Từ chối')
        donDangKy.trangThai = trangThaiMoi;
        await donDangKy.save({ transaction: t }); // Save within the transaction

        // If successful, commit the transaction
        await t.commit();

        res.status(200).json({
            message: 'Cập nhật đơn đăng ký thành công!',
            data: donDangKy
        });

    } catch (error) {
        // Ensure rollback happens on any error during the try block
        await t.rollback();
        res.status(500).json({
            message: 'Lỗi server - Internal Server Error',
            error: error.message
        });
    }
};


// --- CRUD MÔN HỌC ---
const layTatCaMonHoc = async (req, res) => {
    try {
        const danhSachMonHoc = await db.MonHoc.findAll();
        res.status(200).json({ message: 'Lấy danh sách môn học thành công!', data: danhSachMonHoc });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const taoMonHoc = async (req, res) => {
    try {
        const { id: MonHoc_id, ten, soTinChi } = req.body;

        if (!MonHoc_id || !ten || soTinChi === undefined) {
            return res.status(400).json({ message: 'Thiếu thông tin' });
        }

        const monHocTonTai = await db.MonHoc.findByPk(MonHoc_id);
        if (monHocTonTai) {
            return res.status(409).json({ message: `Môn học với ID '${MonHoc_id}' đã tồn tại.` }); // 409 Conflict
        }

        const monHocMoi = await db.MonHoc.create({
            id: MonHoc_id,
            ten: ten,
            soTinChi: soTinChi
        });

        res.status(201).json({
            message: 'Tạo môn học thành công!',
            data: monHocMoi
        })

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const layMonHocTheoId = async (req, res) => {
    try {
        const { id: MonHoc_id } = req.params; // Lấy ID từ URL
        const monHoc = await db.MonHoc.findByPk(MonHoc_id);

        if (!monHoc) {
            return res.status(404).json({ message: `Không tìm thấy môn học với ID '${MonHoc_id}'.` });
        }

        res.status(200).json({ message: 'Lấy thông tin môn học thành công!', data: monHoc });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const capNhatMonHoc = async (req, res) => {
    try {
        const { id: MonHoc_id } = req.params; // Lấy ID từ URL
        const { ten, soTinChi } = req.body; // Lấy thông tin mới từ body

        // Kiểm tra đầu vào
        if (!ten || soTinChi === undefined) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin: ten, soTinChi.' });
        }

        // Tìm môn học cần cập nhật
        const monHoc = await db.MonHoc.findByPk(MonHoc_id);
        if (!monHoc) {
            return res.status(404).json({ message: `Không tìm thấy môn học với ID '${MonHoc_id}'.` });
        }

        // Cập nhật thông tin
        monHoc.ten = ten;
        monHoc.soTinChi = soTinChi;
        await monHoc.save(); // Lưu thay đổi vào CSDL

        res.status(200).json({ message: 'Cập nhật môn học thành công!', data: monHoc });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const xoaMonHoc = async (req, res) => {
    try {
        const { id: MonHoc_id } = req.params; // Lấy ID từ URL

        // Tìm môn học cần xóa
        const monHoc = await db.MonHoc.findByPk(MonHoc_id);
        if (!monHoc) {
            return res.status(404).json({ message: `Không tìm thấy môn học với ID '${MonHoc_id}'.` });
        }

        // Thực hiện xóa
        await monHoc.destroy();

        res.status(200).json({ message: `Xóa môn học '${MonHoc_id}' thành công!` }); // Hoặc 204 No Content

    } catch (error) {
        // Xử lý lỗi nếu môn học đang được sử dụng (ví dụ: có Lớp Tín Chỉ tham chiếu đến)
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ message: `Không thể xóa môn học '${MonHoc_id}' vì đang được sử dụng bởi các lớp tín chỉ.` });
        }
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};



// --- CRUD LỚP TÍN CHỈ ---
// validate input function (helper)
const validateLopTinChiInput = async (data, isUpdate = false) => {
    const { id, kyHoc, namHoc, soLuongToiDa, MonHoc_id, GiangVien_id } = data;
    const errors = {}; // Lưu trữ lỗi nếu có

    // --- Validate Bắt buộc (cho cả Create và Update nếu có) ---
    if (!isUpdate) { // Chỉ check ID khi tạo mới
        if (!id) errors.id = 'ID lớp tín chỉ là bắt buộc.';
        else {
            const lopTonTai = await db.LopTinChi.findByPk(id);
            if (lopTonTai) errors.id = `Lớp tín chỉ với ID '${id}' đã tồn tại.`;
        }
        if (!MonHoc_id) errors.MonHoc_id = 'ID Môn học là bắt buộc.';
        if (!GiangVien_id) errors.GiangVien_id = 'ID Giảng viên là bắt buộc.';
    }
    if (kyHoc !== undefined) {
        const validKyHoc = [1, 2];
        const parsedKyHoc = parseInt(kyHoc, 10);
        if (isNaN(parsedKyHoc) || !validKyHoc.includes(parsedKyHoc)) {
            errors.kyHoc = `Kỳ học không hợp lệ. Phải là ${validKyHoc.join(' hoặc ')}.`;
        }
    } else if (!isUpdate) {
        errors.kyHoc = 'Kỳ học là bắt buộc.';
    }

    if (namHoc !== undefined) {
        const namHocRegex = /^\d{4}-\d{4}$/;
        if (!namHocRegex.test(namHoc)) {
            errors.namHoc = 'Năm học không đúng định dạng (VD: "2024-2025").';
        }
    } else if (!isUpdate) {
        errors.namHoc = 'Năm học là bắt buộc.';
    }

    // --- Validate Tùy chọn ---
    if (soLuongToiDa !== undefined && soLuongToiDa !== null) {
        const parsedSoLuong = parseInt(soLuongToiDa, 10);
        if (isNaN(parsedSoLuong) || parsedSoLuong < 0) {
            errors.soLuongToiDa = 'Số lượng tối đa phải là số nguyên không âm.';
        }
    }

    // --- Check sự tồn tại của Khóa ngoại (chỉ check khi ID được cung cấp) ---
    if (MonHoc_id) {
        const monHoc = await db.MonHoc.findByPk(MonHoc_id);
        if (!monHoc) errors.MonHoc_id = `Môn học với ID '${MonHoc_id}' không tồn tại.`;
    }
    if (GiangVien_id) {
        const giangVien = await db.GiangVien.findByPk(GiangVien_id);
        if (!giangVien) errors.GiangVien_id = `Giảng viên với ID '${GiangVien_id}' không tồn tại.`;
    }

    // Trả về đối tượng lỗi nếu có, hoặc null nếu không có lỗi
    return Object.keys(errors).length > 0 ? errors : null;
};


// 📌 Hàm helper: thêm trường soLuongDaDangKy vào danh sách hoặc bản ghi đơn lẻ
const themSoLuongDaDangKy = (lopTinChi) => {
    if (Array.isArray(lopTinChi)) {
        // Nếu là mảng lớp tín chỉ
        return lopTinChi.map(lop => ({
            ...lop.toJSON(),
            soLuongDaDangKy: lop.DangKyHocs ? lop.DangKyHocs.length : 0
        }));
    } else if (lopTinChi) {
        // Nếu là 1 đối tượng đơn lẻ
        const json = lopTinChi.toJSON();
        return {
            ...json,
            soLuongDaDangKy: lopTinChi.DangKyHocs ? lopTinChi.DangKyHocs.length : 0
        };
    }
    return lopTinChi;
};


const taoLopTinChi = async (req, res) => {
    try {
        // Gọi hàm validate
        const validationErrors = await validateLopTinChiInput(req.body, false); // false = không phải update
        if (validationErrors) {
            // Nếu có lỗi, trả về lỗi 400 và chi tiết lỗi
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: validationErrors });
        }

        // Nếu không có lỗi, tiến hành tạo mới
        const { id, kyHoc, namHoc, kipHoc, ngayHoc, phongHoc, toaNha, soLuongToiDa, MonHoc_id, GiangVien_id } = req.body;
        const lopMoi = await db.LopTinChi.create({
            id, kyHoc, namHoc, kipHoc, ngayHoc, phongHoc, toaNha, soLuongToiDa, MonHoc_id, GiangVien_id
        });

        // truy vấn lại vào csdl để lấy bản ghi mới tạo, gửi về cho frontend để hiển thị đủ thông tin
        const lopMoiDayDu = await db.LopTinChi.findByPk(lopMoi.id, {
            include: [
                db.MonHoc,
                db.GiangVien,
                db.DangKyHoc
            ]
        });

        const lopMoiCoSoLuong = themSoLuongDaDangKy(lopMoiDayDu);
        res.status(201).json({ message: 'Tạo lớp tín chỉ thành công!', data: lopMoiCoSoLuong });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const capNhatLopTinChi = async (req, res) => {
    try {
        const { id } = req.params;
        const lopTinChi = await db.LopTinChi.findByPk(id);
        if (!lopTinChi) {
            return res.status(404).json({ message: `Không tìm thấy lớp tín chỉ với ID '${id}'.` });
        }

        // Gọi hàm validate cho dữ liệu cập nhật
        const validationErrors = await validateLopTinChiInput(req.body, true); // true = là update
        if (validationErrors) {
            return res.status(400).json({ message: 'Dữ liệu cập nhật không hợp lệ.', errors: validationErrors });
        }

        // Nếu validate thành công, cập nhật các trường được phép
        // (Chỉ cập nhật những trường có trong req.body)
        await lopTinChi.update(req.body);

        const lopTinChiUpdated = await db.LopTinChi.findByPk(id, {
            include: [db.MonHoc, db.GiangVien],
        });

        const lopTinChiCoSoLuong = themSoLuongDaDangKy(lopTinChiUpdated);

        res.status(200).json({ message: 'Cập nhật lớp tín chỉ thành công!', data: lopTinChiCoSoLuong });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const layTatCaLopTinChi = async (req, res) => {
    try {
        const danhSachLop = await db.LopTinChi.findAll({
            include: [
                { model: db.MonHoc },
                { model: db.GiangVien },
                { model: db.DangKyHoc } // Thêm dòng này để lấy danh sách đăng ký
            ],
        });

        // Thêm trường đếm số lượng sinh viên đã đăng ký
        const danhSachLopCoSoLuong = themSoLuongDaDangKy(danhSachLop);
        res.status(200).json({ message: 'Lấy danh sách lớp tín chỉ thành công!', data: danhSachLopCoSoLuong });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const layLopTinChiTheoId = async (req, res) => {
    try {
        const { id: LopTinChi_id } = req.params;
        const lopTinChi = await db.LopTinChi.findByPk(LopTinChi_id, {
            include: [ // Lấy kèm thông tin môn học và giảng viên
                { model: db.MonHoc },
                { model: db.GiangVien }
            ]
        });

        if (!lopTinChi) {
            return res.status(404).json({ message: `Không tìm thấy lớp tín chỉ với ID '${LopTinChi_id}'.` });
        }

        res.status(200).json({ message: 'Lấy thông tin lớp tín chỉ thành công!', data: lopTinChi });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const xoaLopTinChi = async (req, res) => {
    try {
        const { id: LopTinChi_id } = req.params;

        const lopTinChi = await db.LopTinChi.findByPk(LopTinChi_id);
        if (!lopTinChi) {
            return res.status(404).json({ message: `Không tìm thấy lớp tín chỉ với ID '${LopTinChi_id}'.` });
        }

        await lopTinChi.destroy();
        res.status(200).json({ message: `Xóa lớp tín chỉ '${LopTinChi_id}' thành công!` });

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ message: 'Không thể xóa lớp tín chỉ này vì nó đang được sử dụng.', error: error.message });
        } else {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }
};



// --- CRUD SINH VIÊN ---
const taoSinhVien = async (req, res) => {
    try {
        const { id, hoTen, ngaySinh, email, password } = req.body;
        if (!id || !hoTen || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin bắt buộc: id, hoTen, email, password.' });
        }

        const sinhVien = await db.SinhVien.findOne({
            where: { [Op.or]: [{ id: id }, { email: email }] }
        });
        if (sinhVien) {
            return res.status(409).json({ message: `Sinh viên với ID '${id}' hoặc Email '${email}' đã tồn tại.` });
        }

        // --- Hash Password ---
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- Create User ---
        const svMoi = await db.SinhVien.create({
            id: id,
            hoTen: hoTen,
            ngaySinh: ngaySinh, // Allow null if not provided
            email: email,
            password: hashedPassword // Save the hashed password
        });

        // Exclude password from the response data
        const svMoiData = svMoi.toJSON();
        delete svMoiData.password;

        res.status(201).json({ message: 'Tạo sinh viên thành công!', data: svMoiData });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const layTatCaSinhVien = async (req, res) => {
    try {
        const dsSinhVien = await db.SinhVien.findAll({
            attributes: { exclude: ['password'] } // Always exclude password
        });
        res.status(200).json({ message: 'Lấy danh sách sinh viên thành công!', data: dsSinhVien });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const laySinhVienTheoId = async (req, res) => {
    try {
        const { id } = req.params;
        const sinhVien = await db.SinhVien.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!sinhVien) {
            return res.status(404).json({ message: `Không tìm thấy sinh viên với ID '${id}'.` });
        }

        res.status(200).json({ message: 'Lấy thông tin sinh viên thành công!', data: sinhVien });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const capNhatSinhVien = async (req, res) => {
    try {
        const { id } = req.params;
        // Only allow updating non-sensitive fields
        const { hoTen, ngaySinh, email } = req.body;

        const sinhVien = await db.SinhVien.findByPk(id);
        if (!sinhVien) {
            return res.status(404).json({ message: `Không tìm thấy sinh viên với ID '${id}'.` });
        }

        // Check if the new email is already taken by another student
        if (email && email !== sinhVien.email) {
            const emailTonTai = await db.SinhVien.findOne({ where: { email: email } });
            if (emailTonTai) {
                return res.status(409).json({ message: `Email '${email}' đã được sử dụng.` });
            }
            sinhVien.email = email;
        }

        // Update fields if provided
        if (hoTen !== undefined) sinhVien.hoTen = hoTen;
        if (ngaySinh !== undefined) sinhVien.ngaySinh = ngaySinh; // Allow setting to null

        await sinhVien.save();

        // Exclude password from the response data
        const svCapNhatData = sinhVien.toJSON();
        delete svCapNhatData.password;

        res.status(200).json({ message: 'Cập nhật thông tin sinh viên thành công!', data: svCapNhatData });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const xoaSinhVien = async (req, res) => {
    try {
        const { id } = req.params;
        const sinhVien = await db.SinhVien.findByPk(id);
        if (!sinhVien) {
            return res.status(404).json({ message: `Không tìm thấy sinh viên với ID '${id}'.` });
        }

        await sinhVien.destroy();
        res.status(200).json({ message: `Xóa sinh viên '${id}' thành công!` });

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ message: `Không thể xóa sinh viên '${id}' vì có dữ liệu liên quan (ví dụ: đơn đăng ký).` });
        }
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};



// --- CRUD GIẢNG VIÊN ---
const taoGiangVien = async (req, res) => {
    try {
        const { id, hoTen, email, password } = req.body;

        if (!id || !hoTen || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin bắt buộc: id, hoTen, email, password.' });
        }
        const gvTonTai = await db.GiangVien.findOne({ where: { [Op.or]: [{ id: id }, { email: email }] } });
        if (gvTonTai) {
            return res.status(409).json({ message: `Giảng viên với ID '${id}' hoặc Email '${email}' đã tồn tại.` });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const gvMoi = await db.GiangVien.create({
            id: id,
            hoTen: hoTen,
            email: email,
            password: hashedPassword
        });

        const gvMoiData = gvMoi.toJSON();
        delete gvMoiData.password;

        res.status(201).json({ message: 'Tạo giảng viên thành công!', data: gvMoiData });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const layTatCaGiangVien = async (req, res) => {
    try {
        const dsGiangVien = await db.GiangVien.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json({ message: 'Lấy danh sách giảng viên thành công!', data: dsGiangVien });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const layGiangVienTheoId = async (req, res) => {
    try {
        const { id } = req.params;
        const giangVien = await db.GiangVien.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!giangVien) {
            return res.status(404).json({ message: `Không tìm thấy giảng viên với ID '${id}'.` });
        }
        res.status(200).json({ message: 'Lấy thông tin giảng viên thành công!', data: giangVien });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const capNhatGiangVien = async (req, res) => {
    try {
        const { id } = req.params;
        const { hoTen, email } = req.body; // Chỉ cho phép cập nhật tên và email

        const giangVien = await db.GiangVien.findByPk(id);
        if (!giangVien) {
            return res.status(404).json({ message: `Không tìm thấy giảng viên với ID '${id}'.` });
        }

        if (email && email !== giangVien.email) {
            const emailTonTai = await db.GiangVien.findOne({ where: { email: email } });
            if (emailTonTai) {
                return res.status(409).json({ message: `Email '${email}' đã được sử dụng.` });
            }
            giangVien.email = email;
        }

        if (hoTen !== undefined) giangVien.hoTen = hoTen;

        await giangVien.save();

        const gvCapNhatData = giangVien.toJSON();
        delete gvCapNhatData.password;

        res.status(200).json({ message: 'Cập nhật thông tin giảng viên thành công!', data: gvCapNhatData });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const xoaGiangVien = async (req, res) => {
    try {
        const { id } = req.params;
        const giangVien = await db.GiangVien.findByPk(id);
        if (!giangVien) {
            return res.status(404).json({ message: `Không tìm thấy giảng viên với ID '${id}'.` });
        }

        await giangVien.destroy();
        res.status(200).json({ message: `Xóa giảng viên '${id}' thành công!` });

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ message: `Không thể xóa giảng viên '${id}' vì đang được phân công dạy lớp tín chỉ.` });
        }
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    layDonDangKyHoc,
    xuLyDonDangKyHoc,
    layThongTinCaNhan,

    taoMonHoc,
    layTatCaMonHoc,
    layMonHocTheoId,
    capNhatMonHoc,
    xoaMonHoc,

    taoLopTinChi,
    capNhatLopTinChi,
    layTatCaLopTinChi,
    layLopTinChiTheoId,
    xoaLopTinChi,

    taoSinhVien,
    layTatCaSinhVien,
    laySinhVienTheoId,
    capNhatSinhVien,
    xoaSinhVien,

    taoGiangVien,
    layTatCaGiangVien,
    layGiangVienTheoId,
    capNhatGiangVien,
    xoaGiangVien
};