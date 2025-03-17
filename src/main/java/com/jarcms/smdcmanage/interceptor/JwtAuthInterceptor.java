package com.jarcms.smdcmanage.interceptor;

import com.jarcms.smdcmanage.exception.BusinessException;
import com.jarcms.smdcmanage.utils.JwtTokenUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.List;

/**
 * JWT认证拦截器
 */
@Slf4j
@Component
public class JwtAuthInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    // 不需要认证的路径
    private static final List<String> WHITE_LIST = Arrays.asList(
        "/api/user/login",
        "/api/user/register",
        "/api/shop/info",
        "/api/shop/list",
        "/api/shop/detail",
        "/api/dish/category/list",
        "/api/dish/list",
        "/uploads/"
    );

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 如果不是映射到方法，直接通过
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        
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
        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        // 如果是小程序的请求，为了方便测试，设置一个默认用户ID
        if (!StringUtils.hasText(token) && isFromMiniApp(request)) {
            request.setAttribute("userId", 1L);
            request.setAttribute("role", 0); // 0: 普通用户
            return true;
        }

        // 验证token是否有效
        if (!StringUtils.hasText(token) || !jwtTokenUtil.validateToken(token)) {
            throw new BusinessException("未登录或token已过期");
        }

        // 将用户ID和角色存入请求属性中，方便后续使用
        request.setAttribute("userId", jwtTokenUtil.getUserIdFromToken(token));
        request.setAttribute("role", jwtTokenUtil.getRoleFromToken(token));

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