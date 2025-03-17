package com.jarcms.smdcmanage.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jarcms.smdcmanage.entity.Dish;
import com.jarcms.smdcmanage.entity.DishCategory;
import com.jarcms.smdcmanage.exception.BusinessException;
import com.jarcms.smdcmanage.mapper.DishCategoryMapper;
import com.jarcms.smdcmanage.mapper.DishMapper;
import com.jarcms.smdcmanage.service.DishCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 菜品分类服务实现类
 */
@Service
public class DishCategoryServiceImpl extends ServiceImpl<DishCategoryMapper, DishCategory> implements DishCategoryService {

    @Autowired
    private DishMapper dishMapper;

    @Override
    public Page<DishCategory> page(int page, int size, String name) {
        LambdaQueryWrapper<DishCategory> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.like(StringUtils.hasText(name), DishCategory::getName, name);
        queryWrapper.orderByAsc(DishCategory::getSort);
        return page(new Page<>(page, size), queryWrapper);
    }

    @Override
    public List<DishCategory> listEnabled() {
        LambdaQueryWrapper<DishCategory> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DishCategory::getStatus, 0);
        queryWrapper.orderByAsc(DishCategory::getSort);
        return list(queryWrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean add(DishCategory dishCategory) {
        // 检查分类名称是否已存在
        LambdaQueryWrapper<DishCategory> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DishCategory::getName, dishCategory.getName());
        if (count(queryWrapper) > 0) {
            throw new BusinessException("分类名称已存在");
        }
        return save(dishCategory);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean update(DishCategory dishCategory) {
        // 检查分类名称是否已存在
        LambdaQueryWrapper<DishCategory> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DishCategory::getName, dishCategory.getName());
        queryWrapper.ne(DishCategory::getId, dishCategory.getId());
        if (count(queryWrapper) > 0) {
            throw new BusinessException("分类名称已存在");
        }
        return updateById(dishCategory);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean remove(Long id) {
        // 检查分类下是否有菜品
        LambdaQueryWrapper<Dish> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Dish::getCategoryId, id);
        if (dishMapper.selectCount(queryWrapper) > 0) {
            throw new BusinessException("该分类下有菜品，不能删除");
        }
        return removeById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateStatus(Long id, Integer status) {
        DishCategory dishCategory = getById(id);
        if (dishCategory == null) {
            throw new BusinessException("分类不存在");
        }
        dishCategory.setStatus(status);
        return updateById(dishCategory);
    }
} 