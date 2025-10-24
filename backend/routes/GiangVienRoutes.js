const express = require('express');
const router = express.Router();
const giangVienController = require('../controllers/GiangVienController.js');
const { authenticateToken, isGiangVien } = require('../middleware/authMiddleware.js');

router.get('/lop-hoc-cua-toi', authenticateToken, isGiangVien, giangVienController.layLopCuaGiangVien);
router.post('/nhap-diem', authenticateToken, isGiangVien, giangVienController.nhapKetQua);

// route dang ky day
router.get('/lop/:id/sinh-vien', authenticateToken, isGiangVien, giangVienController.layDSSinhVienVaDiem);

router.get('/thong-tin', authenticateToken, isGiangVien, giangVienController.nhapKetQua);

module.exports = router;