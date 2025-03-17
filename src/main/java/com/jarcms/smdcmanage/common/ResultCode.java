package com.jarcms.smdcmanage.common;

/**
 * 结果状态码枚举类
 */
public enum ResultCode implements IErrorCode {

    /**
     * 成功
     */
    SUCCESS(0, "操作成功"),

    /**
     * 失败
     */
    FAILED(500, "操作失败"),

    /**
     * 参数错误
     */
    VALIDATE_FAILED(400, "参数检验失败"),

    /**
     * 未认证
     */
    UNAUTHORIZED(401, "暂未登录或token已经过期"),

    /**
     * 未授权
     */
    FORBIDDEN(403, "没有相关权限"),

    /**
     * 不存在
     */
    NOT_FOUND(404, "资源不存在");

    private final Integer code;
    private final String message;

    ResultCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public Integer getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
} 