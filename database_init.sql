-- 数据库初始化脚本 for Crane Vista Hub

-- 创建数据库 (如果不存在)
CREATE DATABASE IF NOT EXISTS `crane_vista_hub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE `crane_vista_hub`;

-- 删除已存在的 equipment 表 (方便重新运行脚本)
DROP TABLE IF EXISTS `equipment`;

-- 创建 equipment 表
CREATE TABLE `equipment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(100) NOT NULL,
  `status` ENUM('online', 'offline', 'warning', 'maintenance') NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `type` ENUM('crane', 'mixer') NOT NULL,
  `working_hours` INT DEFAULT 0,
  `equipment_condition` VARCHAR(100) DEFAULT NULL,
  `last_update` DATETIME DEFAULT NULL,
  
  -- 塔吊特有属性 (nullable)
  `cabin_temp_inside` DOUBLE DEFAULT NULL,
  `cabin_temp_outside` DOUBLE DEFAULT NULL,
  `humidity` DOUBLE DEFAULT NULL,
  `wind_speed` DOUBLE DEFAULT NULL,

  -- 搅拌机特有属性 (nullable)
  `mixing_temp` DOUBLE DEFAULT NULL,
  `mixing_speed` DOUBLE DEFAULT NULL,
  `production_rate` DOUBLE DEFAULT NULL,

  -- 通用维护信息
  `last_maintenance` DATE DEFAULT NULL,
  `next_maintenance` DATE DEFAULT NULL,

  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 插入模拟数据
INSERT INTO `equipment` (`id`, `name`, `code`, `status`, `location`, `type`, `working_hours`, `equipment_condition`, `last_update`, `cabin_temp_inside`, `cabin_temp_outside`, `humidity`, `wind_speed`, `last_maintenance`, `next_maintenance`) VALUES
(1, '塔吊-001', 'TC-001', 'online', 'A区-1号楼', 'crane', 127, '完好', '2024-01-30 14:23:15', 24, 18, 65, 3.2, '2024-01-20', '2024-02-20'),
(2, '塔吊-002', 'TC-002', 'warning', 'A区-2号楼', 'crane', 89, '损坏已保修', '2024-01-30 14:22:45', 26, 18, 70, 4.1, '2024-01-15', '2024-02-15'),
(3, '塔吊-003', 'TC-003', 'offline', 'B区-1号楼', 'crane', 234, '损坏未保修', '2024-01-30 12:15:30', 20, 18, 55, 2.8, '2024-01-10', '2024-02-10');

INSERT INTO `equipment` (`id`, `name`, `code`, `status`, `location`, `type`, `working_hours`, `equipment_condition`, `last_update`, `mixing_temp`, `mixing_speed`, `production_rate`, `last_maintenance`, `next_maintenance`) VALUES
(4, '搅拌机-001', 'CM-001', 'online', '搅拌站-A', 'mixer', 156, '完好', '2024-01-30 14:24:10', 35, 45, 92, '2024-01-25', '2024-02-25'),
(5, '搅拌机-002', 'CM-002', 'maintenance', '搅拌站-B', 'mixer', 203, '报废', '2024-01-30 10:30:00', 28, 0, 0, '2024-01-30', '2024-03-01'),
(6, '搅拌机-003', 'CM-003', 'online', '搅拌站-C', 'mixer', 98, '完好', '2024-01-30 14:23:55', 32, 42, 88, '2024-01-18', '2024-02-18');

-- 查询所有数据以验证
SELECT * FROM `equipment`;
