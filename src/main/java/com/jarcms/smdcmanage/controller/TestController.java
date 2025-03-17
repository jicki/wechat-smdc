package com.jarcms.smdcmanage.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 测试控制器
 */
@RestController
@RequestMapping("/api/test")
public class TestController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * 测试静态资源访问
     */
    @GetMapping("/uploads")
    public Map<String, Object> testUploads() {
        Map<String, Object> result = new HashMap<>();
        
        // 获取上传目录信息
        File dir = new File(uploadDir);
        result.put("uploadDir", uploadDir);
        result.put("exists", dir.exists());
        result.put("isDirectory", dir.isDirectory());
        result.put("canRead", dir.canRead());
        result.put("absolutePath", dir.getAbsolutePath());
        
        // 获取上传目录中的文件列表
        List<Map<String, Object>> files = new ArrayList<>();
        if (dir.exists() && dir.isDirectory()) {
            File[] fileList = dir.listFiles();
            if (fileList != null) {
                for (File file : fileList) {
                    Map<String, Object> fileInfo = new HashMap<>();
                    fileInfo.put("name", file.getName());
                    fileInfo.put("size", file.length());
                    fileInfo.put("lastModified", file.lastModified());
                    fileInfo.put("url", "/uploads/" + file.getName());
                    files.add(fileInfo);
                }
            }
        }
        result.put("files", files);
        
        return result;
    }
} 