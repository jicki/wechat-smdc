package com.jarcms.smdcmanage.vo;

import com.jarcms.smdcmanage.entity.Order;
import com.jarcms.smdcmanage.entity.OrderDetail;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单VO类
 */
@Data
public class OrderVO extends Order implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 订单编号
     */
    private String orderNo;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * 用户手机号
     */
    private String phone;

    /**
     * 订单总金额
     */
    private BigDecimal totalAmount;

    /**
     * 订单状态 0-待支付 1-已完成 2-已取消
     */
    private Integer status;

    /**
     * 订单状态名称
     */
    private String statusName;

    /**
     * 支付方式 0-微信支付
     */
    private Integer payMethod;

    /**
     * 支付方式名称
     */
    private String payMethodName;

    /**
     * 支付时间
     */
    private LocalDateTime payTime;

    /**
     * 备注
     */
    private String remark;

    /**
     * 桌号
     */
    private String tableNo;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 订单详情列表
     */
    private List<OrderDetail> orderDetails;

    /**
     * 订单详情VO
     */
    @Data
    public static class OrderDetailVO implements Serializable {

        private static final long serialVersionUID = 1L;

        /**
         * 详情ID
         */
        private Long id;

        /**
         * 订单ID
         */
        private Long orderId;

        /**
         * 菜品ID
         */
        private Long dishId;

        /**
         * 菜品名称
         */
        private String dishName;

        /**
         * 菜品价格
         */
        private BigDecimal dishPrice;

        /**
         * 数量
         */
        private Integer quantity;

        /**
         * 金额
         */
        private BigDecimal amount;
    }
} 