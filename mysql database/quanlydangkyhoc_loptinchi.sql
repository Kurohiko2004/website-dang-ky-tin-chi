-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: quanlydangkyhoc
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `loptinchi`
--

DROP TABLE IF EXISTS `loptinchi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loptinchi` (
  `id` varchar(20) NOT NULL,
  `kyHoc` varchar(20) NOT NULL,
  `namHoc` varchar(20) NOT NULL,
  `ngayHoc` varchar(50) DEFAULT NULL,
  `phongHoc` varchar(50) DEFAULT NULL,
  `toaNha` varchar(50) DEFAULT NULL,
  `soLuongToiDa` int DEFAULT NULL,
  `MonHoc_id` varchar(20) NOT NULL,
  `GiangVien_id` varchar(20) NOT NULL,
  `kipHoc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `MonHoc_id` (`MonHoc_id`),
  KEY `GiangVien_id` (`GiangVien_id`),
  CONSTRAINT `loptinchi_ibfk_1` FOREIGN KEY (`MonHoc_id`) REFERENCES `monhoc` (`id`),
  CONSTRAINT `loptinchi_ibfk_2` FOREIGN KEY (`GiangVien_id`) REFERENCES `giangvien` (`id`),
  CONSTRAINT `loptinchi_ibfk_3` FOREIGN KEY (`MonHoc_id`) REFERENCES `monhoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `loptinchi_ibfk_4` FOREIGN KEY (`GiangVien_id`) REFERENCES `giangvien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loptinchi`
--

LOCK TABLES `loptinchi` WRITE;
/*!40000 ALTER TABLE `loptinchi` DISABLE KEYS */;
INSERT INTO `loptinchi` VALUES ('CPP001','1','2025-2026','Thứ 5','A-201','Tòa A',30,'MH006','GV007','9-11'),('CPP002','1','2025-2026','Thứ 6','A-201','Tòa A',30,'MH006','GV007','9-11'),('CPP003','1','2025-2026','Thứ 7','A-201','Tòa A',30,'MH006','GV007','9-11'),('DB001','1','2025-2026','Thứ 2','A101','Tòa A',25,'MH003','GV003','13-15'),('DB002','1','2025-2026','Thứ 4','A101','Tòa A',25,'MH003','GV003','13-15'),('DB003','1','2025-2026','Thứ 4','A101','Tòa A',25,'MH003','GV003','13-15'),('DM01','1','2025-2026','Thứ 2','A-VIP','Tòa A',60,'MH004','GV004','15-17'),('DM02','1','2025-2026','Thứ 3','A-VIP','Tòa A',60,'MH004','GV004','15-17'),('DM03','1','2025-2026','Thứ 4','A-VIP','Tòa A',60,'MH004','GV004','15-17'),('DSA001','1','2025-2026','Thứ 2','A301','Tòa A',30,'MH001','GV001','7-9'),('DSA002','1','2025-2026','Thứ 3','A301','Tòa A',30,'MH001','GV001','7-9'),('DSA003','1','2025-2026','Thứ 4','A301','Tòa A',30,'MH001','GV001','7-9'),('LTC_FULL_2','1','2025-2026','Thứ 6','A301','Tòa A',1,'MH001','GV001',NULL),('LTC_TrungMonHoc_2','1','2025-2026','Thứ 8','A301','Tòa A',1,'MH001','GV002',NULL),('OOP001','1','2025-2026','Thứ 2','A101','Tòa A',35,'MH002','GV002','7-9'),('OOP002','1','2025-2026','Thứ 3','A101','Tòa A',25,'MH002','GV002','7-9'),('OOP003','1','2025-2026','Thứ 4','A101','Tòa A',25,'MH002','GV002','7-9'),('PS001','1','2025-2026','Thứ 5','B101','Tòa B',30,'MH007','GV006','13-15'),('PS002','1','2025-2026','Thứ 6','B101','Tòa B',30,'MH007','GV006','13-15'),('PS003','1','2025-2026','Thứ 7','B101','Tòa B',30,'MH007','GV006','13-15'),('S002','1','2025-2026','Thứ 6','A501','Tòa A',30,'MH008','GV008','15-17'),('SS001','1','2025-2026','Thứ 5','A501','Tòa A',30,'MH008','GV008','15-17'),('SS003','1','2025-2026','Thứ 7','A501','Tòa A',30,'MH008','GV008','15-17'),('WP001','1','2025-2026','Thứ 5','A-VIP','Tòa A',60,'MH005','GV005','7-9'),('WP002','1','2025-2026','Thứ 6','A-VIP','Tòa A',60,'MH005','GV005','7-9'),('WP003','1','2025-2026','Thứ 7','A-VIP','Tòa A',60,'MH005','GV005','7-9');
/*!40000 ALTER TABLE `loptinchi` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-29  8:16:02
