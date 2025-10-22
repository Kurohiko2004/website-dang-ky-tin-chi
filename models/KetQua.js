const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const DangKyHoc = require('./DangKyHoc');

const KetQua = sequelize.define('KetQua', {
    // Trong mối quan hệ 1-1 xác định, khóa ngoại cũng chính là khóa chính.
    dangkyhoc_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Đặt cột này làm khóa chính
        allowNull: false
    },
    diemChuyenCan: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    diemBaiTap: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    diemThiGiuaKy: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    diemThiCuoiKy: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'ketqua',
});

module.exports = KetQua;