CREATE DATABASE  IF NOT EXISTS `what_should_i_wear` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `what_should_i_wear`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: wsiwdb.ccciy990gxje.us-east-1.rds.amazonaws.com    Database: what_should_i_wear
-- ------------------------------------------------------
-- Server version	8.0.32

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `resetPasswordToken` varchar(100) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Test','Test','test@gmail.com','abcd@123',NULL,NULL),(2,'Meghana','Peram','meghanaperam@gmail.com','$2b$10$gTnnwWr.OsAZ3ENaBODE3O4eki6ylZWSeTu/mEBYaJTjMqc0zBSKC',NULL,NULL),(3,'Esther','Mona','esthermona06@gmail.com','$2b$10$4nWTuIjGmNVsTeJnR8eO6eELj07QrOltAwp4Zn/DfZtcy9/ZnB2Di',NULL,NULL),(7,'Kiran','Gorantla','kiran@gmail.com','$2b$10$bSjCCec0VxuSJ/8D3nk9pOyU9NmvTmc9PReeJux79CswDdJwOdKSO',NULL,NULL),(8,'Meghana','P','mperam@buffalo.edu','$2b$10$viHT4iCfmmEHFPjgMkc/reo0x44TH5pwXSPV8EOhfgVbXLU9b.3G6',NULL,NULL),(9,'Alan','Hunt','ahunt@buffalo.edu','$2b$10$DQAYs/w31VyH.MedlMIbU.zkGQX7WIlN4Z3J0Z1/BT7dYMrx66EL2',NULL,NULL),(10,'Michael','Belus','Mikebelus@gmail.com','$2b$10$6QXh94TLqZNS2zETsPoiPemSdDevpfLQ4SG7kO4Mm/tpxum9JY2Ua',NULL,NULL);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clothing`
--

