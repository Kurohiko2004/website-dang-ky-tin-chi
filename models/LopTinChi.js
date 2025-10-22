const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const MonHoc = require('./MonHoc');
const GiangVien = require('./GiangVien');

const LopTinChi = sequelize.define('LopTinChi', {
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    kyHoc: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    namHoc: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    kipHoc: DataTypes.STRING(50),
    ngayHoc: DataTypes.STRING(50),
    phongHoc: DataTypes.STRING(50),
    toaNha: DataTypes.STRING(50),
    soLuongToiDa: DataTypes.INTEGER,
    MonHoc_id: {
        type: DataTypes.STRING(20)
    },
    GiangVien_id: {
        type: DataTypes.STRING(20)
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'loptinchi',
});

module.exports = LopTinChi;
