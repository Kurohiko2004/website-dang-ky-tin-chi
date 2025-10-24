// Kết nối MySQL bằng thư viện Sequelize(Một ORM - Object Relational Mapping)

// Nạp các biến môi trường từ file .env
// Nếu không có dotenv thì sẽ phải hardcode các thông tin nhạy cảm như 
// username, password, database name vào trong code, rất nguy hiểm
require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'    // loại csdl (mysql, postgresql, sqlite)
    }
);




module.exports = sequelize;