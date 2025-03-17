package com.jarcms.smdcmanage.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 店铺实体类
 */
@Data
@TableName("shop")
public class Shop implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 店铺ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 店铺名称
     */
    private String name;

    /**
     * 店铺logo
     */
    private String logo;

    /**
     * 店铺公告
     */
    private String notice;

    /**
     * 店铺地址
     */
    private String address;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 营业时间
     */
    private String businessHours;

    /**
     * 状态 0-营业中 1-休息中
     */
    private Integer status;
    
    /**
     * 纬度
     */
    private BigDecimal latitude;
    
    /**
     * 经度
     */
    private BigDecimal longitude;
    
    /**
     * 评分
     */
    private BigDecimal rating;
    
    /**
     * 评分数量
     */
    private Integer ratingCount;
    
    /**
     * 人均消费
     */
    private BigDecimal averagePrice;
    
    /**
     * 促销信息
     */
    private String promotion;
    
    /**
     * 店铺描述
     */
    private String description;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
} 