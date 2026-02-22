/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80042 (8.0.42)
 Source Host           : localhost:3306
 Source Schema         : hotel

 Target Server Type    : MySQL
 Target Server Version : 80042 (8.0.42)
 File Encoding         : 65001

 Date: 22/02/2026 10:13:07
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for facilities
-- ----------------------------
DROP TABLE IF EXISTS `facilities`;
CREATE TABLE `facilities`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of facilities
-- ----------------------------

-- ----------------------------
-- Table structure for guests
-- ----------------------------
DROP TABLE IF EXISTS `guests`;
CREATE TABLE `guests`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `first_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `guests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of guests
-- ----------------------------

-- ----------------------------
-- Table structure for hotel_facilities
-- ----------------------------
DROP TABLE IF EXISTS `hotel_facilities`;
CREATE TABLE `hotel_facilities`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_id` bigint UNSIGNED NOT NULL,
  `facility_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_hotel_facility`(`hotel_id` ASC, `facility_id` ASC) USING BTREE,
  INDEX `facility_id`(`facility_id` ASC) USING BTREE,
  CONSTRAINT `hotel_facilities_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `hotel_facilities_ibfk_2` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hotel_facilities
-- ----------------------------

-- ----------------------------
-- Table structure for hotel_images
-- ----------------------------
DROP TABLE IF EXISTS `hotel_images`;
CREATE TABLE `hotel_images`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_id` bigint UNSIGNED NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('main','room','facility','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sort_order` smallint NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_hotel_id`(`hotel_id` ASC) USING BTREE,
  CONSTRAINT `hotel_images_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hotel_images
-- ----------------------------
INSERT INTO `hotel_images` VALUES (1, 1, 'https://.../main.jpg', 'main', 0, '2026-02-21 09:56:10');
INSERT INTO `hotel_images` VALUES (2, 1, 'https://.../facility.jpg', 'facility', 0, '2026-02-21 09:56:10');
INSERT INTO `hotel_images` VALUES (3, 2, 'https://.../main.jpg', 'main', 0, '2026-02-21 10:04:29');
INSERT INTO `hotel_images` VALUES (4, 2, 'https://.../facility.jpg', 'facility', 0, '2026-02-21 10:04:29');
INSERT INTO `hotel_images` VALUES (5, 3, 'https://.../main.jpg', 'main', 0, '2026-02-21 10:09:37');
INSERT INTO `hotel_images` VALUES (6, 3, 'https://.../facility.jpg', 'facility', 0, '2026-02-21 10:09:37');

