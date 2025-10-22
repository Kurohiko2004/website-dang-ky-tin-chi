const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu.' });
        }

        let user = null;
        let vaiTro = null;

        // tìm lần lượt trong 3 bảng, nếu tìm thấy thì mới gán vaiTro
        user = await db.SinhVien.findOne({ where: { email } });
        if (user) {
            vaiTro = 'sinhvien';
        }

        if (!user) {
            user = await db.GiangVien.findOne({ where: { email } });
            if (user) {
                vaiTro = 'giangvien';
            }
        }

        if (!user) {
            user = await db.Admin.findOne({ where: { email } });
            if (user) {
                vaiTro = 'admin';
            }
        }

        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // 1. So sánh password của trong request với password trong db
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // 2. Tạo JWT token 
        // payload: thông tin muốn lưu trong token, quan trọng nhất là id và vai trò để các
        // middleware xác thực và phân quyền 

        const payload = {
            id: user.id,
            hoTen: user.hoTen,
            vaiTro: vaiTro
        };

        // 3. Sign token
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // 4. Gửi token về cho client
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            token: token,
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    login
};