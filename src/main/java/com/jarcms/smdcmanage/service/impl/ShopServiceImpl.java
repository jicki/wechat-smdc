package com.jarcms.smdcmanage.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jarcms.smdcmanage.entity.Shop;
import com.jarcms.smdcmanage.exception.BusinessException;
import com.jarcms.smdcmanage.mapper.ShopMapper;
import com.jarcms.smdcmanage.service.ShopService;
import com.jarcms.smdcmanage.utils.FileUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

/**
 * 店铺Service实现类
 */
@Slf4j
@Service
public class ShopServiceImpl extends ServiceImpl<ShopMapper, Shop> implements ShopService {

    @Autowired
    private FileUtil fileUtil;

    @Override
    public Shop getShopInfo() {
        Shop shop = getOne(new LambdaQueryWrapper<Shop>().last("LIMIT 1"));
        
        // 如果店铺信息不存在，创建一个默认的店铺信息
        if (shop == null) {
            shop = createDefaultShop();
            save(shop);
        }
        
        // 确保小程序需要的字段不为空
        ensureShopFields(shop);
        
        return shop;
    }
    
    /**
     * 创建默认店铺信息
     */
    private Shop createDefaultShop() {
        Shop shop = new Shop();
        shop.setName("美食餐厅");
        shop.setLogo("/uploads/default-logo.png");
        shop.setNotice("欢迎光临，请扫码点餐");
        shop.setAddress("北京市朝阳区");
        shop.setPhone("010-12345678");
        shop.setBusinessHours("09:00-22:00");
        shop.setStatus(0); // 营业中
        shop.setLatitude(new BigDecimal("39.9087"));
        shop.setLongitude(new BigDecimal("116.3975"));
        shop.setRating(new BigDecimal("4.8"));
        shop.setRatingCount(100);
        shop.setAveragePrice(new BigDecimal("50"));
        shop.setPromotion("满100减20");
        shop.setDescription("这是一家提供美味佳肴的餐厅，欢迎品尝我们的特色菜品。");
        return shop;
    }
    
    /**
     * 确保店铺字段不为空
     */
    private void ensureShopFields(Shop shop) {
        if (shop.getLatitude() == null) {
            shop.setLatitude(new BigDecimal("39.9087"));
        }
        if (shop.getLongitude() == null) {
            shop.setLongitude(new BigDecimal("116.3975"));
        }
        if (shop.getRating() == null) {
            shop.setRating(new BigDecimal("4.8"));
        }
        if (shop.getRatingCount() == null) {
            shop.setRatingCount(100);
        }
        if (shop.getAveragePrice() == null) {
            shop.setAveragePrice(new BigDecimal("50"));
        }
        if (shop.getPromotion() == null) {
            shop.setPromotion("满100减20");
        }
        if (shop.getDescription() == null) {
            shop.setDescription("这是一家提供美味佳肴的餐厅，欢迎品尝我们的特色菜品。");
        }
    }

    @Override
    public boolean updateShopInfo(Shop shop) {
        Shop existShop = getShopInfo();
        if (existShop == null) {
            throw new BusinessException("店铺信息不存在");
        }

        shop.setId(existShop.getId());
        return updateById(shop);
    }

    @Override
    public String uploadLogo(MultipartFile file) {
        // 上传文件
        String filePath = fileUtil.uploadFile(file);

        // 更新店铺Logo
        Shop shop = getShopInfo();
        if (shop == null) {
            throw new BusinessException("店铺信息不存在");
        }

        // 删除旧Logo
        if (shop.getLogo() != null) {
            fileUtil.deleteFile(shop.getLogo());
        }

        // 更新Logo
        shop.setLogo(filePath);
        updateById(shop);

        return filePath;
    }

    @Override
    public boolean updateStatus(Integer status) {
        Shop shop = getShopInfo();
        if (shop == null) {
            throw new BusinessException("店铺信息不存在");
        }

        shop.setStatus(status);
        return updateById(shop);
    }
} 