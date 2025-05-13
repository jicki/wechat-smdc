-- 创建用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `phone` varchar(11) DEFAULT NULL COMMENT '手机号',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `gender` tinyint(4) DEFAULT '0' COMMENT '性别 0-未知 1-男 2-女',
  `role` tinyint(4) DEFAULT '0' COMMENT '角色 0-普通用户 1-管理员',
  `status` tinyint(4) DEFAULT '0' COMMENT '状态 0-正常 1-禁用',
  `openid` varchar(50) DEFAULT NULL COMMENT '微信openid',
  `deleted` tinyint(4) DEFAULT '0' COMMENT '是否删除 0-否 1-是',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 创建管理员账号 (密码: admin123)
INSERT INTO `user` (`phone`, `password`, `nickname`, `role`, `status`) VALUES 
('admin', '$2a$10$N.ZOn9G6/YLFixAOPMg/h.z7pCu6v2XyFDtC4q.jeeGm/TEZyj15C', '管理员', 1, 0); 