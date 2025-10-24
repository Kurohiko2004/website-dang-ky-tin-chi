const express = require('express');
const router = express.Router();
const sinhVienController = require('../controllers/SinhVienController');
const { authenticateToken, isSinhVien } = require('../middleware/authMiddleware');

router.get('/thong-tin', authenticateToken, isSinhVien, sinhVienController.layThongTinCaNhan);
router.get('/ket-qua', authenticateToken, isSinhVien, sinhVienController.xemDiem);

router.get('/lop-tin-chi', authenticateToken, isSinhVien, sinhVienController.layCacLopDangMo);
router.post('/dang-ky', authenticateToken, isSinhVien, sinhVienController.taoDonDangKy);
router.get('/lich-hoc', authenticateToken, isSinhVien, sinhVienController.layLichHoc);


module.exports = router;