const express = require('express');
const router = express.Router();
const giangVienController = require('../controllers/GiangVienController.js');
const { authenticateToken, isGiangVien } = require('../middleware/authMiddleware.js');

router.get('/thong-tin', authenticateToken, isGiangVien, giangVienController.layThongTinCaNhan);
router.get('/lop-hoc-cua-toi', authenticateToken, isGiangVien, giangVienController.layLopCuaGiangVien);
router.get('/lop/:id/sinh-vien', authenticateToken, isGiangVien, giangVienController.layDSSinhVienVaDiem);
router.post('/nhap-diem', authenticateToken, isGiangVien, giangVienController.nhapKetQua);


module.exports = router;