package com.jarcms.smdcmanage.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jarcms.smdcmanage.dto.WxLoginDTO;
import com.jarcms.smdcmanage.entity.User;
import com.jarcms.smdcmanage.exception.BusinessException;
import com.jarcms.smdcmanage.mapper.UserMapper;
import com.jarcms.smdcmanage.service.UserService;
import com.jarcms.smdcmanage.utils.FileUtil;
import com.jarcms.smdcmanage.utils.JwtTokenUtil;
import com.jarcms.smdcmanage.utils.WxMiniAppUtil;
import com.jarcms.smdcmanage.vo.WxLoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

/**
 * 用户服务实现类
 */
@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private FileUtil fileUtil;
    
    @Autowired
    private WxMiniAppUtil wxMiniAppUtil;

    @Override
    public String login(String phone, String password) {
        // 根据手机号查询用户
        User user = getOne(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, phone)
                .eq(User::getDeleted, 0));

        // 用户不存在
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 账号被禁用
        if (user.getStatus() == 1) {
            throw new BusinessException("账号已被禁用");
        }

        // 密码错误
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException("密码错误");
        }

        // 生成token
        return jwtTokenUtil.generateToken(user.getId(), user.getPhone(), user.getRole());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean register(String phone, String password, String nickname) {
        // 检查手机号是否已存在
        long count = count(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, phone)
                .eq(User::getDeleted, 0));
        if (count > 0) {
            throw new BusinessException("手机号已存在");
        }

        // 创建用户
        User user = new User();
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname(nickname);
        user.setRole(0); // 普通用户
        user.setStatus(0); // 正常状态

        return save(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updatePassword(Long userId, String oldPassword, String newPassword) {
        // 获取用户信息
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BusinessException("旧密码错误");
        }

        // 更新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        return updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String uploadAvatar(Long userId, MultipartFile file) {
        // 获取用户信息
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 上传文件
        String avatarUrl = fileUtil.uploadFile(file);

        // 更新用户头像
        user.setAvatar(avatarUrl);
        updateById(user);

        return avatarUrl;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateUserInfo(User user) {
        // 获取用户信息
        User dbUser = getById(user.getId());
        if (dbUser == null) {
            throw new BusinessException("用户不存在");
        }

        // 不允许修改手机号和密码
        user.setPhone(null);
        user.setPassword(null);
        user.setRole(null);
        user.setStatus(null);

        return updateById(user);
    }

    @Override
    public Page<User> page(int page, int size, String phone, String nickname) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.like(StringUtils.hasText(phone), User::getPhone, phone);
        queryWrapper.like(StringUtils.hasText(nickname), User::getNickname, nickname);
        queryWrapper.eq(User::getDeleted, 0);
        queryWrapper.orderByDesc(User::getCreateTime);
        return page(new Page<>(page, size), queryWrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateStatus(Long id, Integer status) {
        // 获取用户信息
        User user = getById(id);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 不能修改管理员状态
        if (user.getRole() == 1) {
            throw new BusinessException("不能修改管理员状态");
        }

        // 更新状态
        user.setStatus(status);
        return updateById(user);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public WxLoginVO wxLogin(WxLoginDTO wxLoginDTO) {
        // 获取微信登录信息
        Map<String, String> wxLoginInfo = wxMiniAppUtil.getSessionKeyAndOpenid(wxLoginDTO.getCode());
        String openid = wxLoginInfo.get("openid");
        String sessionKey = wxLoginInfo.get("session_key");
        
        // 查询用户是否存在
        User user = getOne(new LambdaQueryWrapper<User>()
                .eq(User::getOpenid, openid)
                .eq(User::getDeleted, 0));
        
        // 解密手机号
        String phone = null;
        if (wxLoginDTO.getEncryptedData() != null && wxLoginDTO.getIv() != null) {
            phone = wxMiniAppUtil.decryptPhoneNumber(wxLoginDTO.getEncryptedData(), wxLoginDTO.getIv(), sessionKey);
        }
        
        // 用户不存在，创建新用户
        if (user == null) {
            user = new User();
            user.setOpenid(openid);
            
            // 设置手机号
            if (phone != null) {
                // 检查手机号是否已存在
                User existUser = getOne(new LambdaQueryWrapper<User>()
                        .eq(User::getPhone, phone)
                        .eq(User::getDeleted, 0));
                
                if (existUser != null) {
                    // 如果手机号已存在但没有绑定openid，则绑定openid
                    if (existUser.getOpenid() == null) {
                        existUser.setOpenid(openid);
                        updateById(existUser);
                        user = existUser;
                    } else {
                        throw new BusinessException("该手机号已被其他微信账号绑定");
                    }
                } else {
                    user.setPhone(phone);
                }
            }
            
            // 设置昵称
            if (wxLoginDTO.getNickname() != null) {
                user.setNickname(wxLoginDTO.getNickname());
            } else {
                user.setNickname("用户" + UUID.randomUUID().toString().substring(0, 8));
            }
            
            // 设置头像
            if (wxLoginDTO.getAvatarUrl() != null) {
                user.setAvatar(wxLoginDTO.getAvatarUrl());
            }
            
            // 设置性别
            if (wxLoginDTO.getGender() != null) {
                user.setGender(wxLoginDTO.getGender());
            } else {
                user.setGender(0); // 默认未知
            }
            
            // 设置角色和状态
            user.setRole(0); // 普通用户
            user.setStatus(0); // 正常状态
            
            // 设置随机密码
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            
            // 保存用户
            save(user);
        } 
        // 用户存在但没有手机号，更新手机号
        else if (phone != null && user.getPhone() == null) {
            user.setPhone(phone);
            updateById(user);
        }
        
        // 账号被禁用
        if (user.getStatus() == 1) {
            throw new BusinessException("账号已被禁用");
        }
        
        // 生成token
        String token = jwtTokenUtil.generateToken(user.getId(), user.getPhone(), user.getRole());
        
        // 构建返回结果
        WxLoginVO wxLoginVO = new WxLoginVO();
        wxLoginVO.setToken(token);
        
        WxLoginVO.UserInfoVO userInfoVO = new WxLoginVO.UserInfoVO();
        BeanUtils.copyProperties(user, userInfoVO);
        wxLoginVO.setUserInfo(userInfoVO);
        
        return wxLoginVO;
    }
} 