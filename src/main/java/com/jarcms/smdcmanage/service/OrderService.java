package com.jarcms.smdcmanage.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.jarcms.smdcmanage.entity.Order;
import com.jarcms.smdcmanage.vo.OrderVO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * 订单服务接口
 */
public interface OrderService extends IService<Order> {

    /**
     * 创建订单
     *
     * @param orderVO 订单信息
     * @return 订单ID
     */
    String createOrder(OrderVO orderVO);

    /**
     * 支付订单
     *
     * @param orderNo 订单编号
     * @return 支付结果
     */
    Map<String, Object> payOrder(String orderNo);

    /**
     * 取消订单
     *
     * @param id 订单ID
     * @return 是否成功
     */
    boolean cancelOrder(Long id);

    /**
     * 完成订单
     *
     * @param id 订单ID
     * @return 是否成功
     */
    boolean completeOrder(Long id);

    /**
     * 查询订单详情
     *
     * @param id 订单ID
     * @return 订单详情
     */
    OrderVO getOrderDetail(Long id);

    /**
     * 根据订单号查询订单详情
     *
     * @param orderNo 订单编号
     * @return 订单详情
     */
    OrderVO getOrderDetailByOrderNo(String orderNo);

    /**
     * 分页查询订单
     *
     * @param page     页码
     * @param size     每页数量
     * @param userId   用户ID
     * @param status   订单状态
     * @param orderNo  订单编号
     * @param beginTime 开始时间
     * @param endTime   结束时间
     * @return 分页结果
     */
    Page<OrderVO> page(int page, int size, Long userId, Integer status, String orderNo, String beginTime, String endTime);

    /**
     * 支付回调
     *
     * @param orderNo 订单编号
     * @return 是否成功
     */
    boolean payNotify(String orderNo);

    /**
     * 统计指定时间范围内的订单数量
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 订单数量
     */
    int countByTime(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 统计指定时间范围内的订单金额总和
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 订单金额总和
     */
    BigDecimal sumAmountByTime(LocalDateTime startTime, LocalDateTime endTime);
}
