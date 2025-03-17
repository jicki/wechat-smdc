package com.jarcms.smdcmanage.interceptor;

import com.jarcms.smdcmanage.common.ResultCode;
import com.jarcms.smdcmanage.exception.BusinessException;
import com.jarcms.smdcmanage.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.List;

/**
 * 认证拦截器
 */
@Slf4j
@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Resource
    private JwtUtil jwtUtil;
    
    // 不需要认证的路径
    private static final List<String> WHITE_LIST = Arrays.asList(
        "/api/user/login",
        "/api/shop/list",
        "/api/shop/detail",
        "/api/dish/category/list",
        "/api/dish/list"
    );

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String requestURI = request.getRequestURI();
        
        // 检查是否在白名单中
        if (isInWhiteList(requestURI)) {
            // 为了方便小程序测试，设置一个默认用户ID
            request.setAttribute("userId", 1L);
            request.setAttribute("role", 0); // 0: 普通用户
            return true;
        }
        
        // 获取请求头中的token
        String token = request.getHeader("Authorization");
        if (!StringUtils.hasText(token)) {
            // 如果是小程序的请求，为了方便测试，设置一个默认用户ID
            if (isFromMiniApp(request)) {
                request.setAttribute("userId", 1L);
                request.setAttribute("role", 0); // 0: 普通用户
                return true;
            }
            
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        
        // 如果token以"Bearer "开头，去掉前缀
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // 验证token
        if (!jwtUtil.validateToken(token)) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }

        // 获取用户ID
        Long userId = jwtUtil.getUserIdFromToken(token);
        if (userId == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }

        // 将用户ID存入请求属性
        request.setAttribute("userId", userId);
        
        // 获取用户角色
        Integer role = jwtUtil.getRoleFromToken(token);
        request.setAttribute("role", role != null ? role : 0);
        
        return true;
    }
    
    /**
     * 检查请求是否在白名单中
     */
    private boolean isInWhiteList(String requestURI) {
        return WHITE_LIST.stream().anyMatch(requestURI::startsWith);
    }
    
    /**
     * 检查请求是否来自小程序
     */
    private boolean isFromMiniApp(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        return userAgent != null && (userAgent.contains("MicroMessenger") || userAgent.contains("miniProgram"));
    }
} 