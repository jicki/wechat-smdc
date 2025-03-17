# 微信点餐系统管理端

这是微信点餐系统的管理端前端项目，基于Vue.js和Element UI开发。

## 功能特性

- 用户管理：管理系统用户，包括启用/禁用用户等操作
- 店铺管理：管理店铺信息，包括店铺名称、公告、地址等
- 菜品管理：管理菜品分类和菜品信息
- 订单管理：查看和处理订单
- 系统设置：配置系统参数，如微信支付等

## 技术栈

- Vue.js 2.x
- Vuex
- Vue Router
- Element UI
- Axios

## 项目结构

```
admin-web/
├── src/                    # 源代码
│   ├── api/                # API请求
│   ├── assets/             # 静态资源
│   ├── components/         # 公共组件
│   ├── router/             # 路由配置
│   ├── store/              # Vuex状态管理
│   ├── utils/              # 工具函数
│   ├── views/              # 页面
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── public/                 # 公共文件
├── package.json            # 项目依赖
└── README.md               # 项目说明
```

## 安装和运行

### 前提条件

- Node.js (>= 10.x)
- npm (>= 6.x)

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run serve
```

### 生产环境构建

```bash
npm run build
```

## 接口文档

本项目依赖后端API接口，接口文档请参考后端项目的README.md文件。

## 配置说明

### 环境变量

在项目根目录创建`.env`文件可以配置环境变量：

```
VUE_APP_API_URL=http://localhost:8080
```

### 代理配置

如果需要在开发环境中代理API请求，可以在`vue.config.js`中配置：

```js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
}
``` 