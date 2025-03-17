package com.jarcms.smdcmanage.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.jarcms.smdcmanage.common.Result;
import com.jarcms.smdcmanage.entity.Dish;
import com.jarcms.smdcmanage.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

/**
 * 菜品控制器
 */
@RestController
@RequestMapping("/api/dish")
public class DishController {

    @Autowired
    private DishService dishService;

    /**
     * 分页查询菜品
     */
    @GetMapping("/page")
    public Result<Page<Dish>> page(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        Page<Dish> dishPage = dishService.page(page, size, name, categoryId);
        return Result.success(dishPage);
    }

    /**
     * 根据分类ID查询菜品列表
     */
    @GetMapping("/list")
    public Result<List<Dish>> list(@RequestParam(value = "categoryId", required = false) Long categoryId) {
        // 如果提供了分类ID，则按分类查询
        if (categoryId != null) {
            List<Dish> dishList = dishService.listByCategoryId(categoryId);
            return Result.success(dishList);
        } else {
            // 否则返回所有上架的菜品
            List<Dish> dishList = dishService.listAll();
            return Result.success(dishList);
        }
    }

    /**
     * 获取所有菜品信息
     */
    @GetMapping("/listAll")
    public Result<List<Dish>> listAll() {
        List<Dish> dishList = dishService.listAll();
        return Result.success(dishList);
    }

    /**
     * 新增菜品
     */
    @PostMapping("/add")
    public Result<Void> add(
            @RequestBody @Valid Dish dish,
            HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        dishService.add(dish);
        return Result.success();
    }

    /**
     * 修改菜品
     */
    @PostMapping("/update")
    public Result<Void> update(
            @RequestBody @Valid Dish dish,
            HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        dishService.update(dish);
        return Result.success();
    }

    /**
     * 删除菜品
     */
    @PostMapping("/delete")
    public Result<Void> delete(@RequestParam("id") Long id, HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        dishService.remove(id);
        return Result.success();
    }

    /**
     * 批量删除菜品
     */
    @PostMapping("/deleteBatch")
    public Result<Void> deleteBatch(@RequestBody List<Long> ids, HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        dishService.removeBatch(ids);
        return Result.success();
    }

    /**
     * 上架/下架菜品
     */
    @PostMapping("/updateStatus")
    public Result<Void> updateStatus(
            @RequestParam("id") Long id,
            @RequestParam("status") Integer status,
            HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        dishService.updateStatus(id, status);
        return Result.success();
    }
} 