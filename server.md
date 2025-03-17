# 微信点餐系统后端

这是微信点餐系统的后端项目，基于Spring Boot和MyBatis-Plus开发。

## 功能特性

### 用户端功能
1. 手机号注册登录
2. 查询店铺信息和菜单
3. 下单支付
4. 查看订单列表（全部、待支付、已完成、已取消）

### 管理端功能
1. 用户管理
2. 店铺信息设置和菜品信息维护
3. 订单查询和管理
4. 系统配置（如微信支付密钥配置等）

## 技术栈

- Spring Boot 2.x
- MyBatis-Plus
- Spring Security
- JWT认证
- MySQL
- Redis (可选)

## 项目结构

```
smdcmanage/
├── src/
│   ├── main/
│   │   ├── java/com/jarcms/smdcmanage/
│   │   │   ├── config/           # 配置类
│   │   │   ├── controller/       # 控制器
│   │   │   ├── entity/           # 实体类
│   │   │   ├── dto/              # 数据传输对象
│   │   │   ├── vo/               # 视图对象
│   │   │   ├── service/          # 服务接口及实现
│   │   │   ├── mapper/           # MyBatis映射接口
│   │   │   ├── interceptor/      # 拦截器
│   │   │   ├── exception/        # 异常处理
│   │   │   ├── common/           # 通用类
│   │   │   ├── util/             # 工具类
│   │   │   └── SmdcmanageApplication.java  # 启动类
│   │   └── resources/
│   │       ├── mapper/           # MyBatis XML映射文件
│   │       ├── application.yml   # 应用配置
│   │       └── application-dev.yml # 开发环境配置
│   └── test/                     # 测试代码
├── pom.xml                       # Maven依赖
└── README.md                     # 项目说明
```

## 安装和运行

### 前提条件

- JDK 1.8+
- Maven 3.x
- MySQL 5.7+

### 数据库配置

1. 创建数据库：
```sql
CREATE DATABASE smdcmanage DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 在`application-dev.yml`中配置数据库连接：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/smdcmanage?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

### 运行应用

使用Maven运行：
```bash
mvn spring-boot:run
```

或者打包后运行：
```bash
mvn clean package
java -jar target/smdcmanage-0.0.1-SNAPSHOT.jar
```

## API文档

启动应用后，可以通过以下地址访问Swagger API文档：
```
http://localhost:8080/swagger-ui.html
```

## 微信支付配置

在系统配置中需要设置以下微信支付相关参数：
- `wx.appId`: 微信小程序AppID
- `wx.appSecret`: 微信小程序AppSecret
- `wx.mchId`: 商户号
- `wx.apiKey`: API密钥
- `wx.notifyUrl`: 支付回调地址

## 部署说明

### 生产环境配置

创建`application-prod.yml`文件，配置生产环境参数：
```yaml
spring:
  datasource:
    url: jdbc:mysql://production-db-host:3306/smdcmanage?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: prod_user
    password: prod_password

server:
  port: 8080
  
# 日志配置
logging:
  level:
    root: warn
    com.jarcms.smdcmanage: info
  file:
    name: /var/log/smdcmanage/application.log
```

### 使用生产配置启动

```bash
java -jar smdcmanage.jar --spring.profiles.active=prod
``` 
