const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/TeacherController.js');
const { authenticateToken, isTeacher } = require('../middleware/authMiddleware.js');

router.get('/lop-hoc-cua-toi', authenticateToken, isTeacher, teacherController.layLopCuaGiangVien);
router.post('/nhap-diem', authenticateToken, isTeacher, teacherController.nhapDiem);

// route dang ky day
router.get('/lop/:id/sinh-vien', authenticateToken, isTeacher, teacherController.layDSSinhVienCuaLop);

router.get('/thong-tin', authenticateToken, isTeacher, teacherController.layThongTinCaNhan);

module.exports = router;