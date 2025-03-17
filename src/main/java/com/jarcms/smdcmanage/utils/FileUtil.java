package com.jarcms.smdcmanage.utils;

import com.jarcms.smdcmanage.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * 文件工具类
 */
@Component
public class FileUtil {

    @Value("${file.upload-dir}")
    private String uploadDir;
    
    // 添加后端服务基础URL配置
    @Value("${server.base-url:http://localhost:8080}")
    private String baseUrl;
    
    /**
     * 初始化方法，创建上传目录
     */
    @PostConstruct
    public void init() {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            if (created) {
                System.out.println("上传目录创建成功: " + dir.getAbsolutePath());
            } else {
                System.err.println("上传目录创建失败: " + dir.getAbsolutePath());
            }
        } else {
            System.out.println("上传目录已存在: " + dir.getAbsolutePath());
        }
        
        // 输出基础URL信息
        System.out.println("后端服务基础URL: " + baseUrl);
    }

    /**
     * 上传文件
     *
     * @param file 文件
     * @return 文件访问路径
     */
    public String uploadFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException("上传文件不能为空");
        }

        // 获取文件名
        String fileName = file.getOriginalFilename();
        // 获取文件后缀
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
        // 生成新文件名
        String newFileName = UUID.randomUUID().toString() + suffixName;
        // 创建文件目录
        File dest = new File(uploadDir);
        if (!dest.exists()) {
            dest.mkdirs();
        }
        // 创建文件
        File destFile = new File(dest.getAbsolutePath() + File.separator + newFileName);
        try {
            file.transferTo(destFile);
            System.out.println("文件上传成功: " + destFile.getAbsolutePath());
            
            // 返回完整的URL路径
            String fullUrl = baseUrl + "/uploads/" + newFileName;
            System.out.println("文件访问URL: " + fullUrl);
            return fullUrl;
        } catch (IOException e) {
            e.printStackTrace();
            throw new BusinessException("文件上传失败: " + e.getMessage());
        }
    }

    /**
     * 删除文件
     *
     * @param filePath 文件路径
     */
    public void deleteFile(String filePath) {
        // 处理完整URL路径
        String fileName = null;
        if (filePath != null) {
            if (filePath.startsWith(baseUrl + "/uploads/")) {
                // 处理完整URL
                fileName = filePath.substring((baseUrl + "/uploads/").length());
            } else if (filePath.startsWith("/uploads/")) {
                // 处理相对URL
                fileName = filePath.substring("/uploads/".length());
            }
            
            if (fileName != null) {
                File file = new File(uploadDir + File.separator + fileName);
                if (file.exists()) {
                    boolean deleted = file.delete();
                    if (deleted) {
                        System.out.println("文件删除成功: " + file.getAbsolutePath());
                    } else {
                        System.err.println("文件删除失败: " + file.getAbsolutePath());
                    }
                } else {
                    System.err.println("要删除的文件不存在: " + file.getAbsolutePath());
                }
            }
        }
    }
} 