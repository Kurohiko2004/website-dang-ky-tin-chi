const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/thong-tin', authenticateToken, isAdmin, adminController.layThongTinCaNhan);

router.get('/don-cho-duyet', authenticateToken, isAdmin, adminController.layDonDangKyHoc);
router.put('/duyet-don/:id', authenticateToken, isAdmin, adminController.xuLyDonDangKyHoc);


router.route('/mon-hoc')
    .post(authenticateToken, isAdmin, adminController.taoMonHoc)
    .get(authenticateToken, isAdmin, adminController.layTatCaMonHoc);
router.route('/mon-hoc/:id')
    .get(authenticateToken, isAdmin, adminController.layMonHocTheoId)
    .put(authenticateToken, isAdmin, adminController.capNhatMonHoc)
    .delete(authenticateToken, isAdmin, adminController.xoaMonHoc);


router.route('/lop-tin-chi')
    .post(authenticateToken, isAdmin, adminController.taoLopTinChi)
    .get(authenticateToken, isAdmin, adminController.layTatCaLopTinChi);
router.route('/lop-tin-chi/:id')
    .get(authenticateToken, isAdmin, adminController.layLopTinChiTheoId)
    .put(authenticateToken, isAdmin, adminController.capNhatLopTinChi)
    .delete(authenticateToken, isAdmin, adminController.xoaLopTinChi);


router.route('/sinh-vien')
    .post(authenticateToken, isAdmin, adminController.taoSinhVien)
    .get(authenticateToken, isAdmin, adminController.layTatCaSinhVien);
router.route('/sinh-vien/:id')
    .get(authenticateToken, isAdmin, adminController.laySinhVienTheoId)
    .put(authenticateToken, isAdmin, adminController.capNhatSinhVien)
    .delete(authenticateToken, isAdmin, adminController.xoaSinhVien);


router.route('/giang-vien')
    .post(authenticateToken, isAdmin, adminController.taoGiangVien)
    .get(authenticateToken, isAdmin, adminController.layTatCaGiangVien);
router.route('/giang-vien/:id')
    .get(authenticateToken, isAdmin, adminController.layGiangVienTheoId)
    .put(authenticateToken, isAdmin, adminController.capNhatGiangVien)
    .delete(authenticateToken, isAdmin, adminController.xoaGiangVien);

module.exports = router;

