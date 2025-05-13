package com.jarcms.smdcmanage;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import static org.junit.jupiter.api.Assertions.*;

public class PasswordTest {

    @Test
    public void testPasswordEncoding() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // 生成新的加密密码
        String rawPassword = "admin123";
        String encodedPassword = encoder.encode(rawPassword);
        System.out.println("Encoded password: " + encodedPassword);
        
        // 验证密码
        assertTrue(encoder.matches(rawPassword, encodedPassword));
        
        // 验证数据库中的密码
        String dbPassword = "$2a$10$zH7.oZAIQUxVBrQKyqQVsuXToX6EkJqHw3y6mIkHMBVHBJDLfR7Hy";
        assertTrue(encoder.matches(rawPassword, dbPassword));
    }
} 