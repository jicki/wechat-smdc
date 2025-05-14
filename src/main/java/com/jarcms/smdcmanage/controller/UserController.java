package com.jarcms.smdcmanage.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.jarcms.smdcmanage.common.Result;
import com.jarcms.smdcmanage.dto.LoginDTO;
import com.jarcms.smdcmanage.dto.RegisterDTO;
import com.jarcms.smdcmanage.dto.UpdatePasswordDTO;
import com.jarcms.smdcmanage.dto.WxLoginDTO;
import com.jarcms.smdcmanage.entity.User;
import com.jarcms.smdcmanage.service.UserService;
import com.jarcms.smdcmanage.vo.WxLoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<String> login(@RequestBody @Valid LoginDTO loginDTO) {
        String token = userService.login(loginDTO.getPhone(), loginDTO.getPassword());
        return Result.success(token);
    }

    /**
     * 微信小程序登录
     */
    @PostMapping("/wxLogin")
    public Result<WxLoginVO> wxLogin(@RequestBody WxLoginDTO wxLoginDTO) {
        WxLoginVO wxLoginVO = userService.wxLogin(wxLoginDTO);
        return Result.success(wxLoginVO);
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public Result<Void> register(@RequestBody @Valid RegisterDTO registerDTO) {
        // 验证码校验（实际项目中需要从缓存中获取验证码进行校验）
        // 这里简单处理，验证码为123456
        if (!"123456".equals(registerDTO.getCode())) {
            return Result.failed("验证码错误");
        }
        
        userService.register(registerDTO.getPhone(), registerDTO.getPassword(), registerDTO.getNickname());
        return Result.success();
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/info")
    public Result<User> info(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        User user = userService.getById(userId);
        user.setPassword(null); // 不返回密码
        return Result.success(user);
    }

    /**
     * 修改密码
     */
    @PostMapping("/updatePassword")
    public Result<Void> updatePassword(@RequestBody @Valid UpdatePasswordDTO updatePasswordDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        userService.updatePassword(userId, updatePasswordDTO.getOldPassword(), updatePasswordDTO.getNewPassword());
        return Result.success();
    }

    /**
     * 上传头像
     */
    @PostMapping("/uploadAvatar")
    public Result<String> uploadAvatar(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String avatarUrl = userService.uploadAvatar(userId, file);
        return Result.success(avatarUrl);
    }

    /**
     * 更新用户信息
     */
    @PostMapping("/update")
    public Result<Void> update(@RequestBody User user, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        user.setId(userId);
        userService.updateUserInfo(user);
        return Result.success();
    }

    /**
     * 分页查询用户列表（管理员）
     */
    @GetMapping("/page")
    public Result<Page<User>> page(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "nickname", required = false) String nickname,
            HttpServletRequest request) {
        // 检查是否是管理员
        Integer role = (Integer) request.getAttribute("role");
        if (role != 1) {
            return Result.forbidden();
        }
        Page<User> userPage = userService.page(page, size, phone, nickname);
        // 不返回密码
        userPage.getRecords().forEach(user -> user.setPassword(null));
        return Result.success(userPage);
    }

    /**
     * 禁用/启用用户（管理员）
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
        userService.updateStatus(id, status);
        return Result.success();
    }

    /**
     * 重置管理员密码
     */
    @PostMapping("/resetAdminPassword")
    public Result<String> resetAdminPassword() {
        // 生成新的密码
        String newPassword = "admin123";
        
        // 查询管理员用户
        User admin = userService.getOne(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, "admin")
                .eq(User::getRole, 1)
                .eq(User::getDeleted, 0));
                
        if (admin == null) {
            return Result.failed("管理员用户不存在");
        }
        
        // 更新密码
        admin.setPassword(passwordEncoder.encode(newPassword));
        userService.updateById(admin);
        
        return Result.success("密码重置成功，新密码：" + newPassword);
    }
} 