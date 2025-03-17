package com.jarcms.smdcmanage.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.jarcms.smdcmanage.entity.SystemConfig;

import java.util.List;
import java.util.Map;

/**
 * 系统配置服务接口
 */
public interface SystemConfigService extends IService<SystemConfig> {

    /**
     * 获取所有配置
     *
     * @return 配置列表
     */
    List<SystemConfig> listAll();

    /**
     * 获取配置值
     *
     * @param key 配置键
     * @return 配置值
     */
    String getConfigValue(String key);

    /**
     * 获取微信支付配置
     *
     * @return 微信支付配置
     */
    Map<String, String> getWxPayConfig();

    /**
     * 更新配置
     *
     * @param key   配置键
     * @param value 配置值
     * @return 是否成功
     */
    boolean updateConfig(String key, String value);

    /**
     * 批量更新配置
     *
     * @param configs 配置Map
     * @return 是否成功
     */
    boolean updateConfigBatch(Map<String, String> configs);
} 