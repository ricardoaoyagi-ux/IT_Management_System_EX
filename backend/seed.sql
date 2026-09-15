-- Seed de demonstracao: estrutura completa + dados APENAS das tabelas de dominio/catalogo
-- (listas de sistema/modulo/status/tipo/motivo/feriados/etc). Nenhuma tabela transacional ou
-- com dados pessoais (incidentes, analistas, usuarios, horas, projetos...) tem dados aqui.
-- Nomes de sistemas internos reais foram generalizados (Sistema A..H).


-- MySQL dump 10.13  Distrib 9.5.0, for Win64 (x86_64)
--
-- Host: localhost    Database: cliente
-- ------------------------------------------------------
-- Server version	9.5.0-commercial

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
--


--
-- Table structure for table `agrupamento`
--

DROP TABLE IF EXISTS `agrupamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agrupamento` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Cod_Sistema` int DEFAULT NULL,
  `Cod_Modulo` int DEFAULT NULL,
  `Cod_agrupamento` int DEFAULT NULL,
  `nom_agrupamento` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Cod_Sistema` (`Cod_Sistema`,`Cod_Modulo`,`Cod_agrupamento`),
  CONSTRAINT `fk_agrup_modulo` FOREIGN KEY (`Cod_Sistema`, `Cod_Modulo`) REFERENCES `modulo` (`Cod_Sistema`, `Cod_Modulo`),
  CONSTRAINT `fk_agrup_sistema` FOREIGN KEY (`Cod_Sistema`) REFERENCES `sistema` (`Cod_Sistema`)
) ENGINE=InnoDB AUTO_INCREMENT=5907 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agrupamento`
--

LOCK TABLES `agrupamento` WRITE;
/*!40000 ALTER TABLE `agrupamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `agrupamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alocacao`
--

