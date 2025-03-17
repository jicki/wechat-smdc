package com.jarcms.smdcmanage.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

/**
 * 订单DTO
 */
@Data
public class OrderDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 桌号
     */
    @NotBlank(message = "桌号不能为空")
    private String tableNo;

    /**
     * 备注
     */
    private String remark;

    /**
     * 菜品列表
     */
    @NotEmpty(message = "菜品不能为空")
    private List<OrderDishDTO> dishes;

    /**
     * 订单菜品DTO
     */
    @Data
    public static class OrderDishDTO implements Serializable {

        private static final long serialVersionUID = 1L;

        /**
         * 菜品ID
         */
        @NotNull(message = "菜品ID不能为空")
        private Long dishId;

        /**
         * 数量
         */
        @NotNull(message = "菜品数量不能为空")
        private Integer quantity;
    }
} 