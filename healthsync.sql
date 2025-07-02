-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: healthsync
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `admcodigo` int(11) NOT NULL AUTO_INCREMENT,
  `admnome` varchar(100) NOT NULL,
  `admemail` varchar(100) NOT NULL,
  `admsenha` varchar(100) NOT NULL,
  PRIMARY KEY (`admcodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'natan','natanadm@gmail.com','123'),(2,'silvio','silvioadm@gmail.com','123');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dados_complementares`
--

DROP TABLE IF EXISTS `dados_complementares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dados_complementares` (
  `complemento_codigo` int(11) NOT NULL AUTO_INCREMENT,
  `usucodigo` int(11) NOT NULL,
  `idade` int(11) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`complemento_codigo`),
  KEY `usucodigo` (`usucodigo`),
  CONSTRAINT `dados_complementares_ibfk_1` FOREIGN KEY (`usucodigo`) REFERENCES `usuarios` (`usucodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dados_complementares`
--

LOCK TABLES `dados_complementares` WRITE;
/*!40000 ALTER TABLE `dados_complementares` DISABLE KEYS */;
INSERT INTO `dados_complementares` VALUES (4,11,NULL,'11996968856',NULL,NULL,'Rua Do Meio, 4141','2025-05-30 23:45:09'),(5,12,NULL,NULL,NULL,NULL,NULL,'2025-06-30 21:50:08');
/*!40000 ALTER TABLE `dados_complementares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `educacao_saude`
--

DROP TABLE IF EXISTS `educacao_saude`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `educacao_saude` (
  `edcodigo` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `tipo` enum('video','artigo') NOT NULL,
  `link` varchar(500) NOT NULL,
  PRIMARY KEY (`edcodigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `educacao_saude`
--

LOCK TABLES `educacao_saude` WRITE;
/*!40000 ALTER TABLE `educacao_saude` DISABLE KEYS */;
/*!40000 ALTER TABLE `educacao_saude` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback` (
  `feedback_codigo` int(11) NOT NULL AUTO_INCREMENT,
  `usucodigo` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `data_feedback` datetime NOT NULL,
  PRIMARY KEY (`feedback_codigo`),
  KEY `usucodigo` (`usucodigo`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`usucodigo`) REFERENCES `usuarios` (`usucodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,8,5,'Top demais ','2025-05-28 00:26:42'),(2,8,5,'top','2025-05-28 00:28:25'),(3,8,5,'top','2025-05-28 00:28:39'),(4,9,3,'Ruim','2025-05-28 00:39:36');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lembretes`
--

DROP TABLE IF EXISTS `lembretes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lembretes` (
  `lembrete_codigo` int(11) NOT NULL AUTO_INCREMENT,
  `usucodigo` int(11) NOT NULL,
  `medicamento_codigo` int(11) NOT NULL,
  `lembrete_horario` time NOT NULL,
  `lembrete_frequencia` varchar(20) NOT NULL,
  `lembrete_observacoes` text DEFAULT NULL,
  `lembrete_data_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`lembrete_codigo`),
  KEY `usucodigo` (`usucodigo`),
  KEY `medicamento_codigo` (`medicamento_codigo`),
  CONSTRAINT `lembretes_ibfk_1` FOREIGN KEY (`usucodigo`) REFERENCES `usuarios` (`usucodigo`),
  CONSTRAINT `lembretes_ibfk_2` FOREIGN KEY (`medicamento_codigo`) REFERENCES `medicamentos` (`medicamento_codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lembretes`
--

LOCK TABLES `lembretes` WRITE;
/*!40000 ALTER TABLE `lembretes` DISABLE KEYS */;
INSERT INTO `lembretes` VALUES (6,11,8,'12:00:00','diario','teste','2025-05-30 23:49:35');
/*!40000 ALTER TABLE `lembretes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicamentos`
--

DROP TABLE IF EXISTS `medicamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medicamentos` (
  `medicamento_codigo` int(11) NOT NULL AUTO_INCREMENT,
  `usucodigo` int(11) NOT NULL,
  `medicamento_nome` varchar(100) NOT NULL,
  `medicamento_dosagem` varchar(50) NOT NULL,
  `medicamento_frequencia` varchar(20) NOT NULL,
  `medicamento_horario` time NOT NULL,
  `medicamento_observacoes` text DEFAULT NULL,
  `medicamento_data_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`medicamento_codigo`),
  KEY `usucodigo` (`usucodigo`),
  CONSTRAINT `medicamentos_ibfk_1` FOREIGN KEY (`usucodigo`) REFERENCES `usuarios` (`usucodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicamentos`
--

LOCK TABLES `medicamentos` WRITE;
/*!40000 ALTER TABLE `medicamentos` DISABLE KEYS */;
INSERT INTO `medicamentos` VALUES (6,9,'ozenvitta','1 comprimido, 50ml','12h','12:00:00','Tomar apos refeição','2025-05-28 03:34:21'),(7,9,'Dipirona','1 comprimido, 500mg','8h','12:00:00','','2025-05-28 16:54:22'),(8,11,'Dipirona','1 comprimido, 500mg','12h','12:00:00','teste','2025-05-30 23:49:20');
/*!40000 ALTER TABLE `medicamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicoes`
--

DROP TABLE IF EXISTS `medicoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medicoes` (
  `medcodigo` int(11) NOT NULL AUTO_INCREMENT,
  `usucodigo` int(11) NOT NULL,
  `mednome` varchar(100) NOT NULL,
  `medidade` int(11) NOT NULL,
  `medaltura` decimal(3,2) NOT NULL,
  `medpeso` decimal(5,2) NOT NULL,
  `medgordura` decimal(5,2) NOT NULL,
  `medmassa` decimal(5,2) NOT NULL,
  `medfrequencia` int(11) NOT NULL,
  `medpressao` varchar(10) NOT NULL,
  `medimc` varchar(50) NOT NULL,
  `meddata` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`medcodigo`),
  KEY `usucodigo` (`usucodigo`),
  CONSTRAINT `medicoes_ibfk_1` FOREIGN KEY (`usucodigo`) REFERENCES `usuarios` (`usucodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicoes`
--

LOCK TABLES `medicoes` WRITE;
/*!40000 ALTER TABLE `medicoes` DISABLE KEYS */;
INSERT INTO `medicoes` VALUES (4,11,'jeferson',28,1.75,110.00,36.00,40.00,90,'120/80','Obesidade Grau II','2025-05-30 23:46:37');
/*!40000 ALTER TABLE `medicoes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 trigger tr_calcular_imc
before insert on medicoes
for each row
begin
if new.medpeso is not null and new.medaltura is not null and new.medaltura > 0 then
set new.medimc = round(new.medpeso / (new.medaltura * new.medaltura), 2);
end if;
if new.meddata is null then
set new.meddata = now();
end if;
end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `registro_glicemia`
--

DROP TABLE IF EXISTS `registro_glicemia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registro_glicemia` (
  `glicemia_codigo` int(11) NOT NULL AUTO_INCREMENT,
  `usucodigo` int(11) NOT NULL,
  `glicemia` int(11) NOT NULL,
  `momento` enum('jejum','antes_cafe','depois_cafe','antes_almoco','depois_almoco','antes_jantar','depois_jantar','antes_dormir') DEFAULT NULL,
  `alimentacao` enum('sim','nao') DEFAULT NULL,
  `data_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`glicemia_codigo`),
  KEY `usucodigo` (`usucodigo`),
  CONSTRAINT `registro_glicemia_ibfk_1` FOREIGN KEY (`usucodigo`) REFERENCES `usuarios` (`usucodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_glicemia`
--

LOCK TABLES `registro_glicemia` WRITE;
/*!40000 ALTER TABLE `registro_glicemia` DISABLE KEYS */;
INSERT INTO `registro_glicemia` VALUES (5,11,50,'jejum','sim','2025-05-30 23:48:07');
/*!40000 ALTER TABLE `registro_glicemia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro_pressao`
--

DROP TABLE IF EXISTS `registro_pressao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registro_pressao` (
  `pressao_codigo` int(11) NOT NULL AUTO_INCREMENT,
  `usucodigo` int(11) NOT NULL,
  `pressao` varchar(10) NOT NULL,
  `frequencia` int(11) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `estresse` enum('baixo','moderado','alto') DEFAULT NULL,
  `sal` enum('baixa','moderada','alta') DEFAULT NULL,
  `liquidos` int(11) DEFAULT NULL,
  `data_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`pressao_codigo`),
  KEY `usucodigo` (`usucodigo`),
  CONSTRAINT `registro_pressao_ibfk_1` FOREIGN KEY (`usucodigo`) REFERENCES `usuarios` (`usucodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_pressao`
--

LOCK TABLES `registro_pressao` WRITE;
/*!40000 ALTER TABLE `registro_pressao` DISABLE KEYS */;
INSERT INTO `registro_pressao` VALUES (6,11,'134/70',100,80.00,'baixo','baixa',2000,'2025-05-30 23:47:35');
/*!40000 ALTER TABLE `registro_pressao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sistema_info`
--

DROP TABLE IF EXISTS `sistema_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sistema_info` (
  `sistcodigo` int(11) NOT NULL AUTO_INCREMENT,
  `ultima_atualizacao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ultimo_backup` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`sistcodigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sistema_info`
--

LOCK TABLES `sistema_info` WRITE;
/*!40000 ALTER TABLE `sistema_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `sistema_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `usucodigo` int(11) NOT NULL AUTO_INCREMENT,
  `usunome` varchar(100) NOT NULL,
  `ususobrenome` varchar(100) NOT NULL,
  `usuemail` varchar(100) NOT NULL,
  `ususenha` varchar(100) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  PRIMARY KEY (`usucodigo`),
  UNIQUE KEY `usuemail` (`usuemail`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (11,'Jeferson','Silva','jeferson@gmail.com','123456','2025-05-30 23:45:09','ativo'),(12,'Fernando','Silva','fernando@gmail.com','123456','2025-06-30 21:50:08','ativo');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `vw_usuarios_medicamentos`
--

DROP TABLE IF EXISTS `vw_usuarios_medicamentos`;
/*!50001 DROP VIEW IF EXISTS `vw_usuarios_medicamentos`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `vw_usuarios_medicamentos` AS SELECT
 1 AS `usunome`,
  1 AS `ususobrenome`,
  1 AS `usuemail`,
  1 AS `medicamento_nome`,
  1 AS `medicamento_dosagem`,
  1 AS `medicamento_frequencia` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_usuarios_pressao`
--

DROP TABLE IF EXISTS `vw_usuarios_pressao`;
/*!50001 DROP VIEW IF EXISTS `vw_usuarios_pressao`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `vw_usuarios_pressao` AS SELECT
 1 AS `usunome`,
  1 AS `ususobrenome`,
  1 AS `usuemail`,
  1 AS `pressao`,
  1 AS `data_registro` */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_usuarios_medicamentos`
--

/*!50001 DROP VIEW IF EXISTS `vw_usuarios_medicamentos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_usuarios_medicamentos` AS select `u`.`usunome` AS `usunome`,`u`.`ususobrenome` AS `ususobrenome`,`u`.`usuemail` AS `usuemail`,`m`.`medicamento_nome` AS `medicamento_nome`,`m`.`medicamento_dosagem` AS `medicamento_dosagem`,`m`.`medicamento_frequencia` AS `medicamento_frequencia` from (`usuarios` `u` join `medicamentos` `m` on(`u`.`usucodigo` = `m`.`usucodigo`)) order by `u`.`usunome` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_usuarios_pressao`
--

/*!50001 DROP VIEW IF EXISTS `vw_usuarios_pressao`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_usuarios_pressao` AS select `u`.`usunome` AS `usunome`,`u`.`ususobrenome` AS `ususobrenome`,`u`.`usuemail` AS `usuemail`,`rp`.`pressao` AS `pressao`,`rp`.`data_registro` AS `data_registro` from (`usuarios` `u` join `registro_pressao` `rp` on(`u`.`usucodigo` = `rp`.`usucodigo`)) order by `rp`.`data_registro` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-01 22:40:41
