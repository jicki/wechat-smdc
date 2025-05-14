package com.jarcms.smdcmanage.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class AdminPasswordReset {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // 新密码
        String newPassword = "admin123";
        
        // 生成新的密码哈希
        String encodedPassword = encoder.encode(newPassword);
        
        System.out.println("新密码: " + newPassword);
        System.out.println("新密码哈希: " + encodedPassword);
        System.out.println("\n请使用以下SQL更新管理员密码：");
        System.out.println("UPDATE user SET password = '" + encodedPassword + "' WHERE phone = 'admin';");
    }
} 