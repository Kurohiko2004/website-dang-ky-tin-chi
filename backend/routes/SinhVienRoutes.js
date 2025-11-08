const express = require('express');
const router = express.Router();
const sinhVienController = require('../controllers/SinhVienController');
const { authenticateToken, isSinhVien } = require('../middleware/authMiddleware');

router.get('/thong-tin', authenticateToken, isSinhVien, sinhVienController.layThongTinCaNhan);

router.get('/lop-tin-chi', authenticateToken, isSinhVien, sinhVienController.layCacLopDangMo);

router.get('/dang-ky-hien-tai', authenticateToken, isSinhVien, sinhVienController.layDonDangKyHienTai);
router.get('/thoi-gian-dang-ky', authenticateToken, isSinhVien, sinhVienController.kiemTraThoiGianDangKy);

router.post('/dang-ky', authenticateToken, isSinhVien, sinhVienController.taoDonDangKy);
router.delete('/dang-ky/:id', authenticateToken, isSinhVien, sinhVienController.xoaDonDangKy);

router.get('/lich-hoc', authenticateToken, isSinhVien, sinhVienController.layLichHoc);
router.get('/ket-qua', authenticateToken, isSinhVien, sinhVienController.xemDiem);


module.exports = router;