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
-- Table structure for table `dangkyhoc`
--

DROP TABLE IF EXISTS `dangkyhoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dangkyhoc` (
  `id` int NOT NULL AUTO_INCREMENT,
  `SinhVien_id` varchar(20) NOT NULL,
  `LopTinChi_id` varchar(20) NOT NULL,
  `trangThai` varchar(45) NOT NULL,
  `ngayDangKy` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_SinhVien_Lop` (`SinhVien_id`,`LopTinChi_id`),
  KEY `LopTinChi_id` (`LopTinChi_id`),
  CONSTRAINT `dangkyhoc_ibfk_1` FOREIGN KEY (`SinhVien_id`) REFERENCES `sinhvien` (`id`),
  CONSTRAINT `dangkyhoc_ibfk_2` FOREIGN KEY (`LopTinChi_id`) REFERENCES `loptinchi` (`id`),
  CONSTRAINT `dangkyhoc_ibfk_3` FOREIGN KEY (`SinhVien_id`) REFERENCES `sinhvien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dangkyhoc_ibfk_4` FOREIGN KEY (`LopTinChi_id`) REFERENCES `loptinchi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dangkyhoc`
--

LOCK TABLES `dangkyhoc` WRITE;
/*!40000 ALTER TABLE `dangkyhoc` DISABLE KEYS */;
INSERT INTO `dangkyhoc` VALUES (1,'SV001','CPP001','Đã duyệt','2025-10-29 00:37:41'),(2,'SV001','DSA001','Đã duyệt','2025-10-29 00:37:41'),(3,'SV001','WP001','Đã duyệt','2025-10-29 00:37:41'),(4,'SV002','DSA001','Đã duyệt','2025-10-29 01:00:29'),(5,'SV003','DSA001','Đã duyệt','2025-10-29 01:00:51'),(6,'SV005','DSA001','Đã duyệt','2025-10-29 01:01:49'),(7,'SV006','DSA001','Đã duyệt','2025-10-29 01:02:07'),(8,'SV004','DSA001','Đã duyệt','2025-10-29 01:02:20');
/*!40000 ALTER TABLE `dangkyhoc` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-29  8:16:03