DROP TABLE IF EXISTS `clothing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clothing` (
  `clothing_id` int NOT NULL AUTO_INCREMENT,
  `clothing_type` varchar(40) NOT NULL,
  `clothing_image_path` varchar(200) NOT NULL,
  `clothing_category_id` int NOT NULL,
  PRIMARY KEY (`clothing_id`),
  KEY `fk_category` (`clothing_category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`clothing_category_id`) REFERENCES `clothing_category` (`clothing_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clothing`
--

LOCK TABLES `clothing` WRITE;
/*!40000 ALTER TABLE `clothing` DISABLE KEYS */;
INSERT INTO `clothing` VALUES (15,'T-Shirt','https://api.mikebelus.net/images/tshirt.png',15),(16,'Shorts','https://api.mikebelus.net/images/shorts.png',16),(17,'Long Sleeve','https://api.mikebelus.net/images/long-sleeve.png',15),(18,'Light Pants','https://api.mikebelus.net/images/LightPants.png',16),(19,'Light Gloves','https://api.mikebelus.net/images/LightGloves.png',18),(20,'Moderate Top','https://api.mikebelus.net/images/ModerateTop.png',15),(21,'Moderate Gloves','https://api.mikebelus.net/images/ModerateGloves.png',18),(22,'Skull Cap','https://api.mikebelus.net/images/SkullCap.png',20),(23,'Light Cap','https://api.mikebelus.net/images/LightCap.png',20),(24,'Heavy Top','https://api.mikebelus.net/images/HeavyTop.png',15),(25,'Heavy Pants','https://api.mikebelus.net/images/HeavyPants.png',16),(26,'Heavy Cap','https://api.mikebelus.net/images/HeavyCap.png',20),(27,'Boots','https://api.mikebelus.net/images/boots.png',22),(28,'Double Layer Heavy Pants','https://api.mikebelus.net/images/DoubleLayerPants.png',16),(29,'Heavy Mittens','https://api.mikebelus.net/images/HeavyMittens.png',19),(30,'Face Covering','https://api.mikebelus.net/images/FaceCovering.png',21),(31,'Heavy Socks','https://api.mikebelus.net/images/HeavySocks.png',17),(32,'Double Socks','https://api.mikebelus.net/images/socks.png',17),(33,'Double Layer Moderate Top','https://api.mikebelus.net/images/DoubleLayerModerateTop.png',15),(34,'Snow Pants','https://api.mikebelus.net/images/snow.png',16),(36,'Light Tights','https://api.mikebelus.net/images/LightTights.png',16),(37,'Heavy Tights','https://api.mikebelus.net/images/HeavyTights.png',16),(38,'Medium Top','https://api.mikebelus.net/images/MediumTop.png',15);
/*!40000 ALTER TABLE `clothing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clothing_category`
--

DROP TABLE IF EXISTS `clothing_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clothing_category` (
  `clothing_category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`clothing_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clothing_category`
--

LOCK TABLES `clothing_category` WRITE;
/*!40000 ALTER TABLE `clothing_category` DISABLE KEYS */;
INSERT INTO `clothing_category` VALUES (15,'Tops'),(16,'Pants'),(17,'Socks'),(18,'Gloves'),(19,'Mittens'),(20,'Caps'),(21,'Mask'),(22,'Boots');
/*!40000 ALTER TABLE `clothing_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cronlogs`
--

DROP TABLE IF EXISTS `cronlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cronlogs` (
  `logid` int NOT NULL AUTO_INCREMENT,
  `AllOrSingleJobType` varchar(10) NOT NULL,
  `HourlyOrWeeklyJobType` varchar(10) NOT NULL,
  `RecordsCount` int NOT NULL,
  `CronStartTime` datetime NOT NULL,
  `CronEndTime` datetime NOT NULL,
  `TimeTaken` varchar(10) NOT NULL,
  PRIMARY KEY (`logid`)
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cronlogs`
--

LOCK TABLES `cronlogs` WRITE;
/*!40000 ALTER TABLE `cronlogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `cronlogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `postal_code` int NOT NULL,
  `city` varchar(30) NOT NULL,
  `state` varchar(30) NOT NULL,
  `latitude` decimal(10,6) NOT NULL,
  `longitude` decimal(10,6) NOT NULL,
  `isAvailable` varchar(10) NOT NULL,
  `lastUpdated` datetime NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,14201,'Buffalo','NY',42.896700,-78.884600,'Yes','2023-05-11 21:05:19'),(2,14202,'Buffalo','NY',42.887000,-78.877900,'Yes','2023-05-11 21:05:19'),(3,14203,'Buffalo','NY',42.893900,-78.868100,'Yes','2023-05-11 21:05:19'),(4,14204,'Buffalo','NY',42.884000,-78.859700,'Yes','2023-05-11 21:05:19'),(5,14205,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(6,14206,'Buffalo','NY',42.881100,-78.810400,'Yes','2023-05-11 21:05:19'),(7,14207,'Buffalo','NY',42.949100,-78.897800,'Yes','2023-05-11 21:05:19'),(8,14208,'Buffalo','NY',42.915400,-78.850500,'Yes','2023-05-11 21:05:19'),(9,14209,'Buffalo','NY',42.913000,-78.865600,'Yes','2023-05-11 21:05:19'),(10,14210,'Buffalo','NY',42.861400,-78.820600,'Yes','2023-05-11 21:05:19'),(11,14211,'Buffalo','NY',42.908200,-78.822500,'Yes','2023-05-11 21:05:19'),(12,14212,'Buffalo','NY',42.894600,-78.824500,'Yes','2023-05-11 21:05:19'),(13,14213,'Buffalo','NY',42.916700,-78.889500,'Yes','2023-05-11 21:05:19'),(14,14214,'Buffalo','NY',42.941400,-78.837400,'Yes','2023-05-11 21:05:19'),(15,14215,'Buffalo','NY',42.933500,-78.811500,'Yes','2023-05-11 21:05:19'),(16,14216,'Buffalo','NY',42.949900,-78.859900,'Yes','2023-05-11 21:05:19'),(17,14217,'Buffalo','NY',42.971900,-78.876900,'Yes','2023-05-11 21:05:19'),(18,14218,'Buffalo','NY',42.814600,-78.807800,'Yes','2023-05-11 21:05:19'),(19,14219,'Buffalo','NY',42.786300,-78.826400,'Yes','2023-05-11 21:05:19'),(20,14220,'Buffalo','NY',42.844100,-78.818200,'Yes','2023-05-11 21:05:19'),(21,14221,'Buffalo','NY',42.968500,-78.749200,'Yes','2023-05-11 21:05:19'),(22,14222,'Buffalo','NY',42.916400,-78.876300,'Yes','2023-05-11 21:05:19'),(23,14223,'Buffalo','NY',42.973100,-78.845000,'Yes','2023-05-11 21:05:19'),(24,14224,'Buffalo','NY',42.837100,-78.748400,'Yes','2023-05-11 21:05:19'),(25,14225,'Buffalo','NY',42.925500,-78.748100,'Yes','2023-05-11 21:05:19'),(26,14226,'Buffalo','NY',42.974400,-78.794900,'Yes','2023-05-11 21:05:19'),(27,14227,'Buffalo','NY',42.885300,-78.746200,'Yes','2023-05-11 21:05:19'),(28,14228,'Buffalo','NY',43.040800,-78.781200,'Yes','2023-05-11 21:05:19'),(29,14231,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(30,14233,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(31,14240,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(32,14241,'Buffalo','NY',42.938300,-78.744100,'Yes','2023-05-11 21:05:19'),(33,14260,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(34,14261,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(35,14263,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(36,14264,'Buffalo','NY',42.885600,-78.873500,'Yes','2023-05-11 21:05:19'),(37,14265,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(38,14266,'Buffalo','NY',42.884900,-78.826400,'Yes','2023-05-11 21:05:19'),(39,14267,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(40,14269,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(41,14270,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(42,14271,'Buffalo','NY',42.884900,-78.826400,'Yes','2023-05-11 21:05:19'),(43,14272,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(44,14273,'Buffalo','NY',42.755000,-78.784900,'Yes','2023-05-11 21:05:19'),(45,14276,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(46,14280,'Buffalo','NY',42.768400,-78.887100,'Yes','2023-05-11 21:05:19'),(47,98060,'Seattle','WA',47.432300,-121.803400,'Yes','2023-05-01 11:23:06'),(48,27395,'Greensboro','NC',36.044600,-79.859600,'Yes','2023-05-01 11:23:43'),(49,98109,'Seattle','WA',47.633900,-122.347600,'Yes','2023-05-01 11:24:06'),(50,60064,'North Chicago','IL',42.324700,-87.856400,'Yes','2023-05-01 11:41:30'),(51,2101,'Boston','MA',42.370600,-71.027000,'Yes','2023-05-01 12:19:47'),(52,1886,'Westford','MA',42.586400,-71.440100,'Yes','2023-05-01 12:20:21'),(53,14571,'Waterport','NY',43.332600,-78.243000,'Yes','2023-05-01 13:03:21'),(54,10029,'New York City','NY',40.791800,-73.944800,'Yes','2023-05-01 13:34:26'),(55,77469,'Richmond','TX',29.551100,-95.732900,'Yes','2023-05-01 13:35:03'),(56,93203,'Arvin','CA',35.196600,-118.833600,'Yes','2023-05-01 13:37:26'),(57,90212,'Beverly Hills','CA',34.061900,-118.399500,'Yes','2023-05-01 14:05:40'),(58,90210,'Beverly Hills','CA',34.090100,-118.406500,'Yes','2023-05-01 14:11:12'),(59,60064,'North Chicago','IL',42.324700,-87.856400,'Yes','2023-05-01 14:37:55'),(60,14031,'Clarence','NY',42.981000,-78.616200,'Yes','2023-05-01 14:53:23'),(61,14120,'North Tonawanda','NY',43.049800,-78.851000,'Yes','2023-05-01 14:54:29'),(62,94203,'Sacramento','CA',38.380500,-121.555400,'Yes','2023-05-01 16:19:14'),(63,60616,'Chicago','IL',41.842600,-87.630600,'Yes','2023-05-01 19:02:19'),(64,10000,'New York City','NY',40.706900,-73.673100,'Yes','2023-05-01 19:06:11'),(65,73301,'Austin','TX',30.326400,-97.771300,'Yes','2023-05-01 19:06:29'),(66,85001,'Phoenix','AZ',33.704000,-112.351800,'Yes','2023-05-01 19:07:26'),(67,14072,'Grand Island','NY',43.018300,-78.959100,'Yes','2023-05-02 22:44:46'),(68,7423,'Ho Ho Kus','NJ',41.000400,-74.102500,'Yes','2023-05-02 22:45:04'),(69,85280,'Tempe','AZ',33.401400,-111.931300,'Yes','2023-05-02 22:45:19'),(70,48205,'Detroit','MI',42.431300,-82.981300,'Yes','2023-05-04 03:14:28'),(71,13114,'Mexico','NY',43.460500,-76.244600,'Yes','2023-05-04 03:14:43'),(72,14305,'Niagara Falls','NY',43.114600,-79.037800,'Yes','2023-05-04 17:28:07'),(73,93301,'Bakersfield','CA',35.386600,-119.017100,'Yes','2023-05-05 01:00:22'),(74,95101,'San Jose','CA',37.389400,-121.886800,'Yes','2023-05-05 01:01:06'),(75,60445,'Midlothian','IL',41.635000,-87.736200,'Yes','2023-05-05 02:11:40'),(76,65591,'Montreal','MO',37.985100,-92.547000,'Yes','2023-05-05 05:14:03'),(77,14432,'Clifton Springs','NY',42.963200,-77.144000,'Yes','2023-05-05 06:13:51'),(78,21719,'Cascade','MD',39.695800,-77.495500,'Yes','2023-05-05 06:16:26'),(79,14094,'Lockport','NY',43.160000,-78.692300,'Yes','2023-05-05 06:55:52'),(80,16025,'Chicora','PA',40.945800,-79.746200,'Yes','2023-05-05 16:03:44'),(82,14532,'Phelps','NY',42.958200,-77.047300,'Yes','2023-05-05 19:36:09'),(83,10023,'New York City','NY',40.776400,-73.982700,'Yes','2023-05-06 00:04:32'),(84,75065,'Lake Dallas','TX',33.121900,-97.023700,'Yes','2023-05-06 04:04:44'),(85,20007,'Washington','DC',38.914400,-77.074000,'Yes','2023-05-06 04:05:03'),(86,75065,'Lake Dallas','TX',33.121900,-97.023700,'Yes','2023-05-07 03:18:05'),(87,19460,'Phoenixville','PA',40.126700,-75.527200,'Yes','2023-05-07 03:45:35'),(88,57754,'Lead','SD',44.263000,-103.871200,'Yes','2023-05-07 04:43:35'),(89,2116,'Boston','MA',42.349200,-71.076800,'Yes','2023-05-07 20:45:36'),(90,81001,'Pueblo','CO',38.287900,-104.584800,'Yes','2023-05-07 20:57:16'),(91,77001,'Houston','TX',29.813100,-95.309800,'Yes','2023-05-07 22:18:07'),(92,76201,'Denton','TX',33.228900,-97.131400,'Yes','2023-05-08 00:33:53'),(93,14068,'Getzville','NY',43.024000,-78.753200,'Yes','2023-05-08 00:38:18'),(94,50131,'Johnston','IA',41.673000,-93.702800,'Yes','2023-05-08 02:54:58'),(95,13657,'Limerick','NY',44.035700,-76.090400,'Yes','2023-05-08 04:08:32'),(96,10000,'New York City','NY',40.706900,-73.673100,'Yes','2023-05-08 04:21:25'),(97,43085,'Columbus','OH',40.099900,-83.015700,'Yes','2023-05-08 04:22:07'),(98,14170,'West Falls','NY',42.705300,-78.677900,'Yes','2023-05-08 04:29:17'),(99,65746,'Seymour','MO',37.166700,-92.785700,'Yes','2023-05-08 04:30:12'),(100,52777,'Wheatland','IA',41.825800,-90.840200,'Yes','2023-05-08 04:30:51'),(101,46360,'Michigan City','IN',41.698000,-86.869900,'Yes','2023-05-08 04:31:12'),(102,49254,'Michigan Center','MI',42.227100,-84.316100,'Yes','2023-05-08 04:31:25'),(103,98660,'Vancouver','WA',45.641800,-122.680100,'Yes','2023-05-08 12:38:09'),(104,85701,'Tucson','AZ',32.213900,-110.969400,'Yes','2023-05-08 04:32:20'),(105,81120,'Antonito','CO',37.085500,-106.037900,'Yes','2023-05-08 12:39:58'),(107,75065,'Lake Dallas','TX',33.121900,-97.023700,'No','2023-05-08 12:29:33'),(108,93301,'Bakersfield','CA',35.386600,-119.017100,'No','2023-05-08 12:29:27'),(109,84101,'Salt Lake City','UT',40.755900,-111.896700,'Yes','2023-05-08 13:15:58'),(110,20006,'Washington','DC',38.896400,-77.044700,'Yes','2023-05-08 12:47:26'),(111,28107,'Midland','NC',35.247700,-80.531900,'Yes','2023-05-08 13:12:01'),(112,50011,'Ames','IA',42.036000,-93.465200,'Yes','2023-05-08 13:14:22'),(113,33601,'Tampa','FL',27.996100,-82.582000,'Yes','2023-05-08 13:21:40'),(114,83701,'Boise','ID',43.603800,-116.272900,'Yes','2023-05-08 14:16:00'),(115,59101,'Billings','MT',45.774500,-108.500500,'Yes','2023-05-08 14:17:19'),(116,13126,'Oswego','NY',43.439400,-76.461300,'Yes','2023-05-08 14:49:04'),(117,75065,'Lake Dallas','TX',33.121900,-97.023700,'Yes','2023-05-10 19:37:10'),(118,27601,'Raleigh','NC',35.772700,-78.632400,'Yes','2023-05-10 19:37:45'),(119,99801,'Juneau','AK',58.362800,-134.529400,'Yes','2023-05-10 19:38:43'),(120,33101,'Miami','FL',25.779100,-80.197800,'Yes','2023-05-10 20:19:09'),(121,21201,'Baltimore','MD',39.294600,-76.625200,'Yes','2023-05-10 20:20:04'),(122,1720,'Acton','MA',42.475100,-71.448300,'Yes','2023-05-10 20:20:26'),(123,43964,'Toronto','OH',40.473300,-80.632500,'Yes','2023-05-10 20:21:06'),(124,15112,'East Pittsburgh','PA',40.403600,-79.838900,'Yes','2023-05-10 20:21:23'),(125,99701,'Fairbanks','AK',64.644000,-147.522100,'Yes','2023-05-10 20:22:01'),(126,58201,'Grand Forks','ND',47.901000,-97.044600,'Yes','2023-05-10 20:28:09'),(127,14043,'Depew','NY',42.905000,-78.704100,'Yes','2023-05-10 20:37:05'),(128,12836,'Hague','NY',43.746300,-73.528200,'Yes','2023-05-11 10:35:14'),(129,10000,'New York City','NY',40.706900,-73.673100,'Yes','2023-05-11 14:55:48');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preference`
--

DROP TABLE IF EXISTS `preference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preference` (
  `preference_id` int NOT NULL AUTO_INCREMENT,
  `preference` varchar(30) NOT NULL,
  `preference_category` varchar(40) NOT NULL,
  PRIMARY KEY (`preference_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preference`
--

LOCK TABLES `preference` WRITE;
/*!40000 ALTER TABLE `preference` DISABLE KEYS */;
INSERT INTO `preference` VALUES (1,'Run','Sport'),(2,'Walk','Sport'),(3,'Casual','Sport'),(4,'Cold','Feel'),(5,'Normal','Feel'),(6,'Hot','Feel'),(7,'Bike','Sport'),(8,'Swim','Sport');
/*!40000 ALTER TABLE `preference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommended`
--

DROP TABLE IF EXISTS `recommended`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommended` (
  `recommended_id` int NOT NULL AUTO_INCREMENT,
  `clothing_id` int NOT NULL,
  `clothing_category_id` int NOT NULL,
  `apparent_temp_range_start` int NOT NULL,
  `apparent_temp_range_end` int NOT NULL,
  `feel_id` int NOT NULL,
  `sport_id` int NOT NULL,
  PRIMARY KEY (`recommended_id`),
  KEY `fk_clothingID` (`clothing_id`),
  KEY `fk_feel_id` (`feel_id`),
  KEY `fk_sport_id` (`sport_id`),
  CONSTRAINT `fk_clothingID` FOREIGN KEY (`clothing_id`) REFERENCES `clothing` (`clothing_id`),
  CONSTRAINT `fk_feel_id` FOREIGN KEY (`feel_id`) REFERENCES `preference` (`preference_id`),
  CONSTRAINT `fk_sport_id` FOREIGN KEY (`sport_id`) REFERENCES `preference` (`preference_id`)
) ENGINE=InnoDB AUTO_INCREMENT=528 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommended`
--

LOCK TABLES `recommended` WRITE;
/*!40000 ALTER TABLE `recommended` DISABLE KEYS */;
INSERT INTO `recommended` VALUES (27,15,15,64,120,6,7),(28,17,15,59,64,6,8),(29,16,16,64,120,6,7),(30,16,16,59,64,6,7),(31,17,15,49,59,6,7),(32,18,16,49,59,6,7),(33,19,18,49,59,6,7),(34,22,20,39,49,6,7),(35,17,15,39,49,6,7),(36,18,16,39,49,6,7),(41,17,15,44,49,5,1),(42,18,16,44,49,5,1),(43,17,15,39,44,5,1),(44,18,16,39,44,5,1),(45,19,18,39,44,5,1),(46,15,15,74,120,5,3),(47,16,16,74,120,5,3),(48,17,15,69,76,5,3),(49,16,16,76,69,5,3),(50,17,15,64,69,5,3),(51,18,16,64,69,5,3),(52,17,15,59,64,5,3),(53,18,16,59,64,5,3),(54,19,18,59,64,5,3),(55,20,15,54,59,5,3),(56,17,15,54,59,5,3),(57,18,16,54,59,5,3),(58,19,18,54,59,5,3),(59,20,15,49,54,5,3),(60,17,15,49,54,5,3),(61,18,16,49,54,5,3),(62,19,18,49,54,5,3),(63,23,20,49,54,5,3),(64,17,15,44,49,5,3),(65,24,15,44,49,5,3),(66,18,16,44,49,5,3),(67,19,18,44,49,5,3),(68,23,20,44,49,5,3),(69,24,15,39,44,5,3),(70,17,15,39,44,5,3),(71,19,18,39,44,5,3),(72,23,20,39,44,5,3),(73,25,16,39,44,5,3),(74,24,15,34,39,5,3),(75,17,15,34,39,5,3),(76,25,16,34,39,5,3),(77,21,18,34,39,5,3),(78,23,20,34,39,5,3),(79,24,15,29,34,5,3),(80,20,15,29,34,5,3),(81,17,15,29,34,5,3),(82,25,16,29,34,5,3),(83,21,18,29,34,5,3),(84,23,20,29,34,5,3),(85,24,15,24,29,5,3),(86,20,15,24,29,5,3),(87,17,15,24,29,5,3),(88,25,16,24,29,5,3),(89,21,18,24,29,5,3),(90,27,22,24,29,5,3),(91,26,20,24,29,5,3),(92,24,15,19,24,5,3),(93,20,15,19,24,5,3),(94,17,15,19,24,5,3),(95,21,18,19,24,5,3),(96,26,20,19,24,5,3),(97,27,22,19,24,5,3),(98,28,16,19,24,5,3),(99,24,15,14,19,5,3),(100,17,15,14,19,5,3),(101,20,15,14,19,5,3),(102,28,16,14,19,5,3),(103,29,19,14,19,5,3),(104,26,20,14,19,5,3),(105,27,22,14,19,5,3),(106,30,21,14,19,5,3),(107,32,17,14,19,5,3),(108,24,15,9,14,5,3),(109,17,15,9,14,5,3),(110,33,15,9,14,5,3),(111,28,16,9,14,5,3),(112,29,19,9,14,5,3),(113,26,20,9,14,5,3),(114,27,22,9,14,5,3),(115,32,17,9,14,5,3),(116,30,21,9,14,5,3),(117,24,15,-20,9,5,3),(118,33,15,-20,9,5,3),(119,17,15,-20,9,5,3),(120,28,16,-20,9,5,3),(121,34,16,-20,9,5,3),(122,29,19,-20,9,5,3),(123,26,20,-20,9,5,3),(124,27,22,-20,9,5,3),(125,32,17,-20,9,5,3),(126,30,21,-20,9,5,3),(127,15,15,54,120,5,2),(128,16,16,54,120,5,2),(130,16,16,49,54,5,2),(131,17,15,44,49,5,2),(132,36,16,44,49,5,2),(133,17,15,49,54,5,2),(134,17,15,39,44,5,2),(135,36,16,39,44,5,2),(136,19,18,39,44,5,2),(137,15,15,39,120,6,1),(138,16,16,39,120,6,1),(139,17,15,34,39,6,1),(140,16,16,34,39,6,1),(141,17,15,29,34,6,1),(142,36,16,29,34,6,1),(143,17,15,24,29,6,1),(144,36,16,24,29,6,1),(145,19,18,24,29,6,1),(146,38,15,19,24,6,1),(147,17,15,19,24,6,1),(148,36,16,19,24,6,1),(149,19,18,19,24,6,1),(150,38,15,14,19,6,1),(151,17,15,14,19,6,1),(152,36,16,14,19,6,1),(153,19,18,14,19,6,1),(154,23,20,14,19,6,1),(155,31,17,14,19,6,1),(156,24,15,9,14,6,1),(157,17,15,9,14,6,1),(158,36,16,9,14,6,1),(159,19,18,9,14,6,1),(160,23,20,9,14,6,1),(161,31,17,9,14,6,1),(162,24,15,4,9,6,1),(163,17,15,4,9,6,1),(164,37,16,4,9,6,1),(165,19,18,4,9,6,1),(166,23,20,4,9,6,1),(167,31,17,4,9,6,1),(168,24,15,-1,4,6,1),(169,17,15,-1,4,6,1),(170,37,16,-1,4,6,1),(171,21,18,-1,4,6,1),(172,23,20,-1,4,6,1),(173,31,17,-1,4,6,1),(174,24,15,-6,-1,6,1),(175,20,15,-6,-1,6,1),(176,17,15,-6,-1,6,1),(177,37,16,-6,-1,6,1),(178,21,18,-6,-1,6,1),(179,23,20,-6,-1,6,1),(180,31,17,-6,-1,6,1),(181,24,15,-11,-6,6,1),(182,20,15,-11,-6,6,1),(183,17,15,-11,-6,6,1),(184,37,16,-11,-6,6,1),(185,21,18,-11,-6,6,1),(186,26,20,-11,-6,6,1),(187,31,17,-11,-6,6,1),(188,24,15,-16,-11,6,1),(189,20,15,-16,-11,6,1),(190,20,15,-16,-11,6,1),(191,17,15,-16,-11,6,1),(192,28,16,-16,-11,6,1),(193,21,18,-16,-11,6,1),(194,26,20,-16,-11,6,1),(195,31,17,-16,-11,6,1),(196,24,15,-21,-16,6,1),(197,20,15,-21,-16,6,1),(198,17,15,-21,-16,6,1),(199,28,16,-21,-16,6,1),(200,29,19,-21,-16,6,1),(201,26,20,-21,-16,6,1),(202,30,21,-21,-16,6,1),(203,31,17,-21,-16,6,1),(204,24,15,-26,-21,6,1),(205,33,15,-26,-21,6,1),(206,17,15,-26,-21,6,1),(207,28,16,-26,-21,6,1),(208,29,19,-26,-21,6,1),(209,26,20,-26,-21,6,1),(210,30,21,-26,-21,6,1),(211,31,17,-26,-21,6,1),(212,24,15,-21,-30,6,1),(213,33,15,-21,-30,6,1),(214,17,15,-21,-30,6,1),(215,28,16,-21,-30,6,1),(216,34,16,-21,-30,6,1),(217,29,19,-21,-30,6,1),(218,26,20,-21,-30,6,1),(219,30,21,-21,-30,6,1),(220,31,17,-21,-30,6,1),(221,15,15,59,120,4,1),(222,16,16,59,120,4,1),(223,17,15,54,59,4,1),(224,16,16,54,59,4,1),(225,17,15,49,54,4,1),(226,36,16,49,54,4,1),(228,36,16,44,49,4,1),(229,19,18,44,49,4,1),(230,38,15,39,44,4,1),(231,17,15,44,49,4,1),(232,36,16,39,44,4,1),(233,19,18,39,44,4,1),(234,17,15,39,44,4,1),(235,38,15,34,39,4,1),(236,17,15,34,39,4,1),(237,36,16,34,39,4,1),(238,19,18,34,39,4,1),(239,23,20,34,39,4,1),(240,31,17,34,39,4,1),(241,24,15,29,34,4,1),(242,17,15,29,34,4,1),(243,36,16,29,34,4,1),(244,19,18,29,34,4,1),(245,23,20,29,34,4,1),(246,31,17,29,34,4,1),(247,24,15,24,29,4,1),(248,17,15,24,29,4,1),(249,37,16,24,29,4,1),(250,19,18,24,29,4,1),(251,23,20,24,29,4,1),(252,31,17,24,29,4,1),(253,24,15,19,24,4,1),(254,17,15,19,24,4,1),(255,37,16,19,24,4,1),(256,21,18,19,24,4,1),(257,23,20,19,24,4,1),(258,31,17,19,24,4,1),(259,24,15,14,19,4,1),(260,20,15,14,19,4,1),(261,17,15,14,19,4,1),(262,37,16,14,19,4,1),(263,21,18,14,19,4,1),(264,23,20,14,19,4,1),(265,31,17,14,19,4,1),(266,24,15,9,14,4,1),(267,20,15,9,14,4,1),(268,17,15,9,14,4,1),(269,37,16,9,14,4,1),(270,21,18,9,14,4,1),(271,26,20,9,14,4,1),(272,31,17,9,14,4,1),(273,24,15,4,9,4,1),(274,20,15,4,9,4,1),(275,17,15,4,9,4,1),(276,28,16,4,9,4,1),(277,21,18,4,9,4,1),(278,26,20,4,9,4,1),(279,31,17,4,9,4,1),(280,24,15,-1,4,4,1),(281,20,15,-1,4,4,1),(282,17,15,-1,4,4,1),(283,15,15,49,120,5,1),(284,16,16,49,120,5,1),(286,16,16,44,49,5,1),(287,17,15,39,44,5,1),(288,36,16,39,44,5,1),(289,17,15,34,39,5,1),(290,36,16,34,39,5,1),(291,19,18,34,39,5,1),(292,38,15,29,34,5,1),(293,17,15,29,34,5,1),(294,36,16,24,29,5,1),(295,19,18,24,29,5,1),(296,23,20,24,29,5,1),(297,31,17,24,29,5,1),(298,24,15,19,24,5,1),(299,17,15,19,24,5,1),(300,36,16,19,24,5,1),(301,19,18,19,24,5,1),(302,23,20,19,24,5,1),(303,31,17,19,24,5,1),(304,24,15,14,19,5,1),(305,17,15,14,19,5,1),(306,37,16,14,19,5,1),(307,19,18,14,19,5,1),(308,23,20,14,19,5,1),(309,31,17,14,19,5,1),(310,24,15,9,14,5,1),(311,17,15,9,14,5,1),(312,37,16,9,14,5,1),(313,21,18,9,14,5,1),(314,23,20,9,14,5,1),(315,31,17,9,14,5,1),(316,24,15,4,9,5,1),(317,20,15,4,9,5,1),(318,17,15,4,9,5,1),(319,37,16,4,9,5,1),(320,21,18,4,9,5,1),(321,23,20,4,9,5,1),(322,31,17,4,9,5,1),(323,24,15,-1,4,5,1),(324,20,15,-1,4,5,1),(325,17,15,-1,4,5,1),(326,37,16,-1,4,5,1),(327,21,18,-1,4,5,1),(328,26,20,-1,4,5,1),(329,31,17,-1,4,5,1),(330,24,15,-6,-1,5,1),(331,20,15,-6,-1,5,1),(332,17,15,-6,-1,5,1),(333,28,16,-6,-1,5,1),(334,21,18,-6,-1,5,1),(335,26,20,-6,-1,5,1),(336,31,17,-6,-1,5,1),(337,24,15,-11,-6,5,1),(338,20,15,-6,-11,5,1),(339,17,15,-6,-11,5,1),(340,28,16,-6,-11,5,1),(341,29,19,-6,-11,5,1),(342,26,20,-6,-11,5,1),(343,30,21,-6,-11,5,1),(344,31,17,-6,-11,5,1),(345,24,15,-16,-11,5,1),(346,33,15,-16,-11,5,1),(347,17,15,-16,-11,5,1),(348,28,16,-16,-11,5,1),(349,29,19,-16,-11,5,1),(350,26,20,-16,-11,5,1),(351,30,21,-16,-11,5,1),(352,31,17,-16,-11,5,1),(353,24,15,-21,-30,5,1),(354,33,15,-21,-30,5,1),(355,17,15,-21,-30,5,1),(356,28,16,-21,-30,5,1),(357,34,16,-21,-30,5,1),(358,29,19,-21,-30,5,1),(359,26,20,-21,-30,5,1),(360,30,21,-21,-30,5,1),(361,31,17,-21,-30,5,1),(362,38,15,34,39,5,2),(363,17,15,34,39,5,2),(364,36,16,34,39,5,2),(365,19,18,34,39,5,2),(366,38,15,29,34,5,2),(367,17,15,29,34,5,2),(368,36,16,29,34,5,2),(369,19,18,29,34,5,2),(370,23,20,29,34,5,2),(371,31,17,29,34,5,2),(372,24,15,24,29,5,2),(373,17,15,24,29,5,2),(374,36,16,24,29,5,2),(375,19,18,24,29,5,2),(376,23,20,24,29,5,2),(377,31,17,24,29,5,2),(378,24,15,19,24,5,2),(379,17,15,19,24,5,2),(380,37,16,19,24,5,2),(381,19,18,19,24,5,2),(382,23,20,19,24,5,2),(383,31,17,19,24,5,2),(384,24,15,14,19,5,2),(385,17,15,14,19,5,2),(386,37,16,14,19,5,2),(387,21,18,14,19,5,2),(388,23,20,14,19,5,2),(389,31,17,14,19,5,2),(390,24,15,9,14,5,2),(391,20,15,9,14,5,2),(392,17,15,9,14,5,2),(393,37,16,9,14,5,2),(394,21,18,9,14,5,2),(395,23,20,9,14,5,2),(396,31,17,9,14,5,2),(397,24,15,4,9,5,2),(398,20,15,4,9,5,2),(399,17,15,4,9,5,2),(400,37,16,4,9,5,2),(401,21,18,4,9,5,2),(402,26,20,4,9,5,2),(403,31,17,4,9,5,2),(404,24,15,-1,4,5,2),(405,20,15,-1,4,5,2),(406,17,15,-1,4,5,2),(407,29,19,-1,4,5,2),(408,26,20,-1,4,5,2),(409,30,21,-1,4,5,2),(410,31,17,-1,4,5,2),(411,24,15,-6,-1,5,2),(412,33,15,-6,-1,5,2),(413,17,15,-6,-1,5,2),(414,29,19,-6,-1,5,2),(415,26,20,-6,-1,5,2),(416,30,21,-6,-1,5,2),(417,31,17,-6,-1,5,2),(418,24,15,-20,-6,5,2),(419,33,15,-20,-6,5,2),(420,17,15,-20,-6,5,2),(421,34,16,-20,-6,5,2),(422,29,19,-20,-6,5,2),(423,26,20,-20,-6,5,2),(424,30,21,-20,-6,5,2),(425,31,17,-20,-6,5,2),(426,15,15,44,120,6,2),(427,16,16,44,120,6,2),(428,17,15,39,44,6,2),(429,16,16,39,44,6,2),(430,17,15,34,39,6,2),(431,36,16,34,39,6,2),(432,17,15,29,34,6,2),(433,36,16,29,34,6,2),(434,19,18,29,34,6,2),(435,38,15,24,29,6,2),(436,17,15,24,29,6,2),(437,36,16,24,29,6,2),(438,19,18,24,29,6,2),(439,38,15,19,24,6,2),(440,17,15,19,24,6,2),(441,36,16,19,24,6,2),(442,19,18,19,24,6,2),(443,23,20,19,24,6,2),(444,31,17,19,24,6,2),(445,24,15,14,19,6,2),(446,17,15,14,19,6,2),(447,36,16,14,19,6,2),(448,19,18,14,19,6,2),(449,23,20,14,19,6,2),(450,31,17,14,19,6,2),(451,24,15,9,14,6,2),(452,17,15,9,14,6,2),(453,37,16,9,14,6,2),(454,19,18,9,14,6,2),(455,23,20,9,14,6,2),(456,31,17,9,14,6,2),(457,24,15,4,9,6,2),(458,17,15,4,9,6,2),(459,37,16,4,9,6,2),(460,21,18,4,9,6,2),(461,31,17,4,9,6,2),(462,23,20,4,9,6,2),(463,24,15,-1,4,6,2),(464,20,15,-1,4,6,2),(465,17,15,-1,4,6,2),(466,37,16,-1,4,6,2),(467,21,18,-1,4,6,2),(468,23,20,-1,4,6,2),(469,31,17,-1,4,6,2),(470,24,15,-6,-1,6,2),(471,20,15,-6,-1,6,2),(472,17,15,-6,-1,6,2),(473,37,16,-6,-1,6,2),(474,21,18,-6,-1,6,2),(475,26,20,-6,-1,6,2),(476,31,17,-6,-1,6,2),(477,24,15,-11,-6,6,2),(478,20,15,-11,-6,6,2),(479,17,15,-11,-6,6,2),(480,29,19,-11,-6,6,2),(481,26,20,-11,-6,6,2),(482,30,21,-11,-6,6,2),(483,31,17,-11,-6,6,2),(484,24,15,-16,-11,6,2),(485,33,15,-16,-11,6,2),(486,17,15,-16,-11,6,2),(487,29,19,-16,-11,6,2),(488,26,20,-16,-11,6,2),(489,30,21,-16,-11,6,2),(490,31,17,-16,-11,6,2),(491,24,15,-20,-16,6,2),(492,33,15,-20,-16,6,2),(493,17,15,-20,-16,6,2),(494,34,16,-20,-16,6,2),(495,29,19,-20,-16,6,2),(496,26,20,-20,-16,6,2),(497,30,21,-20,-16,6,2),(498,31,17,-20,-16,6,2),(499,15,15,64,120,4,2),(500,16,16,64,120,4,2),(501,17,15,59,64,4,2),(502,16,16,59,64,4,2),(503,17,15,54,59,4,2),(504,36,16,54,59,4,2),(505,17,15,49,54,4,2),(506,36,16,49,54,4,2),(507,19,18,49,54,4,2),(508,38,15,44,49,4,2),(509,17,15,44,49,4,2),(510,36,16,44,49,4,2),(511,19,18,44,49,4,2),(512,38,15,39,44,4,2),(513,17,15,39,44,4,2),(514,36,16,39,44,4,2),(515,19,18,39,44,4,2),(516,23,20,39,44,4,2),(517,31,17,39,44,4,2),(518,24,15,34,39,4,2),(519,17,15,34,39,4,2),(520,36,16,34,39,4,2),(521,19,18,34,39,4,2),(522,23,20,34,39,4,2),(523,31,17,34,39,4,2),(524,24,15,29,34,4,2),(525,17,15,29,34,4,2),(526,37,16,29,34,4,2),(527,19,18,29,34,4,2);
/*!40000 ALTER TABLE `recommended` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weather`
--

DROP TABLE IF EXISTS `weather`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weather` (
  `weather_id` int NOT NULL AUTO_INCREMENT,
  `location_id` int NOT NULL,
  `Date_Time` timestamp NOT NULL,
  `Alert` varchar(100) DEFAULT NULL,
  `Forecast` varchar(100) NOT NULL,
  `Temperature` int NOT NULL,
  `DewPoint` int NOT NULL,
  `HeatIndex` int DEFAULT NULL,
  `WindChill` int DEFAULT NULL,
  `SurfaceWind` int DEFAULT NULL,
  `WindDir` varchar(20) DEFAULT NULL,
  `Gust` int DEFAULT NULL,
  `SkyCover` int DEFAULT NULL,
  `PrecipitationPotential` int NOT NULL,
  `RelativeHumidity` int NOT NULL,
  `Rain` varchar(40) DEFAULT NULL,
  `Thunder` varchar(40) DEFAULT NULL,
  `Snow` varchar(40) DEFAULT NULL,
  `FreezingRain` varchar(40) DEFAULT NULL,
  `Sleet` varchar(40) DEFAULT NULL,
  `ApparentTemp` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`weather_id`)
) ENGINE=InnoDB AUTO_INCREMENT=572233 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weather`
--

LOCK TABLES `weather` WRITE;
/*!40000 ALTER TABLE `weather` DISABLE KEYS */;
/*!40000 ALTER TABLE `weather` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-11 17:06:20
