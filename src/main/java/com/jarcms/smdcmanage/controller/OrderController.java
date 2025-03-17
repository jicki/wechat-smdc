package com.jarcms.smdcmanage.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.jarcms.smdcmanage.common.Result;
import com.jarcms.smdcmanage.service.OrderService;
import com.jarcms.smdcmanage.vo.OrderVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Map;

/**
 * 订单控制器
 */
@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * 创建订单
     */
    @PostMapping("/create")
    public Result<String> create(@RequestBody @Valid OrderVO orderVO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        orderVO.setUserId(userId);
        String orderNo = orderService.createOrder(orderVO);
        return Result.success(orderNo);
    }

    /**
     * 支付订单
     */
    @PostMapping("/pay")
    public Result<Map<String, Object>> pay(@RequestBody Map<String, String> params) {
        String orderNo = params.get("orderNo");
        if (orderNo == null || orderNo.isEmpty()) {
            return Result.failed("订单号不能为空");
        }
        Map<String, Object> result = orderService.payOrder(orderNo);
        return Result.success(result);
    }

    /**
     * 取消订单
     */
    @PostMapping("/cancel")
    public Result<Void> cancel(@RequestParam(value = "id", required = false) Long id, 
                              @RequestParam(value = "orderNo", required = false) String orderNo,
                              @RequestBody(required = false) Map<String, Object> requestBody,
                              HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        
        // 如果请求参数中没有orderNo，尝试从请求体中获取
        if (orderNo == null && requestBody != null && requestBody.containsKey("orderNo")) {
            orderNo = String.valueOf(requestBody.get("orderNo"));
        }
        
        // 检查参数
        if (id == null && (orderNo == null || orderNo.isEmpty())) {
            return Result.failed("订单ID或订单号不能为空");
        }
        
        OrderVO orderVO;
        
        // 根据ID或订单号获取订单
        if (id != null) {
            orderVO = orderService.getOrderDetail(id);
        } else {
            orderVO = orderService.getOrderDetailByOrderNo(orderNo);
        }
        
        // 检查订单是否存在
        if (orderVO == null) {
            return Result.failed("订单不存在");
        }
        
        // 检查订单是否属于当前用户
        if (!orderVO.getUserId().equals(userId)) {
            return Result.forbidden();
        }
        
        // 取消订单
        orderService.cancelOrder(orderVO.getId());
        
        return Result.success();
    }

    /**
     * 完成订单（管理员）
     */
    @PostMapping("/complete")
    public Result<Void> complete(@RequestParam("id") Long id, HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        orderService.completeOrder(id);
        return Result.success();
    }

    /**
     * 查询订单详情（根据ID）
     */
    @GetMapping("/detail")
    public Result<OrderVO> detail(@RequestParam("id") Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        Integer role = (Integer) request.getAttribute("role");
        // 检查订单是否属于当前用户或者是管理员
        OrderVO orderVO = orderService.getOrderDetail(id);
        if (role != 1 && !orderVO.getUserId().equals(userId)) {
            return Result.forbidden();
        }
        return Result.success(orderVO);
    }

    /**
     * 查询订单详情（根据订单号）
     */
    @GetMapping("/detailByOrderNo")
    public Result<OrderVO> detailByOrderNo(@RequestParam("orderNo") String orderNo, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        Integer role = (Integer) request.getAttribute("role");
        // 检查订单是否属于当前用户或者是管理员
        OrderVO orderVO = orderService.getOrderDetailByOrderNo(orderNo);
        if (role != 1 && !orderVO.getUserId().equals(userId)) {
            return Result.forbidden();
        }
        return Result.success(orderVO);
    }

    /**
     * 分页查询订单（用户）
     */
    @GetMapping("/page")
    public Result<Page<OrderVO>> page(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "status", required = false) Integer status,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        Page<OrderVO> orderPage = orderService.page(page, size, userId, status, null, null, null);
        return Result.success(orderPage);
    }

    /**
     * 分页查询订单（管理员）
     */
    @GetMapping("/pageAdmin")
    public Result<Page<OrderVO>> pageAdmin(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "status", required = false) Integer status,
            @RequestParam(value = "orderNo", required = false) String orderNo,
            @RequestParam(value = "beginTime", required = false) String beginTime,
            @RequestParam(value = "endTime", required = false) String endTime,
            HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        Page<OrderVO> orderPage = orderService.page(page, size, userId, status, orderNo, beginTime, endTime);
        return Result.success(orderPage);
    }

    /**
     * 支付回调
     */
    @PostMapping("/payNotify")
    public Result<Void> payNotify(@RequestParam("orderNo") String orderNo) {
        orderService.payNotify(orderNo);
        return Result.success();
    }
}
