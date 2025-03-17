package com.jarcms.smdcmanage.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jarcms.smdcmanage.exception.BusinessException;
import com.jarcms.smdcmanage.service.SystemConfigService;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.AlgorithmParameters;
import java.security.Security;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * 微信小程序工具类
 */
@Slf4j
@Component
public class WxMiniAppUtil {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private SystemConfigService systemConfigService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 获取微信小程序 session_key 和 openid
     *
     * @param code 登录时获取的 code
     * @return Map<String, String> 包含 session_key 和 openid
     */
    public Map<String, String> getSessionKeyAndOpenid(String code) {
        // 获取微信小程序配置
        String appId = systemConfigService.getConfigValue("wx.appid");
        String appSecret = systemConfigService.getConfigValue("wx.appsecret");

        if (appId == null || appSecret == null) {
            throw new BusinessException("微信小程序配置不完整");
        }

        // 请求微信接口获取 session_key 和 openid
        String url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appId +
                "&secret=" + appSecret +
                "&js_code=" + code +
                "&grant_type=authorization_code";

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String responseBody = response.getBody();

        try {
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            
            // 检查是否有错误
            if (jsonNode.has("errcode") && jsonNode.get("errcode").asInt() != 0) {
                log.error("获取微信session_key和openid失败: {}", responseBody);
                throw new BusinessException("微信登录失败: " + jsonNode.get("errmsg").asText());
            }

            // 获取 session_key 和 openid
            String sessionKey = jsonNode.get("session_key").asText();
            String openid = jsonNode.get("openid").asText();

            Map<String, String> result = new HashMap<>();
            result.put("session_key", sessionKey);
            result.put("openid", openid);
            return result;
        } catch (Exception e) {
            log.error("解析微信返回数据失败", e);
            throw new BusinessException("微信登录失败");
        }
    }

    /**
     * 解密微信小程序获取的加密手机号
     *
     * @param encryptedData 加密数据
     * @param iv            加密算法的初始向量
     * @param sessionKey    会话密钥
     * @return 解密后的手机号
     */
    public String decryptPhoneNumber(String encryptedData, String iv, String sessionKey) {
        try {
            // 初始化 BouncyCastle 加密库
            if (Security.getProvider("BC") == null) {
                Security.addProvider(new BouncyCastleProvider());
            }

            // Base64 解码
            byte[] encryptedDataBytes = Base64.getDecoder().decode(encryptedData);
            byte[] ivBytes = Base64.getDecoder().decode(iv);
            byte[] sessionKeyBytes = Base64.getDecoder().decode(sessionKey);

            // 设置解密参数
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS7Padding", "BC");
            SecretKeySpec secretKeySpec = new SecretKeySpec(sessionKeyBytes, "AES");
            AlgorithmParameters parameters = AlgorithmParameters.getInstance("AES");
            parameters.init(new IvParameterSpec(ivBytes));

            // 执行解密
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, parameters);
            byte[] decryptedBytes = cipher.doFinal(encryptedDataBytes);
            String decryptedData = new String(decryptedBytes, StandardCharsets.UTF_8);

            // 解析 JSON 数据
            JsonNode jsonNode = objectMapper.readTree(decryptedData);
            return jsonNode.get("phoneNumber").asText();
        } catch (Exception e) {
            log.error("解密手机号失败", e);
            throw new BusinessException("解密手机号失败");
        }
    }
} 