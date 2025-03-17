package com.jarcms.smdcmanage.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.jarcms.smdcmanage.entity.Shop;
import org.springframework.web.multipart.MultipartFile;

/**
 * 店铺Service接口
 */
public interface ShopService extends IService<Shop> {

    /**
     * 获取店铺信息
     *
     * @return 店铺信息
     */
    Shop getShopInfo();

    /**
     * 更新店铺信息
     *
     * @param shop 店铺信息
     * @return 是否成功
     */
    boolean updateShopInfo(Shop shop);

    /**
     * 上传店铺Logo
     *
     * @param file 文件
     * @return 文件访问路径
     */
    String uploadLogo(MultipartFile file);

    /**
     * 更新店铺状态
     *
     * @param status 状态 0-营业中 1-休息中
     * @return 是否成功
     */
    boolean updateStatus(Integer status);
} 