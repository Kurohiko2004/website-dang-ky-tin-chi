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
-- Table structure for table `sinhvien`
--

DROP TABLE IF EXISTS `sinhvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sinhvien` (
  `id` varchar(20) NOT NULL,
  `hoTen` varchar(100) NOT NULL,
  `ngaySinh` datetime DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_sinhvien_email` (`email`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sinhvien`
--

LOCK TABLES `sinhvien` WRITE;
/*!40000 ALTER TABLE `sinhvien` DISABLE KEYS */;
INSERT INTO `sinhvien` VALUES ('SV001','Nguyễn Văn A','2003-05-10 00:00:00','vana@example.com','$2b$10$No5w30I4HhVYL0HjV7o6quVE9hdHAePbuao3ipdiqD924iOdIRDw2'),('SV002','Trần Thị B','2002-08-21 00:00:00','thib@example.com','$2b$10$No5w30I4HhVYL0HjV7o6quVE9hdHAePbuao3ipdiqD924iOdIRDw2'),('SV003','Đỗ Giang Bình','2003-10-10 00:00:00','binh@gmail.com','$2b$10$3/1ZK/ZbMYKNiWiLjuk2q.a5.ZlRCkT.4Pu6fkl6mkAuEVFwgpyRu'),('SV004','Nguyễn Việt Anh','2003-12-10 00:00:00','vanhsecond@gmail.com','$2b$10$d40UVkyJGEiT.e6S6MIOQO3HwQofyyXuLgYsL47uNXuRMyvDntvU2'),('SV005','Nguyễn Hải Đăng','2003-07-09 00:00:00','dang@gmail.com','$2b$10$clbxkKFrT8A2qw6rmjWIGeGgflPKLurcqVtr9Fei1.fb6PlByJr0i'),('SV006','Nguyễn Lê Hiếu','2003-01-09 00:00:00','hieu@gmail.com','$2b$10$clbxkKFrT8A2qw6rmjWIGeGgflPKLurcqVtr9Fei1.fb6PlByJr0i');
/*!40000 ALTER TABLE `sinhvien` ENABLE KEYS */;
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
