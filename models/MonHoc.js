const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MonHoc = sequelize.define('MonHoc', {
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    ten: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    soTinChi: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'monhoc',
});

module.exports = MonHoc;
