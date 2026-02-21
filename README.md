# 易宿酒店预订平台后端系统

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![Express](https://img.shields.io/badge/Express-5.2.1-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)
![JWT](https://img.shields.io/badge/JWT-Authentication-purple.svg)

一个功能完善、架构清晰的酒店预订平台后端系统

</div>

## 项目简介

易宿酒店预订平台是一个基于 Node.js + Express + MySQL 构建的现代化酒店管理系统后端服务。系统采用 RESTful API 设计，支持用户注册登录、JWT身份认证、酒店管理、房型管理、预订管理、标签管理等完整业务流程，为酒店预订平台提供稳定可靠的后端服务支持。

## 技术栈

### 后端框架
- **Node.js** - 基于 Chrome V8 引擎的 JavaScript 运行时
- **Express.js** - 轻量级、灵活的 Node.js Web 应用框架

### 数据库
- **MySQL** - 开源的关系型数据库管理系统
- **MySQL2** - 高性能的 MySQL 驱动，支持 Promise 和连接池

### 安全加密
- **bcrypt** - 密码加密库，提供安全的密码哈希算法
- **jsonwebtoken** - JWT（JSON Web Token）身份认证

### 项目架构
- **MVC 架构** - Model-View-Controller 分层设计
- **RESTful API** - 遵循 REST 架构风格的 API 设计
- **中间件模式** - 统一响应格式、认证授权、错误处理



## 项目结构

```
hotel_backend/
├── config/                    # 配置文件
│   └── db.js                 # 数据库连接配置
├── controllers/               # 控制器层（6个）
│   ├── AuthController.js      # 认证控制器
│   ├── PublicHotelController.js # 酒店公共接口控制器
│   ├── MerchantController.js   # 商户端控制器
│   ├── AdminController.js      # 管理员控制器
│   ├── ReservationController.js # 预订控制器
│   └── TagGuestController.js   # 标签和入住人控制器
├── middleware/                # 中间件层（2个）
│   ├── auth.js               # JWT认证和权限控制中间件
│   └── responseFormatter.js  # 统一响应格式中间件
├── models/                    # 数据模型层（5个）
│   ├── Hotel.js              # 酒店模型
│   ├── Room.js               # 房型模型
│   ├── Reservation.js        # 预订模型
│   ├── Tag.js                # 标签模型
│   └── Guest.js              # 入住人模型
├── routes/                    # 路由层（6个）
│   ├── authRoutes.js         # 认证路由
│   ├── publicHotelRoutes.js  # 酒店公共路由
│   ├── merchantRoutes.js     # 商户端路由
│   ├── adminRoutes.js        # 管理员路由
│   ├── reservationRoutes.js   # 预订路由
│   └── tagGuestRoutes.js     # 标签和入住人路由
├── index.js                   # 应用入口
├── hotel.sql                  # 数据库初始化脚本
├── package.json              # 项目依赖配置
├── API.md                    # API 接口文档
├── README.md                 # 项目说明文档
└── 接口文档.md                # 原始接口文档
```