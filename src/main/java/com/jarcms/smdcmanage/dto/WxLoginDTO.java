package com.jarcms.smdcmanage.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;

/**
 * 微信小程序登录DTO
 */
@Data
public class WxLoginDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 微信登录code
     */
    @NotBlank(message = "code不能为空")
    private String code;

    /**
     * 加密数据
     */
    private String encryptedData;

    /**
     * 加密算法的初始向量
     */
    private String iv;

    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * 用户头像
     */
    private String avatarUrl;

    /**
     * 性别 0-未知 1-男 2-女
     */
    private Integer gender;
} 