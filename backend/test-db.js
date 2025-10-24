// lấy riêng thuộc tính {sequelize} nằm trong object db 
// được export trong models/index.js
const { sequelize } = require('./models')

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối CSDL thành công!');

        // Đồng bộ hóa tất cả models với CSDL (kiểm tra tất cả các model 
        // hiện tại, rồi so sánh chúng với các bảng trong CSDL, nếu có khác 
        // biệt thì sẽ thay đổi (thêm/sửa cột) để chúng khớp nhau mà không 
        // mất dữ liệu sẵn có
        await sequelize.sync({ alter: true });
        console.log("Đã sync xong");

    } catch (error) {
        console.error('❌ Kết nối thất bại:', error);
    } finally {
        await sequelize.close(); // đóng kết nối sau khi test xong
        console.log('Đã đóng kết nối!')
    }
}

testConnection();
