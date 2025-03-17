package com.jarcms.smdcmanage.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.jarcms.smdcmanage.common.Result;
import com.jarcms.smdcmanage.entity.DishCategory;
import com.jarcms.smdcmanage.service.DishCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

/**
 * 菜品分类控制器
 */
@RestController
@RequestMapping("/api/dish/category")
public class DishCategoryController {

    @Autowired
    private DishCategoryService dishCategoryService;

    /**
     * 分页查询菜品分类
     */
    @GetMapping("/page")
    public Result<Page<DishCategory>> page(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "name", required = false) String name,
            HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        Page<DishCategory> categoryPage = dishCategoryService.page(page, size, name);
        return Result.success(categoryPage);
    }

    /**
     * 获取所有启用的分类
     */
    @GetMapping("/list")
    public Result<List<DishCategory>> list() {
        List<DishCategory> categoryList = dishCategoryService.listEnabled();
        return Result.success(categoryList);
    }

    /**
     * 新增分类
     */
    @PostMapping("/add")
    public Result<Void> add(@RequestBody @Valid DishCategory dishCategory, HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        dishCategoryService.add(dishCategory);
        return Result.success();
    }

    /**
     * 修改分类
     */
    @PostMapping("/update")
    public Result<Void> update(@RequestBody @Valid DishCategory dishCategory, HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        dishCategoryService.update(dishCategory);
        return Result.success();
    }

    /**
     * 删除分类
     */
    @PostMapping("/delete")
    public Result<Void> delete(@RequestParam("id") Long id, HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        dishCategoryService.remove(id);
        return Result.success();
    }

    /**
     * 启用/禁用分类
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
        dishCategoryService.updateStatus(id, status);
        return Result.success();
    }
} 