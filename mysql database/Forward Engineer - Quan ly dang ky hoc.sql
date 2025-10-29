-- MySQL Workbench Synchronization
-- Generated: 2025-10-15 17:22
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: vanh

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER TABLE `quanlydangkyhoc`.`dangkyhoc` 
DROP FOREIGN KEY `dangkyhoc_ibfk_1`,
DROP FOREIGN KEY `dangkyhoc_ibfk_2`;

ALTER TABLE `quanlydangkyhoc`.`ketqua` 
DROP FOREIGN KEY `ketqua_ibfk_1`;

ALTER TABLE `quanlydangkyhoc`.`loptinchi` 
DROP FOREIGN KEY `loptinchi_ibfk_1`,
DROP FOREIGN KEY `loptinchi_ibfk_2`;

ALTER TABLE `quanlydangkyhoc`.`dangkyhoc` 
CHANGE COLUMN `SinhVien_id` `SinhVien_id` VARCHAR(20) NOT NULL ,
CHANGE COLUMN `LopTinChi_id` `LopTinChi_id` VARCHAR(20) NOT NULL ,
CHANGE COLUMN `trangThai` `trangThai` VARCHAR(45) NOT NULL ,
CHANGE COLUMN `ngayDangKy` `ngayDangKy` DATE NOT NULL ;

ALTER TABLE `quanlydangkyhoc`.`giangvien` 
CHANGE COLUMN `email` `email` VARCHAR(100) NOT NULL ,
CHANGE COLUMN `password` `password` VARCHAR(100) NOT NULL ;

ALTER TABLE `quanlydangkyhoc`.`ketqua` 
DROP COLUMN `id`,
CHANGE COLUMN `DangKyHoc_id` `dangkyhoc_id` INT(11) NOT NULL FIRST,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`dangkyhoc_id`),
ADD INDEX `fk_ketqua_dangkyhoc1_idx` (`dangkyhoc_id` ASC) VISIBLE,
DROP INDEX `UQ_KetQua_DangKyHoc` ;
;

ALTER TABLE `quanlydangkyhoc`.`loptinchi` 
CHANGE COLUMN `kyHoc` `kyHoc` VARCHAR(20) NOT NULL ,
CHANGE COLUMN `namHoc` `namHoc` VARCHAR(20) NOT NULL ,
CHANGE COLUMN `phongHoc` `phongHoc` VARCHAR(50) NULL DEFAULT NULL ,
CHANGE COLUMN `MonHoc_id` `MonHoc_id` VARCHAR(20) NOT NULL ,
CHANGE COLUMN `GiangVien_id` `GiangVien_id` VARCHAR(20) NOT NULL ;

ALTER TABLE `quanlydangkyhoc`.`monhoc` 
CHANGE COLUMN `soTinChi` `soTinChi` INT(11) NOT NULL ;

ALTER TABLE `quanlydangkyhoc`.`sinhvien` 
CHANGE COLUMN `email` `email` VARCHAR(100) NOT NULL ,
CHANGE COLUMN `password` `password` VARCHAR(100) NOT NULL ;

ALTER TABLE `quanlydangkyhoc`.`dangkyhoc` 
ADD CONSTRAINT `dangkyhoc_ibfk_1`
  FOREIGN KEY (`SinhVien_id`)
  REFERENCES `quanlydangkyhoc`.`sinhvien` (`id`),
ADD CONSTRAINT `dangkyhoc_ibfk_2`
  FOREIGN KEY (`LopTinChi_id`)
  REFERENCES `quanlydangkyhoc`.`loptinchi` (`id`);

ALTER TABLE `quanlydangkyhoc`.`ketqua` 
ADD CONSTRAINT `fk_ketqua_dangkyhoc1`
  FOREIGN KEY (`dangkyhoc_id`)
  REFERENCES `quanlydangkyhoc`.`dangkyhoc` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `quanlydangkyhoc`.`loptinchi` 
ADD CONSTRAINT `loptinchi_ibfk_1`
  FOREIGN KEY (`MonHoc_id`)
  REFERENCES `quanlydangkyhoc`.`monhoc` (`id`),
ADD CONSTRAINT `loptinchi_ibfk_2`
  FOREIGN KEY (`GiangVien_id`)
  REFERENCES `quanlydangkyhoc`.`giangvien` (`id`);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;



-- CHANGES --
ALTER TABLE sinhvien
ADD CONSTRAINT UQ_sinhvien_email UNIQUE (email);

ALTER TABLE giangvien
ADD CONSTRAINT UQ_giangvien_email UNIQUE (email);

ALTER TABLE ketqua
ADD CONSTRAINT CHECK_diem_hop_ly
CHECK (
	diemChuyenCan 	BETWEEN 0 AND 10 AND
    diemBaiTap 		BETWEEN 0 AND 10 AND
    diemThiGiuaKy 	BETWEEN 0 AND 10 AND
    diemThiCuoiKy 	BETWEEN 0 AND 10
);

-- BẢNG admin ---
USE quanlydangkyhoc;
CREATE TABLE admin (
  id VARCHAR(20) PRIMARY KEY,
  hoTen VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100)
);

INSERT INTO Admin (id, hoTen, email, password)
VALUES ('ADMIN01', 'vanh', 'admin@gmail.com', '$2b$10$No5w30I4HhVYL0HjV7o6quVE9hdHAePbuao3ipdiqD924iOdIRDw2');

UPDATE giangvien
SET password = '$2b$10$No5w30I4HhVYL0HjV7o6quVE9hdHAePbuao3ipdiqD924iOdIRDw2'
WHERE id = 'GV001';


-- fix lỗi lưu 2 lần liên tiếp cùng 1 đơn đăng ký trong csdl
SELECT SinhVien_id, LopTinChi_id, COUNT(*) AS SoLuong
FROM DangKyHoc
GROUP BY SinhVien_id, LopTinChi_id
HAVING COUNT(*) > 1;

ALTER TABLE DangKyHoc
ADD CONSTRAINT UQ_SinhVien_Lop UNIQUE (SinhVien_id, LopTinChi_id);


-- XÓA RECORD DangKyHoc
USE quanlydangkyhoc;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE dangkyhoc; 
SET FOREIGN_KEY_CHECKS = 1;

-- Theo dõi RECORD DangKyHoc
USE quanlydangkyhoc;
SELECT * FROM Dangkyhoc 
WHERE trangThai = 'Đã duyệt';
	
SELECT * FROM LopTinChi 
WHERE id = 'LTC_FULL';

UPDATE loptinchi 
SET kipHoc = '7-9'
WHERE id ='LTC_FULL';

