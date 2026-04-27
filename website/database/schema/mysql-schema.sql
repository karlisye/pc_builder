/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `builds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `builds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `total_price` decimal(10,2) DEFAULT NULL,
  `cpu_id` bigint unsigned DEFAULT NULL,
  `motherboard_id` bigint unsigned DEFAULT NULL,
  `ram_id` bigint unsigned DEFAULT NULL,
  `gpu_id` bigint unsigned DEFAULT NULL,
  `ssd_id` bigint unsigned DEFAULT NULL,
  `hdd_id` bigint unsigned DEFAULT NULL,
  `case_id` bigint unsigned DEFAULT NULL,
  `cooler_id` bigint unsigned DEFAULT NULL,
  `psu_id` bigint unsigned DEFAULT NULL,
  `fan_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `1` (`user_id`),
  KEY `builds_cpu_id_foreign` (`cpu_id`),
  KEY `builds_motherboard_id_foreign` (`motherboard_id`),
  KEY `builds_ram_id_foreign` (`ram_id`),
  KEY `builds_gpu_id_foreign` (`gpu_id`),
  KEY `builds_ssd_id_foreign` (`ssd_id`),
  KEY `builds_hdd_id_foreign` (`hdd_id`),
  KEY `builds_case_id_foreign` (`case_id`),
  KEY `builds_cooler_id_foreign` (`cooler_id`),
  KEY `builds_psu_id_foreign` (`psu_id`),
  KEY `builds_fan_id_foreign` (`fan_id`),
  CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `builds_case_id_foreign` FOREIGN KEY (`case_id`) REFERENCES `cases` (`id`) ON DELETE SET NULL,
  CONSTRAINT `builds_cooler_id_foreign` FOREIGN KEY (`cooler_id`) REFERENCES `coolers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `builds_cpu_id_foreign` FOREIGN KEY (`cpu_id`) REFERENCES `cpus` (`id`) ON DELETE SET NULL,
  CONSTRAINT `builds_fan_id_foreign` FOREIGN KEY (`fan_id`) REFERENCES `fans` (`id`) ON DELETE SET NULL,
  CONSTRAINT `builds_gpu_id_foreign` FOREIGN KEY (`gpu_id`) REFERENCES `gpus` (`id`) ON DELETE SET NULL,
  CONSTRAINT `builds_hdd_id_foreign` FOREIGN KEY (`hdd_id`) REFERENCES `hdds` (`id`) ON DELETE SET NULL,
  CONSTRAINT `builds_motherboard_id_foreign` FOREIGN KEY (`motherboard_id`) REFERENCES `motherboards` (`id`) ON DELETE SET NULL,
  CONSTRAINT `builds_psu_id_foreign` FOREIGN KEY (`psu_id`) REFERENCES `psus` (`id`) ON DELETE SET NULL,
  CONSTRAINT `builds_ram_id_foreign` FOREIGN KEY (`ram_id`) REFERENCES `ram` (`id`) ON DELETE SET NULL,
  CONSTRAINT `builds_ssd_id_foreign` FOREIGN KEY (`ssd_id`) REFERENCES `ssds` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateks_id` int unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT '0',
  `stock_quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `form_factor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_gpu_length` smallint DEFAULT NULL,
  `max_cpu_cooler_height` smallint DEFAULT NULL,
  `bays_25` tinyint DEFAULT NULL,
  `bays_35` tinyint DEFAULT NULL,
  `psu_wattage` smallint DEFAULT '1',
  `scraped_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cases_dateks_id_unique` (`dateks_id`),
  KEY `cases_price_index` (`price`),
  KEY `cases_in_stock_index` (`in_stock`),
  KEY `cases_form_factor_index` (`form_factor`),
  KEY `cases_max_gpu_length_index` (`max_gpu_length`),
  KEY `cases_max_cpu_cooler_height_index` (`max_cpu_cooler_height`),
  KEY `cases_psu_included_index` (`psu_wattage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `coolers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coolers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateks_id` int unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT '0',
  `stock_quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `compatibility` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tdp_support` smallint DEFAULT NULL,
  `height_mm` smallint DEFAULT NULL,
  `fan_size_mm` smallint DEFAULT NULL,
  `scraped_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coolers_dateks_id_unique` (`dateks_id`),
  KEY `coolers_price_index` (`price`),
  KEY `coolers_in_stock_index` (`in_stock`),
  KEY `coolers_compatibility_index` (`compatibility`),
  KEY `coolers_tdp_support_index` (`tdp_support`),
  KEY `coolers_height_mm_index` (`height_mm`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cpus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cpus` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateks_id` int unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT '0',
  `stock_quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `socket` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cores` smallint DEFAULT NULL,
  `threads` smallint DEFAULT NULL,
  `clock_rate` decimal(4,2) DEFAULT NULL,
  `turbo_frequency` decimal(4,2) DEFAULT NULL,
  `tdp` smallint DEFAULT NULL,
  `integrated_graphics` tinyint(1) DEFAULT NULL,
  `cooler_included` tinyint(1) DEFAULT NULL,
  `passmark` int DEFAULT NULL,
  `scraped_at` timestamp NULL DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpus_dateks_id_unique` (`dateks_id`),
  KEY `cpus_price_index` (`price`),
  KEY `cpus_in_stock_index` (`in_stock`),
  KEY `cpus_socket_index` (`socket`),
  KEY `cpus_cores_index` (`cores`),
  KEY `cpus_tdp_index` (`tdp`),
  KEY `cpus_integrated_graphics_index` (`integrated_graphics`),
  KEY `cpus_cooler_included_index` (`cooler_included`),
  KEY `cpus_passmark_index` (`passmark`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `fans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateks_id` int unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT '0',
  `stock_quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size_mm` smallint DEFAULT NULL,
  `connector` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `units_in_package` tinyint DEFAULT NULL,
  `scraped_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fans_dateks_id_unique` (`dateks_id`),
  KEY `fans_price_index` (`price`),
  KEY `fans_in_stock_index` (`in_stock`),
  KEY `fans_size_mm_index` (`size_mm`),
  KEY `fans_connector_index` (`connector`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `gpus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gpus` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateks_id` int unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT '0',
  `stock_quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gpu_model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vram` tinyint DEFAULT NULL,
  `tdp` smallint DEFAULT NULL,
  `min_psu` smallint DEFAULT NULL,
  `pcie_version` decimal(2,1) DEFAULT NULL,
  `length_mm` smallint DEFAULT NULL,
  `power_connectors` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scraped_at` timestamp NULL DEFAULT NULL,
  `cuda` smallint DEFAULT NULL,
  `bus` smallint DEFAULT NULL,
  `vram_freq` smallint DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gpus_dateks_id_unique` (`dateks_id`),
  KEY `gpus_price_index` (`price`),
  KEY `gpus_in_stock_index` (`in_stock`),
  KEY `gpus_gpu_model_index` (`gpu_model`),
  KEY `gpus_vram_index` (`vram`),
  KEY `gpus_tdp_index` (`tdp`),
  KEY `gpus_min_psu_index` (`min_psu`),
  KEY `gpus_pcie_version_index` (`pcie_version`),
  KEY `gpus_length_mm_index` (`length_mm`),
  KEY `gpus_cuda_index` (`cuda`),
  KEY `gpus_bus_index` (`bus`),
  KEY `gpus_vram_freq_index` (`vram_freq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `hdds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hdds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateks_id` int unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT '0',
  `stock_quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` smallint DEFAULT NULL,
  `interface` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scraped_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hdds_dateks_id_unique` (`dateks_id`),
  KEY `hdds_price_index` (`price`),
  KEY `hdds_in_stock_index` (`in_stock`),
  KEY `hdds_capacity_index` (`capacity`),
  KEY `hdds_interface_index` (`interface`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `motherboards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `motherboards` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateks_id` int unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT '0',
  `stock_quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `socket` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chipset` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `form_factor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memory_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memory_slots` tinyint DEFAULT NULL,
  `memory_max_speed` smallint DEFAULT NULL,
  `m2_slots` tinyint DEFAULT NULL,
  `sata_ports` tinyint DEFAULT NULL,
  `wifi` tinyint(1) DEFAULT NULL,
  `scraped_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `motherboards_dateks_id_unique` (`dateks_id`),
  KEY `motherboards_price_index` (`price`),
  KEY `motherboards_in_stock_index` (`in_stock`),
  KEY `motherboards_socket_index` (`socket`),
  KEY `motherboards_chipset_index` (`chipset`),
  KEY `motherboards_form_factor_index` (`form_factor`),
  KEY `motherboards_memory_type_index` (`memory_type`),
  KEY `motherboards_memory_slots_index` (`memory_slots`),
  KEY `motherboards_memory_max_speed_index` (`memory_max_speed`),
  KEY `motherboards_m2_slots_index` (`m2_slots`),
  KEY `motherboards_sata_ports_index` (`sata_ports`),
  KEY `motherboards_wifi_index` (`wifi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `psus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `psus` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateks_id` int unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT '0',
  `stock_quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wattage` smallint DEFAULT NULL,
  `efficiency_rating` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `psu_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modular` tinyint(1) DEFAULT NULL,
  `fan_size_mm` smallint DEFAULT NULL,
  `pcie_connectors` tinyint DEFAULT NULL,
  `eps_connectors` tinyint DEFAULT NULL,
  `sata_connectors` tinyint DEFAULT NULL,
  `scraped_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `psus_dateks_id_unique` (`dateks_id`),
  KEY `psus_price_index` (`price`),
  KEY `psus_in_stock_index` (`in_stock`),
  KEY `psus_wattage_index` (`wattage`),
  KEY `psus_efficiency_rating_index` (`efficiency_rating`),
  KEY `psus_psu_type_index` (`psu_type`),
  KEY `psus_modular_index` (`modular`),
  KEY `psus_pcie_connectors_index` (`pcie_connectors`),
  KEY `psus_eps_connectors_index` (`eps_connectors`),
  KEY `psus_sata_connectors_index` (`sata_connectors`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ram`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ram` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateks_id` int unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT '0',
  `stock_quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memory_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` smallint DEFAULT NULL,
  `frequency` smallint DEFAULT NULL,
  `cl_latency` tinyint DEFAULT NULL,
  `modules_count` tinyint DEFAULT '1',
  `scraped_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ram_dateks_id_unique` (`dateks_id`),
  KEY `ram_price_index` (`price`),
  KEY `ram_in_stock_index` (`in_stock`),
  KEY `ram_memory_type_index` (`memory_type`),
  KEY `ram_capacity_index` (`capacity`),
  KEY `ram_frequency_index` (`frequency`),
  KEY `ram_modules_count_index` (`modules_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ssds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ssds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateks_id` int unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT '0',
  `stock_quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` smallint DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `form_factor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interface` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read_speed` smallint DEFAULT NULL,
  `write_speed` smallint DEFAULT NULL,
  `scraped_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ssds_dateks_id_unique` (`dateks_id`),
  KEY `ssds_price_index` (`price`),
  KEY `ssds_in_stock_index` (`in_stock`),
  KEY `ssds_capacity_index` (`capacity`),
  KEY `ssds_type_index` (`type`),
  KEY `ssds_form_factor_index` (`form_factor`),
  KEY `ssds_interface_index` (`interface`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1,'2026_03_06_191334_create_component_tables',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2,'2026_03_10_164958_create_users_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3,'2026_03_10_164959_create_builds_table',3);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4,'2026_03_10_163647_create_builds_table',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (7,'2026_04_15_083712_add_fields_to_gpus_table',5);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (8,'2026_04_25_095403_add_type_field_to_cpus_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9,'2026_04_25_100020_add_type_field_to_gpus_table',7);
