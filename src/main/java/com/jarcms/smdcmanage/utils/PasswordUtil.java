package com.jarcms.smdcmanage.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public static String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    public static boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }

    public static void main(String[] args) {
        String password = "admin123";
        String encodedPassword = encode(password);
        System.out.println("原始密码: " + password);
        System.out.println("加密后的密码: " + encodedPassword);
        System.out.println("验证结果: " + matches(password, encodedPassword));
        
        // 验证数据库中的密码
        String dbPassword = "$2a$10$PY.HU/DrpG7zKQYrn0c9YOq0HW9qkGHiDjZYXJqIwkjHpQHXXAiCy";
        System.out.println("数据库密码验证结果: " + matches(password, dbPassword));
    }
} 