const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SinhVien = sequelize.define('SinhVien', {
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    hoTen: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ngaySinh: {
        type: DataTypes.DATE,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    // // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,

    //// disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,

    // define the table's name
    tableName: 'sinhvien',
});

module.exports = SinhVien;