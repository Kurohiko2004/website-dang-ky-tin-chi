const sequelize = require('../config/database.js');
const SinhVien = require('./SinhVien');
const GiangVien = require('./GiangVien');
const MonHoc = require('./MonHoc');
const LopTinChi = require('./LopTinChi');
const DangKyHoc = require('./DangKyHoc');
const KetQua = require('./KetQua');
const Admin = require('./Admin')

// db là một obj để quản lý toàn bộ csdl
const db = {};  // tạo một object rỗng (một cái hộp trống)
db.sequelize = sequelize;

// Gán các model vào object db (giống như gán thuộc tính 
// vào obj)
db.SinhVien = SinhVien;
db.GiangVien = GiangVien;
db.MonHoc = MonHoc;
db.LopTinChi = LopTinChi;
db.DangKyHoc = DangKyHoc;
db.KetQua = KetQua;
db.Admin = Admin;

// --- Định nghĩa association ---

// Quan hệ 1-N: SinhVien -> DangKyHoc
db.SinhVien.hasMany(db.DangKyHoc, { foreignKey: 'SinhVien_id' });
db.DangKyHoc.belongsTo(db.SinhVien, { foreignKey: 'SinhVien_id' });;
// { foreignKey: 'SinhVien_id' }: 
// + Cho biết rằng cột khóa ngoại (foreign key) sẽ nằm trong bảng DangKyHoc
// + Sequelize sẽ hiểu rằng bảng DangKyHoc có một cột là SinhVien_id để liên
// kết với SinhVien.id

// Quan hệ 1-N: LopTinChi -> DangKyHoc
db.LopTinChi.hasMany(db.DangKyHoc, { foreignKey: 'LopTinChi_id' });
db.DangKyHoc.belongsTo(db.LopTinChi, { foreignKey: 'LopTinChi_id' });

// Quan hệ 1-N: MonHoc -> LopTinChi
db.MonHoc.hasMany(db.LopTinChi, { foreignKey: 'MonHoc_id' });
db.LopTinChi.belongsTo(db.MonHoc, { foreignKey: 'MonHoc_id' });

// Quan hệ 1-N: GiangVien -> LopTinChi
db.GiangVien.hasMany(db.LopTinChi, { foreignKey: 'GiangVien_id' });
db.LopTinChi.belongsTo(db.GiangVien, { foreignKey: 'GiangVien_id' });

// Quan hệ 1-1: DangKyHoc -> KetQua
db.DangKyHoc.hasOne(db.KetQua, { foreignKey: 'dangkyhoc_id' });
db.KetQua.belongsTo(db.DangKyHoc, { foreignKey: 'dangkyhoc_id' });

module.exports = db;