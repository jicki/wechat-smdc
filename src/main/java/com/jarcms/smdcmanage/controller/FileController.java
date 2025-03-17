package com.jarcms.smdcmanage.controller;

import com.jarcms.smdcmanage.common.Result;
import com.jarcms.smdcmanage.utils.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

/**
 * 文件上传控制器
 */
@RestController
@RequestMapping("/api/file")
public class FileController {

    @Autowired
    private FileUtil fileUtil;

    /**
     * 上传文件
     *
     * @param file 文件
     * @return 文件访问路径
     */
    @PostMapping("/upload")
    public Result<String> upload(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        // 检查是否是管理员（如果需要权限控制）
        Integer role = (Integer) request.getAttribute("role");
        if (role != null && role != 1) {
            return Result.forbidden();
        }
        
        String filePath = fileUtil.uploadFile(file);
        return Result.success(filePath);
    }

    /**
     * 删除文件
     *
     * @param filePath 文件路径
     * @return 结果
     */
    @PostMapping("/delete")
    public Result<Void> delete(@RequestParam("filePath") String filePath, HttpServletRequest request) {
        // 检查是否是管理员（如果需要权限控制）
        Integer role = (Integer) request.getAttribute("role");
        if (role != null && role != 1) {
            return Result.forbidden();
        }
        
        fileUtil.deleteFile(filePath);
        return Result.success();
    }
} 