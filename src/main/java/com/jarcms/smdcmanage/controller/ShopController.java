package com.jarcms.smdcmanage.controller;

import com.jarcms.smdcmanage.common.Result;
import com.jarcms.smdcmanage.entity.Shop;
import com.jarcms.smdcmanage.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 * 店铺控制器
 */
@RestController
@RequestMapping("/api/shop")
public class ShopController {

    @Autowired
    private ShopService shopService;

    /**
     * 获取店铺信息
     */
    @GetMapping("/info")
    public Result<Shop> info() {
        Shop shop = shopService.getShopInfo();
        return Result.success(shop);
    }
    
    /**
     * 获取店铺列表（单店模式，只返回一个店铺）
     */
    @GetMapping("/list")
    public Result<List<Shop>> list() {
        Shop shop = shopService.getShopInfo();
        List<Shop> shopList = new ArrayList<>();
        if (shop != null) {
            shopList.add(shop);
        }
        return Result.success(shopList);
    }
    
    /**
     * 获取店铺详情
     */
    @GetMapping("/detail")
    public Result<Shop> detail(@RequestParam("id") Long id) {
        // 单店模式，忽略id参数，直接返回店铺信息
        Shop shop = shopService.getShopInfo();
        return Result.success(shop);
    }

    /**
     * 更新店铺信息（管理员）
     */
    @PostMapping("/update")
    public Result<Void> update(@RequestBody @Valid Shop shop, HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        shopService.updateShopInfo(shop);
        return Result.success();
    }

    /**
     * 上传店铺Logo（管理员）
     */
    @PostMapping("/uploadLogo")
    public Result<String> uploadLogo(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        String logoUrl = shopService.uploadLogo(file);
        return Result.success(logoUrl);
    }

    /**
     * 更新店铺状态（管理员）
     */
    @PostMapping("/updateStatus")
    public Result<Void> updateStatus(@RequestParam("status") Integer status, HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        shopService.updateStatus(status);
        return Result.success();
    }
} 