package com.jarcms.smdcmanage.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jarcms.smdcmanage.entity.Dish;
import com.jarcms.smdcmanage.exception.BusinessException;
import com.jarcms.smdcmanage.mapper.DishMapper;
import com.jarcms.smdcmanage.service.DishService;
import com.jarcms.smdcmanage.utils.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 菜品服务实现类
 */
@Service
public class DishServiceImpl extends ServiceImpl<DishMapper, Dish> implements DishService {

    @Autowired
    private FileUtil fileUtil;

    @Override
    public Page<Dish> page(int page, int size, String name, Long categoryId) {
        LambdaQueryWrapper<Dish> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.like(StringUtils.hasText(name), Dish::getName, name);
        queryWrapper.eq(categoryId != null, Dish::getCategoryId, categoryId);
        queryWrapper.orderByAsc(Dish::getSort);
        return page(new Page<>(page, size), queryWrapper);
    }

    @Override
    public List<Dish> listByCategoryId(Long categoryId) {
        LambdaQueryWrapper<Dish> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Dish::getCategoryId, categoryId);
        queryWrapper.eq(Dish::getStatus, 0); // 只查询上架的菜品
        queryWrapper.orderByAsc(Dish::getSort);
        return list(queryWrapper);
    }

    @Override
    public List<Dish> listAll() {
        LambdaQueryWrapper<Dish> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Dish::getStatus, 0); // 只查询上架的菜品
        queryWrapper.orderByAsc(Dish::getCategoryId); // 按分类ID排序
        queryWrapper.orderByAsc(Dish::getSort); // 按排序字段排序
        return list(queryWrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean add(Dish dish) {
        // 直接保存菜品信息，图片URL已经在前端通过单独的上传接口获取
        return save(dish);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean update(Dish dish) {
        // 获取原菜品信息
        Dish oldDish = getById(dish.getId());
        if (oldDish == null) {
            throw new BusinessException("菜品不存在");
        }

        // 直接更新菜品信息，图片URL已经在前端通过单独的上传接口获取
        return updateById(dish);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean remove(Long id) {
        // 获取菜品信息
        Dish dish = getById(id);
        if (dish == null) {
            throw new BusinessException("菜品不存在");
        }

        // 删除图片
        if (StringUtils.hasText(dish.getImage())) {
            fileUtil.deleteFile(dish.getImage());
        }

        return removeById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean removeBatch(List<Long> ids) {
        // 获取菜品信息
        List<Dish> dishes = listByIds(ids);
        if (dishes.isEmpty()) {
            throw new BusinessException("菜品不存在");
        }

        // 删除图片
        for (Dish dish : dishes) {
            if (StringUtils.hasText(dish.getImage())) {
                fileUtil.deleteFile(dish.getImage());
            }
        }

        return removeByIds(ids);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateStatus(Long id, Integer status) {
        Dish dish = getById(id);
        if (dish == null) {
            throw new BusinessException("菜品不存在");
        }
        dish.setStatus(status);
        return updateById(dish);
    }
} 