const express = require('express');
const router = express.Router();
const giangVienController = require('../controllers/GiangVienController.js');
const { authenticateToken, isGiangVien } = require('../middleware/authMiddleware.js');

router.get('/lop-hoc-cua-toi', authenticateToken, isGiangVien, giangVienController.layLopCuaGiangVien);
router.post('/nhap-diem', authenticateToken, isGiangVien, giangVienController.nhapDiem);

// route dang ky day
router.get('/lop/:id/sinh-vien', authenticateToken, isGiangVien, giangVienController.layDSSinhVienCuaLop);

router.get('/thong-tin', authenticateToken, isGiangVien, giangVienController.layThongTinCaNhan);

module.exports = router;