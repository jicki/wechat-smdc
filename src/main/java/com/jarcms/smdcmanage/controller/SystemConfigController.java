package com.jarcms.smdcmanage.controller;

import com.jarcms.smdcmanage.common.Result;
import com.jarcms.smdcmanage.entity.SystemConfig;
import com.jarcms.smdcmanage.service.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 系统配置控制器
 */
@RestController
@RequestMapping("/api/config")
public class SystemConfigController {

    @Autowired
    private SystemConfigService systemConfigService;

    /**
     * 获取所有配置（管理员）
     */
    @GetMapping("/list")
    public Result<List<SystemConfig>> list(HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        List<SystemConfig> configList = systemConfigService.listAll();
        return Result.success(configList);
    }

    /**
     * 获取配置值
     */
    @GetMapping("/value")
    public Result<String> getValue(@RequestParam("key") String key, HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        String value = systemConfigService.getConfigValue(key);
        return Result.success(value);
    }

    /**
     * 更新配置（管理员）
     */
    @PostMapping("/update")
    public Result<Void> update(
            @RequestParam("key") String key,
            @RequestParam("value") String value,
            HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        systemConfigService.updateConfig(key, value);
        return Result.success();
    }

    /**
     * 批量更新配置（管理员）
     */
    @PostMapping("/updateBatch")
    public Result<Void> updateBatch(@RequestBody Map<String, String> configs, HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        systemConfigService.updateConfigBatch(configs);
        return Result.success();
    }

    /**
     * 获取微信支付配置（管理员）
     */
    @GetMapping("/wxpay")
    public Result<Map<String, String>> getWxPayConfig(HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        Map<String, String> wxPayConfig = systemConfigService.getWxPayConfig();
        return Result.success(wxPayConfig);
    }
    
    /**
     * 获取微信小程序配置（管理员）
     */
    @GetMapping("/wxminiapp")
    public Result<Map<String, String>> getWxMiniAppConfig(HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        
        Map<String, String> wxMiniAppConfig = new HashMap<>();
        wxMiniAppConfig.put("appid", systemConfigService.getConfigValue("wx.appid"));
        wxMiniAppConfig.put("appsecret", systemConfigService.getConfigValue("wx.appsecret"));
        
        return Result.success(wxMiniAppConfig);
    }
} 