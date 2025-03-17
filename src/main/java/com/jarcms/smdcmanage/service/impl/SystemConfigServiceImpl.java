package com.jarcms.smdcmanage.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jarcms.smdcmanage.entity.SystemConfig;
import com.jarcms.smdcmanage.exception.BusinessException;
import com.jarcms.smdcmanage.mapper.SystemConfigMapper;
import com.jarcms.smdcmanage.service.SystemConfigService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 系统配置服务实现类
 */
@Service
public class SystemConfigServiceImpl extends ServiceImpl<SystemConfigMapper, SystemConfig> implements SystemConfigService {

    @Override
    public List<SystemConfig> listAll() {
        return list();
    }

    @Override
    public String getConfigValue(String key) {
        LambdaQueryWrapper<SystemConfig> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SystemConfig::getConfigKey, key);
        SystemConfig config = getOne(queryWrapper);
        return config != null ? config.getConfigValue() : null;
    }

    @Override
    public Map<String, String> getWxPayConfig() {
        Map<String, String> wxPayConfig = new HashMap<>();
        wxPayConfig.put("appid", getConfigValue("wx_appid"));
        wxPayConfig.put("secret", getConfigValue("wx_secret"));
        wxPayConfig.put("mchid", getConfigValue("wx_mchid"));
        wxPayConfig.put("key", getConfigValue("wx_key"));
        wxPayConfig.put("notifyUrl", getConfigValue("wx_notify_url"));
        return wxPayConfig;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateConfig(String key, String value) {
        LambdaQueryWrapper<SystemConfig> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SystemConfig::getConfigKey, key);
        SystemConfig config = getOne(queryWrapper);
        if (config == null) {
            throw new BusinessException("配置不存在");
        }
        config.setConfigValue(value);
        return updateById(config);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateConfigBatch(Map<String, String> configs) {
        if (configs == null || configs.isEmpty()) {
            return false;
        }

        for (Map.Entry<String, String> entry : configs.entrySet()) {
            updateConfig(entry.getKey(), entry.getValue());
        }
        return true;
    }
} 