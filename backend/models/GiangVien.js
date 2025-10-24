// try {
//     const sequelize = require('./config/database');
//     console.log("Import thành công");
// } catch (err) {
//     throw ("Import lỗi: ", err.message);
// }

const { DataTypes } = require('sequelize');
// .. : từ vị trí của file đang chứa dòng lệnh này, đi ra 
// ngoài 1 cấp, sau đó tìm folder config...
const sequelize = require('../config/database');


const GiangVien = sequelize.define('GiangVien', {
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    hoTen: {
        type: DataTypes.STRING(100),
        allowNull: false
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
    timestamps: false,
    freezeTableName: true,
    tableName: 'giangvien',
});

module.exports = GiangVien;


