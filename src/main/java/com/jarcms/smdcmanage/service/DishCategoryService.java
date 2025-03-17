package com.jarcms.smdcmanage.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.jarcms.smdcmanage.entity.DishCategory;

import java.util.List;

/**
 * 菜品分类服务接口
 */
public interface DishCategoryService extends IService<DishCategory> {

    /**
     * 分页查询菜品分类
     *
     * @param page  页码
     * @param size  每页数量
     * @param name  分类名称
     * @return 分页结果
     */
    Page<DishCategory> page(int page, int size, String name);

    /**
     * 获取所有启用的分类
     *
     * @return 分类列表
     */
    List<DishCategory> listEnabled();

    /**
     * 新增分类
     *
     * @param dishCategory 分类信息
     * @return 是否成功
     */
    boolean add(DishCategory dishCategory);

    /**
     * 修改分类
     *
     * @param dishCategory 分类信息
     * @return 是否成功
     */
    boolean update(DishCategory dishCategory);

    /**
     * 删除分类
     *
     * @param id 分类ID
     * @return 是否成功
     */
    boolean remove(Long id);

    /**
     * 启用/禁用分类
     *
     * @param id     分类ID
     * @param status 状态
     * @return 是否成功
     */
    boolean updateStatus(Long id, Integer status);
} 