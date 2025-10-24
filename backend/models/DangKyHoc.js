const { DataTypes } = require('sequelize');
const sequelize = require('../config/database')
const SinhVien = require('./SinhVien')
const LopTinChi = require('./LopTinChi')

const DangKyHoc = sequelize.define('DangKyHoc', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    trangThai: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    ngayDangKy: {
        type: DataTypes.DATE,
        allowNull: false
    },
    SinhVien_id: {
        type: DataTypes.STRING(20)
    },
    LopTinChi_id: {
        type: DataTypes.STRING(20)
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'dangkyhoc',

    indexes: [
        {
            unique: true,
            fields: ['SinhVien_id', 'LopTinChi_id'],
            name: 'UQ_SinhVien_Lop' // 
        }
    ]
});

module.exports = DangKyHoc;