-- ----------------------------
-- Table structure for hotel_tags
-- ----------------------------
DROP TABLE IF EXISTS `hotel_tags`;
CREATE TABLE `hotel_tags`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_id` bigint UNSIGNED NOT NULL,
  `tag_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_hotel_tag`(`hotel_id` ASC, `tag_id` ASC) USING BTREE,
  INDEX `tag_id`(`tag_id` ASC) USING BTREE,
  CONSTRAINT `hotel_tags_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `hotel_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hotel_tags
-- ----------------------------
INSERT INTO `hotel_tags` VALUES (1, 1, 1);
INSERT INTO `hotel_tags` VALUES (2, 1, 2);
INSERT INTO `hotel_tags` VALUES (3, 2, 1);
INSERT INTO `hotel_tags` VALUES (4, 2, 2);
INSERT INTO `hotel_tags` VALUES (5, 3, 1);
INSERT INTO `hotel_tags` VALUES (6, 3, 2);

-- ----------------------------
-- Table structure for hotels
-- ----------------------------
DROP TABLE IF EXISTS `hotels`;
CREATE TABLE `hotels`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `merchant_id` bigint UNSIGNED NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `star` tinyint UNSIGNED NULL DEFAULT NULL,
  `rating` decimal(2, 1) NULL DEFAULT 0.0,
  `opening_date` date NULL DEFAULT NULL,
  `status` enum('pending','approved','rejected','published','unpublished') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `audit_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_merchant_id`(`merchant_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  CONSTRAINT `hotels_ibfk_1` FOREIGN KEY (`merchant_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hotels
-- ----------------------------
INSERT INTO `hotels` VALUES (1, 5, '上海酒店', '黄浦区中山东一路1号', '酒店描述...', 5, 0.0, '2018-06-01', 'published', NULL, 0, '2026-02-21 09:56:10', '2026-02-21 19:57:45');
INSERT INTO `hotels` VALUES (2, 5, '上海外滩酒店', '黄浦区中山东一路1号', '酒店描述...', 5, 0.0, '2018-06-01', 'pending', NULL, 0, '2026-02-21 10:04:29', '2026-02-21 10:04:29');
INSERT INTO `hotels` VALUES (3, 5, '上海外滩酒店', '黄浦区中山东一路1号', '酒店描述...', 5, 0.0, '2018-06-01', 'pending', NULL, 1, '2026-02-21 10:09:37', '2026-02-22 09:41:49');

-- ----------------------------
-- Table structure for price_calendar
-- ----------------------------
DROP TABLE IF EXISTS `price_calendar`;
CREATE TABLE `price_calendar`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_id` bigint UNSIGNED NOT NULL,
  `room_id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `available` smallint NOT NULL,
  `status` enum('available','closed','full') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'available',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_room_date`(`room_id` ASC, `date` ASC) USING BTREE,
  INDEX `idx_hotel_date`(`hotel_id` ASC, `date` ASC) USING BTREE,
  CONSTRAINT `price_calendar_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `price_calendar_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of price_calendar
-- ----------------------------

-- ----------------------------
-- Table structure for reservations
-- ----------------------------
DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `reservation_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `hotel_id` bigint UNSIGNED NOT NULL,
  `room_id` bigint UNSIGNED NOT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `total_price` decimal(10, 2) NOT NULL,
  `guest_info` json NOT NULL,
  `contact_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `special_requests` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `status` enum('confirmed','cancelled','completed','no_show') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'confirmed',
  `promotion_id` bigint UNSIGNED NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `reservation_no`(`reservation_no` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_hotel_id`(`hotel_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `room_id`(`room_id` ASC) USING BTREE,
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `reservations_ibfk_3` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of reservations
-- ----------------------------
INSERT INTO `reservations` VALUES (1, 'RES2026022120UF3S', 1, 1, 2, '2026-03-01', '2026-03-03', 3600.00, '[{\"phone\": \"13800138000\", \"idType\": \"身份证\", \"idNumber\": \"110101199001011234\", \"lastName\": \"三\", \"firstName\": \"张\"}]', '张三', '13800138000', '需要高楼层', 'confirmed', NULL, '2026-02-21 11:38:30', '2026-02-21 11:38:30');
INSERT INTO `reservations` VALUES (2, 'RES20260221DH6L7M', 1, 1, 2, '2026-03-01', '2026-03-03', 3600.00, '[{\"phone\": \"13800138000\", \"idType\": \"身份证\", \"idNumber\": \"110101199001011234\", \"lastName\": \"三\", \"firstName\": \"张\"}]', '张三', '13800138000', '需要高楼层', 'confirmed', NULL, '2026-02-21 18:15:37', '2026-02-21 18:15:37');
INSERT INTO `reservations` VALUES (3, 'RES202602218KT7PZ', 1, 1, 2, '2026-03-01', '2026-03-03', 3600.00, '[{\"phone\": \"13800138000\", \"idType\": \"身份证\", \"idNumber\": \"110101199001011234\", \"lastName\": \"三\", \"firstName\": \"张\"}]', '张三', '13800138000', '需要高楼层', 'cancelled', NULL, '2026-02-21 18:27:44', '2026-02-21 18:30:16');

-- ----------------------------
-- Table structure for rooms
-- ----------------------------
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_id` bigint UNSIGNED NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `area` smallint UNSIGNED NULL DEFAULT NULL,
  `bed_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `max_occupancy` tinyint UNSIGNED NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `total_rooms` smallint UNSIGNED NOT NULL,
  `available_rooms` smallint UNSIGNED NOT NULL,
  `images` json NULL,
  `amenities` json NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_hotel_id`(`hotel_id` ASC) USING BTREE,
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rooms
-- ----------------------------
INSERT INTO `rooms` VALUES (2, 1, '豪华大床房', 45, '大床 (1.8米)', 2, 1800.00, 10, 10, '[\"https://.../room.jpg\"]', '[\"浴缸\", \"迷你吧\"]', '2026-02-21 11:36:02', '2026-02-21 11:36:02');
INSERT INTO `rooms` VALUES (3, 1, '豪华大床房', 45, '大床 (1.8米)', 2, 1800.00, 10, 10, '[\"https://.../room.jpg\"]', '[\"浴缸\", \"迷你吧\"]', '2026-02-21 11:37:25', '2026-02-21 11:37:25');
INSERT INTO `rooms` VALUES (4, 1, '豪华大床房', 45, '大床 (1.8米)', 2, 1800.00, 10, 10, '[\"https://.../room.jpg\"]', '[\"浴缸\", \"迷你吧\"]', '2026-02-21 18:13:41', '2026-02-21 18:13:41');

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tags
-- ----------------------------
INSERT INTO `tags` VALUES (1, '江景', 'view', '2026-02-21 09:37:15');
INSERT INTO `tags` VALUES (2, '海景', '', '2026-02-21 09:38:27');
INSERT INTO `tags` VALUES (3, '亲子', '', '2026-02-21 09:38:36');
INSERT INTO `tags` VALUES (4, '豪华', '', '2026-02-21 09:38:43');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `role` enum('user','merchant','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  UNIQUE INDEX `phone`(`phone` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'testuser', '$2b$10$XQ1WpVqEpNpwQJUQGisE.ei36E7GSadyPlawRhj6HLa/grsYH0x5O', 'test@example.com', NULL, 'user', '2026-02-20 19:33:42', '2026-02-20 19:33:42');
INSERT INTO `users` VALUES (4, 'testadmin', '$2b$10$46mCB4FYcfGQkrYfNirAcuydoXrEV3tF//ocoT5GbvJgDCqO/gYw6', NULL, NULL, 'admin', '2026-02-20 20:05:56', '2026-02-20 20:05:56');
INSERT INTO `users` VALUES (5, 'testmerchant', '$2b$10$FblQLifp4z7ovjKxCjkZSOuQMZTp1qRve/g0AwXIpNeJ9aeOfziAi', NULL, NULL, 'merchant', '2026-02-20 20:06:21', '2026-02-20 20:06:21');
INSERT INTO `users` VALUES (6, 'testuser1', '$2b$10$aOkfOQaMNpz39vuS87r.CuskU.4yswECOiyisxuNAusR43MXFKVIa', NULL, NULL, 'user', '2026-02-20 21:02:23', '2026-02-20 21:02:23');

SET FOREIGN_KEY_CHECKS = 1;
