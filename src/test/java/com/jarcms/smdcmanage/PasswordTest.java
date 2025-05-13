package com.jarcms.smdcmanage;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import static org.junit.jupiter.api.Assertions.*;

public class PasswordTest {

    @Test
    public void testPasswordEncoding() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // 测试管理员密码
        String adminPassword = "admin123";
        String dbStoredHash = "$2a$10$PY.HU/DrpG7zKQYrn0c9YOq0HW9qkGHiDjZYXJqIwkjHpQHXXAiCy";
        
        // 验证数据库中存储的密码哈希是否正确
        boolean matches = encoder.matches(adminPassword, dbStoredHash);
        assertTrue(matches, "管理员密码验证失败");
        
        // 生成新的密码哈希并验证
        String newHash = encoder.encode(adminPassword);
        assertTrue(encoder.matches(adminPassword, newHash), "新生成的密码哈希验证失败");
        
        // 验证不同的哈希值是否都能正确匹配
        for (int i = 0; i < 5; i++) {
            String hash = encoder.encode(adminPassword);
            assertTrue(encoder.matches(adminPassword, hash), 
                    "第 " + (i + 1) + " 次生成的密码哈希验证失败");
            // 确保每次生成的哈希值都不相同
            assertNotEquals(hash, newHash, "生成了相同的密码哈希");
        }
        
        // 测试错误密码
        assertFalse(encoder.matches("wrongpassword", dbStoredHash), "错误密码不应该通过验证");
    }
} 