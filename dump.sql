-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: roketkr
-- ------------------------------------------------------
-- Server version	8.0.46

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

--
-- Table structure for table `__drizzle_migrations`
--

DROP TABLE IF EXISTS `__drizzle_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__drizzle_migrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hash` text NOT NULL,
  `created_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__drizzle_migrations`
--

LOCK TABLES `__drizzle_migrations` WRITE;
/*!40000 ALTER TABLE `__drizzle_migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `__drizzle_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` varchar(255) NOT NULL,
  `accountId` varchar(255) NOT NULL,
  `providerId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `accessToken` text,
  `refreshToken` text,
  `idToken` text,
  `accessTokenExpiresAt` timestamp NULL DEFAULT NULL,
  `refreshTokenExpiresAt` timestamp NULL DEFAULT NULL,
  `scope` varchar(500) DEFAULT NULL,
  `password` text,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `account_userId_user_id_fk` (`userId`),
  CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('3EwGakRi4u2xd7egFrudf5DiVMmWIjgr','SZlBtgQk8qkwcngprQ1qKN3xff78WOZu','credential','SZlBtgQk8qkwcngprQ1qKN3xff78WOZu',NULL,NULL,NULL,NULL,NULL,NULL,'a119045363dcd18cd45451cfc4964c2b:c31be3efdb865dfe38136ee532aa3c14a0ab706434782a23fdd735aee621e00678c5c84dc6bb0e06796b7ddd7dea6348336fd5203ef60e2d0d15ba659120b85d','2026-05-21 17:19:02','2026-05-21 17:19:02'),('Fp6V5WAnFE9gSKdSrNTFNFvHzqnAPWdr','NR35nI3bYAjyy1VCuxaVGtPwyNvUhJh9','credential','NR35nI3bYAjyy1VCuxaVGtPwyNvUhJh9',NULL,NULL,NULL,NULL,NULL,NULL,'7a2bd15b7bb2b52a3f0b61f929a16ba4:ce9dfda0f26b857f6083f9a035110345932f14cd6baf098c0d754c3f46ddccf6435ac32c421e27561dc8d4ac2f5c3553b7050b13d8af23a1d3866b19f0e0413f','2026-05-27 10:30:53','2026-05-27 10:30:53');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `country` varchar(10) NOT NULL DEFAULT 'RU',
  `city` varchar(255) NOT NULL,
  `street` varchar(500) NOT NULL,
  `postalCode` varchar(20) DEFAULT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `address_userId_user_id_fk` (`userId`),
  CONSTRAINT `address_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carModel`
--

DROP TABLE IF EXISTS `carModel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carModel` (
  `id` varchar(36) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `generation` varchar(255) DEFAULT NULL,
  `yearFrom` int DEFAULT NULL,
  `yearTo` int DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `imageUrl` text,
  `isPopular` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `carModel_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carModel`
--

LOCK TABLES `carModel` WRITE;
/*!40000 ALTER TABLE `carModel` DISABLE KEYS */;
INSERT INTO `carModel` VALUES ('2ca98c1d-967e-43b5-8b3b-2412336ee9bb','Toyota','Land Cruiser Prado','150',NULL,NULL,'toyota-prado-150','Frame81.png',1,'2026-05-20 20:19:23','2026-05-20 21:03:52'),('32d201de-7f61-4e9a-8756-a2817ecb9373','Lexus','GX','460',NULL,NULL,'lexus-gx460','Frame80.png',1,'2026-05-20 20:19:23','2026-05-20 21:01:12'),('8f0c8761-b4a6-45ec-8d93-c0131e836e47','Toyota','Land Cruiser','200',NULL,NULL,'toyota-lc200','Frame80.png',1,'2026-05-20 20:19:23','2026-05-20 21:01:12'),('ae59f122-e61a-4823-9882-9efb5a0dcc8a','Nissan','Patrol','Y62',NULL,NULL,'nissan-patrol-y62','Frame80.png',1,'2026-05-20 20:19:23','2026-05-24 02:31:23'),('bbe44af1-af01-4cef-8e7e-679dc72402b6','Lexus','LX','570',NULL,NULL,'lexus-lx570','Frame80.png',0,'2026-05-20 20:19:23','2026-05-20 21:01:12'),('be9a150b-edbd-4cf2-9ed4-3f18f99963d3','Mercedes-Benz','GLE','W167',NULL,NULL,'mercedes-gle-w167','Frame80.png',0,'2026-05-20 20:19:23','2026-05-20 21:01:12');
/*!40000 ALTER TABLE `carModel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cartItem`
--

DROP TABLE IF EXISTS `cartItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartItem` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `productId` varchar(36) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cartItem_userId_productId_idx` (`userId`,`productId`),
  KEY `cartItem_productId_product_id_fk` (`productId`),
  CONSTRAINT `cartItem_productId_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cartItem_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartItem`
--

LOCK TABLES `cartItem` WRITE;
/*!40000 ALTER TABLE `cartItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `cartItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` varchar(36) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `imageUrl` text,
  `parentId` varchar(36) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('02f3573a-16a9-4916-b467-dbed71f19c3f','body-kits','Обвесы',NULL,'body-kit.png',NULL,3,1,'2026-05-20 20:19:23','2026-05-20 20:19:23'),('18398dda-70cb-497e-9419-0273cd996cd6','used-parts','Автозапчасти Б/У',NULL,'used-parts.png',NULL,8,1,'2026-05-20 20:19:23','2026-05-20 20:19:23'),('357f0154-1cea-4f53-ba7b-bff1b64730df','accessories','Аксессуары',NULL,'accessories.png',NULL,6,1,'2026-05-20 20:19:23','2026-05-20 20:19:23'),('3f42f5e4-09da-48d0-815a-ff91d8f5ed08','restyling-kits','Комплекты рестайлинга',NULL,'restyling-set.png',NULL,2,1,'2026-05-20 20:19:23','2026-05-20 20:19:23'),('4192cf99-4833-4dc4-b660-4874b94d8cc6','steering-wheels','Рули',NULL,'wheels.png',NULL,1,1,'2026-05-20 20:19:23','2026-05-20 20:19:23'),('46106f13-2eeb-4497-99c5-080a4c3e26d8','optics','Оптика',NULL,'optics.png',NULL,7,1,'2026-05-20 20:19:23','2026-05-20 20:19:23'),('73318c9e-d65b-466c-a5f2-4f81f3121808','bumpers','Бамперы',NULL,'bumper.png',NULL,4,1,'2026-05-20 20:19:23','2026-05-20 20:19:23'),('d5b8a77a-c4b8-4638-9663-e2c778258527','other','Прочее',NULL,'other.png',NULL,9,1,'2026-05-20 20:19:23','2026-05-20 20:19:23'),('fc7aa282-749e-4349-a0b4-b857c23fb2b7','running-boards','Пороги и подножки',NULL,'apron.png',NULL,5,1,'2026-05-20 20:19:23','2026-05-20 20:19:23');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate`
--

DROP TABLE IF EXISTS `certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate` (
  `id` varchar(36) NOT NULL,
  `title` varchar(500) NOT NULL,
  `issuer` varchar(255) DEFAULT NULL,
  `issuedAt` timestamp NULL DEFAULT NULL,
  `expiresAt` timestamp NULL DEFAULT NULL,
  `imageUrl` text,
  `fileUrl` varchar(1000) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificate_title_unique` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate`
--

LOCK TABLES `certificate` WRITE;
/*!40000 ALTER TABLE `certificate` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `placement` enum('home') DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gallery_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
INSERT INTO `gallery` VALUES ('02931f5e-3568-4fa5-b8f1-07b123ac9617','Склад','home','Фото склада и наличия комплектов'),('201907ba-33f1-4e5b-bdf3-78f9b8e96f0a','Комплекты','home','Комплекты рестайлинга и обвесы'),('df90256f-ead1-4ba2-bb12-6c89ca317439','Установка','home','Процесс установки и монтажа');
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `galleryImage`
--

DROP TABLE IF EXISTS `galleryImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `galleryImage` (
  `id` varchar(36) NOT NULL,
  `galleryId` varchar(36) NOT NULL,
  `url` text,
  `altText` varchar(500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `isPrimary` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `galleryImage_galleryId_gallery_id_fk` (`galleryId`),
  CONSTRAINT `galleryImage_galleryId_gallery_id_fk` FOREIGN KEY (`galleryId`) REFERENCES `gallery` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `galleryImage`
--

LOCK TABLES `galleryImage` WRITE;
/*!40000 ALTER TABLE `galleryImage` DISABLE KEYS */;
INSERT INTO `galleryImage` VALUES ('0563580a-92b4-45ae-b35b-ae8683a31ad2','df90256f-ead1-4ba2-bb12-6c89ca317439','install3.jpeg','Установка — фото 3',2,0),('0811bdc7-15d8-4d06-b468-6400954561f9','df90256f-ead1-4ba2-bb12-6c89ca317439','install1.jpeg','Установка — фото 1',0,1),('0a37a054-21e7-46c8-812c-6f1fafea0f68','201907ba-33f1-4e5b-bdf3-78f9b8e96f0a','kits4.jpeg','Комплекты — фото 4',3,0),('130d47ce-722e-4719-8c33-93dc4ec297ef','02931f5e-3568-4fa5-b8f1-07b123ac9617','warehouse4.jpeg','Склад — фото 4',3,0),('1d3f9295-ada3-4c1f-ada2-9869d149c27d','df90256f-ead1-4ba2-bb12-6c89ca317439','install4.jpeg','Установка — фото 4',3,0),('2cd5694d-07ab-4b19-b581-862b17e65ad7','02931f5e-3568-4fa5-b8f1-07b123ac9617','warehouse2.jpeg','Склад — фото 2',1,0),('2df28454-6f06-4697-bdde-a89c5f3eb0b3','201907ba-33f1-4e5b-bdf3-78f9b8e96f0a','kits5.jpeg','Комплекты — фото 5',4,0),('35747ebd-f9cf-4b16-9b9d-379a5c90d74f','df90256f-ead1-4ba2-bb12-6c89ca317439','install2.jpeg','Установка — фото 2',1,0),('4d357c4d-b8fc-490f-8e1c-b7844a267f7c','02931f5e-3568-4fa5-b8f1-07b123ac9617','warehouse5.jpeg','Склад — фото 5',4,0),('66bdb929-bfd0-44a3-9268-e065554a9486','201907ba-33f1-4e5b-bdf3-78f9b8e96f0a','kits1.jpeg','Комплекты — фото 1',0,1),('779138bc-4062-4845-ae7e-38774d19a6e6','201907ba-33f1-4e5b-bdf3-78f9b8e96f0a','kits3.jpeg','Комплекты — фото 3',2,0),('a4856f10-f893-484e-942d-683a4cdd3aae','02931f5e-3568-4fa5-b8f1-07b123ac9617','warehouse1.jpeg','Склад — фото 1',0,1),('b638f96d-8004-488d-b6cc-6bd075ca36ba','201907ba-33f1-4e5b-bdf3-78f9b8e96f0a','kits2.jpeg','Комплекты — фото 2',1,0),('c7566cc2-c5d9-46a4-8f26-810e4c3fd82f','df90256f-ead1-4ba2-bb12-6c89ca317439','install5.jpeg','Установка — фото 5',4,0),('d061daba-f052-4d0b-9e4f-e31ba88c62fc','02931f5e-3568-4fa5-b8f1-07b123ac9617','warehouse3.jpeg','Склад — фото 3',2,0);
/*!40000 ALTER TABLE `galleryImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gibddRegistration`
--

DROP TABLE IF EXISTS `gibddRegistration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gibddRegistration` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `orderId` varchar(36) DEFAULT NULL,
  `contactName` varchar(255) NOT NULL,
  `contactPhone` varchar(50) NOT NULL,
  `carVin` varchar(50) DEFAULT NULL,
  `carPlate` varchar(20) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `notes` text,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `gibddRegistration_userId_user_id_fk` (`userId`),
  KEY `gibddRegistration_orderId_order_id_fk` (`orderId`),
  CONSTRAINT `gibddRegistration_orderId_order_id_fk` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE SET NULL,
  CONSTRAINT `gibddRegistration_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gibddRegistration`
--

LOCK TABLES `gibddRegistration` WRITE;
/*!40000 ALTER TABLE `gibddRegistration` DISABLE KEYS */;
/*!40000 ALTER TABLE `gibddRegistration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `installationBooking`
--

DROP TABLE IF EXISTS `installationBooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `installationBooking` (
  `id` varchar(36) NOT NULL,
  `orderId` varchar(36) DEFAULT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `contactName` varchar(255) NOT NULL,
  `contactPhone` varchar(50) NOT NULL,
  `carBrand` varchar(255) NOT NULL,
  `carModel` varchar(255) NOT NULL,
  `carYear` int DEFAULT NULL,
  `scheduledAt` timestamp NULL DEFAULT NULL,
  `status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `notes` text,
  `technicianNotes` text,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `installationBooking_orderId_order_id_fk` (`orderId`),
  KEY `installationBooking_userId_user_id_fk` (`userId`),
  CONSTRAINT `installationBooking_orderId_order_id_fk` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE SET NULL,
  CONSTRAINT `installationBooking_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `installationBooking`
--

LOCK TABLES `installationBooking` WRITE;
/*!40000 ALTER TABLE `installationBooking` DISABLE KEYS */;
/*!40000 ALTER TABLE `installationBooking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` varchar(36) NOT NULL,
  `orderNumber` varchar(255) NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `contactName` varchar(255) NOT NULL,
  `contactPhone` varchar(50) NOT NULL,
  `contactEmail` varchar(255) DEFAULT NULL,
  `deliveryMethod` enum('pickup','courier','transport_company','post') NOT NULL DEFAULT 'courier',
  `deliveryAddress` text,
  `deliveryCity` varchar(255) DEFAULT NULL,
  `deliveryPostalCode` varchar(20) DEFAULT NULL,
  `trackingNumber` varchar(255) DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `discountAmount` decimal(12,2) DEFAULT '0.00',
  `deliveryCost` decimal(12,2) DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'RUB',
  `status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `notes` text,
  `needsInstallation` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_orderNumber_unique` (`orderNumber`),
  KEY `order_userId_idx` (`userId`),
  KEY `order_status_idx` (`status`),
  CONSTRAINT `order_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES ('271fdc77-c89c-47ed-9403-ad347481fd07','ORD-1780129899775',NULL,'Petr Sidorov','+995595189036','piterpatrikk@gmail.com','courier',NULL,'Tbilisi',NULL,NULL,25000.00,0.00,0.00,25000.00,'RUB','pending',NULL,0,'2026-05-30 08:31:39','2026-05-30 08:31:39'),('b71ba467-875c-4e59-8cf0-4775d9568cd8','ORD-1780131219043',NULL,'Petr Sidorov','+995595189036','piterpatrikk@gmail.com','courier',NULL,'Tbilisi',NULL,NULL,145000.00,0.00,0.00,145000.00,'RUB','pending',NULL,0,'2026-05-30 08:53:39','2026-05-30 08:53:39'),('d14bd522-01ce-4dbd-b62a-9672820490d9','ORD-1780130783861',NULL,'Petr Sidorov','+995595189036','piterpatrikk@gmail.com','courier',NULL,'Tbilisi',NULL,NULL,95000.00,0.00,0.00,95000.00,'RUB','pending',NULL,0,'2026-05-30 08:46:23','2026-05-30 08:46:23');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderItem`
--

DROP TABLE IF EXISTS `orderItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderItem` (
  `id` varchar(36) NOT NULL,
  `orderId` varchar(36) NOT NULL,
  `productId` varchar(36) DEFAULT NULL,
  `productName` varchar(500) NOT NULL,
  `productSku` varchar(255) NOT NULL,
  `unitPrice` decimal(12,2) NOT NULL,
  `quantity` int NOT NULL,
  `totalPrice` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderItem_orderId_order_id_fk` (`orderId`),
  KEY `orderItem_productId_product_id_fk` (`productId`),
  CONSTRAINT `orderItem_orderId_order_id_fk` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orderItem_productId_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderItem`
--

LOCK TABLES `orderItem` WRITE;
/*!40000 ALTER TABLE `orderItem` DISABLE KEYS */;
INSERT INTO `orderItem` VALUES ('53eb1721-e194-48dc-becc-bac961f1991c','b71ba467-875c-4e59-8cf0-4775d9568cd8','774babfd-5fd6-48f6-aecb-85bf436208ef','Комплект обвеса LX570 2020+','BODYKIT-0001',145000.00,1,145000.00),('9e5b6a0c-8e2b-4008-8b8b-5a3e120a7ef4','d14bd522-01ce-4dbd-b62a-9672820490d9','c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7','Обвес GX460 Premium','GX460-BODY-0001',95000.00,1,95000.00),('c94d0b01-411a-44a8-96cb-a31b77c40aba','271fdc77-c89c-47ed-9403-ad347481fd07','fc588748-412b-4558-b124-4d61626fa120','Профессиональный монтаж комплектов','INSTALL-SVC-0001',25000.00,1,25000.00);
/*!40000 ALTER TABLE `orderItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` varchar(36) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(500) NOT NULL,
  `description` text,
  `model` varchar(255) DEFAULT NULL,
  `generation` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `categoryId` varchar(36) DEFAULT NULL,
  `condition` enum('new','used','refurbished') NOT NULL DEFAULT 'new',
  `price` decimal(12,2) NOT NULL,
  `compareAtPrice` decimal(12,2) DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'RUB',
  `stockQty` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `weight` decimal(8,3) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `metaTitle` varchar(500) DEFAULT NULL,
  `metaDescription` text,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_sku_unique` (`sku`),
  UNIQUE KEY `product_slug_unique` (`slug`),
  KEY `product_categoryId_idx` (`categoryId`),
  KEY `product_price_idx` (`price`),
  CONSTRAINT `product_categoryId_category_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('107af26d-8113-45e0-a018-aa4e48b408b8','LX570-KIT-0001','restyling-kit-lx570','Комплект рестайлинга LX570 2020+','Полный комплект рестайлинга для Lexus LX570.',NULL,NULL,NULL,'3f42f5e4-09da-48d0-815a-ff91d8f5ed08','new',175000.00,205000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('16e43c63-5c0a-43e4-b637-3b964ef911e3','LC200-KIT-0001','jaos-kit-lc200-2020','Комплект обвеса Jaos LC200 2020+','Оригинальный комплект рестайлинга для LC200 2020+ от Jaos.','Land Cruiser','200','Jaos','3f42f5e4-09da-48d0-815a-ff91d8f5ed08','new',189000.00,220000.00,'RUB',5,1,1,NULL,0,NULL,NULL,'2026-05-24 10:17:16','2026-05-24 10:17:16'),('27dfb02d-4fdf-4a32-9198-47517573b2cf','GX460-BUMP-0001','bumper-front-gx460','Передний бампер GX460','Передний бампер для Lexus GX460.',NULL,NULL,NULL,'73318c9e-d65b-466c-a5f2-4f81f3121808','new',40000.00,50000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('2a84c51e-cabd-4a0b-abae-e768d1658e8b','LC200-STEP-0001','running-boards-lc200','Пороги LC200 OEM-style','Боковые пороги в стиле OEM для Land Cruiser 200.',NULL,NULL,NULL,'fc7aa282-749e-4349-a0b4-b857c23fb2b7','new',28000.00,35000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('423e886a-9b72-42a1-9e11-e0d114042eda','PRADO-STEP-0001','running-boards-prado-150','Пороги Prado 150 ST','Боковые подножки для Land Cruiser Prado 150.',NULL,NULL,NULL,'fc7aa282-749e-4349-a0b4-b857c23fb2b7','new',24000.00,NULL,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-06-03 08:39:44'),('4c15eb7d-2bdc-46c9-8919-2554f52e7291','LC200-OPT-0001','optics-led-lc200','Фары LED LC200 2020+','Светодиодные фары для Land Cruiser 200 2020+.',NULL,NULL,NULL,'46106f13-2eeb-4497-99c5-080a4c3e26d8','new',55000.00,68000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('4d85e7fc-b32d-467b-bca3-9a851cccd34b','LC200-BUMP-0001','bumper-front-lc200','Передний бампер LC200 Sport','Стальной передний бампер для Land Cruiser 200.',NULL,NULL,NULL,'73318c9e-d65b-466c-a5f2-4f81f3121808','new',42000.00,52000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('5b8026d7-8dec-4ae6-a330-96d22a551a32','LX570-BUMP-0001','bumper-front-lx570','Передний бампер LX570 Sport','Спортивный передний бампер для Lexus LX570.',NULL,NULL,NULL,'73318c9e-d65b-466c-a5f2-4f81f3121808','new',46000.00,56000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('5c029db0-8fc6-4009-987e-82fc88274a60','GX460-KIT-0001','restyling-kit-gx460','Комплект рестайлинга GX460','Комплект обновления стиля для Lexus GX460.',NULL,NULL,NULL,'3f42f5e4-09da-48d0-815a-ff91d8f5ed08','new',148000.00,172000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('6dee1137-e043-4e83-aaef-9909dcc8cccc','PATROL-KIT-0001','restyling-kit-patrol-y62','Комплект рестайлинга Patrol Y62 2020+','Ограниченная партия комплектов рестайлинга для Nissan Patrol Y62.','Patrol','Y62','Jaos','3f42f5e4-09da-48d0-815a-ff91d8f5ed08','new',155000.00,180000.00,'RUB',2,1,1,NULL,0,NULL,NULL,'2026-05-24 10:17:16','2026-05-24 10:17:16'),('726c04c1-b711-4ede-817b-4422da0b21e4','PATROL-OPT-0001','optics-led-patrol-y62','Фары LED Patrol Y62','Светодиодные фары для Nissan Patrol Y62.',NULL,NULL,NULL,'46106f13-2eeb-4497-99c5-080a4c3e26d8','new',52000.00,64000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('774babfd-5fd6-48f6-aecb-85bf436208ef','BODYKIT-0001','body-kit-lx570','Комплект обвеса LX570 2020+','Передний и задний бамперы, расширители арок, накладки.','LX','570','Jaos','02f3573a-16a9-4916-b467-dbed71f19c3f','new',145000.00,180000.00,'RUB',3,1,1,NULL,0,NULL,NULL,'2026-05-24 10:17:16','2026-05-24 10:17:16'),('7abab2b8-4a36-4f18-8a41-5a772ea4ff1a','LX570-STEP-0001','running-boards-lx570','Пороги LX570 Premium','Хромированные пороги для Lexus LX570.',NULL,NULL,NULL,'fc7aa282-749e-4349-a0b4-b857c23fb2b7','new',32000.00,40000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('83081407-8a84-41d3-b069-259fd0f67892','PRADO-OPT-0001','optics-led-prado-150','Фары LED Prado 150 2017+','Светодиодные фары для Land Cruiser Prado 150.',NULL,NULL,NULL,'46106f13-2eeb-4497-99c5-080a4c3e26d8','new',48000.00,60000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('896ff826-5534-4aae-b165-ccb6b7ac85d2','PATROL-STEP-0001','running-boards-patrol-y62','Пороги Patrol Y62','Боковые подножки для Nissan Patrol Y62.',NULL,NULL,NULL,'fc7aa282-749e-4349-a0b4-b857c23fb2b7','new',25000.00,32000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('9e76edd8-9027-4f38-8fde-a01b83fdc0aa','GX460-STEP-0001','running-boards-gx460','Пороги GX460','Боковые подножки для Lexus GX460.',NULL,NULL,NULL,'fc7aa282-749e-4349-a0b4-b857c23fb2b7','new',26000.00,33000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('aef9450a-003d-4b99-bea1-23fb92fdaf74','PATROL-BUMP-0001','bumper-front-patrol-y62','Передний бампер Patrol Y62','Передний бампер для Nissan Patrol Y62.',NULL,NULL,NULL,'73318c9e-d65b-466c-a5f2-4f81f3121808','new',39000.00,48000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('b224728d-7577-4a5b-afe1-264963309e48','PRADO-KIT-0001','restyling-kit-prado-150-2023','Комплект рестайлинга Prado 150 2023+','Обновлённый стиль 2023 года для Land Cruiser Prado 150.','Land Cruiser Prado','150','Jaos','3f42f5e4-09da-48d0-815a-ff91d8f5ed08','new',165000.00,190000.00,'RUB',4,1,1,NULL,0,NULL,NULL,'2026-05-24 10:17:16','2026-05-24 10:17:16'),('b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64','PRADO-BUMP-0001','bumper-front-prado-150','Передний бампер Prado 150','Усиленный передний бампер для Land Cruiser Prado 150.',NULL,NULL,NULL,'73318c9e-d65b-466c-a5f2-4f81f3121808','new',38000.00,46000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7','GX460-BODY-0001','body-kit-gx460','Обвес GX460 Premium','Расширители арок и накладки для Lexus GX460.',NULL,NULL,NULL,'02f3573a-16a9-4916-b467-dbed71f19c3f','new',95000.00,115000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('c7a8ee49-0926-406f-b4e3-f4b59d7dfd84','GX460-OPT-0001','optics-led-gx460','Фары LED GX460','Светодиодные фары для Lexus GX460.',NULL,NULL,NULL,'46106f13-2eeb-4497-99c5-080a4c3e26d8','new',50000.00,62000.00,'RUB',10,1,0,NULL,0,NULL,NULL,'2026-05-25 11:55:16','2026-05-25 11:55:16'),('fc588748-412b-4558-b124-4d61626fa120','INSTALL-SVC-0001','installation-service','Профессиональный монтаж комплектов','Услуга профессиональной установки обвесов и комплектов рестайлинга.','','','RoketKRD','357f0154-1cea-4f53-ba7b-bff1b64730df','new',25000.00,30000.00,'RUB',99,1,0,NULL,0,NULL,NULL,'2026-05-24 10:17:16','2026-05-24 10:17:16');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productAttribute`
--

DROP TABLE IF EXISTS `productAttribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productAttribute` (
  `id` varchar(36) NOT NULL,
  `productId` varchar(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productAttribute_productId_product_id_fk` (`productId`),
  CONSTRAINT `productAttribute_productId_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productAttribute`
--

LOCK TABLES `productAttribute` WRITE;
/*!40000 ALTER TABLE `productAttribute` DISABLE KEYS */;
INSERT INTO `productAttribute` VALUES ('1ee2e0b5-8b8d-40dc-8bd1-f1627cadef36','fc588748-412b-4558-b124-4d61626fa120','Тип','Услуга'),('29032895-8d4b-429f-9bb2-ba44ef5f8413','774babfd-5fd6-48f6-aecb-85bf436208ef','Производитель','Jaos'),('76d744c2-cffa-49b2-ae25-5bc6d3d7f1e3','6dee1137-e043-4e83-aaef-9909dcc8cccc','Производитель','Jaos'),('94907bbd-c7eb-45a4-bb61-1da28bd73e35','16e43c63-5c0a-43e4-b637-3b964ef911e3','Производитель','Jaos'),('9e2fe377-f264-4423-83c9-c969d93eb0e1','b224728d-7577-4a5b-afe1-264963309e48','Производитель','Jaos');
/*!40000 ALTER TABLE `productAttribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productCarCompatibility`
--

DROP TABLE IF EXISTS `productCarCompatibility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productCarCompatibility` (
  `productId` varchar(36) NOT NULL,
  `carModelId` varchar(36) NOT NULL,
  PRIMARY KEY (`productId`,`carModelId`),
  KEY `productCarCompatibility_carModelId_carModel_id_fk` (`carModelId`),
  CONSTRAINT `productCarCompatibility_carModelId_carModel_id_fk` FOREIGN KEY (`carModelId`) REFERENCES `carModel` (`id`) ON DELETE CASCADE,
  CONSTRAINT `productCarCompatibility_productId_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productCarCompatibility`
--

LOCK TABLES `productCarCompatibility` WRITE;
/*!40000 ALTER TABLE `productCarCompatibility` DISABLE KEYS */;
INSERT INTO `productCarCompatibility` VALUES ('423e886a-9b72-42a1-9e11-e0d114042eda','2ca98c1d-967e-43b5-8b3b-2412336ee9bb'),('83081407-8a84-41d3-b069-259fd0f67892','2ca98c1d-967e-43b5-8b3b-2412336ee9bb'),('b224728d-7577-4a5b-afe1-264963309e48','2ca98c1d-967e-43b5-8b3b-2412336ee9bb'),('b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64','2ca98c1d-967e-43b5-8b3b-2412336ee9bb'),('27dfb02d-4fdf-4a32-9198-47517573b2cf','32d201de-7f61-4e9a-8756-a2817ecb9373'),('5c029db0-8fc6-4009-987e-82fc88274a60','32d201de-7f61-4e9a-8756-a2817ecb9373'),('9e76edd8-9027-4f38-8fde-a01b83fdc0aa','32d201de-7f61-4e9a-8756-a2817ecb9373'),('c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7','32d201de-7f61-4e9a-8756-a2817ecb9373'),('c7a8ee49-0926-406f-b4e3-f4b59d7dfd84','32d201de-7f61-4e9a-8756-a2817ecb9373'),('16e43c63-5c0a-43e4-b637-3b964ef911e3','8f0c8761-b4a6-45ec-8d93-c0131e836e47'),('2a84c51e-cabd-4a0b-abae-e768d1658e8b','8f0c8761-b4a6-45ec-8d93-c0131e836e47'),('4c15eb7d-2bdc-46c9-8919-2554f52e7291','8f0c8761-b4a6-45ec-8d93-c0131e836e47'),('4d85e7fc-b32d-467b-bca3-9a851cccd34b','8f0c8761-b4a6-45ec-8d93-c0131e836e47'),('6dee1137-e043-4e83-aaef-9909dcc8cccc','ae59f122-e61a-4823-9882-9efb5a0dcc8a'),('726c04c1-b711-4ede-817b-4422da0b21e4','ae59f122-e61a-4823-9882-9efb5a0dcc8a'),('896ff826-5534-4aae-b165-ccb6b7ac85d2','ae59f122-e61a-4823-9882-9efb5a0dcc8a'),('aef9450a-003d-4b99-bea1-23fb92fdaf74','ae59f122-e61a-4823-9882-9efb5a0dcc8a'),('107af26d-8113-45e0-a018-aa4e48b408b8','bbe44af1-af01-4cef-8e7e-679dc72402b6'),('5b8026d7-8dec-4ae6-a330-96d22a551a32','bbe44af1-af01-4cef-8e7e-679dc72402b6'),('774babfd-5fd6-48f6-aecb-85bf436208ef','bbe44af1-af01-4cef-8e7e-679dc72402b6'),('7abab2b8-4a36-4f18-8a41-5a772ea4ff1a','bbe44af1-af01-4cef-8e7e-679dc72402b6');
/*!40000 ALTER TABLE `productCarCompatibility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productImage`
--

DROP TABLE IF EXISTS `productImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productImage` (
  `id` varchar(36) NOT NULL,
  `productId` varchar(36) NOT NULL,
  `url` text,
  `altText` varchar(500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `isPrimary` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `productImage_productId_product_id_fk` (`productId`),
  CONSTRAINT `productImage_productId_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productImage`
--

LOCK TABLES `productImage` WRITE;
/*!40000 ALTER TABLE `productImage` DISABLE KEYS */;
INSERT INTO `productImage` VALUES ('020f75ab-52e2-4d97-9dfb-47da99cf1d2d','6dee1137-e043-4e83-aaef-9909dcc8cccc','Frame83.png',NULL,5,0),('02c67d85-a410-4ea7-8a37-d189ab21b395','5b8026d7-8dec-4ae6-a330-96d22a551a32','Frame82.png',NULL,2,0),('03c9a6e6-3c62-49d7-bfee-7b49e5fdf0b6','b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64','Frame82.png',NULL,0,1),('0558a5b1-20d5-49c9-87dc-2fda8aaf8f2b','6dee1137-e043-4e83-aaef-9909dcc8cccc','Frame83.png',NULL,0,1),('066f41ef-bd7a-43d3-b7ec-d5eb457ac1e4','c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7','Frame79.png',NULL,4,0),('06bf0a07-36e5-46cf-9b1e-837b87869f5f','b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64','Frame81.png',NULL,4,0),('0d076ff7-f3ae-44b7-9345-2702e8c65963','2a84c51e-cabd-4a0b-abae-e768d1658e8b','Frame80.png',NULL,0,1),('0fc1abc7-3ac9-4955-aae4-04cf48f5f144','c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7','Frame80.png',NULL,0,1),('11a51f9e-75ed-40b2-b3aa-1c706c874382','4c15eb7d-2bdc-46c9-8919-2554f52e7291','Frame83.png',NULL,2,0),('13df1a98-a8dd-4285-a4fa-bab3a9e7d9ad','107af26d-8113-45e0-a018-aa4e48b408b8','Frame83.png',NULL,0,1),('15a56efa-b782-4c9e-bc77-abc556010c40','6dee1137-e043-4e83-aaef-9909dcc8cccc','Frame81.png',NULL,3,0),('15a9d46d-ab94-47fe-89c2-aedc971e5e3f','774babfd-5fd6-48f6-aecb-85bf436208ef','Frame82.png',NULL,1,0),('1a163f99-f4a6-42b4-b99b-53ccfb9bdd92','7abab2b8-4a36-4f18-8a41-5a772ea4ff1a','Frame83.png',NULL,2,0),('1be6fef0-4f23-401d-9c27-2aa148bc0104','896ff826-5534-4aae-b165-ccb6b7ac85d2','Frame81.png',NULL,1,0),('1c5d2a8c-0b00-4374-8019-cf7fb0a2c3f5','5c029db0-8fc6-4009-987e-82fc88274a60','Frame80.png',NULL,1,0),('1de060a3-12fe-43b5-bc1b-dde99ace9182','b224728d-7577-4a5b-afe1-264963309e48','Frame81.png',NULL,4,0),('20b93643-5152-46b5-aef6-d35fd92f3c86','b224728d-7577-4a5b-afe1-264963309e48','Frame82.png',NULL,0,1),('25e71bc4-e8fb-4497-8bc8-0be653f02fbc','726c04c1-b711-4ede-817b-4422da0b21e4','Frame83.png',NULL,2,0),('260d7842-8106-46b0-82f7-997f60f57b5a','726c04c1-b711-4ede-817b-4422da0b21e4','Frame81.png',NULL,0,1),('26136e57-f4af-47f3-9f14-e2214dd290b8','774babfd-5fd6-48f6-aecb-85bf436208ef','Frame81.png',NULL,0,1),('270e81c2-b98b-4d1b-b362-2bc23e34e52a','774babfd-5fd6-48f6-aecb-85bf436208ef','Frame81.png',NULL,5,0),('2934db8a-41ef-47ad-ab9c-c5726bfb97d1','aef9450a-003d-4b99-bea1-23fb92fdaf74','Frame80.png',NULL,1,0),('2de88625-b78d-493c-9876-4183f6571f7b','5c029db0-8fc6-4009-987e-82fc88274a60','Frame83.png',NULL,4,0),('30f6a16e-0103-4b15-8b9a-3f5a8e98febd','16e43c63-5c0a-43e4-b637-3b964ef911e3','Frame81.png',NULL,2,0),('315c2eb6-3504-4b2c-b322-42476bc105e0','16e43c63-5c0a-43e4-b637-3b964ef911e3','Frame80.png',NULL,1,0),('32d53c2f-7d60-449f-aa7b-99dae82d7c92','423e886a-9b72-42a1-9e11-e0d114042eda','Frame83.png',NULL,0,1),('32de8ecd-1818-4f26-901c-82c04b5d553c','b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64','Frame80.png',NULL,3,0),('36943f05-6390-4e1c-a986-fec6dde327c2','4c15eb7d-2bdc-46c9-8919-2554f52e7291','Frame80.png',NULL,4,0),('36961990-1dc4-4d17-a7d9-7b8f5735bb9f','5b8026d7-8dec-4ae6-a330-96d22a551a32','Frame79.png',NULL,4,0),('3ca52fa7-435b-4fd6-a790-e1914cc6a50d','6dee1137-e043-4e83-aaef-9909dcc8cccc','Frame82.png',NULL,4,0),('3f14ca44-8b7b-49f7-87f4-f36601f35c23','5b8026d7-8dec-4ae6-a330-96d22a551a32','Frame83.png',NULL,3,0),('3f5d6ff0-c43e-4a4c-af5c-51f2ca958a4a','b224728d-7577-4a5b-afe1-264963309e48','Frame83.png',NULL,1,0),('40e74d0b-01b0-4f1e-a95a-3a87972b62c0','27dfb02d-4fdf-4a32-9198-47517573b2cf','Frame82.png',NULL,1,0),('4245fdb7-f5e0-4ff3-92a4-c0c891f3dd28','16e43c63-5c0a-43e4-b637-3b964ef911e3','Frame79.png',NULL,5,0),('4254f2a8-4964-45f2-8d51-8fa7b1865567','16e43c63-5c0a-43e4-b637-3b964ef911e3','Frame82.png',NULL,3,0),('443e078a-29b5-494a-8c64-cbdad08a6935','107af26d-8113-45e0-a018-aa4e48b408b8','Frame80.png',NULL,2,0),('46030dc1-6073-47db-af01-75760635727e','16e43c63-5c0a-43e4-b637-3b964ef911e3','Frame83.png',NULL,4,0),('4608d9fa-5e83-468e-a4c6-fbeaa5285ddf','4c15eb7d-2bdc-46c9-8919-2554f52e7291','Frame81.png',NULL,0,1),('4a843a88-3908-4d96-94d4-8ae5b7321c4e','aef9450a-003d-4b99-bea1-23fb92fdaf74','Frame83.png',NULL,4,0),('4cec4650-9f6a-4f89-acf5-c85685532c56','c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7','Frame81.png',NULL,1,0),('4d2954b4-6a87-4955-8f24-76b1b908c436','aef9450a-003d-4b99-bea1-23fb92fdaf74','Frame82.png',NULL,3,0),('51896991-c210-4648-a008-ac6eb363330e','b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64','Frame83.png',NULL,1,0),('51c20e12-fdec-4843-9781-49d0436b0dbb','c7a8ee49-0926-406f-b4e3-f4b59d7dfd84','Frame83.png',NULL,0,1),('532067b9-ebdd-41a4-8ea5-0236738a21e6','16e43c63-5c0a-43e4-b637-3b964ef911e3','Frame79.png',NULL,0,1),('58605ffa-36e0-4e2c-9a76-ae7245ccd62a','83081407-8a84-41d3-b069-259fd0f67892','Frame81.png',NULL,2,0),('588ded0b-16ee-45b9-93d0-2982c266cfa4','fc588748-412b-4558-b124-4d61626fa120','Frame82.png',NULL,2,0),('5cd85603-6570-4810-8df8-34c6f764e90f','7abab2b8-4a36-4f18-8a41-5a772ea4ff1a','Frame82.png',NULL,1,0),('5e489874-8b90-45f4-a543-f34304ef497b','9e76edd8-9027-4f38-8fde-a01b83fdc0aa','Frame82.png',NULL,0,1),('61c87647-0864-4709-8847-47760e683cfc','c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7','Frame83.png',NULL,3,0),('64db53d1-38d8-4802-9893-b5a780d69075','5c029db0-8fc6-4009-987e-82fc88274a60','Frame79.png',NULL,0,1),('6504b060-6ecd-44e0-9f4f-f9fdf91bd26b','107af26d-8113-45e0-a018-aa4e48b408b8','Frame79.png',NULL,1,0),('66074040-1713-4b51-b484-13a838e8a0f0','b224728d-7577-4a5b-afe1-264963309e48','Frame79.png',NULL,2,0),('6f90ee4a-f3aa-47f8-a20d-34f49ba630ea','83081407-8a84-41d3-b069-259fd0f67892','Frame80.png',NULL,1,0),('71cf8287-4c3f-4a3d-920b-9951d5cee765','27dfb02d-4fdf-4a32-9198-47517573b2cf','Frame81.png',NULL,0,1),('7379ce0e-9f67-41bb-bb3d-8824a43558c1','5c029db0-8fc6-4009-987e-82fc88274a60','Frame82.png',NULL,3,0),('764082d1-472a-4da8-a82e-fbcee15480e8','4c15eb7d-2bdc-46c9-8919-2554f52e7291','Frame79.png',NULL,3,0),('76bcaf14-0100-41a0-9467-585db0b4d127','c7a8ee49-0926-406f-b4e3-f4b59d7dfd84','Frame79.png',NULL,1,0),('7a232e27-8857-408d-b7e9-4006d5337c75','7abab2b8-4a36-4f18-8a41-5a772ea4ff1a','Frame81.png',NULL,0,1),('7a72e4b9-e40c-4d90-ab8a-7a34d4085187','107af26d-8113-45e0-a018-aa4e48b408b8','Frame82.png',NULL,4,0),('7bb73af4-1da7-4dd8-99c9-21e07770358c','83081407-8a84-41d3-b069-259fd0f67892','Frame79.png',NULL,0,1),('7c4db645-9253-4795-94c1-402bc3a9d52d','896ff826-5534-4aae-b165-ccb6b7ac85d2','Frame83.png',NULL,3,0),('7c622833-044e-46c9-bc62-efd02ad79325','896ff826-5534-4aae-b165-ccb6b7ac85d2','Frame80.png',NULL,0,1),('7d98fe44-965d-4a4d-8aa1-848874275eaa','fc588748-412b-4558-b124-4d61626fa120','Frame79.png',NULL,4,0),('7ebe0c78-d488-4a88-82d1-3f09b9ba9d9a','774babfd-5fd6-48f6-aecb-85bf436208ef','Frame80.png',NULL,4,0),('804f8cc7-0f6b-4c5c-a487-229d6b3695d7','fc588748-412b-4558-b124-4d61626fa120','Frame80.png',NULL,0,1),('8188b459-df31-4ec1-874c-1b8e2b5a7000','5b8026d7-8dec-4ae6-a330-96d22a551a32','Frame81.png',NULL,1,0),('83f7ded8-686a-4e0f-8727-4b6a4dc4fcee','83081407-8a84-41d3-b069-259fd0f67892','Frame83.png',NULL,4,0),('86f6260b-6f93-4cb9-b016-06e208d74a13','83081407-8a84-41d3-b069-259fd0f67892','Frame82.png',NULL,3,0),('87ee0683-5768-4755-99be-c46cdc1cb33f','aef9450a-003d-4b99-bea1-23fb92fdaf74','Frame79.png',NULL,0,1),('88185ea8-b81a-41c6-bb03-c9bfa4d0abfd','9e76edd8-9027-4f38-8fde-a01b83fdc0aa','Frame81.png',NULL,4,0),('89cdffe1-441d-4700-9905-d618366095af','2a84c51e-cabd-4a0b-abae-e768d1658e8b','Frame83.png',NULL,3,0),('8c97bf1f-a664-4bfd-8ac8-9a97a208506c','7abab2b8-4a36-4f18-8a41-5a772ea4ff1a','Frame79.png',NULL,3,0),('8d601d6d-8314-41d0-8999-e829dab23d6e','c7a8ee49-0926-406f-b4e3-f4b59d7dfd84','Frame80.png',NULL,2,0),('8ea2a261-c931-4578-9cd3-71f5c4eb95e0','9e76edd8-9027-4f38-8fde-a01b83fdc0aa','Frame83.png',NULL,1,0),('8f452bcd-847d-48cd-b6ff-fffb16f3cb72','c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7','Frame82.png',NULL,2,0),('920100a2-53f4-4cbd-87f8-5b07b92316c2','4d85e7fc-b32d-467b-bca3-9a851cccd34b','Frame83.png',NULL,4,0),('93663b2d-18be-48dc-9c44-7e534b847939','b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64','Frame79.png',NULL,2,0),('93eb6a96-cdc7-4870-a337-35e795ea40fc','896ff826-5534-4aae-b165-ccb6b7ac85d2','Frame82.png',NULL,2,0),('96a6b414-91fe-446d-a03e-c520612f2cb0','c7a8ee49-0926-406f-b4e3-f4b59d7dfd84','Frame81.png',NULL,3,0),('99cc7626-f6a9-4115-9a1f-0526b701a82c','27dfb02d-4fdf-4a32-9198-47517573b2cf','Frame79.png',NULL,3,0),('9c2a22d5-015a-4973-a507-fcd60db486cd','7abab2b8-4a36-4f18-8a41-5a772ea4ff1a','Frame80.png',NULL,4,0),('a2787f32-7d02-45d0-bdb6-3d053f1d1ca1','4c15eb7d-2bdc-46c9-8919-2554f52e7291','Frame82.png',NULL,1,0),('a7375ebe-88f3-44b2-9807-9839a6a33c39','2a84c51e-cabd-4a0b-abae-e768d1658e8b','Frame79.png',NULL,4,0),('a9db2668-0001-4721-baf9-925858171337','423e886a-9b72-42a1-9e11-e0d114042eda','Frame82.png',NULL,4,0),('acb0aae7-24c8-47bf-befd-3244e06f45d7','fc588748-412b-4558-b124-4d61626fa120','Frame81.png',NULL,1,0),('af3a6652-02ca-4e6c-8be8-562bd51fc5ae','fc588748-412b-4558-b124-4d61626fa120','Frame83.png',NULL,3,0),('b02ddb18-5c48-4466-aa4b-7b26c52b6d46','423e886a-9b72-42a1-9e11-e0d114042eda','Frame80.png',NULL,2,0),('b1f77747-5c7f-432d-916e-307f373596cf','27dfb02d-4fdf-4a32-9198-47517573b2cf','Frame80.png',NULL,4,0),('b2f87b77-d37c-4acc-a6e6-0047d9b17b25','896ff826-5534-4aae-b165-ccb6b7ac85d2','Frame79.png',NULL,4,0),('b4d0390a-1737-48fd-be70-06a49412f198','fc588748-412b-4558-b124-4d61626fa120','Frame80.png',NULL,5,0),('b58d4690-e124-4c98-b1cb-5cb825ad0918','4d85e7fc-b32d-467b-bca3-9a851cccd34b','Frame81.png',NULL,2,0),('b8605671-c58e-491a-af65-030881b0a6d3','4d85e7fc-b32d-467b-bca3-9a851cccd34b','Frame79.png',NULL,0,1),('ba3d1d00-03bc-4907-bd3c-37ccfaf563d4','107af26d-8113-45e0-a018-aa4e48b408b8','Frame81.png',NULL,3,0),('bcff2a36-cab6-4f5d-9b96-179fb9cc1a41','774babfd-5fd6-48f6-aecb-85bf436208ef','Frame83.png',NULL,2,0),('bdeed74d-b499-482d-be59-fd88b10c5277','6dee1137-e043-4e83-aaef-9909dcc8cccc','Frame80.png',NULL,2,0),('c029c7d2-9ad6-4105-b208-279e9cfdead9','c7a8ee49-0926-406f-b4e3-f4b59d7dfd84','Frame82.png',NULL,4,0),('c0b3dead-9a91-4947-8b01-d3b2265148d2','4d85e7fc-b32d-467b-bca3-9a851cccd34b','Frame80.png',NULL,1,0),('c2f18fe1-b190-4aff-8002-bdff80c9e418','6dee1137-e043-4e83-aaef-9909dcc8cccc','Frame79.png',NULL,1,0),('c3984203-8d38-4d84-9fdd-3e2c0b0e83ab','b224728d-7577-4a5b-afe1-264963309e48','Frame80.png',NULL,3,0),('c6cf9431-9c40-49e5-a18f-8962d70dc999','423e886a-9b72-42a1-9e11-e0d114042eda','Frame81.png',NULL,3,0),('d192dbfb-91fa-4730-93bc-c15ea2bdc0e8','726c04c1-b711-4ede-817b-4422da0b21e4','Frame80.png',NULL,4,0),('d64e554f-eda2-46f0-9419-3b600e215fbd','9e76edd8-9027-4f38-8fde-a01b83fdc0aa','Frame79.png',NULL,2,0),('d9db49a2-784a-4622-892f-1abec8024755','4d85e7fc-b32d-467b-bca3-9a851cccd34b','Frame82.png',NULL,3,0),('e104fedd-c355-4242-8861-7e9ebafca34c','2a84c51e-cabd-4a0b-abae-e768d1658e8b','Frame81.png',NULL,1,0),('e2c4c515-29bf-43fb-9784-2f7d20b23104','9e76edd8-9027-4f38-8fde-a01b83fdc0aa','Frame80.png',NULL,3,0),('e6a484ca-0a0f-4ecd-b3b4-e8c38b9c2485','774babfd-5fd6-48f6-aecb-85bf436208ef','Frame79.png',NULL,3,0),('e7fe75e3-d8eb-4cae-8655-e0fec264406e','5b8026d7-8dec-4ae6-a330-96d22a551a32','Frame80.png',NULL,0,1),('e9c74436-ef44-4dba-89f1-458fef4b9efe','726c04c1-b711-4ede-817b-4422da0b21e4','Frame79.png',NULL,3,0),('eaa084a6-ca87-4be6-ab98-6454678cde18','27dfb02d-4fdf-4a32-9198-47517573b2cf','Frame83.png',NULL,2,0),('eb5f8136-59aa-498d-aee3-9d45ab09486d','726c04c1-b711-4ede-817b-4422da0b21e4','Frame82.png',NULL,1,0),('f1b92184-36f2-4d00-a432-575d00fbd8d1','5c029db0-8fc6-4009-987e-82fc88274a60','Frame81.png',NULL,2,0),('f43cc07f-d00f-4463-ada2-3d93f75baa51','b224728d-7577-4a5b-afe1-264963309e48','Frame82.png',NULL,5,0),('f6c57da5-4319-435a-bf7d-4523a354fc99','aef9450a-003d-4b99-bea1-23fb92fdaf74','Frame81.png',NULL,2,0),('fc7826e7-4998-4b4e-8cd8-f79ed6d96c8c','2a84c51e-cabd-4a0b-abae-e768d1658e8b','Frame82.png',NULL,2,0),('fd63b18d-adcf-48e5-8d9d-e29df5db1f98','423e886a-9b72-42a1-9e11-e0d114042eda','Frame79.png',NULL,1,0);
/*!40000 ALTER TABLE `productImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productPromotion`
--

DROP TABLE IF EXISTS `productPromotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productPromotion` (
  `productId` varchar(36) NOT NULL,
  `promotionId` varchar(36) NOT NULL,
  PRIMARY KEY (`productId`,`promotionId`),
  KEY `productPromotion_promotionId_promotion_id_fk` (`promotionId`),
  CONSTRAINT `productPromotion_productId_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  CONSTRAINT `productPromotion_promotionId_promotion_id_fk` FOREIGN KEY (`promotionId`) REFERENCES `promotion` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productPromotion`
--

LOCK TABLES `productPromotion` WRITE;
/*!40000 ALTER TABLE `productPromotion` DISABLE KEYS */;
INSERT INTO `productPromotion` VALUES ('b224728d-7577-4a5b-afe1-264963309e48','24a31582-006f-4abb-9e87-39d3e944f19e'),('6dee1137-e043-4e83-aaef-9909dcc8cccc','7e94dab8-541f-42db-9786-0bbfb0896918'),('fc588748-412b-4558-b124-4d61626fa120','8c2ac191-5ac4-4c89-bd0e-5942d7211253'),('16e43c63-5c0a-43e4-b637-3b964ef911e3','95b7abee-96d7-4caa-9188-5086a32a8646'),('b224728d-7577-4a5b-afe1-264963309e48','c207b7dc-59b2-11f1-be2e-0242ac120002'),('774babfd-5fd6-48f6-aecb-85bf436208ef','dd59e68b-0b6b-4f39-b2a6-48273eac68ca');
/*!40000 ALTER TABLE `productPromotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productTag`
--

DROP TABLE IF EXISTS `productTag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productTag` (
  `productId` varchar(36) NOT NULL,
  `tagId` varchar(36) NOT NULL,
  PRIMARY KEY (`productId`,`tagId`),
  KEY `productTag_tagId_tag_id_fk` (`tagId`),
  CONSTRAINT `productTag_productId_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  CONSTRAINT `productTag_tagId_tag_id_fk` FOREIGN KEY (`tagId`) REFERENCES `tag` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productTag`
--

LOCK TABLES `productTag` WRITE;
/*!40000 ALTER TABLE `productTag` DISABLE KEYS */;
INSERT INTO `productTag` VALUES ('fc588748-412b-4558-b124-4d61626fa120','0c57407b-8249-4c56-bd5a-2106ad2f0df9'),('6dee1137-e043-4e83-aaef-9909dcc8cccc','28819c07-9064-4a5b-8d73-64cbd6b27f00'),('6dee1137-e043-4e83-aaef-9909dcc8cccc','60a5a576-8f4c-4d5d-a8a7-1ea07dce30de'),('b224728d-7577-4a5b-afe1-264963309e48','7d63a8d5-9394-410f-88ce-960f62ac5349'),('16e43c63-5c0a-43e4-b637-3b964ef911e3','c3cc22c5-7964-463b-81dd-9063ba4096da'),('774babfd-5fd6-48f6-aecb-85bf436208ef','ca6e9267-59ef-4996-8ef3-e511577c5e27'),('16e43c63-5c0a-43e4-b637-3b964ef911e3','d395c88f-ef32-4af9-ae5d-e65f9bd35ce9'),('774babfd-5fd6-48f6-aecb-85bf436208ef','d395c88f-ef32-4af9-ae5d-e65f9bd35ce9'),('b224728d-7577-4a5b-afe1-264963309e48','d395c88f-ef32-4af9-ae5d-e65f9bd35ce9');
/*!40000 ALTER TABLE `productTag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `id` varchar(36) NOT NULL,
  `title` varchar(500) NOT NULL,
  `placement` enum('home') DEFAULT NULL,
  `description` text,
  `imageUrl` text NOT NULL,
  `discountPercent` decimal(5,2) DEFAULT NULL,
  `discountAmount` decimal(12,2) DEFAULT NULL,
  `startsAt` timestamp NULL DEFAULT NULL,
  `endsAt` timestamp NULL DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES ('24a31582-006f-4abb-9e87-39d3e944f19e','Скидка на комплект рестайлинга Prado 150','home','Обновлённый стиль 2023 года по специальной цене.','Frame82.png',NULL,25000.00,'2026-05-24 11:31:10','2026-08-22 11:31:10',1,'2026-05-24 11:31:10','2026-05-24 11:31:10'),('7e94dab8-541f-42db-9786-0bbfb0896918','Установка по выгодной цене','home','Профессиональный монтаж комплектов со сниженной стоимостью.','Frame80.png',NULL,25000.00,'2026-05-24 11:31:10','2026-08-22 11:31:10',1,'2026-05-24 11:31:10','2026-05-26 23:49:17'),('8c2ac191-5ac4-4c89-bd0e-5942d7211253','Комплект Patrol Y62 — лучшая цена','home','Ограниченная партия комплектов рестайлинга Patrol Y62.','Frame83.png',NULL,25000.00,'2026-05-24 11:31:10','2026-08-22 11:31:10',1,'2026-05-24 11:31:10','2026-05-24 11:31:10'),('95b7abee-96d7-4caa-9188-5086a32a8646','Скидка на комплект рестайлинга LC200','home','Оригинальный комплект 2020+. Специальная цена на ограниченное количество.','Frame79.png',NULL,31000.00,'2026-05-24 11:31:10','2026-08-22 11:31:10',1,'2026-05-24 11:31:10','2026-05-24 11:31:10'),('c207b7dc-59b2-11f1-be2e-0242ac120002','Скидка на комплект рестайлинга Prado 150','home','Обновлённый стиль 2023 года по специальной цене.','Frame82.png',NULL,25000.00,'2026-05-24 11:31:10','2026-08-22 11:31:10',1,'2026-05-27 09:59:31','2026-05-27 09:59:31'),('dd59e68b-0b6b-4f39-b2a6-48273eac68ca','Специальная цена на обвесы','home','Передние и задние бамперы, расширители арок, накладки и комплектующие.','Frame81.png',20.00,NULL,'2026-05-24 11:31:10','2026-08-22 11:31:10',1,'2026-05-24 11:31:10','2026-05-24 11:31:10');
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `productId` varchar(36) DEFAULT NULL,
  `orderId` varchar(36) DEFAULT NULL,
  `authorName` varchar(255) NOT NULL,
  `rating` int NOT NULL,
  `body` text,
  `isVerifiedPurchase` tinyint(1) NOT NULL DEFAULT '0',
  `isPublished` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `review_userId_user_id_fk` (`userId`),
  KEY `review_orderId_order_id_fk` (`orderId`),
  KEY `review_productId_idx` (`productId`),
  CONSTRAINT `review_orderId_order_id_fk` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE SET NULL,
  CONSTRAINT `review_productId_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  CONSTRAINT `review_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES ('3ed3eb72-3fb8-4877-91b3-dd109dddd0f5',NULL,'d12a10fc-bb42-458c-9a69-e2110255f3f9',NULL,'Виталий',4,'Редкий комплект, вживую смотрится ещё лучше.',1,1,'2026-05-21 04:24:19','2026-05-21 04:24:19'),('68696635-2e1e-4465-8859-11844d53d5ee',NULL,'b6fc0da5-f8bd-48a7-ac93-311c2e3110da',NULL,'Антон',5,'Очень доволен качеством деталей и упаковкой.',1,1,'2026-05-21 04:24:19','2026-05-21 04:24:19'),('946a37ed-802b-4282-8f01-abc77051e952',NULL,'54eb58f0-8391-4ba2-bfce-dc30320d1af2',NULL,'Максим',5,'Установили быстро и аккуратно. Рекомендую сервис.',1,1,'2026-05-21 04:24:19','2026-05-21 04:24:19'),('9ae50b3d-88e4-4a43-a8e3-e53e5ab7a25e',NULL,'eea20de1-29e8-42b7-8350-22b4b52d351e',NULL,'Александр',5,'Отличное качество. Всё встало без доработок, внешний вид просто топ.',1,1,'2026-05-21 04:24:19','2026-05-21 04:24:19'),('ab5b495f-eb2f-4a52-a65d-8eeef3fb972b',NULL,'75ef9403-6645-420d-b8c2-781b0faa6e8b',NULL,'Дмитрий',5,'Материалы качественные, покраска отличная.',1,1,'2026-05-21 04:24:19','2026-05-21 04:24:19'),('cadf847b-df84-45b6-b6ea-d43997df9a55',NULL,'75ef9403-6645-420d-b8c2-781b0faa6e8b',NULL,'Руслан',4,'Выглядит очень дорого после установки.',0,1,'2026-05-21 04:24:19','2026-05-21 04:24:19'),('e26f7026-f158-4add-b285-038b073816b2',NULL,'d12a10fc-bb42-458c-9a69-e2110255f3f9',NULL,'Артур',5,'Отличный сервис и хорошая консультация перед покупкой.',0,1,'2026-05-21 04:24:19','2026-05-21 04:24:19'),('ee51472a-efde-4b8a-b495-b486322f8656',NULL,'b6fc0da5-f8bd-48a7-ac93-311c2e3110da',NULL,'Сергей',5,'Prado стал выглядеть намного современнее.',1,1,'2026-05-21 04:24:19','2026-05-21 04:24:19');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` varchar(255) NOT NULL,
  `expiresAt` timestamp NOT NULL,
  `token` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `ipAddress` varchar(100) DEFAULT NULL,
  `userAgent` text,
  `userId` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token_unique` (`token`),
  KEY `session_userId_user_id_fk` (`userId`),
  CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES ('09eSw0lMbDd5UwTw9OmUqPpZ7veBIfu4','2026-05-28 17:19:02','qVI3X9By13A5c8pGNiYDElOo3BbGaa3N','2026-05-21 17:19:02','2026-05-21 17:19:02','0000:0000:0000:0000:0000:0000:0000:0000','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','SZlBtgQk8qkwcngprQ1qKN3xff78WOZu'),('eMg2QtR24FxX7OY8Sw8VItkYBJavNVEN','2026-06-03 10:30:53','pS7soXVnUuVZm6yNUuCBSz7MEYuZ02QE','2026-05-27 10:30:53','2026-05-27 10:30:53','0000:0000:0000:0000:0000:0000:0000:0000','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','NR35nI3bYAjyy1VCuxaVGtPwyNvUhJh9'),('jQrWmmxXa30krGgaGMS2aG5BOtfD8krk','2026-06-03 10:31:04','FPZCBP4BEAsBK6wgINPnEqCMeNsBdPds','2026-05-27 10:31:04','2026-05-27 10:31:04','0000:0000:0000:0000:0000:0000:0000:0000','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','NR35nI3bYAjyy1VCuxaVGtPwyNvUhJh9');
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_name_unique` (`name`),
  UNIQUE KEY `tag_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES ('0c57407b-8249-4c56-bd5a-2106ad2f0df9','OEM аксессуары','oem-accessories','2026-05-24 10:10:31'),('28819c07-9064-4a5b-8d73-64cbd6b27f00','Интерьер','interior','2026-05-24 10:10:31'),('60a5a576-8f4c-4d5d-a8a7-1ea07dce30de','Performance элементы','performance','2026-05-24 10:10:31'),('7d63a8d5-9394-410f-88ce-960f62ac5349','Защита','protection','2026-05-24 10:10:31'),('c3cc22c5-7964-463b-81dd-9063ba4096da','Карбон','carbon','2026-05-24 10:10:31'),('ca6e9267-59ef-4996-8ef3-e511577c5e27','Хром / Black Style','chrome-black-style','2026-05-24 10:10:31'),('d395c88f-ef32-4af9-ae5d-e65f9bd35ce9','Внешний тюнинг','exterior-tuning','2026-05-24 10:10:31');
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `display_username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `emailVerified` tinyint(1) NOT NULL,
  `image` text,
  `role` varchar(50) DEFAULT 'member',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `banned` tinyint(1) DEFAULT '0',
  `ban_reason` text,
  `ban_expires` timestamp NULL DEFAULT NULL,
  `is_anonymous` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique` (`email`),
  UNIQUE KEY `user_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('NR35nI3bYAjyy1VCuxaVGtPwyNvUhJh9','Petr Sidorov','roket','roket','peter.sidorov.dev@gmail.com',0,NULL,'user','2026-05-27 10:30:53','2026-05-27 10:30:53',0,NULL,NULL,0),('SZlBtgQk8qkwcngprQ1qKN3xff78WOZu','Petr Sidorov','pitas','pitas','piterpatrikk@gmail.com',0,NULL,'user','2026-05-21 17:19:02','2026-05-21 17:19:02',0,NULL,NULL,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification`
--

DROP TABLE IF EXISTS `verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification` (
  `id` varchar(255) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `expiresAt` timestamp NOT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification`
--

LOCK TABLES `verification` WRITE;
/*!40000 ALTER TABLE `verification` DISABLE KEYS */;
/*!40000 ALTER TABLE `verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video`
--

DROP TABLE IF EXISTS `video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video` (
  `id` varchar(36) NOT NULL,
  `productId` varchar(36) DEFAULT NULL,
  `url` text,
  `altText` varchar(500) DEFAULT NULL,
  `placeholderUrl` text,
  `sortOrder` int NOT NULL DEFAULT '0',
  `isPrimary` tinyint(1) NOT NULL DEFAULT '0',
  `carModelId` varchar(36) DEFAULT NULL,
  `sourceType` enum('local','youtube','vkvideo','rutube') NOT NULL DEFAULT 'local',
  `videoId` varchar(255) DEFAULT NULL,
  `ownerId` varchar(64) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `title` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `video_carModelId_carModel_id_fk` (`carModelId`),
  KEY `video_productId_product_id_fk` (`productId`),
  KEY `video_productId_idx` (`productId`),
  KEY `video_carModelId_idx` (`carModelId`),
  KEY `video_sourceType_idx` (`sourceType`),
  CONSTRAINT `video_carModelId_carModel_id_fk` FOREIGN KEY (`carModelId`) REFERENCES `carModel` (`id`) ON DELETE CASCADE,
  CONSTRAINT `video_productId_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video`
--

LOCK TABLES `video` WRITE;
/*!40000 ALTER TABLE `video` DISABLE KEYS */;
INSERT INTO `video` VALUES ('04b01c8a-3de3-447c-a04c-b3956c87b745','c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('05494f00-033e-4250-86a2-fa3627122069','5b8026d7-8dec-4ae6-a330-96d22a551a32',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('096c4940-f2ac-43eb-b68e-9c2a17b9f82a','423e886a-9b72-42a1-9e11-e0d114042eda',NULL,NULL,NULL,0,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('0d22fb84-337a-4200-aaf7-2d54fa78a2bd',NULL,'1.mp4',NULL,NULL,0,1,'8f0c8761-b4a6-45ec-8d93-c0131e836e47','local',NULL,NULL,NULL,NULL),('113d7f5d-9806-4d01-9346-55dcfd746410','b224728d-7577-4a5b-afe1-264963309e48',NULL,NULL,NULL,5,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('11565188-36f0-4dd0-91cb-75ef339884e7','896ff826-5534-4aae-b165-ccb6b7ac85d2',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('119742ad-9d97-484e-8c89-d77a37f87df6','774babfd-5fd6-48f6-aecb-85bf436208ef',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('13681be0-2ec1-4d08-86c7-cdb4fb4f0061','c7a8ee49-0926-406f-b4e3-f4b59d7dfd84',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('161df652-1e27-42fe-bd7b-8ff0f592614c','4d85e7fc-b32d-467b-bca3-9a851cccd34b',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('164353d0-8d32-4c7a-bdd7-149a75ee2441','107af26d-8113-45e0-a018-aa4e48b408b8',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('171baea8-f42a-4093-922f-eeb3ee530afb','5c029db0-8fc6-4009-987e-82fc88274a60',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('17310f52-680e-4607-9dc5-f1f05e4849a3','27dfb02d-4fdf-4a32-9198-47517573b2cf',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('17d06c51-dedf-4c1e-a0c2-4915533685b6','6dee1137-e043-4e83-aaef-9909dcc8cccc',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('1baead38-86ee-4857-91a7-fbfc7e84cf99',NULL,'7.mp4',NULL,NULL,0,1,'be9a150b-edbd-4cf2-9ed4-3f18f99963d3','local',NULL,NULL,NULL,NULL),('1d2a0c02-53f5-42fb-ab6a-2fcadac5a6a7','fc588748-412b-4558-b124-4d61626fa120',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('1d9485c3-fb7b-4e29-addf-59ba673ad502','5c029db0-8fc6-4009-987e-82fc88274a60',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('229e3e12-4984-492b-a1da-a431d9b65ecb','774babfd-5fd6-48f6-aecb-85bf436208ef',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('23a8ab78-2333-404e-a747-3408b4082ae5','16e43c63-5c0a-43e4-b637-3b964ef911e3',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('23cdd015-a003-4e59-99fe-67a6a4dc6449','7abab2b8-4a36-4f18-8a41-5a772ea4ff1a',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('23e91fd5-0549-47a9-bc73-f001b39f6aed','5c029db0-8fc6-4009-987e-82fc88274a60',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('2450dbb8-5479-4744-a093-03bc94624b53','b224728d-7577-4a5b-afe1-264963309e48',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('26e91bd4-cc97-4da3-a298-0d61e0985fb1','c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('2ab7086c-5754-4496-959f-ae1ec2717a56','7abab2b8-4a36-4f18-8a41-5a772ea4ff1a',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('2aff1adb-4f7c-4df2-a746-37d7b3a29466',NULL,NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('2b56f5bb-2091-4203-b8b1-4d18f0c0a6ed','c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('2bdb7602-0bcd-4758-8ff4-68035caa037e','9e76edd8-9027-4f38-8fde-a01b83fdc0aa',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('2bf5b739-044c-4c79-aafa-c8a68391fe1b','726c04c1-b711-4ede-817b-4422da0b21e4',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('2cab0899-7fdb-4dc8-9765-17a292a5b33a','423e886a-9b72-42a1-9e11-e0d114042eda',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('2e975ee0-500f-4c90-aa74-e3f0793a582a','fc588748-412b-4558-b124-4d61626fa120',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('2fd28d4d-3553-4223-88a2-70410ae122de','107af26d-8113-45e0-a018-aa4e48b408b8',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('344c1f6f-bbe5-4261-89e5-76d0ea3df707','b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('385b1a4c-8068-427f-9e81-221e8a02a05c','107af26d-8113-45e0-a018-aa4e48b408b8',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('398d8f0f-f07d-4627-ad98-b20e2053d36f','16e43c63-5c0a-43e4-b637-3b964ef911e3',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('3cac3989-bbda-4abb-8881-22815d7dfaca','16e43c63-5c0a-43e4-b637-3b964ef911e3',NULL,NULL,NULL,5,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('3f0c2641-e30a-4106-beeb-1a4e025eddd7','774babfd-5fd6-48f6-aecb-85bf436208ef',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('402844f2-3028-457a-b3c4-4a47ce4191ae','c7a8ee49-0926-406f-b4e3-f4b59d7dfd84',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('49437fe1-43a6-4dab-8102-284863d85220','83081407-8a84-41d3-b069-259fd0f67892',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('49810aee-9ec4-4245-bc0e-b55486117ed8','b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('50c152ab-8e18-4782-ad2a-13484483c0e9','107af26d-8113-45e0-a018-aa4e48b408b8',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('542f58a7-3474-427b-bb36-5c8b0d0eb1cd',NULL,NULL,NULL,NULL,1,0,NULL,'youtube','9bZkp7q19f0',NULL,NULL,NULL),('5608f302-dcc9-4399-8dfe-462f549ce7bd','726c04c1-b711-4ede-817b-4422da0b21e4',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('59590caf-b9fa-4c0c-95cd-b0ab44775453','2a84c51e-cabd-4a0b-abae-e768d1658e8b',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('5a679acf-1db8-469e-89d9-a493d6b50273','27dfb02d-4fdf-4a32-9198-47517573b2cf',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('618b844e-019b-4053-906f-f5ed14ca6085','16e43c63-5c0a-43e4-b637-3b964ef911e3',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('687f9095-c41c-4d78-bd87-abbd788fd4b6','9e76edd8-9027-4f38-8fde-a01b83fdc0aa',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('6a24aefd-ccc9-4514-b8d0-d71c6f597590','4c15eb7d-2bdc-46c9-8919-2554f52e7291',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('6bcf5133-9baf-4367-8d0e-90865e16dca7','27dfb02d-4fdf-4a32-9198-47517573b2cf',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('6c86e399-0c43-40b7-9c75-1e9ad026e083','fc588748-412b-4558-b124-4d61626fa120',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('6dfb7d6c-3fb1-4a6e-8c26-7d852a0c83a6','726c04c1-b711-4ede-817b-4422da0b21e4',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('6f5830d5-a600-47d8-ac94-95130715c4e3','896ff826-5534-4aae-b165-ccb6b7ac85d2',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('724b4fa0-b2ae-40ef-81d2-63844a85f295','83081407-8a84-41d3-b069-259fd0f67892',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('72adcdcb-0161-4802-9119-2a4324601607','107af26d-8113-45e0-a018-aa4e48b408b8',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('73e696a8-13c9-4245-8f69-9b5314d012b2','7abab2b8-4a36-4f18-8a41-5a772ea4ff1a',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('789a5c6a-7d9b-423c-b2e9-b646e6a8ca7d','6dee1137-e043-4e83-aaef-9909dcc8cccc',NULL,NULL,NULL,5,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('7a275aa6-2d92-4e2b-a622-e41c4a67316c','fc588748-412b-4558-b124-4d61626fa120',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('7b47ce02-a9df-416d-a97e-06e90eadd7ff','4c15eb7d-2bdc-46c9-8919-2554f52e7291',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('7bae719c-7d37-4bad-9a67-324960c1cfde',NULL,'4.mp4',NULL,NULL,0,1,'32d201de-7f61-4e9a-8756-a2817ecb9373','local',NULL,NULL,NULL,NULL),('7d4fc8b4-f8af-4dcd-b469-6054b5789ddf','9e76edd8-9027-4f38-8fde-a01b83fdc0aa',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('7ea4e0ae-745f-46b1-ad85-7d2101c6b324','b224728d-7577-4a5b-afe1-264963309e48',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('811bddee-0ac9-403a-9792-19a958e114fe','83081407-8a84-41d3-b069-259fd0f67892',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('88c6cddc-4759-499a-86d5-44ca378ecd74',NULL,NULL,NULL,NULL,2,0,NULL,'youtube','kJQP7kiw5Fk',NULL,NULL,NULL),('88d53d87-4390-415e-88d0-415f89c85a26','b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('88e77c38-17f8-4db7-a131-edf1bb47e080','2a84c51e-cabd-4a0b-abae-e768d1658e8b',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('8a3852f9-3603-4f5f-9603-f6104cf332a4','5b8026d7-8dec-4ae6-a330-96d22a551a32',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('8abb4fe7-2beb-4434-9b70-8efa7d68d092','2a84c51e-cabd-4a0b-abae-e768d1658e8b',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('8b77f035-ab97-48e1-baab-d7d8439ce498','423e886a-9b72-42a1-9e11-e0d114042eda',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('8c2ef4fc-bc67-4f26-89a2-118832b2b65a','2a84c51e-cabd-4a0b-abae-e768d1658e8b',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('90ebc409-333a-40d3-adb7-34510e2e4a1a','4c15eb7d-2bdc-46c9-8919-2554f52e7291',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('9129e1fa-1407-4244-9f53-7914f78b7fc8','4d85e7fc-b32d-467b-bca3-9a851cccd34b',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('94cb2b53-08f8-42cf-8eda-5c3796ff13a0','fc588748-412b-4558-b124-4d61626fa120',NULL,NULL,NULL,5,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('9ae04ee5-95df-4074-bdbb-0bf9449b14ac','896ff826-5534-4aae-b165-ccb6b7ac85d2',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('9c054c70-7ae7-4df3-a287-5d7c470b4173','5b8026d7-8dec-4ae6-a330-96d22a551a32',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('9cb65cea-1ce8-4c17-9bdd-4062bbe60728','c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('9e6e40c1-db25-4a23-8129-3903a1c84fc1','896ff826-5534-4aae-b165-ccb6b7ac85d2',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('9eb388e9-fe8e-4cf6-94e5-1e677efe3665','774babfd-5fd6-48f6-aecb-85bf436208ef',NULL,NULL,NULL,5,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('a3312493-4538-42f8-86bf-eb0aa39e360d','fc588748-412b-4558-b124-4d61626fa120',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('a5276efb-d8a2-4a06-acdd-03c742010d83','4d85e7fc-b32d-467b-bca3-9a851cccd34b',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('a5fe856d-5f1d-43d6-bd58-81d66fed56bd','b224728d-7577-4a5b-afe1-264963309e48',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('a8feba76-6a16-4e7d-98ec-8c6dfeaefa93',NULL,NULL,NULL,NULL,4,0,NULL,'youtube','RgKAFK5djSk',NULL,NULL,NULL),('a9d4404b-1010-468d-97a4-b04bb4294910','83081407-8a84-41d3-b069-259fd0f67892',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('ac0e866d-ed8e-4878-aa2b-482997aab113','774babfd-5fd6-48f6-aecb-85bf436208ef',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('adf43092-7fff-4416-b59f-ad9cbeabeaeb','423e886a-9b72-42a1-9e11-e0d114042eda',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('aea47dd0-85e1-4e96-aa7f-1f7e117d7000','896ff826-5534-4aae-b165-ccb6b7ac85d2',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('af75bc92-8653-428e-8ea3-4d5b31bbc05f','c7a8ee49-0926-406f-b4e3-f4b59d7dfd84',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('b235d1a3-d69a-440d-8a5b-8973d5f80ada','83081407-8a84-41d3-b069-259fd0f67892',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('b51e1682-9773-48b7-818d-792442f7f930',NULL,'3.mp4',NULL,NULL,0,1,'bbe44af1-af01-4cef-8e7e-679dc72402b6','local',NULL,NULL,NULL,NULL),('b5ae4232-63ad-4075-87f4-7bf0ce8eba70','c05d38d7-c8e5-4fad-8e66-bcc82e83d6e7',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('b5fe70ba-6e56-4ce0-aa0a-a4a0333693e2','6dee1137-e043-4e83-aaef-9909dcc8cccc',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('b9ae33e9-cae9-4350-b07a-46ca43079b3b','27dfb02d-4fdf-4a32-9198-47517573b2cf',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('bae62481-9402-41e4-9db5-88c85ccc6ba5','5c029db0-8fc6-4009-987e-82fc88274a60',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('bc5342b7-2b7e-41c7-bc08-5dd6a60cada8','c7a8ee49-0926-406f-b4e3-f4b59d7dfd84',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('bc754b1d-6dd4-4c7b-b9d1-156ce417cf90','4d85e7fc-b32d-467b-bca3-9a851cccd34b',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('bf210d33-f9fc-4ede-b0eb-e73058d4ce4b','5b8026d7-8dec-4ae6-a330-96d22a551a32',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('bfbf3dfd-68cb-400a-a88a-2b11fb5ea31d','16e43c63-5c0a-43e4-b637-3b964ef911e3',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('c3099a59-fe86-4e77-b893-a570d8e4ef3b','6dee1137-e043-4e83-aaef-9909dcc8cccc',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('c7a49e34-7c51-4973-8d37-3888d5e99cc8',NULL,'5.mp4',NULL,NULL,0,1,'ae59f122-e61a-4823-9882-9efb5a0dcc8a','local',NULL,NULL,NULL,NULL),('cab03d9b-fb25-462b-a39a-ba1adc27b120','b224728d-7577-4a5b-afe1-264963309e48',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('d0dc16b8-e496-40af-a982-df3f77241895','726c04c1-b711-4ede-817b-4422da0b21e4',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('d43aafb2-182e-4cc3-964c-c7a36d44b2bd','16e43c63-5c0a-43e4-b637-3b964ef911e3',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('d515d016-3601-41c3-a35c-04975a754c9c','4c15eb7d-2bdc-46c9-8919-2554f52e7291',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('d89b4c81-316b-4852-98d8-b2afddd54f64','aef9450a-003d-4b99-bea1-23fb92fdaf74',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('d9fab27d-0abe-4934-907a-e4b80947b23f',NULL,'2.mp4',NULL,NULL,0,1,'2ca98c1d-967e-43b5-8b3b-2412336ee9bb','local',NULL,NULL,NULL,NULL),('dbff970f-10ab-41ee-8659-fd7b89bcb6e9',NULL,NULL,NULL,NULL,0,1,NULL,'youtube','dQw4w9WgXcQ',NULL,NULL,NULL),('e16f7035-92a6-49b7-84cf-9a6e1c1b4b3e','2a84c51e-cabd-4a0b-abae-e768d1658e8b',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('e34a8220-3676-4462-aaeb-43d2b4e898e7','b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('e742bfeb-706b-4366-ab2c-8424a9593e7b','9e76edd8-9027-4f38-8fde-a01b83fdc0aa',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('e7562ee3-946c-4992-a5a2-38636c5669f2','4c15eb7d-2bdc-46c9-8919-2554f52e7291',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('e8634bcc-23af-4500-b5cb-57cbcf8f372f','7abab2b8-4a36-4f18-8a41-5a772ea4ff1a',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('e991b525-b26f-4fb2-96aa-6702b12f99ae','c7a8ee49-0926-406f-b4e3-f4b59d7dfd84',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('ea51c344-3eb1-4064-bf0c-3c8b0f8e99c9','b224728d-7577-4a5b-afe1-264963309e48',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('eb2827e5-1a59-45a6-a32a-99d6c831d170','423e886a-9b72-42a1-9e11-e0d114042eda',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('ec8b17b1-ab71-4fc8-9817-db686bb53e27','aef9450a-003d-4b99-bea1-23fb92fdaf74',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('ece51eec-3f5d-47c8-8a46-acdd318684b2','5c029db0-8fc6-4009-987e-82fc88274a60',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('edaa3b5d-4895-435e-a3dd-b64ef70d190e','726c04c1-b711-4ede-817b-4422da0b21e4',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('edd5f51d-4251-45d3-b623-a3da3a16a6c4','423e886a-9b72-42a1-9e11-e0d114042eda','fd65560a-0751-416b-81db-7ec49019c684.mov',NULL,NULL,0,1,NULL,'local',NULL,NULL,NULL,NULL),('ee306739-2987-43ab-a798-958858432b61','4d85e7fc-b32d-467b-bca3-9a851cccd34b',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('f010d773-bd78-4104-8e4f-fe66f6d02b1a','aef9450a-003d-4b99-bea1-23fb92fdaf74',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('f19062b2-ac8e-4a62-b69b-2a1580728e95','774babfd-5fd6-48f6-aecb-85bf436208ef',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('f220147b-bde0-4a17-b00a-fdaf797d4892','7abab2b8-4a36-4f18-8a41-5a772ea4ff1a',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('f4148749-e3f3-4ed8-9ddc-8756594f807e','5b8026d7-8dec-4ae6-a330-96d22a551a32',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('f44d6efa-a901-4922-bd13-034003d1fce1','aef9450a-003d-4b99-bea1-23fb92fdaf74',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('f65170ea-b6c7-4f17-8910-bafda0c247e8','6dee1137-e043-4e83-aaef-9909dcc8cccc',NULL,NULL,NULL,2,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('f8a3590c-f46b-4afc-97f8-3fab4a1da14d','9e76edd8-9027-4f38-8fde-a01b83fdc0aa',NULL,NULL,NULL,4,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('f8a5d613-9f91-4846-a93d-a91a0211b39f','b31f4b9f-11b9-47d8-86a6-9d1d9ffc2f64',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('fcbdecf4-8427-45e7-863e-19a0061a3540','6dee1137-e043-4e83-aaef-9909dcc8cccc',NULL,NULL,NULL,3,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('fd08c0ad-a499-43ad-bca6-34e92bed54f3','27dfb02d-4fdf-4a32-9198-47517573b2cf',NULL,NULL,NULL,0,1,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL),('ff434faf-78f6-4101-91e6-6bad4db6e044','aef9450a-003d-4b99-bea1-23fb92fdaf74',NULL,NULL,NULL,1,0,NULL,'youtube','JGwWNGJdvx8',NULL,NULL,NULL);
/*!40000 ALTER TABLE `video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlistItem`
--

DROP TABLE IF EXISTS `wishlistItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlistItem` (
  `userId` varchar(255) NOT NULL,
  `productId` varchar(36) NOT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`userId`,`productId`),
  KEY `wishlistItem_productId_product_id_fk` (`productId`),
  CONSTRAINT `wishlistItem_productId_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlistItem_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlistItem`
--

LOCK TABLES `wishlistItem` WRITE;
/*!40000 ALTER TABLE `wishlistItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlistItem` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-04 23:39:35
