-- 创建数据库
CREATE DATABASE IF NOT EXISTS smdc_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE smdc_db;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `openid` varchar(64) DEFAULT NULL COMMENT '微信openid',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `password` varchar(64) DEFAULT NULL COMMENT '密码',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `gender` tinyint(1) DEFAULT '0' COMMENT '性别 0-未知 1-男 2-女',
  `role` tinyint(1) DEFAULT '0' COMMENT '角色 0-普通用户 1-管理员',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态 0-正常 1-禁用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除 0-未删除 1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_phone` (`phone`),
  KEY `idx_openid` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 店铺信息表
CREATE TABLE IF NOT EXISTS `shop` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '店铺ID',
  `name` varchar(100) NOT NULL COMMENT '店铺名称',
  `logo` varchar(255) DEFAULT NULL COMMENT '店铺logo',
  `notice` varchar(500) DEFAULT NULL COMMENT '店铺公告',
  `address` varchar(255) DEFAULT NULL COMMENT '店铺地址',
  `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `business_hours` varchar(100) DEFAULT NULL COMMENT '营业时间',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态 0-营业中 1-休息中',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
  `rating` decimal(2,1) DEFAULT '5.0' COMMENT '评分',
  `rating_count` int(11) DEFAULT '0' COMMENT '评分数量',
  `average_price` decimal(10,2) DEFAULT '0.00' COMMENT '人均消费',
  `promotion` varchar(255) DEFAULT NULL COMMENT '促销信息',
  `description` varchar(500) DEFAULT NULL COMMENT '店铺描述',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='店铺信息表';

-- 菜品分类表
CREATE TABLE IF NOT EXISTS `dish_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态 0-启用 1-禁用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除 0-未删除 1-已删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品分类表';

-- 菜品表
CREATE TABLE IF NOT EXISTS `dish` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '菜品ID',
  `category_id` bigint(20) NOT NULL COMMENT '分类ID',
  `name` varchar(100) NOT NULL COMMENT '菜品名称',
  `price` decimal(10,2) NOT NULL COMMENT '菜品价格',
  `image` varchar(255) DEFAULT NULL COMMENT '菜品图片',
  `description` varchar(500) DEFAULT NULL COMMENT '菜品描述',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态 0-上架 1-下架',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除 0-未删除 1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品表';

-- 订单表
CREATE TABLE IF NOT EXISTS `order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` varchar(64) NOT NULL COMMENT '订单编号',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `total_amount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '订单状态 0-待支付 1-已完成 2-已取消',
  `pay_method` tinyint(1) DEFAULT NULL COMMENT '支付方式 0-微信支付',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `cancel_time` datetime DEFAULT NULL COMMENT '取消时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `table_no` varchar(20) DEFAULT NULL COMMENT '桌号',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 订单详情表
CREATE TABLE IF NOT EXISTS `order_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '详情ID',
  `order_id` bigint(20) NOT NULL COMMENT '订单ID',
  `dish_id` bigint(20) NOT NULL COMMENT '菜品ID',
  `dish_name` varchar(100) NOT NULL COMMENT '菜品名称',
  `dish_price` decimal(10,2) NOT NULL COMMENT '菜品价格',
  `quantity` int(11) NOT NULL COMMENT '数量',
  `amount` decimal(10,2) NOT NULL COMMENT '金额',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单详情表';

-- 系统配置表
CREATE TABLE IF NOT EXISTS `system_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` varchar(100) NOT NULL COMMENT '配置键',
  `config_value` varchar(500) DEFAULT NULL COMMENT '配置值',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 初始化管理员账号
INSERT INTO `user` (`phone`, `password`, `nickname`, `role`, `status`) VALUES ('admin', '$2a$10$8qx711TBg/2hxfL7N.sxf.0ROMhR/iuPhQx33IFqGd7PLgt5nGJTO', '管理员', 1, 0);

-- 初始化店铺信息
INSERT INTO `shop` (`name`, `notice`, `address`, `phone`, `business_hours`, `status`, `latitude`, `longitude`, `rating`, `rating_count`, `average_price`, `promotion`, `description`) 
VALUES ('美食餐厅', '欢迎光临，请扫码点餐', '北京市朝阳区xxx路xx号', '010-12345678', '09:00-22:00', 0, 39.9087, 116.3975, 4.8, 100, 50.00, '满100减20', '这是一家提供美味佳肴的餐厅，欢迎品尝我们的特色菜品。');

-- 初始化系统配置
INSERT INTO `system_config` (`config_key`, `config_value`, `remark`) VALUES ('wx_appid', '', '微信小程序AppID');
INSERT INTO `system_config` (`config_key`, `config_value`, `remark`) VALUES ('wx_secret', '', '微信小程序AppSecret');
INSERT INTO `system_config` (`config_key`, `config_value`, `remark`) VALUES ('wx_mchid', '', '微信商户号');
INSERT INTO `system_config` (`config_key`, `config_value`, `remark`) VALUES ('wx_key', '', '微信支付密钥');
INSERT INTO `system_config` (`config_key`, `config_value`, `remark`) VALUES ('wx_notify_url', '', '微信支付回调地址'); 