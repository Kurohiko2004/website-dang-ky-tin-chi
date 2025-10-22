// Tạo một middleware authenticateToken để kiểm tra token trong header của mỗi request.

// Giải mã token bằng jsonwebtoken.verify.

// Nếu token hợp lệ, lấy thông tin user (ví dụ id và vaiTro) và gán vào req.user.

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // 1. Lấy token từ header (định dạng: "Bearer <TOKEN>")
    // Trong authHeader có phần tên Header và phần token, thì split cái 
    // chuỗi đó ra sẽ lấy được token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // nếu không có token thì return null, tra về 401 - lỗi xác thực
    if (token == null) {
        return res.status(401).json({ message: 'Chưa cung cấp token.' }); // 401 Unauthorized
    }

    // 2. Kiểm tra và giải mã token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        // Nếu token không hợp lệ (hết hạn, sai chữ ký...), trả về lỗi 403
        if (err) {
            return res.status(403).json({ message: 'Token không hợp lệ.' }); // 403 Forbidden
        }

        // 3. Gắn thông tin user vào request
        req.user = user; // user ở đây là thông tin bạn đã mã hóa, ví dụ: { id: 'SV001', vaiTro: 'sinhvien' }

        // 4. Cho phép request đi tiếp vào controller
        next();
    });
};

const isStudent = (req, res, next) => {
    // req.user được tạo ra từ middleware authenticateToken chạy trước đó
    if (req.user && req.user.vaiTro === 'sinhvien') {
        next(); // Nếu đúng là sinh viên, cho đi tiếp
    } else {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này. Yêu cầu quyền Sinh viên.' });
    }
};

const isTeacher = (req, res, next) => {
    if (req.user && req.user.vaiTro === 'giangvien') {
        next();
    } else {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này. Yêu cầu quyền Giảng viên.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.vaiTro == 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này. Yêu cầu quyền Admin.' });
    }
};

module.exports = {
    authenticateToken,
    isStudent,
    isTeacher,
    isAdmin
};
