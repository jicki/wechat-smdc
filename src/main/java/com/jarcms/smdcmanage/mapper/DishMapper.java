package com.jarcms.smdcmanage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.jarcms.smdcmanage.entity.Dish;
import org.apache.ibatis.annotations.Mapper;

/**
 * 菜品Mapper接口
 */
@Mapper
public interface DishMapper extends BaseMapper<Dish> {
} 