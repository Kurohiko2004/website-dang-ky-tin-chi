I. Setting up project

1. Tải NodeJS:
   - Truy cập https://nodejs.org/en/download, tải bản Window Installer (.msi) rồi chạy file cài.
   - Mặc định, Powershell sẽ chặn không cho Node chạy lệnh, và sẽ hiển thị lỗi sau khi chạy các lệnh bắt đầu bằng "npm":
     "File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system."
   - Để sửa lỗi này, truy cập tutorial sau và làm theo các hướng dẫn: https://stackoverflow.com/questions/57673913/vsc-powershell-after-npm-updating-packages-ps1-cannot-be-loaded-because-runnin
     -   Tutorial dễ hiểu hơn nhưng viết bằng chatgpt: https://www.linkedin.com/pulse/how-fix-npm-file-cprogram-filesnodejsnpmps1-cannot-loaded-hasan-ojsnc

2. Cài đặt các thư viện và dependency
   - Sau khi tải project về, mở folder chính trong VS Code (folder "website-dang-ky-tin-chi")
   - Mở 2 terminal khác nhau và chạy các lệnh sau:
     -  Terminal 1:
         
         cd backend
         
         npm install
  
     - Terminal 2:
         
         cd frontend
         
         npm install

   - Lệnh npm install sẽ tự động cài các dependency dựa theo file package.json có trong cả hai thư mục frontend và backend. Đây là file chứa các thông tin về project
    và các dependency cần thiết để chạy project

3. Load database:
   a. Mở MySQL Workbench:
   - Nhấn vào Local Instance MySQL80 (hoặc tương tự)
   - Nhập mật khẩu user root
  
   b. Tạo một database rỗng:
   - Tạo một SQL script mới và nhập:
     - CREATE DATABASE project_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     - USE project_db;
    
   c. Tạo csdl từ file sql sẵn có
   - Trong Workbench, vào menu: Server → Data Import → Import from Dump Project Folder
   - Nhập link dẫn đến thư mục /website-dang-ky-tin-chi/mysql database
   - Vào tab Import Progress → import

4. Kết nối database vừa tạo với backend của project
   - Truy cập thư mục backend
   - Tạo file .env. File này chứa các thông tin nhạy cảm như mật khẩu để kết nối với cơ sở dữ liệu (database), vì vậy không nên đẩy file này lên github
   - Nội dung file .env có thể như sau:
  
    DB_HOST=localhost
   
    DB_USER=root
   
    DB_PASSWORD=password_truy_cap_csdl_cua_ban
   
    DB_NAME=ten_database_muon_truy_cap
  
6. Chạy code
   - Trong thư mục đã truy cập ở backend: chạy lệnh
  
     npm run start

   - hoặc nếu không được thì:

     npm run devStart

   - Trong thư mục đã truy cập ở frontend: chạy lệnh
  
     npm run dev

     
       
     
