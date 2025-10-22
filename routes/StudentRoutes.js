const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');
const { authenticateToken, isStudent } = require('../middleware/authMiddleware');

router.post('/dang-ky', authenticateToken, isStudent, studentController.taoDonDangKy);

router.get('/lop-tin-chi', authenticateToken, isStudent, studentController.layCacLopDangMo);
router.get('/lich-hoc', authenticateToken, isStudent, studentController.layLichHoc);
router.get('/ket-qua', authenticateToken, isStudent, studentController.xemDiem);

router.get('/thong-tin', authenticateToken, isStudent, studentController.layThongTinCaNhan);

module.exports = router;