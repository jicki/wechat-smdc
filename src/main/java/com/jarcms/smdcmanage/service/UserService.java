package com.jarcms.smdcmanage.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.jarcms.smdcmanage.dto.WxLoginDTO;
import com.jarcms.smdcmanage.entity.User;
import com.jarcms.smdcmanage.vo.WxLoginVO;
import org.springframework.web.multipart.MultipartFile;

/**
 * 用户服务接口
 */
public interface UserService extends IService<User> {

    /**
     * 用户登录
     *
     * @param phone    手机号
     * @param password 密码
     * @return token
     */
    String login(String phone, String password);

    /**
     * 用户注册
     *
     * @param phone    手机号
     * @param password 密码
     * @param nickname 昵称
     * @return 是否成功
     */
    boolean register(String phone, String password, String nickname);

    /**
     * 修改密码
     *
     * @param userId      用户ID
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 是否成功
     */
    boolean updatePassword(Long userId, String oldPassword, String newPassword);

    /**
     * 上传头像
     *
     * @param userId 用户ID
     * @param file   头像文件
     * @return 头像URL
     */
    String uploadAvatar(Long userId, MultipartFile file);

    /**
     * 更新用户信息
     *
     * @param user 用户信息
     * @return 是否成功
     */
    boolean updateUserInfo(User user);

    /**
     * 分页查询用户列表
     *
     * @param page     页码
     * @param size     每页数量
     * @param phone    手机号
     * @param nickname 昵称
     * @return 分页结果
     */
    Page<User> page(int page, int size, String phone, String nickname);

    /**
     * 修改用户状态
     *
     * @param id     用户ID
     * @param status 状态
     * @return 是否成功
     */
    boolean updateStatus(Long id, Integer status);
    
    /**
     * 微信小程序登录
     *
     * @param wxLoginDTO 微信登录参数
     * @return 登录结果
     */
    WxLoginVO wxLogin(WxLoginDTO wxLoginDTO);
} 