package com.jarcms.smdcmanage.enums;

import lombok.Getter;

/**
 * 支付方式枚举
 */
@Getter
public enum PayMethodEnum {

    /**
     * 微信支付
     */
    WECHAT_PAY(0, "微信支付");

    private final Integer code;
    private final String desc;

    PayMethodEnum(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    /**
     * 根据code获取枚举
     */
    public static PayMethodEnum getByCode(Integer code) {
        if (code == null) {
            return null;
        }
        for (PayMethodEnum value : PayMethodEnum.values()) {
            if (value.getCode().equals(code)) {
                return value;
            }
        }
        return null;
    }

    /**
     * 根据code获取描述
     */
    public static String getDescByCode(Integer code) {
        PayMethodEnum payMethodEnum = getByCode(code);
        return payMethodEnum == null ? "" : payMethodEnum.getDesc();
    }
} 