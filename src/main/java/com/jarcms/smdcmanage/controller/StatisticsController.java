package com.jarcms.smdcmanage.controller;

import com.jarcms.smdcmanage.common.Result;
import com.jarcms.smdcmanage.service.DishService;
import com.jarcms.smdcmanage.service.OrderService;
import com.jarcms.smdcmanage.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 统计控制器
 */
@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private DishService dishService;

    /**
     * 获取统计数据
     * @return 统计数据
     */
    @GetMapping
    public Result<Map<String, Object>> getStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 获取用户总数
        long userCount = userService.count();
        statistics.put("userCount", userCount);
        
        // 获取菜品总数
        long dishCount = dishService.count();
        statistics.put("dishCount", dishCount);
        
        // 获取今日订单数和收入
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime todayEnd = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        
        int todayOrderCount = orderService.countByTime(todayStart, todayEnd);
        BigDecimal todayIncome = orderService.sumAmountByTime(todayStart, todayEnd);
        
        statistics.put("todayOrderCount", todayOrderCount);
        statistics.put("todayIncome", todayIncome);
        
        return Result.success(statistics);
    }

    /**
     * 获取订单统计数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单统计数据
     */
    @GetMapping("/order")
    public Result<Map<String, Object>> getOrderStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        // 这里可以根据日期范围查询订单统计数据
        // 实际项目中应该实现具体的统计逻辑
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("orderCount", 100);
        statistics.put("totalAmount", 5000);
        statistics.put("averageAmount", 50);
        return Result.success(statistics);
    }

    /**
     * 获取用户统计数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 用户统计数据
     */
    @GetMapping("/user")
    public Result<Map<String, Object>> getUserStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        // 这里可以根据日期范围查询用户统计数据
        // 实际项目中应该实现具体的统计逻辑
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("newUserCount", 20);
        statistics.put("activeUserCount", 50);
        return Result.success(statistics);
    }

    /**
     * 获取菜品销售统计数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 菜品销售统计数据
     */
    @GetMapping("/dish")
    public Result<Map<String, Object>> getDishStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        // 这里可以根据日期范围查询菜品销售统计数据
        // 实际项目中应该实现具体的统计逻辑
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("topSelling", new Object[]{"红烧肉", "鱼香肉丝", "宫保鸡丁"});
        statistics.put("totalSales", 200);
        return Result.success(statistics);
    }
} 