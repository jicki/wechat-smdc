package com.jarcms.smdcmanage.enums;

import lombok.Getter;

/**
 * 订单状态枚举
 */
@Getter
public enum OrderStatusEnum {

    /**
     * 待支付
     */
    WAIT_PAY(0, "待支付"),

    /**
     * 已完成
     */
    COMPLETED(1, "已完成"),

    /**
     * 已取消
     */
    CANCELED(2, "已取消");

    private final Integer code;
    private final String desc;

    OrderStatusEnum(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    /**
     * 根据code获取枚举
     */
    public static OrderStatusEnum getByCode(Integer code) {
        if (code == null) {
            return null;
        }
        for (OrderStatusEnum value : OrderStatusEnum.values()) {
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
        OrderStatusEnum orderStatusEnum = getByCode(code);
        return orderStatusEnum == null ? "" : orderStatusEnum.getDesc();
    }
}