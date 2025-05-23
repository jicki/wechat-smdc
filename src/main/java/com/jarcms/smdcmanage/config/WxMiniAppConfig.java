package com.jarcms.smdcmanage.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 微信小程序配置
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "wx.miniapp")
public class WxMiniAppConfig {

    /**
     * 设置微信小程序的appid
     */
    private String appid;

    /**
     * 设置微信小程序的Secret
     */
    private String secret;

    /**
     * 消息格式，XML或者JSON
     */
    private String msgDataFormat;
} 