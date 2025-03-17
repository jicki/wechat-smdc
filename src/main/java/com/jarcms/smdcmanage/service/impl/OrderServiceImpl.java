package com.jarcms.smdcmanage.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jarcms.smdcmanage.entity.Order;
import com.jarcms.smdcmanage.entity.OrderDetail;
import com.jarcms.smdcmanage.entity.User;
import com.jarcms.smdcmanage.exception.BusinessException;
import com.jarcms.smdcmanage.mapper.OrderDetailMapper;
import com.jarcms.smdcmanage.mapper.OrderMapper;
import com.jarcms.smdcmanage.mapper.UserMapper;
import com.jarcms.smdcmanage.service.OrderService;
import com.jarcms.smdcmanage.vo.OrderVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 订单服务实现类
 */
@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    @Autowired
    private OrderDetailMapper orderDetailMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String createOrder(OrderVO orderVO) {
        // 生成订单号
        String orderNo = generateOrderNo();
        Order order = new Order();
        BeanUtils.copyProperties(orderVO, order);
        order.setOrderNo(orderNo);
        order.setStatus(0); // 待支付
        // 保存订单
        save(order);

        // 保存订单详情
        List<OrderDetail> orderDetails = orderVO.getOrderDetails();
        if (orderDetails != null && !orderDetails.isEmpty()) {
            for (OrderDetail orderDetail : orderDetails) {
                orderDetail.setOrderId(order.getId());
                orderDetailMapper.insert(orderDetail);
            }
        }

        return orderNo;
    }

    @Override
    public Map<String, Object> payOrder(String orderNo) {
        // 查询订单
        Order order = getOrderByOrderNo(orderNo);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new BusinessException("订单状态不正确");
        }

        // TODO: 调用微信支付接口
        Map<String, Object> result = new HashMap<>();
        result.put("orderNo", orderNo);
        result.put("totalAmount", order.getTotalAmount());
        // 模拟支付成功
        order.setStatus(1); // 已完成
        order.setPayTime(LocalDateTime.now());
        updateById(order);

        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean cancelOrder(Long id) {
        // 查询订单
        Order order = getById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new BusinessException("只有待支付的订单才能取消");
        }

        // 更新订单状态
        order.setStatus(2); // 已取消
        order.setCancelTime(LocalDateTime.now());
        return updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean completeOrder(Long id) {
        Order order = getById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new BusinessException("订单状态不正确，只能完成待支付的订单");
        }

        order.setStatus(1); // 已完成
        return updateById(order);
    }

    @Override
    public OrderVO getOrderDetail(Long id) {
        // 查询订单
        Order order = getById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }

        // 查询订单详情
        LambdaQueryWrapper<OrderDetail> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(OrderDetail::getOrderId, id);
        List<OrderDetail> orderDetails = orderDetailMapper.selectList(queryWrapper);

        // 查询用户信息
        User user = userMapper.selectById(order.getUserId());

        // 组装VO
        OrderVO orderVO = new OrderVO();
        BeanUtils.copyProperties(order, orderVO);
        orderVO.setOrderDetails(orderDetails);
        if (user != null) {
            orderVO.setNickname(user.getNickname());
            orderVO.setPhone(user.getPhone());
        }

        return orderVO;
    }

    @Override
    public OrderVO getOrderDetailByOrderNo(String orderNo) {
        // 查询订单
        Order order = getOrderByOrderNo(orderNo);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }

        // 查询订单详情
        LambdaQueryWrapper<OrderDetail> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(OrderDetail::getOrderId, order.getId());
        List<OrderDetail> orderDetails = orderDetailMapper.selectList(queryWrapper);

        // 查询用户信息
        User user = userMapper.selectById(order.getUserId());

        // 组装VO
        OrderVO orderVO = new OrderVO();
        BeanUtils.copyProperties(order, orderVO);
        orderVO.setOrderDetails(orderDetails);
        if (user != null) {
            orderVO.setNickname(user.getNickname());
            orderVO.setPhone(user.getPhone());
        }

        return orderVO;
    }

    @Override
    public Page<OrderVO> page(int page, int size, Long userId, Integer status, String orderNo, String beginTime, String endTime) {
        // 查询订单
        Page<Order> orderPage = new Page<>(page, size);
        LambdaQueryWrapper<Order> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(userId != null, Order::getUserId, userId);
        queryWrapper.eq(status != null, Order::getStatus, status);
        queryWrapper.like(StringUtils.hasText(orderNo), Order::getOrderNo, orderNo);

        // 时间范围查询
        if (StringUtils.hasText(beginTime) && StringUtils.hasText(endTime)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime begin = LocalDateTime.parse(beginTime, formatter);
            LocalDateTime end = LocalDateTime.parse(endTime, formatter);
            queryWrapper.between(Order::getCreateTime, begin, end);
        }

        queryWrapper.orderByDesc(Order::getCreateTime);
        page(orderPage, queryWrapper);

        // 组装VO
        List<Order> records = orderPage.getRecords();
        List<OrderVO> orderVOList = new ArrayList<>();

        if (!records.isEmpty()) {
            // 获取所有订单ID
            List<Long> orderIds = records.stream().map(Order::getId).collect(Collectors.toList());
            // 查询所有订单详情
            LambdaQueryWrapper<OrderDetail> detailQueryWrapper = new LambdaQueryWrapper<>();
            detailQueryWrapper.in(OrderDetail::getOrderId, orderIds);
            List<OrderDetail> orderDetails = orderDetailMapper.selectList(detailQueryWrapper);
            // 按订单ID分组
            Map<Long, List<OrderDetail>> detailMap = orderDetails.stream()
                    .collect(Collectors.groupingBy(OrderDetail::getOrderId));

            // 获取所有用户ID
            List<Long> userIds = records.stream().map(Order::getUserId).distinct().collect(Collectors.toList());
            // 查询所有用户
            LambdaQueryWrapper<User> userQueryWrapper = new LambdaQueryWrapper<>();
            userQueryWrapper.in(User::getId, userIds);
            List<User> users = userMapper.selectList(userQueryWrapper);
            // 按用户ID分组
            Map<Long, User> userMap = users.stream().collect(Collectors.toMap(User::getId, user -> user));

            // 组装VO
            for (Order order : records) {
                OrderVO orderVO = new OrderVO();
                BeanUtils.copyProperties(order, orderVO);
                // 设置订单详情
                orderVO.setOrderDetails(detailMap.get(order.getId()));
                // 设置用户信息
                User user = userMap.get(order.getUserId());
                if (user != null) {
                    orderVO.setNickname(user.getNickname());
                    orderVO.setPhone(user.getPhone());
                }
                orderVOList.add(orderVO);
            }
        }

        // 创建VO分页对象
        Page<OrderVO> orderVOPage = new Page<>(page, size, orderPage.getTotal());
        orderVOPage.setRecords(orderVOList);

        return orderVOPage;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean payNotify(String orderNo) {
        // 查询订单
        Order order = getOrderByOrderNo(orderNo);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 0) {
            return true; // 订单已处理，直接返回成功
        }

        // 更新订单状态
        order.setStatus(1); // 已完成
        order.setPayTime(LocalDateTime.now());
        return updateById(order);
    }

    @Override
    public int countByTime(LocalDateTime startTime, LocalDateTime endTime) {
        return 0;
    }

    @Override
    public BigDecimal sumAmountByTime(LocalDateTime startTime, LocalDateTime endTime) {
        return null;
    }

    /**
     * 根据订单号查询订单
     */
    private Order getOrderByOrderNo(String orderNo) {
        LambdaQueryWrapper<Order> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Order::getOrderNo, orderNo);
        return getOne(queryWrapper);
    }

    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        return System.currentTimeMillis() + String.format("%06d", (int) (Math.random() * 1000000));
    }
}