DROP TABLE IF EXISTS `alocacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alocacao` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Cod_alocacao` int DEFAULT NULL,
  `Desc_alocacao` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Cod_alocacao` (`Cod_alocacao`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alocacao`
--

LOCK TABLES `alocacao` WRITE;
/*!40000 ALTER TABLE `alocacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `alocacao` ENABLE KEYS */;
UNLOCK TABLES;

--
INSERT INTO `alocacao` VALUES (1,1,'Gestão'),(2,2,'Sustain_Inc'),(3,3,'Sustain_Renov'),(4,4,'Sustain_Enquad');
-- Table structure for table `analistas`
--

DROP TABLE IF EXISTS `analistas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analistas` (
  `Id_analista` int NOT NULL AUTO_INCREMENT,
  `Matricula` int DEFAULT NULL,
  `Nom_Analista` varchar(255) DEFAULT NULL,
  `Lider_Gerente` varchar(255) DEFAULT NULL,
  `Id_Fornecedor` varchar(255) DEFAULT NULL,
  `Id_Cliente` varchar(255) DEFAULT NULL,
  `Alocacao` int DEFAULT NULL,
  `Senioridade` int DEFAULT NULL,
  `Rate` int DEFAULT NULL,
  `Dt_Inicio` datetime DEFAULT NULL,
  `Dt_Fim` datetime DEFAULT NULL,
  `Dt_Atualizacao` datetime DEFAULT NULL,
  `Id_Atualizacao` varchar(255) DEFAULT NULL,
  `NOM_USUARIO_SIG` varchar(255) DEFAULT NULL,
  `CID_RESIDENCIA` varchar(255) DEFAULT NULL,
  `UF_RESIDENCIA` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id_analista`),
  UNIQUE KEY `Matricula` (`Matricula`),
  KEY `fk_analistas_rate` (`Rate`),
  KEY `fk_analistas_alocacao` (`Alocacao`),
  KEY `FK_Analistas_Senioridade` (`Senioridade`),
  CONSTRAINT `fk_analistas_alocacao` FOREIGN KEY (`Alocacao`) REFERENCES `alocacao` (`Cod_alocacao`),
  CONSTRAINT `fk_analistas_rate` FOREIGN KEY (`Rate`) REFERENCES `rates` (`Rate`),
  CONSTRAINT `FK_Analistas_Senioridade` FOREIGN KEY (`Senioridade`) REFERENCES `senioridade` (`ID_Senioridade`),
  CONSTRAINT `fk_users_analista` FOREIGN KEY (`Id_analista`) REFERENCES `users` (`AnalistaId`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analistas`
--

LOCK TABLES `analistas` WRITE;
/*!40000 ALTER TABLE `analistas` DISABLE KEYS */;
/*!40000 ALTER TABLE `analistas` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_insert_analistas` AFTER INSERT ON `analistas` FOR EACH ROW BEGIN
    INSERT INTO skills (
        Matricula, Nom_Analista,
        SistemaA, SistemaA_Cadastro, SistemaA_Sinistro, SistemaA_Cobranca, SistemaA_Emissao, SistemaA_Comissao,
        SistemaA_Contabil, SistemaA_Cosseguro, SistemaA_Cadenas, SistemaA_SSR, SistemaB, SistemaC,
        SistemaD_Auto, SistemaD_Auto_Front, SistemaD_Vida, SistemaD_Vida_Front, SistemaD_Residencial, SistemaD_Residencial_Front,
        SistemaE, SistemaF, `BI-Cognos`, `SistemaG`, SistemaH, Crm_salesforce, `PL-SQL`,
        Webmethods, Java, `Java - API`, Angular, DataStage, PowerCenter,
        Cognos, Forms, Gestao
    ) VALUES (
        NEW.Matricula, NEW.NOM_USUARIO_SIG,
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 1, 1
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_update_analistas` AFTER UPDATE ON `analistas` FOR EACH ROW BEGIN 
        UPDATE skills
        SET
            Matricula   = NEW.Matricula,
            Nom_Analista = NEW.Nom_Analista
        WHERE ( Nom_Analista = OLD.NOM_USUARIO_SIG
            or Nom_Analista = OLD.Nom_Analista 
            or Matricula in (OLD.Matricula,NEW.Matricula) ); 
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_analistas_after_delete` AFTER DELETE ON `analistas` FOR EACH ROW begin
	delete from users where AnalistaId = OLD.Id_Analista;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `aplicacoes`
--

DROP TABLE IF EXISTS `aplicacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aplicacoes` (
  `Codigo` int NOT NULL AUTO_INCREMENT,
  `Id_aplicacao` int DEFAULT NULL,
  `Nom_Aplicacao` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aplicacoes`
--

LOCK TABLES `aplicacoes` WRITE;
/*!40000 ALTER TABLE `aplicacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `aplicacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feriado`
--

DROP TABLE IF EXISTS `feriado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feriado` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Data` date NOT NULL,
  `Nome` varchar(100) NOT NULL,
  `Tipo` enum('FIXO','MOVEL') NOT NULL,
  `Ano` int NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `uk_feriado_data` (`Data`)
) ENGINE=InnoDB AUTO_INCREMENT=271 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feriado`
--

LOCK TABLES `feriado` WRITE;
/*!40000 ALTER TABLE `feriado` DISABLE KEYS */;
/*!40000 ALTER TABLE `feriado` ENABLE KEYS */;
UNLOCK TABLES;

--
INSERT INTO `feriado` VALUES (1,'2026-01-01','Confraternização Universal','FIXO',2026,'2026-02-03 09:58:35'),(2,'2026-04-21','Tiradentes','FIXO',2026,'2026-02-03 09:58:35'),(3,'2026-05-01','Dia do Trabalho','FIXO',2026,'2026-02-03 09:58:35'),(4,'2026-09-07','Independência do Brasil','FIXO',2026,'2026-02-03 09:58:35'),(5,'2026-10-12','Nossa Senhora Aparecida','FIXO',2026,'2026-02-03 09:58:35'),(6,'2026-11-02','Finados','FIXO',2026,'2026-02-03 09:58:35'),(7,'2026-11-15','Proclamação da República','FIXO',2026,'2026-02-03 09:58:35'),(8,'2026-11-20','Consciência Negra','FIXO',2026,'2026-02-03 09:58:35'),(9,'2026-12-25','Natal','FIXO',2026,'2026-02-03 09:58:35'),(10,'2027-01-01','Confraternização Universal','FIXO',2027,'2026-02-03 09:58:35'),(11,'2027-04-21','Tiradentes','FIXO',2027,'2026-02-03 09:58:35'),(12,'2027-05-01','Dia do Trabalho','FIXO',2027,'2026-02-03 09:58:35'),(13,'2027-09-07','Independência do Brasil','FIXO',2027,'2026-02-03 09:58:35'),(14,'2027-10-12','Nossa Senhora Aparecida','FIXO',2027,'2026-02-03 09:58:35'),(15,'2027-11-02','Finados','FIXO',2027,'2026-02-03 09:58:35'),(16,'2027-11-15','Proclamação da República','FIXO',2027,'2026-02-03 09:58:35'),(17,'2027-11-20','Consciência Negra','FIXO',2027,'2026-02-03 09:58:35'),(18,'2027-12-25','Natal','FIXO',2027,'2026-02-03 09:58:35'),(19,'2028-01-01','Confraternização Universal','FIXO',2028,'2026-02-03 09:58:35'),(20,'2028-04-21','Tiradentes','FIXO',2028,'2026-02-03 09:58:35'),(21,'2028-05-01','Dia do Trabalho','FIXO',2028,'2026-02-03 09:58:35'),(22,'2028-09-07','Independência do Brasil','FIXO',2028,'2026-02-03 09:58:35'),(23,'2028-10-12','Nossa Senhora Aparecida','FIXO',2028,'2026-02-03 09:58:35'),(24,'2028-11-02','Finados','FIXO',2028,'2026-02-03 09:58:35'),(25,'2028-11-15','Proclamação da República','FIXO',2028,'2026-02-03 09:58:35'),(26,'2028-11-20','Consciência Negra','FIXO',2028,'2026-02-03 09:58:35'),(27,'2028-12-25','Natal','FIXO',2028,'2026-02-03 09:58:35'),(28,'2029-01-01','Confraternização Universal','FIXO',2029,'2026-02-03 09:58:35'),(29,'2029-04-21','Tiradentes','FIXO',2029,'2026-02-03 09:58:35'),(30,'2029-05-01','Dia do Trabalho','FIXO',2029,'2026-02-03 09:58:35'),(31,'2029-09-07','Independência do Brasil','FIXO',2029,'2026-02-03 09:58:35'),(32,'2029-10-12','Nossa Senhora Aparecida','FIXO',2029,'2026-02-03 09:58:35'),(33,'2029-11-02','Finados','FIXO',2029,'2026-02-03 09:58:35'),(34,'2029-11-15','Proclamação da República','FIXO',2029,'2026-02-03 09:58:35'),(35,'2029-11-20','Consciência Negra','FIXO',2029,'2026-02-03 09:58:35'),(36,'2029-12-25','Natal','FIXO',2029,'2026-02-03 09:58:35'),(37,'2030-01-01','Confraternização Universal','FIXO',2030,'2026-02-03 09:58:35'),(38,'2030-04-21','Tiradentes','FIXO',2030,'2026-02-03 09:58:35'),(39,'2030-05-01','Dia do Trabalho','FIXO',2030,'2026-02-03 09:58:35'),(40,'2030-09-07','Independência do Brasil','FIXO',2030,'2026-02-03 09:58:35'),(41,'2030-10-12','Nossa Senhora Aparecida','FIXO',2030,'2026-02-03 09:58:35'),(42,'2030-11-02','Finados','FIXO',2030,'2026-02-03 09:58:35'),(43,'2030-11-15','Proclamação da República','FIXO',2030,'2026-02-03 09:58:35'),(44,'2030-11-20','Consciência Negra','FIXO',2030,'2026-02-03 09:58:35'),(45,'2030-12-25','Natal','FIXO',2030,'2026-02-03 09:58:35'),(46,'2031-01-01','Confraternização Universal','FIXO',2031,'2026-02-03 09:58:35'),(47,'2031-04-21','Tiradentes','FIXO',2031,'2026-02-03 09:58:35'),(48,'2031-05-01','Dia do Trabalho','FIXO',2031,'2026-02-03 09:58:35'),(49,'2031-09-07','Independência do Brasil','FIXO',2031,'2026-02-03 09:58:35'),(50,'2031-10-12','Nossa Senhora Aparecida','FIXO',2031,'2026-02-03 09:58:35'),(51,'2031-11-02','Finados','FIXO',2031,'2026-02-03 09:58:35'),(52,'2031-11-15','Proclamação da República','FIXO',2031,'2026-02-03 09:58:35'),(53,'2031-11-20','Consciência Negra','FIXO',2031,'2026-02-03 09:58:35'),(54,'2031-12-25','Natal','FIXO',2031,'2026-02-03 09:58:35'),(55,'2032-01-01','Confraternização Universal','FIXO',2032,'2026-02-03 09:58:35'),(56,'2032-04-21','Tiradentes','FIXO',2032,'2026-02-03 09:58:35'),(57,'2032-05-01','Dia do Trabalho','FIXO',2032,'2026-02-03 09:58:35'),(58,'2032-09-07','Independência do Brasil','FIXO',2032,'2026-02-03 09:58:35'),(59,'2032-10-12','Nossa Senhora Aparecida','FIXO',2032,'2026-02-03 09:58:35'),(60,'2032-11-02','Finados','FIXO',2032,'2026-02-03 09:58:35'),(61,'2032-11-15','Proclamação da República','FIXO',2032,'2026-02-03 09:58:35'),(62,'2032-11-20','Consciência Negra','FIXO',2032,'2026-02-03 09:58:35'),(63,'2032-12-25','Natal','FIXO',2032,'2026-02-03 09:58:35'),(64,'2033-01-01','Confraternização Universal','FIXO',2033,'2026-02-03 09:58:35'),(65,'2033-04-21','Tiradentes','FIXO',2033,'2026-02-03 09:58:35'),(66,'2033-05-01','Dia do Trabalho','FIXO',2033,'2026-02-03 09:58:35'),(67,'2033-09-07','Independência do Brasil','FIXO',2033,'2026-02-03 09:58:35'),(68,'2033-10-12','Nossa Senhora Aparecida','FIXO',2033,'2026-02-03 09:58:35'),(69,'2033-11-02','Finados','FIXO',2033,'2026-02-03 09:58:35'),(70,'2033-11-15','Proclamação da República','FIXO',2033,'2026-02-03 09:58:35'),(71,'2033-11-20','Consciência Negra','FIXO',2033,'2026-02-03 09:58:35'),(72,'2033-12-25','Natal','FIXO',2033,'2026-02-03 09:58:35'),(73,'2034-01-01','Confraternização Universal','FIXO',2034,'2026-02-03 09:58:35'),(74,'2034-04-21','Tiradentes','FIXO',2034,'2026-02-03 09:58:35'),(75,'2034-05-01','Dia do Trabalho','FIXO',2034,'2026-02-03 09:58:35'),(76,'2034-09-07','Independência do Brasil','FIXO',2034,'2026-02-03 09:58:35'),(77,'2034-10-12','Nossa Senhora Aparecida','FIXO',2034,'2026-02-03 09:58:35'),(78,'2034-11-02','Finados','FIXO',2034,'2026-02-03 09:58:35'),(79,'2034-11-15','Proclamação da República','FIXO',2034,'2026-02-03 09:58:35'),(80,'2034-11-20','Consciência Negra','FIXO',2034,'2026-02-03 09:58:35'),(81,'2034-12-25','Natal','FIXO',2034,'2026-02-03 09:58:35'),(82,'2035-01-01','Confraternização Universal','FIXO',2035,'2026-02-03 09:58:35'),(83,'2035-04-21','Tiradentes','FIXO',2035,'2026-02-03 09:58:35'),(84,'2035-05-01','Dia do Trabalho','FIXO',2035,'2026-02-03 09:58:35'),(85,'2035-09-07','Independência do Brasil','FIXO',2035,'2026-02-03 09:58:35'),(86,'2035-10-12','Nossa Senhora Aparecida','FIXO',2035,'2026-02-03 09:58:35'),(87,'2035-11-02','Finados','FIXO',2035,'2026-02-03 09:58:35'),(88,'2035-11-15','Proclamação da República','FIXO',2035,'2026-02-03 09:58:35'),(89,'2035-11-20','Consciência Negra','FIXO',2035,'2026-02-03 09:58:35'),(90,'2035-12-25','Natal','FIXO',2035,'2026-02-03 09:58:35'),(91,'2036-01-01','Confraternização Universal','FIXO',2036,'2026-02-03 09:58:35'),(92,'2036-04-21','Tiradentes','FIXO',2036,'2026-02-03 09:58:35'),(93,'2036-05-01','Dia do Trabalho','FIXO',2036,'2026-02-03 09:58:35'),(94,'2036-09-07','Independência do Brasil','FIXO',2036,'2026-02-03 09:58:35'),(95,'2036-10-12','Nossa Senhora Aparecida','FIXO',2036,'2026-02-03 09:58:35'),(96,'2036-11-02','Finados','FIXO',2036,'2026-02-03 09:58:35'),(97,'2036-11-15','Proclamação da República','FIXO',2036,'2026-02-03 09:58:35'),(98,'2036-11-20','Consciência Negra','FIXO',2036,'2026-02-03 09:58:35'),(99,'2036-12-25','Natal','FIXO',2036,'2026-02-03 09:58:35'),(100,'2037-01-01','Confraternização Universal','FIXO',2037,'2026-02-03 09:58:35'),(101,'2037-04-21','Tiradentes','FIXO',2037,'2026-02-03 09:58:35'),(102,'2037-05-01','Dia do Trabalho','FIXO',2037,'2026-02-03 09:58:35'),(103,'2037-09-07','Independência do Brasil','FIXO',2037,'2026-02-03 09:58:35'),(104,'2037-10-12','Nossa Senhora Aparecida','FIXO',2037,'2026-02-03 09:58:35'),(105,'2037-11-02','Finados','FIXO',2037,'2026-02-03 09:58:35'),(106,'2037-11-15','Proclamação da República','FIXO',2037,'2026-02-03 09:58:35'),(107,'2037-11-20','Consciência Negra','FIXO',2037,'2026-02-03 09:58:35'),(108,'2037-12-25','Natal','FIXO',2037,'2026-02-03 09:58:35'),(109,'2038-01-01','Confraternização Universal','FIXO',2038,'2026-02-03 09:58:35'),(110,'2038-04-21','Tiradentes','FIXO',2038,'2026-02-03 09:58:35'),(111,'2038-05-01','Dia do Trabalho','FIXO',2038,'2026-02-03 09:58:35'),(112,'2038-09-07','Independência do Brasil','FIXO',2038,'2026-02-03 09:58:35'),(113,'2038-10-12','Nossa Senhora Aparecida','FIXO',2038,'2026-02-03 09:58:35'),(114,'2038-11-02','Finados','FIXO',2038,'2026-02-03 09:58:35'),(115,'2038-11-15','Proclamação da República','FIXO',2038,'2026-02-03 09:58:35'),(116,'2038-11-20','Consciência Negra','FIXO',2038,'2026-02-03 09:58:35'),(117,'2038-12-25','Natal','FIXO',2038,'2026-02-03 09:58:35'),(118,'2039-01-01','Confraternização Universal','FIXO',2039,'2026-02-03 09:58:35'),(119,'2039-04-21','Tiradentes','FIXO',2039,'2026-02-03 09:58:35'),(120,'2039-05-01','Dia do Trabalho','FIXO',2039,'2026-02-03 09:58:35'),(121,'2039-09-07','Independência do Brasil','FIXO',2039,'2026-02-03 09:58:35'),(122,'2039-10-12','Nossa Senhora Aparecida','FIXO',2039,'2026-02-03 09:58:35'),(123,'2039-11-02','Finados','FIXO',2039,'2026-02-03 09:58:35'),(124,'2039-11-15','Proclamação da República','FIXO',2039,'2026-02-03 09:58:35'),(125,'2039-11-20','Consciência Negra','FIXO',2039,'2026-02-03 09:58:35'),(126,'2039-12-25','Natal','FIXO',2039,'2026-02-03 09:58:35'),(127,'2040-01-01','Confraternização Universal','FIXO',2040,'2026-02-03 09:58:35'),(128,'2040-04-21','Tiradentes','FIXO',2040,'2026-02-03 09:58:35'),(129,'2040-05-01','Dia do Trabalho','FIXO',2040,'2026-02-03 09:58:35'),(130,'2040-09-07','Independência do Brasil','FIXO',2040,'2026-02-03 09:58:35'),(131,'2040-10-12','Nossa Senhora Aparecida','FIXO',2040,'2026-02-03 09:58:35'),(132,'2040-11-02','Finados','FIXO',2040,'2026-02-03 09:58:35'),(133,'2040-11-15','Proclamação da República','FIXO',2040,'2026-02-03 09:58:35'),(134,'2040-11-20','Consciência Negra','FIXO',2040,'2026-02-03 09:58:35'),(135,'2040-12-25','Natal','FIXO',2040,'2026-02-03 09:58:35'),(226,'2026-02-17','Carnaval','MOVEL',2026,'2026-02-03 10:00:24'),(227,'2026-04-05','Páscoa','MOVEL',2026,'2026-02-03 10:00:24'),(228,'2026-06-04','Corpus Christi','MOVEL',2026,'2026-02-03 10:00:24'),(229,'2027-02-09','Carnaval','MOVEL',2027,'2026-02-03 10:00:24'),(230,'2027-03-28','Páscoa','MOVEL',2027,'2026-02-03 10:00:24'),(231,'2027-05-27','Corpus Christi','MOVEL',2027,'2026-02-03 10:00:24'),(232,'2028-02-29','Carnaval','MOVEL',2028,'2026-02-03 10:00:24'),(233,'2028-04-16','Páscoa','MOVEL',2028,'2026-02-03 10:00:24'),(234,'2028-06-15','Corpus Christi','MOVEL',2028,'2026-02-03 10:00:24'),(235,'2029-02-13','Carnaval','MOVEL',2029,'2026-02-03 10:00:24'),(236,'2029-04-01','Páscoa','MOVEL',2029,'2026-02-03 10:00:24'),(237,'2029-05-31','Corpus Christi','MOVEL',2029,'2026-02-03 10:00:24'),(238,'2030-03-05','Carnaval','MOVEL',2030,'2026-02-03 10:00:24'),(239,'2030-06-20','Corpus Christi','MOVEL',2030,'2026-02-03 10:00:24'),(240,'2031-02-25','Carnaval','MOVEL',2031,'2026-02-03 10:00:24'),(241,'2031-04-13','Páscoa','MOVEL',2031,'2026-02-03 10:00:24'),(242,'2031-06-12','Corpus Christi','MOVEL',2031,'2026-02-03 10:00:24'),(243,'2032-02-10','Carnaval','MOVEL',2032,'2026-02-03 10:00:24'),(244,'2032-03-28','Páscoa','MOVEL',2032,'2026-02-03 10:00:24'),(245,'2032-05-27','Corpus Christi','MOVEL',2032,'2026-02-03 10:00:24'),(246,'2033-03-01','Carnaval','MOVEL',2033,'2026-02-03 10:00:24'),(247,'2033-04-17','Páscoa','MOVEL',2033,'2026-02-03 10:00:24'),(248,'2033-06-16','Corpus Christi','MOVEL',2033,'2026-02-03 10:00:24'),(249,'2034-02-21','Carnaval','MOVEL',2034,'2026-02-03 10:00:24'),(250,'2034-04-09','Páscoa','MOVEL',2034,'2026-02-03 10:00:24'),(251,'2034-06-08','Corpus Christi','MOVEL',2034,'2026-02-03 10:00:24'),(252,'2035-02-06','Carnaval','MOVEL',2035,'2026-02-03 10:00:24'),(253,'2035-03-25','Páscoa','MOVEL',2035,'2026-02-03 10:00:24'),(254,'2035-05-24','Corpus Christi','MOVEL',2035,'2026-02-03 10:00:24'),(255,'2036-02-26','Carnaval','MOVEL',2036,'2026-02-03 10:00:24'),(256,'2036-04-13','Páscoa','MOVEL',2036,'2026-02-03 10:00:24'),(257,'2036-06-12','Corpus Christi','MOVEL',2036,'2026-02-03 10:00:24'),(258,'2037-02-17','Carnaval','MOVEL',2037,'2026-02-03 10:00:24'),(259,'2037-04-05','Páscoa','MOVEL',2037,'2026-02-03 10:00:24'),(260,'2037-06-04','Corpus Christi','MOVEL',2037,'2026-02-03 10:00:24'),(261,'2038-03-02','Carnaval','MOVEL',2038,'2026-02-03 10:00:24'),(262,'2038-04-25','Páscoa','MOVEL',2038,'2026-02-03 10:00:24'),(263,'2038-06-24','Corpus Christi','MOVEL',2038,'2026-02-03 10:00:24'),(264,'2039-02-22','Carnaval','MOVEL',2039,'2026-02-03 10:00:24'),(265,'2039-04-10','Páscoa','MOVEL',2039,'2026-02-03 10:00:24'),(266,'2039-06-09','Corpus Christi','MOVEL',2039,'2026-02-03 10:00:24'),(267,'2040-02-14','Carnaval','MOVEL',2040,'2026-02-03 10:00:24'),(268,'2040-04-01','Páscoa','MOVEL',2040,'2026-02-03 10:00:24'),(269,'2040-05-31','Corpus Christi','MOVEL',2040,'2026-02-03 10:00:24');
-- Table structure for table `ferias`
--

DROP TABLE IF EXISTS `ferias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ferias` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Matricula` int DEFAULT NULL,
  `Nom_Analista` varchar(255) DEFAULT NULL,
  `Aquisitivo` int DEFAULT NULL,
  `Dt_Inicio` datetime DEFAULT NULL,
  `Dt_Fim` datetime DEFAULT NULL,
  `Dt_Cadastro` datetime DEFAULT NULL,
  `Pendente` bit(1) DEFAULT NULL,
  `Sequencia` int DEFAULT NULL,
  `Nota` varchar(255) DEFAULT NULL,
  `Usr_Cadastro` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_ferias_analista` (`Matricula`),
  CONSTRAINT `fk_ferias_analista` FOREIGN KEY (`Matricula`) REFERENCES `analistas` (`Matricula`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ferias`
--

LOCK TABLES `ferias` WRITE;
/*!40000 ALTER TABLE `ferias` DISABLE KEYS */;
/*!40000 ALTER TABLE `ferias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horas_import`
--

DROP TABLE IF EXISTS `horas_import`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horas_import` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data_importacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `email_usuario` varchar(255) DEFAULT NULL,
  `responsavel` varchar(255) DEFAULT NULL,
  `data_trabalho` date DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fim` time DEFAULT NULL,
  `pausa_minutos` int DEFAULT NULL,
  `observacoes` text,
  `tipo_registro` varchar(100) DEFAULT NULL,
  `data_guardia` date DEFAULT NULL,
  `inicio_guardia` time DEFAULT NULL,
  `fim_guardia` time DEFAULT NULL,
  `houve_acionamento` tinyint(1) DEFAULT NULL,
  `inicio_intervencao` datetime DEFAULT NULL,
  `fim_intervencao` datetime DEFAULT NULL,
  `descricao_ocorrencia` text,
  `origem_hora_extra` varchar(255) DEFAULT NULL,
  `horas_trabalhadas` time DEFAULT NULL,
  `horas_guardia` time DEFAULT NULL,
  `tipo_dia` varchar(50) DEFAULT NULL,
  `percentual` varchar(10) DEFAULT NULL,
  `status_validacao` varchar(50) DEFAULT NULL,
  `data_validacao` datetime DEFAULT NULL,
  `ano_mes` varchar(10) DEFAULT NULL,
  `raw_json` json DEFAULT NULL,
  `nome_arquivo` varchar(255) DEFAULT NULL,
  `hash_arquivo` varchar(64) DEFAULT NULL,
  `linha_arquivo` int DEFAULT NULL,
  `data_lancamento` datetime DEFAULT NULL,
  `pausa_inicio` time DEFAULT NULL,
  `pausa_fim` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_import_hash` (`hash_arquivo`)
) ENGINE=InnoDB AUTO_INCREMENT=20042 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horas_import`
--

LOCK TABLES `horas_import` WRITE;
/*!40000 ALTER TABLE `horas_import` DISABLE KEYS */;
/*!40000 ALTER TABLE `horas_import` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horas_registro`
--

DROP TABLE IF EXISTS `horas_registro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horas_registro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_email` varchar(255) DEFAULT NULL,
  `data_trabalho` date DEFAULT NULL,
  `inicio` datetime DEFAULT NULL,
  `fim` datetime DEFAULT NULL,
  `pausa_minutos` int DEFAULT NULL,
  `minutos_trabalhados` int DEFAULT NULL,
  `minutos_standby` int DEFAULT NULL,
  `minutos_extra_50` int DEFAULT NULL,
  `minutos_extra_70` int DEFAULT NULL,
  `minutos_extra_100` int DEFAULT NULL,
  `minutos_extra_120` int DEFAULT NULL,
  `eh_noturno` tinyint(1) DEFAULT NULL,
  `eh_domingo_feriado` tinyint(1) DEFAULT NULL,
  `origem` varchar(100) DEFAULT NULL,
  `id_import` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_import` (`id_import`),
  CONSTRAINT `horas_registro_ibfk_1` FOREIGN KEY (`id_import`) REFERENCES `horas_import` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horas_registro`
--

LOCK TABLES `horas_registro` WRITE;
/*!40000 ALTER TABLE `horas_registro` DISABLE KEYS */;
/*!40000 ALTER TABLE `horas_registro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horas_segmentadas`
--

DROP TABLE IF EXISTS `horas_segmentadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horas_segmentadas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_email` varchar(255) DEFAULT NULL,
  `data_ref` date DEFAULT NULL,
  `inicio` datetime DEFAULT NULL,
  `fim` datetime DEFAULT NULL,
  `minutos` int DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `eh_noturno` tinyint(1) DEFAULT NULL,
  `eh_domingo_feriado` tinyint(1) DEFAULT NULL,
  `origem` varchar(100) DEFAULT NULL,
  `id_import` int DEFAULT NULL,
  `minutosreais` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2242 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horas_segmentadas`
--

LOCK TABLES `horas_segmentadas` WRITE;
/*!40000 ALTER TABLE `horas_segmentadas` DISABLE KEYS */;
/*!40000 ALTER TABLE `horas_segmentadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horas_segmentadas_v2`
--

DROP TABLE IF EXISTS `horas_segmentadas_v2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horas_segmentadas_v2` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_email` varchar(255) NOT NULL,
  `data_ref` date NOT NULL,
  `inicio` datetime NOT NULL,
  `fim` datetime NOT NULL,
  `segundos_reais` int NOT NULL,
  `segundos_convertidos` decimal(10,4) NOT NULL,
  `tipo_base` varchar(20) NOT NULL,
  `adicional_noturno` tinyint(1) DEFAULT '0',
  `adicional_domingo_feriado` tinyint(1) DEFAULT '0',
  `eh_noturno` tinyint(1) NOT NULL,
  `eh_domingo_feriado` tinyint(1) NOT NULL,
  `origem` varchar(100) DEFAULT NULL,
  `id_import` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `jornada_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_email`),
  KEY `idx_data_ref` (`data_ref`),
  KEY `idx_import` (`id_import`),
  KEY `idx_jornada` (`jornada_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horas_segmentadas_v2`
--

LOCK TABLES `horas_segmentadas_v2` WRITE;
/*!40000 ALTER TABLE `horas_segmentadas_v2` DISABLE KEYS */;
/*!40000 ALTER TABLE `horas_segmentadas_v2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inc_problem`
--

DROP TABLE IF EXISTS `inc_problem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inc_problem` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Cod_Problem` int DEFAULT NULL,
  `Id_Incidente` varchar(20) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_incproblem_problem` (`Cod_Problem`),
  KEY `fk_incproblem_incidente` (`Id_Incidente`),
  CONSTRAINT `fk_incproblem_incidente` FOREIGN KEY (`Id_Incidente`) REFERENCES `incidente` (`Id_Incidente`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_incproblem_problem` FOREIGN KEY (`Cod_Problem`) REFERENCES `problems` (`Cod_Problem`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inc_problem`
--

LOCK TABLES `inc_problem` WRITE;
/*!40000 ALTER TABLE `inc_problem` DISABLE KEYS */;
/*!40000 ALTER TABLE `inc_problem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incidente`
--

DROP TABLE IF EXISTS `incidente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidente` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Id_Incidente` varchar(255) DEFAULT NULL,
  `Sistema` int DEFAULT NULL,
  `Modulo` varchar(255) DEFAULT NULL,
  `Tip_Solicitacao` varchar(255) DEFAULT NULL,
  `Cod_Classificacao1` varchar(255) DEFAULT NULL,
  `Cod_Classificacao2` varchar(255) DEFAULT NULL,
  `Cod_Classificacao3` varchar(255) DEFAULT NULL,
  `Desc_Incidente` mediumtext,
  `Desc_Resolucao` mediumtext,
  `Dt_Resolucao` datetime DEFAULT NULL,
  `Dt_Abertura` datetime DEFAULT NULL,
  `Dt_Carga` datetime DEFAULT NULL,
  `Solucionador` varchar(255) DEFAULT NULL,
  `RCA` bit(1) DEFAULT NULL,
  `Cod_RCA` int DEFAULT NULL,
  `St` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_Incidente` (`Id_Incidente`),
  KEY `fk_incidente_status` (`St`),
  CONSTRAINT `fk_incidente_status` FOREIGN KEY (`St`) REFERENCES `status_problem` (`Status`)
) ENGINE=InnoDB AUTO_INCREMENT=2344 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidente`
--

LOCK TABLES `incidente` WRITE;
/*!40000 ALTER TABLE `incidente` DISABLE KEYS */;
/*!40000 ALTER TABLE `incidente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `justificativa_reabertura`
--

DROP TABLE IF EXISTS `justificativa_reabertura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `justificativa_reabertura` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cod_incidente` varchar(20) NOT NULL,
  `seq` int NOT NULL,
  `data_reabertura` datetime NOT NULL,
  `motivo_id` bigint NOT NULL,
  `obs` varchar(500) DEFAULT NULL,
  `usuario_upd` varchar(50) NOT NULL,
  `data_upd` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_just_reab` (`cod_incidente`,`seq`),
  KEY `idx_reab_incidente` (`cod_incidente`),
  KEY `idx_reab_data_reabertura` (`data_reabertura`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `justificativa_reabertura`
--

LOCK TABLES `justificativa_reabertura` WRITE;
/*!40000 ALTER TABLE `justificativa_reabertura` DISABLE KEYS */;
/*!40000 ALTER TABLE `justificativa_reabertura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `justificativa_sla`
--

DROP TABLE IF EXISTS `justificativa_sla`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `justificativa_sla` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cod_incidente` varchar(20) NOT NULL,
  `seq` int NOT NULL,
  `data_resolved` datetime NOT NULL,
  `motivo_id` bigint NOT NULL,
  `obs` varchar(500) DEFAULT NULL,
  `usuario_upd` varchar(50) NOT NULL,
  `data_upd` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_just_sla` (`cod_incidente`,`seq`),
  KEY `idx_sla_incidente` (`cod_incidente`),
  KEY `idx_sla_data_resolved` (`data_resolved`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `justificativa_sla`
--

LOCK TABLES `justificativa_sla` WRITE;
/*!40000 ALTER TABLE `justificativa_sla` DISABLE KEYS */;
/*!40000 ALTER TABLE `justificativa_sla` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kt_controle`
--

DROP TABLE IF EXISTS `kt_controle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kt_controle` (
  `cod_kt` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `participantes` text NOT NULL,
  `responsavel_kt` varchar(100) NOT NULL,
  `area_origem` varchar(100) DEFAULT NULL,
  `area_destino` varchar(100) DEFAULT NULL,
  `data_envio` datetime NOT NULL,
  `data_realizacao` datetime DEFAULT NULL,
  `aceito` char(1) NOT NULL DEFAULT 'N',
  `data_aceite` datetime DEFAULT NULL,
  `observacao_aceite` text,
  `data_inicio_vigencia` datetime DEFAULT NULL,
  `status_kt` varchar(30) NOT NULL DEFAULT 'AGENDADO',
  `link_material` varchar(500) DEFAULT NULL,
  `link_gravacao` varchar(500) DEFAULT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  `data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime DEFAULT NULL,
  PRIMARY KEY (`cod_kt`),
  KEY `idx_kt_status` (`status_kt`),
  KEY `idx_kt_aceito` (`aceito`),
  KEY `idx_kt_ativo` (`ativo`),
  KEY `idx_kt_data_realizacao` (`data_realizacao`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kt_controle`
--

LOCK TABLES `kt_controle` WRITE;
/*!40000 ALTER TABLE `kt_controle` DISABLE KEYS */;
/*!40000 ALTER TABLE `kt_controle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulo`
--

DROP TABLE IF EXISTS `modulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulo` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Cod_Sistema` int DEFAULT NULL,
  `Cod_Modulo` int DEFAULT NULL,
  `Nom_Modulo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Cod_Sistema` (`Cod_Sistema`,`Cod_Modulo`),
  CONSTRAINT `fk_modulo_sistema` FOREIGN KEY (`Cod_Sistema`) REFERENCES `sistema` (`Cod_Sistema`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulo`
--

LOCK TABLES `modulo` WRITE;
/*!40000 ALTER TABLE `modulo` DISABLE KEYS */;
/*!40000 ALTER TABLE `modulo` ENABLE KEYS */;
UNLOCK TABLES;

--
INSERT INTO `modulo` VALUES (27,1,1,'Sistema A - Cadenas'),(28,1,2,'Cobrança'),(29,2,1,'Sistema B Online'),(30,2,2,'Sistema A - Cadenas'),(31,1,3,'Emissão'),(32,1,4,'Comissão'),(33,1,5,'Contábil'),(34,1,6,'Cosseguro'),(35,1,7,'Sinistros'),(36,1,8,'SSR'),(37,3,1,'Desativação Sistema C'),(38,4,1,'Sistema D Auto'),(39,4,2,'Sistema D Vida'),(40,4,3,'Sistema D Residencial'),(41,5,1,'Sistema G - Clientes'),(42,5,2,'Sistema H - Distribuidores'),(43,5,3,'CRM-Salesforce'),(44,6,1,'ADHOC'),(45,7,1,'Sistema E'),(46,8,1,'Sistema F'),(47,9,1,'COGNOS'),(48,10,1,'Projetos'),(50,11,1,'DataStage'),(51,1,9,'Cadastros Gerais');
-- Table structure for table `motivo_justificativa`
--

DROP TABLE IF EXISTS `motivo_justificativa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `motivo_justificativa` (
  `cod_motivo` bigint NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  `abono` char(1) NOT NULL DEFAULT 'N',
  `tipo_motivo` varchar(30) NOT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  `data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime DEFAULT NULL,
  PRIMARY KEY (`cod_motivo`),
  KEY `idx_motivo_tipo` (`tipo_motivo`),
  KEY `idx_motivo_abono` (`abono`),
  KEY `idx_motivo_ativo` (`ativo`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `motivo_justificativa`
--

LOCK TABLES `motivo_justificativa` WRITE;
/*!40000 ALTER TABLE `motivo_justificativa` DISABLE KEYS */;
/*!40000 ALTER TABLE `motivo_justificativa` ENABLE KEYS */;
UNLOCK TABLES;

--
INSERT INTO `motivo_justificativa` VALUES (1,'Chamados complexos: demora na análise / atendimento','N','SLA','S','2026-01-14 09:47:04',NULL),(2,'Chamados com muitas trocas de fila entre fornecedores','N','SLA','S','2026-01-14 09:47:04',NULL),(3,'Falha na recepção e atendimento do chamado','N','SLA','S','2026-01-14 09:47:04',NULL),(4,'Relacionado a demanda e fechado na fila CLIENTE2 GARANTIA','N','SLA','S','2026-01-14 09:47:04',NULL),(5,'Relacionado a demanda e/ou aberto por TI CLIENTE2 CLIENTE e fechado fora da fila CLIENTE2 GARANTIA','N','SLA','S','2026-01-14 09:47:04',NULL),(6,'Chamados que vieram vencidos de outras filas do Sustain (informar a fila no campo Observação)','N','SLA','S','2026-01-14 09:47:04',NULL),(7,'Devido a backlog alto e / ou priorização de outros incidentes da fila','N','SLA','S','2026-01-14 09:47:04',NULL),(8,'Perdeu o SLA no tempo que ficou em Assign','N','SLA','S','2026-01-14 09:47:04',NULL),(9,'Critical / High que caiu / voltou fora do horário e sem acionamento','S','SLA','S','2026-01-14 09:47:04',NULL),(10,'Erro de procedimento no direcionamento do fornecedor (Pending Others)','S','SLA','S','2026-01-14 09:47:04',NULL),(11,'Falha da ferramenta, que não permitiu associar a change como Blocking','S','SLA','S','2026-01-14 09:47:04',NULL),(12,'Severidade modificada pela Gestão de TI da CLIENTE2 Cliente para priorização de atendimento','S','SLA','S','2026-01-14 09:47:04',NULL),(13,'Chamado colocado em Pending (Others ou Vendor) para aguardar processamento batch','S','SLA','S','2026-01-14 09:47:04',NULL),(14,'Atendimento realizado pelo suporte IBM da ferramenta Cognos Mobile','S','SLA','S','2026-01-14 09:47:04',NULL),(15,'Incidente contabilizado duas vezes em severidades diferentes','S','SLA','S','2026-01-14 09:47:04',NULL),(16,'Contabilização Incorreta da Ferramenta','S','SLA','S','2026-01-14 09:47:04',NULL),(17,'VPN Indisponível','S','SLA','S','2026-01-14 09:47:04',NULL),(18,'Erro de procedimento Service Desk / direcionamento incorreto do chamado','N','SLA','S','2026-01-14 09:47:04',NULL),(19,'Erro de procedimento do analista na ferramenta','N','SLA','S','2026-01-14 09:47:04',NULL),(20,'Chamado com severidade incorreta / solicitado ajuste','S','SLA','S','2026-01-14 09:47:04',NULL),(21,'Indisponibilidade do HPSM','S','SLA','S','2026-01-14 09:47:04',NULL),(22,'Chamado fechado na fila do SICREDI - Fila em SLO','S','SLA','S','2026-01-14 09:47:04',NULL),(23,'Chamado aberto pelo GRA para tratar planilha com casos diversos','N','SLA','S','2026-01-14 09:47:04','2026-01-14 10:02:04'),(24,'Usuario não entendeu a resposta','S','REABERTURA','S','2026-01-14 09:47:04',NULL),(25,'Procedimento inicial não resolveu o problema','N','REABERTURA','S','2026-01-14 09:47:04',NULL),(26,'Usuario informou novo problema, diferente do inicial','S','REABERTURA','S','2026-01-14 09:47:04','2026-01-14 10:01:37'),(28,'Usuario não conhece o procedimento informado na resposta','S','REABERTURA','S','2026-01-14 10:01:22',NULL);
-- Table structure for table `plantao`
--

DROP TABLE IF EXISTS `plantao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantao` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `data_ini` date NOT NULL,
  `data_fim` date NOT NULL,
  `fechamento` tinyint(1) DEFAULT '0',
  `nivel1_sistemaA` varchar(50) DEFAULT NULL,
  `nivel1_sistemaD` varchar(50) DEFAULT NULL,
  `nivel1_codeadmin` varchar(50) DEFAULT NULL,
  `nivel2` varchar(50) DEFAULT NULL,
  `obs` text,
  `data_alteracao` datetime NOT NULL,
  `usuario_alteracao` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf16;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantao`
--

LOCK TABLES `plantao` WRITE;
/*!40000 ALTER TABLE `plantao` DISABLE KEYS */;
/*!40000 ALTER TABLE `plantao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `problems`
--

DROP TABLE IF EXISTS `problems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `problems` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Cod_Problem` int DEFAULT NULL,
  `Nom_Problem` varchar(255) DEFAULT NULL,
  `Desc_Problem` varchar(255) DEFAULT NULL,
  `Dt_Abertura` datetime DEFAULT NULL,
  `Dt_Encerramento` datetime DEFAULT NULL,
  `Status` int DEFAULT NULL,
  `Tip_Problem` int DEFAULT NULL,
  `PM_CLIENTE` varchar(255) DEFAULT NULL,
  `Analista_Cadastro` varchar(255) DEFAULT NULL,
  `Analista_Responsavel` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Cod_Problem` (`Cod_Problem`),
  KEY `fk_problem_status` (`Status`),
  KEY `fk_problem_tipo` (`Tip_Problem`),
  CONSTRAINT `fk_problem_status` FOREIGN KEY (`Status`) REFERENCES `status_problem` (`Status`),
  CONSTRAINT `fk_problem_tipo` FOREIGN KEY (`Tip_Problem`) REFERENCES `tip_problem` (`Tip_Problem`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `problems`
--

LOCK TABLES `problems` WRITE;
/*!40000 ALTER TABLE `problems` DISABLE KEYS */;
/*!40000 ALTER TABLE `problems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rates`
--

DROP TABLE IF EXISTS `rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rates` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Rate` int DEFAULT NULL,
  `Valor` double DEFAULT NULL,
  `Especialidade` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Rate` (`Rate`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rates`
--

LOCK TABLES `rates` WRITE;
/*!40000 ALTER TABLE `rates` DISABLE KEYS */;
/*!40000 ALTER TABLE `rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rca`
--

DROP TABLE IF EXISTS `rca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rca` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Cod_RCA` int DEFAULT NULL,
  `Cod_Problem` int DEFAULT NULL,
  `Desc_RCA` varchar(255) DEFAULT NULL,
  `Dt_Inicio` datetime DEFAULT NULL,
  `Dt_Conclusao` datetime DEFAULT NULL,
  `Tot_Hors_dev` int DEFAULT NULL,
  `Tot_Hors_orc` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Cod_RCA` (`Cod_RCA`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rca`
--

LOCK TABLES `rca` WRITE;
/*!40000 ALTER TABLE `rca` DISABLE KEYS */;
/*!40000 ALTER TABLE `rca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `senioridade`
--

DROP TABLE IF EXISTS `senioridade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `senioridade` (
  `ID_Senioridade` int NOT NULL AUTO_INCREMENT,
  `Categoria` varchar(50) NOT NULL,
  `Cat` varchar(10) NOT NULL,
  PRIMARY KEY (`ID_Senioridade`),
  UNIQUE KEY `ID_Senioridade` (`ID_Senioridade`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf16;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `senioridade`
--

LOCK TABLES `senioridade` WRITE;
/*!40000 ALTER TABLE `senioridade` DISABLE KEYS */;
/*!40000 ALTER TABLE `senioridade` ENABLE KEYS */;
UNLOCK TABLES;

--
INSERT INTO `senioridade` VALUES (1,'Intern','ITR'),(2,'Developer','DEV1'),(3,'Developer','DEV2'),(4,'Developer','DEV3'),(5,'Software Engineer','SWE1'),(6,'Software Engineer','SWE2'),(7,'Software Engineer','SWE3'),(8,'Architect','ARQ1'),(9,'Architect','ARQ2'),(10,'Architect','ARQ3'),(11,'Delivery Manager','DMGR1'),(12,'Delivery Manager','DMGR2'),(13,'Delivery Manager','DMGR3'),(14,'Head','HEAD1'),(15,'Head','HEAD2'),(17,'Head','HEAD3'),(18,'teste','teste');
-- Table structure for table `sistema`
--

DROP TABLE IF EXISTS `sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sistema` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Cod_Sistema` int DEFAULT NULL,
  `Nom_Sistema` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Cod_Sistema` (`Cod_Sistema`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sistema`
--

LOCK TABLES `sistema` WRITE;
/*!40000 ALTER TABLE `sistema` DISABLE KEYS */;
/*!40000 ALTER TABLE `sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
INSERT INTO `sistema` VALUES (1,1,'Sistema A'),(2,2,'Sistema B'),(3,3,'Sistema C'),(4,4,'Sistema D'),(10,7,'Sistema E'),(11,8,'Sistema F'),(12,5,'Auto Serviço'),(15,9,'BI'),(16,6,'ADHOC'),(17,10,'Projetos'),(18,11,'ETL');
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Matricula` int DEFAULT NULL,
  `Nom_Analista` varchar(255) DEFAULT NULL,
  `SistemaA` int DEFAULT NULL,
  `SistemaA_Cadastro` int DEFAULT NULL,
  `SistemaA_Sinistro` int DEFAULT NULL,
  `SistemaA_Cobranca` int DEFAULT NULL,
  `SistemaA_Emissao` int DEFAULT NULL,
  `SistemaA_Comissao` int DEFAULT NULL,
  `SistemaA_Contabil` int DEFAULT NULL,
  `SistemaA_Cosseguro` int DEFAULT NULL,
  `SistemaA_Cadenas` int DEFAULT NULL,
  `SistemaA_SSR` int DEFAULT NULL,
  `SistemaB` int DEFAULT NULL,
  `SistemaC` int DEFAULT NULL,
  `SistemaD_Auto` int DEFAULT NULL,
  `SistemaD_Auto_Front` int DEFAULT NULL,
  `SistemaD_Vida` int DEFAULT NULL,
  `SistemaD_Vida_Front` int DEFAULT NULL,
  `SistemaD_Residencial` int DEFAULT NULL,
  `SistemaD_Residencial_Front` int DEFAULT NULL,
  `SistemaE` int DEFAULT NULL,
  `SistemaF` int DEFAULT NULL,
  `BI-Cognos` int DEFAULT NULL,
  `SistemaG` int DEFAULT NULL,
  `SistemaH` int DEFAULT NULL,
  `Crm_salesforce` int DEFAULT NULL,
  `PL-SQL` int DEFAULT NULL,
  `Webmethods` int DEFAULT NULL,
  `Java` int DEFAULT NULL,
  `Java - API` int DEFAULT NULL,
  `Angular` int DEFAULT NULL,
  `DataStage` int DEFAULT NULL,
  `PowerCenter` int DEFAULT NULL,
  `Cognos` int DEFAULT NULL,
  `Forms` int DEFAULT NULL,
  `Gestao` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_skills_analista` (`Matricula`),
  CONSTRAINT `fk_skills_analista` FOREIGN KEY (`Matricula`) REFERENCES `analistas` (`Matricula`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_problem`
--

DROP TABLE IF EXISTS `status_problem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_problem` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Status` int DEFAULT NULL,
  `Desc_Status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Status` (`Status`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_problem`
--

LOCK TABLES `status_problem` WRITE;
/*!40000 ALTER TABLE `status_problem` DISABLE KEYS */;
/*!40000 ALTER TABLE `status_problem` ENABLE KEYS */;
UNLOCK TABLES;

--
INSERT INTO `status_problem` VALUES (1,1,'Aberto'),(2,2,'Em andamento'),(3,3,'Solução Temporaria'),(4,4,'Concluido'),(6,5,'Cancelado'),(9,0,'Pendente');
-- Table structure for table `sub_agrupamento`
--

DROP TABLE IF EXISTS `sub_agrupamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_agrupamento` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `cod_sistema` int DEFAULT NULL,
  `Cod_Modulo` int DEFAULT NULL,
  `cod_agrupamento` int DEFAULT NULL,
  `cod_subagrupamento` int DEFAULT NULL,
  `nom_subagrupamento` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `cod_sistema` (`cod_sistema`,`Cod_Modulo`,`cod_agrupamento`,`cod_subagrupamento`),
  CONSTRAINT `fk_subagrup_agrup` FOREIGN KEY (`cod_sistema`, `Cod_Modulo`, `cod_agrupamento`) REFERENCES `agrupamento` (`Cod_Sistema`, `Cod_Modulo`, `Cod_agrupamento`),
  CONSTRAINT `fk_subagrup_mod` FOREIGN KEY (`cod_sistema`, `Cod_Modulo`) REFERENCES `modulo` (`Cod_Sistema`, `Cod_Modulo`),
  CONSTRAINT `fk_subagrup_sistema` FOREIGN KEY (`cod_sistema`) REFERENCES `sistema` (`Cod_Sistema`)
) ENGINE=InnoDB AUTO_INCREMENT=9886 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_agrupamento`
--

LOCK TABLES `sub_agrupamento` WRITE;
/*!40000 ALTER TABLE `sub_agrupamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_agrupamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_subagrupamento`
--

DROP TABLE IF EXISTS `sub_subagrupamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_subagrupamento` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `cod_sistema` int DEFAULT NULL,
  `Cod_Modulo` int DEFAULT NULL,
  `cod_agrupamento` int DEFAULT NULL,
  `cod_subagrupamento` int DEFAULT NULL,
  `cod_subsubagrupamento` int DEFAULT NULL,
  `nom_subsubagrupamento` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `cod_sistema` (`cod_sistema`,`Cod_Modulo`,`cod_agrupamento`,`cod_subagrupamento`,`cod_subsubagrupamento`),
  CONSTRAINT `fk_subsub_agrup` FOREIGN KEY (`cod_sistema`, `Cod_Modulo`, `cod_agrupamento`) REFERENCES `agrupamento` (`Cod_Sistema`, `Cod_Modulo`, `Cod_agrupamento`),
  CONSTRAINT `fk_subsub_modulo` FOREIGN KEY (`cod_sistema`, `Cod_Modulo`) REFERENCES `modulo` (`Cod_Sistema`, `Cod_Modulo`),
  CONSTRAINT `fk_subsub_sistema` FOREIGN KEY (`cod_sistema`) REFERENCES `sistema` (`Cod_Sistema`),
  CONSTRAINT `fk_subsub_subagrup` FOREIGN KEY (`cod_sistema`, `Cod_Modulo`, `cod_agrupamento`, `cod_subagrupamento`) REFERENCES `sub_agrupamento` (`cod_sistema`, `Cod_Modulo`, `cod_agrupamento`, `cod_subagrupamento`)
) ENGINE=InnoDB AUTO_INCREMENT=19060 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_subagrupamento`
--

LOCK TABLES `sub_subagrupamento` WRITE;
/*!40000 ALTER TABLE `sub_subagrupamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_subagrupamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timebox_contrato`
--

DROP TABLE IF EXISTS `timebox_contrato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timebox_contrato` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ClienteId` int NOT NULL,
  `Descricao` varchar(255) DEFAULT NULL,
  `HorasContratadas` int NOT NULL,
  `HorasConsumidas` int DEFAULT '0',
  `DataInicio` date DEFAULT NULL,
  `DataFim` date DEFAULT NULL,
  `Status` enum('ATIVO','ENCERRADO') DEFAULT 'ATIVO',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timebox_contrato`
--

LOCK TABLES `timebox_contrato` WRITE;
/*!40000 ALTER TABLE `timebox_contrato` DISABLE KEYS */;
/*!40000 ALTER TABLE `timebox_contrato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timebox_projeto`
--

DROP TABLE IF EXISTS `timebox_projeto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timebox_projeto` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TimeboxContratoId` int NOT NULL,
  `Nome` varchar(150) NOT NULL,
  `Descricao` text,
  `HorasPrevistas` int NOT NULL,
  `HorasConsumidas` int DEFAULT '0',
  `DataInicio` date DEFAULT NULL,
  `DataPrevisaoFim` date DEFAULT NULL,
  `DataFimReal` date DEFAULT NULL,
  `Status` enum('PLANEJADO','EM_ANDAMENTO','CONCLUIDO','CANCELADO') DEFAULT 'PLANEJADO',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `TimeboxContratoId` (`TimeboxContratoId`),
  CONSTRAINT `timebox_projeto_ibfk_1` FOREIGN KEY (`TimeboxContratoId`) REFERENCES `timebox_contrato` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timebox_projeto`
--

LOCK TABLES `timebox_projeto` WRITE;
/*!40000 ALTER TABLE `timebox_projeto` DISABLE KEYS */;
/*!40000 ALTER TABLE `timebox_projeto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timebox_projeto_membro`
--

DROP TABLE IF EXISTS `timebox_projeto_membro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timebox_projeto_membro` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TimeboxProjetoId` int NOT NULL,
  `UserId` int NOT NULL,
  `Papel` varchar(50) DEFAULT NULL,
  `QuantidadeHoras` decimal(5,2) NOT NULL DEFAULT '0.00',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `TimeboxProjetoId` (`TimeboxProjetoId`),
  CONSTRAINT `timebox_projeto_membro_ibfk_1` FOREIGN KEY (`TimeboxProjetoId`) REFERENCES `timebox_projeto` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timebox_projeto_membro`
--

LOCK TABLES `timebox_projeto_membro` WRITE;
/*!40000 ALTER TABLE `timebox_projeto_membro` DISABLE KEYS */;
/*!40000 ALTER TABLE `timebox_projeto_membro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timebox_projeto_participacao`
--

DROP TABLE IF EXISTS `timebox_projeto_participacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timebox_projeto_participacao` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TimeboxProjetoId` int NOT NULL,
  `UserId` int NOT NULL,
  `Papel` varchar(50) DEFAULT NULL,
  `DataInicio` date NOT NULL,
  `DataFim` date NOT NULL,
  `HorasPorDia` decimal(4,2) NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `TimeboxProjetoId` (`TimeboxProjetoId`),
  CONSTRAINT `timebox_projeto_participacao_ibfk_1` FOREIGN KEY (`TimeboxProjetoId`) REFERENCES `timebox_projeto` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timebox_projeto_participacao`
--

LOCK TABLES `timebox_projeto_participacao` WRITE;
/*!40000 ALTER TABLE `timebox_projeto_participacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `timebox_projeto_participacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tip_problem`
--

DROP TABLE IF EXISTS `tip_problem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tip_problem` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Tip_Problem` int DEFAULT NULL,
  `Desc_Tip_Problem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Tip_Problem` (`Tip_Problem`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tip_problem`
--

LOCK TABLES `tip_problem` WRITE;
/*!40000 ALTER TABLE `tip_problem` DISABLE KEYS */;
/*!40000 ALTER TABLE `tip_problem` ENABLE KEYS */;
UNLOCK TABLES;

--
INSERT INTO `tip_problem` VALUES (1,1,'Sev1'),(2,2,'Recorrente');
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `AnalistaId` int NOT NULL,
  `Perfil` int NOT NULL,
  `Username` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `MFAAtivo` tinyint(1) NOT NULL DEFAULT '0',
  `TOTPSecret` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `AnalistaId` (`AnalistaId`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_users_before_insert` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
  SET NEW.Username = UPPER(NEW.Username);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_users_after_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
  INSERT INTO analistas (
    id_analista,
    NOM_USUARIO_SIG
  )
  VALUES (
    NEW.AnalistaId,
    NEW.Username
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_users_before_update` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
  SET NEW.Username = UPPER(NEW.Username);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `vw_justificativas`
--

DROP TABLE IF EXISTS `vw_justificativas`;
/*!50001 DROP VIEW IF EXISTS `vw_justificativas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_justificativas` AS SELECT 
 1 AS `id`,
 1 AS `cod_incidente`,
 1 AS `seq`,
 1 AS `data_evento`,
 1 AS `motivo_id`,
 1 AS `obs`,
 1 AS `analista`,
 1 AS `lider`,
 1 AS `data_upd`,
 1 AS `tipo_justificativa`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_justificativas`
--

/*!50001 DROP VIEW IF EXISTS `vw_justificativas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_justificativas` AS select `js`.`id` AS `id`,`js`.`cod_incidente` AS `cod_incidente`,`js`.`seq` AS `seq`,`js`.`data_resolved` AS `data_evento`,`js`.`motivo_id` AS `motivo_id`,`js`.`obs` AS `obs`,`a`.`Id_Cliente` AS `analista`,`a`.`Lider_Gerente` AS `lider`,`js`.`data_upd` AS `data_upd`,(cast('SLA' as char(10) charset utf8mb4) collate utf8mb4_0900_ai_ci) AS `tipo_justificativa` from (((`justificativa_sla` `js` left join `incidente` `i` on((`js`.`cod_incidente` = `i`.`Id_Incidente`))) join `analistas` `a` on((`a`.`Id_Cliente` = `i`.`Solucionador`))) join `users` `u` on((`u`.`AnalistaId` = `a`.`Id_analista`))) union all select `jr`.`id` AS `id`,`jr`.`cod_incidente` AS `cod_incidente`,`jr`.`seq` AS `seq`,`jr`.`data_reabertura` AS `data_evento`,`jr`.`motivo_id` AS `motivo_id`,`jr`.`obs` AS `obs`,`a`.`Id_Cliente` AS `analista`,`a`.`Lider_Gerente` AS `lider`,`jr`.`data_upd` AS `data_upd`,(cast('REABERTURA' as char(10) charset utf8mb4) collate utf8mb4_0900_ai_ci) AS `tipo_justificativa` from (((`justificativa_reabertura` `jr` left join `incidente` `i` on((`jr`.`cod_incidente` = `i`.`Id_Incidente`))) join `analistas` `a` on((`a`.`Id_Cliente` = `i`.`Solucionador`))) join `users` `u` on((`u`.`AnalistaId` = `a`.`Id_analista`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-15 17:07:00
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-15 17:07:00
