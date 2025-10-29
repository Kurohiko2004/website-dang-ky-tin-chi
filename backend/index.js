// dotenv đọc file .env rồi tải biến vào process.env. 
// Đặt lên đầu vì các file khác có thể dùng nó
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/AuthRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const sinhVienRoutes = require('./routes/SinhVienRoutes');
const giangVienRoutes = require('./routes/GiangVienRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/sinh-vien', sinhVienRoutes);
app.use('/giang-vien', giangVienRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the REST API');
})

// Khởi động server
app.listen(PORT, async () => {
    console.log(` Server đang chạy trên cổng ${PORT}`);
    try {
        await db.sequelize.authenticate();
        console.log(' Kết nối CSDL thành công.');
    } catch (error) {
        console.error(' Không thể kết nối tới CSDL:', error);
    }
});