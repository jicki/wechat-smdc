package com.jarcms.smdcmanage.vo;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户VO
 */
@Data
public class UserVO implements Serializable {

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

    /**
     * 状态 0-正常 1-禁用
     */
    private Integer status;

    /**
     * token
     */
    private String token;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;
} 