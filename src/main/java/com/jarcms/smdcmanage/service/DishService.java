package com.jarcms.smdcmanage.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.jarcms.smdcmanage.entity.Dish;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 菜品服务接口
 */
public interface DishService extends IService<Dish> {

    /**
     * 分页查询菜品
     *
     * @param page       页码
     * @param size       每页数量
     * @param name       菜品名称
     * @param categoryId 分类ID
     * @return 分页结果
     */
    Page<Dish> page(int page, int size, String name, Long categoryId);

    /**
     * 根据分类ID查询菜品列表
     *
     * @param categoryId 分类ID
     * @return 菜品列表
     */
    List<Dish> listByCategoryId(Long categoryId);

    /**
     * 查询所有上架的菜品
     *
     * @return 菜品列表
     */
    List<Dish> listAll();

    /**
     * 新增菜品
     *
     * @param dish 菜品信息
     * @return 是否成功
     */
    boolean add(Dish dish);

    /**
     * 修改菜品
     *
     * @param dish 菜品信息
     * @return 是否成功
     */
    boolean update(Dish dish);

    /**
     * 删除菜品
     *
     * @param id 菜品ID
     * @return 是否成功
     */
    boolean remove(Long id);

    /**
     * 批量删除菜品
     *
     * @param ids 菜品ID列表
     * @return 是否成功
     */
    boolean removeBatch(List<Long> ids);

    /**
     * 上架/下架菜品
     *
     * @param id     菜品ID
     * @param status 状态
     * @return 是否成功
     */
    boolean updateStatus(Long id, Integer status);
} 