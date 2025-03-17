package com.jarcms.smdcmanage.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * 微信小程序登录响应VO
 */
@Data
public class WxLoginVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户token
     */
    private String token;

    /**
     * 用户信息
     */
    private UserInfoVO userInfo;

    /**
     * 用户信息VO
     */
    @Data
    public static class UserInfoVO implements Serializable {

        private static final long serialVersionUID = 1L;

        /**
         * 用户ID
         */
        private Long id;

        /**
         * 手机号
         */
        private String phone;

        /**
         * 昵称
         */
        private String nickname;

        /**
         * 头像
         */
        private String avatar;

        /**
         * 性别 0-未知 1-男 2-女
         */
        private Integer gender;

        /**
         * 角色 0-普通用户 1-管理员
         */
        private Integer role;
    }
} 