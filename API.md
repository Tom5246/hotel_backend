# 易宿酒店预订平台 API

## 基础信息
- 基础URL: `http://localhost:3000/api`
- 数据格式: JSON

## 用户相关接口

### 1. 用户注册
- **POST** `/api/register`
- 请求体:
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string (optional)",
    "phone": "string (optional)",
    "role": "user|merchant|admin (optional, default: user)"
  }
  ```
- 响应: 用户信息

### 2. 用户登录
- **POST** `/api/login`
- 请求体:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- 响应: 用户信息

### 3. 获取用户信息
- **GET** `/api/users/:id`
- 响应: 用户信息

### 4. 更新用户信息
- **PUT** `/api/users/:id`
- 请求体:
  ```json
  {
    "username": "string (optional)",
    "password": "string (optional)",
    "email": "string (optional)",
    "phone": "string (optional)",
    "role": "user|merchant|admin (optional)"
  }
  ```
- 响应: 更新后的用户信息

### 5. 删除用户
- **DELETE** `/api/users/:id`
- 响应: 成功消息

### 6. 获取用户列表
- **GET** `/api/users`
- 查询参数:
  - `role`: 用户角色 (可选)
  - `limit`: 限制数量 (可选)
  - `offset`: 偏移量 (可选)
- 响应: 用户列表

## 酒店相关接口

### 1. 创建酒店
- **POST** `/api/hotels`
- 请求体:
  ```json
  {
    "merchant_id": "number",
    "name": "string",
    "address": "string",
    "description": "string (optional)",
    "star": "number (optional)",
    "rating": "number (optional)",
    "opening_date": "date (optional)",
    "status": "pending|approved|rejected|published|unpublished (optional)",
    "audit_comment": "string (optional)"
  }
  ```
- 响应: 酒店信息

### 2. 获取酒店详情
- **GET** `/api/hotels/:id`
- 响应: 酒店详情（包含图片、标签、设施）

### 3. 获取酒店列表
- **GET** `/api/hotels`
- 查询参数:
  - `status`: 酒店状态 (可选)
  - `star`: 星级 (可选)
  - `min_rating`: 最低评分 (可选)
  - `name`: 酒店名称（模糊搜索）(可选)
  - `limit`: 限制数量 (可选)
  - `offset`: 偏移量 (可选)
- 响应: 酒店列表

### 4. 获取商户的酒店列表
- **GET** `/api/merchants/:merchantId/hotels`
- 查询参数:
  - `status`: 酒店状态 (可选)
- 响应: 酒店列表

### 5. 更新酒店信息
- **PUT** `/api/hotels/:id`
- 请求体:
  ```json
  {
    "name": "string (optional)",
    "address": "string (optional)",
    "description": "string (optional)",
    "star": "number (optional)",
    "rating": "number (optional)",
    "opening_date": "date (optional)",
    "status": "pending|approved|rejected|published|unpublished (optional)",
    "audit_comment": "string (optional)"
  }
  ```
- 响应: 更新后的酒店信息

### 6. 删除酒店
- **DELETE** `/api/hotels/:id`
- 响应: 成功消息

### 7. 更新酒店状态
- **PATCH** `/api/hotels/:id/status`
- 请求体:
  ```json
  {
    "status": "pending|approved|rejected|published|unpublished",
    "audit_comment": "string (optional)"
  }
  ```
- 响应: 更新后的酒店信息

### 8. 搜索酒店
- **GET** `/api/hotels/search`
- 查询参数:
  - `keyword`: 关键词 (可选)
  - `check_in`: 入住日期 (可选)
  - `check_out`: 退房日期 (可选)
  - `guests`: 入住人数 (可选)
  - `min_price`: 最低价格 (可选)
  - `max_price`: 最高价格 (可选)
  - `star`: 星级 (可选)
  - `limit`: 限制数量 (可选)
  - `offset`: 偏移量 (可选)
- 响应: 酒店列表

## 房型相关接口

### 1. 创建房型
- **POST** `/api/rooms`
- 请求体:
  ```json
  {
    "hotel_id": "number",
    "type": "string",
    "area": "number (optional)",
    "bed_type": "string (optional)",
    "max_occupancy": "number",
    "price": "number",
    "total_rooms": "number",
    "available_rooms": "number (optional)",
    "images": "array (optional)",
    "amenities": "array (optional)"
  }
  ```
- 响应: 房型信息

### 2. 获取房型详情
- **GET** `/api/rooms/:id`
- 响应: 房型详情

### 3. 获取酒店的房型列表
- **GET** `/api/hotels/:hotelId/rooms`
- 响应: 房型列表

### 4. 获取房型列表
- **GET** `/api/rooms`
- 查询参数:
  - `hotel_id`: 酒店ID (可选)
  - `type`: 房型（模糊搜索）(可选)
  - `min_price`: 最低价格 (可选)
  - `max_price`: 最高价格 (可选)
  - `max_occupancy`: 最大入住人数 (可选)
  - `limit`: 限制数量 (可选)
  - `offset`: 偏移量 (可选)
- 响应: 房型列表

### 5. 更新房型信息
- **PUT** `/api/rooms/:id`
- 请求体:
  ```json
  {
    "type": "string (optional)",
    "area": "number (optional)",
    "bed_type": "string (optional)",
    "max_occupancy": "number (optional)",
    "price": "number (optional)",
    "total_rooms": "number (optional)",
    "available_rooms": "number (optional)",
    "images": "array (optional)",
    "amenities": "array (optional)"
  }
  ```
- 响应: 更新后的房型信息

### 6. 删除房型
- **DELETE** `/api/rooms/:id`
- 响应: 成功消息

### 7. 更新可用房间数
- **PATCH** `/api/rooms/:id/availability`
- 请求体:
  ```json
  {
    "available_rooms": "number"
  }
  ```
- 响应: 更新后的房型信息

### 8. 获取可用房型
- **GET** `/api/rooms/available`
- 查询参数:
  - `hotel_id`: 酒店ID (必填)
  - `check_in`: 入住日期 (必填)
  - `check_out`: 退房日期 (必填)
  - `guests`: 入住人数 (必填)
- 响应: 可用房型列表

## 预订相关接口

### 1. 创建预订
- **POST** `/api/reservations`
- 请求体:
  ```json
  {
    "user_id": "number",
    "hotel_id": "number",
    "room_id": "number",
    "check_in_date": "date",
    "check_out_date": "date",
    "guest_info": "object (optional)",
    "contact_name": "string",
    "contact_phone": "string",
    "special_requests": "string (optional)",
    "promotion_id": "number (optional)"
  }
  ```
- 响应: 预订信息

### 2. 获取预订详情
- **GET** `/api/reservations/:id`
- 响应: 预订详情

### 3. 根据预订号获取预订
- **GET** `/api/reservations/no/:reservationNo`
- 响应: 预订信息

### 4. 获取用户的预订列表
- **GET** `/api/users/:userId/reservations`
- 查询参数:
  - `status`: 预订状态 (可选)
- 响应: 预订列表

### 5. 获取酒店的预订列表
- **GET** `/api/hotels/:hotelId/reservations`
- 查询参数:
  - `status`: 预订状态 (可选)
- 响应: 预订列表

### 6. 获取预订列表
- **GET** `/api/reservations`
- 查询参数:
  - `user_id`: 用户ID (可选)
  - `hotel_id`: 酒店ID (可选)
  - `status`: 预订状态 (可选)
  - `check_in_date_from`: 入住日期起始 (可选)
  - `check_in_date_to`: 入住日期结束 (可选)
  - `limit`: 限制数量 (可选)
  - `offset`: 偏移量 (可选)
- 响应: 预订列表

### 7. 更新预订信息
- **PUT** `/api/reservations/:id`
- 请求体:
  ```json
  {
    "status": "confirmed|cancelled|completed|no_show (optional)",
    "special_requests": "string (optional)"
  }
  ```
- 响应: 更新后的预订信息

### 8. 取消预订
- **PATCH** `/api/reservations/:id/cancel`
- 响应: 更新后的预订信息

### 9. 删除预订
- **DELETE** `/api/reservations/:id`
- 响应: 成功消息

## 标签相关接口

### 1. 创建标签
- **POST** `/api/tags`
- 请求体:
  ```json
  {
    "name": "string",
    "category": "string (optional)"
  }
  ```
- 响应: 标签信息

### 2. 获取标签详情
- **GET** `/api/tags/:id`
- 响应: 标签信息

### 3. 获取标签列表
- **GET** `/api/tags`
- 查询参数:
  - `category`: 标签分类 (可选)
  - `name`: 标签名称（模糊搜索）(可选)
  - `limit`: 限制数量 (可选)
  - `offset`: 偏移量 (可选)
- 响应: 标签列表

### 4. 更新标签信息
- **PUT** `/api/tags/:id`
- 请求体:
  ```json
  {
    "name": "string (optional)",
    "category": "string (optional)"
  }
  ```
- 响应: 更新后的标签信息

### 5. 删除标签
- **DELETE** `/api/tags/:id`
- 响应: 成功消息

### 6. 添加标签到酒店
- **POST** `/api/hotels/tags`
- 请求体:
  ```json
  {
    "hotel_id": "number",
    "tag_id": "number"
  }
  ```
- 响应: 关联ID

### 7. 从酒店移除标签
- **DELETE** `/api/hotels/tags`
- 请求体:
  ```json
  {
    "hotel_id": "number",
    "tag_id": "number"
  }
  ```
- 响应: 成功消息

### 8. 获取酒店的标签
- **GET** `/api/hotels/:hotelId/tags`
- 响应: 标签列表

## 设施相关接口

### 1. 创建设施
- **POST** `/api/facilities`
- 请求体:
  ```json
  {
    "name": "string",
    "icon": "string (optional)"
  }
  ```
- 响应: 设施信息

### 2. 获取设施详情
- **GET** `/api/facilities/:id`
- 响应: 设施信息

### 3. 获取设施列表
- **GET** `/api/facilities`
- 查询参数:
  - `name`: 设施名称（模糊搜索）(可选)
  - `limit`: 限制数量 (可选)
  - `offset`: 偏移量 (可选)
- 响应: 设施列表

### 4. 更新设施信息
- **PUT** `/api/facilities/:id`
- 请求体:
  ```json
  {
    "name": "string (optional)",
    "icon": "string (optional)"
  }
  ```
- 响应: 更新后的设施信息

### 5. 删除设施
- **DELETE** `/api/facilities/:id`
- 响应: 成功消息

### 6. 添加设施到酒店
- **POST** `/api/hotels/facilities`
- 请求体:
  ```json
  {
    "hotel_id": "number",
    "facility_id": "number"
  }
  ```
- 响应: 关联ID

### 7. 从酒店移除设施
- **DELETE** `/api/hotels/facilities`
- 请求体:
  ```json
  {
    "hotel_id": "number",
    "facility_id": "number"
  }
  ```
- 响应: 成功消息

### 8. 获取酒店的设施
- **GET** `/api/hotels/:hotelId/facilities`
- 响应: 设施列表

## 酒店图片相关接口

### 1. 上传酒店图片
- **POST** `/api/hotel-images`
- 请求体:
  ```json
  {
    "hotel_id": "number",
    "url": "string",
    "type": "main|room|facility|other (optional)",
    "sort_order": "number (optional)"
  }
  ```
- 响应: 图片信息

### 2. 获取图片详情
- **GET** `/api/hotel-images/:id`
- 响应: 图片信息

### 3. 获取酒店的图片列表
- **GET** `/api/hotels/:hotelId/images`
- 查询参数:
  - `type`: 图片类型 (可选)
- 响应: 图片列表

### 4. 更新图片信息
- **PUT** `/api/hotel-images/:id`
- 请求体:
  ```json
  {
    "url": "string (optional)",
    "type": "main|room|facility|other (optional)",
    "sort_order": "number (optional)"
  }
  ```
- 响应: 更新后的图片信息

### 5. 删除图片
- **DELETE** `/api/hotel-images/:id`
- 响应: 成功消息

### 6. 删除酒店的所有图片
- **DELETE** `/api/hotels/:hotelId/images`
- 响应: 成功消息及删除数量

## 数据库表结构

### users（用户表）
- id: 用户ID（主键）
- username: 用户名（唯一）
- password: 密码（加密）
- email: 邮箱（唯一）
- phone: 手机号（唯一）
- role: 角色（user/merchant/admin）
- created_at: 创建时间
- updated_at: 更新时间

### hotels（酒店表）
- id: 酒店ID（主键）
- merchant_id: 商户ID（外键）
- name: 酒店名称
- address: 地址
- description: 描述
- star: 星级
- rating: 评分
- opening_date: 开业日期
- status: 状态（pending/approved/rejected/published/unpublished）
- audit_comment: 审核备注
- created_at: 创建时间
- updated_at: 更新时间

### rooms（房型表）
- id: 房型ID（主键）
- hotel_id: 酒店ID（外键）
- type: 房型
- area: 面积
- bed_type: 床型
- max_occupancy: 最大入住人数
- price: 价格
- total_rooms: 总房间数
- available_rooms: 可用房间数
- images: 图片（JSON）
- amenities: 设施（JSON）
- created_at: 创建时间
- updated_at: 更新时间

### reservations（预订表）
- id: 预订ID（主键）
- reservation_no: 预订号（唯一）
- user_id: 用户ID（外键）
- hotel_id: 酒店ID（外键）
- room_id: 房型ID（外键）
- check_in_date: 入住日期
- check_out_date: 退房日期
- total_price: 总价
- guest_info: 入住人信息（JSON）
- contact_name: 联系人姓名
- contact_phone: 联系电话
- special_requests: 特殊要求
- status: 状态（confirmed/cancelled/completed/no_show）
- promotion_id: 促销ID（外键）
- created_at: 创建时间
- updated_at: 更新时间

### tags（标签表）
- id: 标签ID（主键）
- name: 标签名称（唯一）
- category: 分类
- created_at: 创建时间

### facilities（设施表）
- id: 设施ID（主键）
- name: 设施名称（唯一）
- icon: 图标
- created_at: 创建时间

### hotel_tags（酒店-标签关联表）
- id: 关联ID（主键）
- hotel_id: 酒店ID（外键）
- tag_id: 标签ID（外键）

### hotel_facilities（酒店-设施关联表）
- id: 关联ID（主键）
- hotel_id: 酒店ID（外键）
- facility_id: 设施ID（外键）

### hotel_images（酒店图片表）
- id: 图片ID（主键）
- hotel_id: 酒店ID（外键）
- url: 图片URL
- type: 类型（main/room/facility/other）
- sort_order: 排序
- created_at: 创建时间

## 启动项目

1. 安装依赖:
```bash
npm install
```

2. 启动服务器:
```bash
node index.js
```

3. 服务器运行在: `http://localhost:3000`

## 测试API

可以使用 Postman、curl 或其他工具测试API接口。

示例 - 创建用户:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com"
  }'
```

示例 - 获取酒店列表:
```bash
curl http://localhost:3000/api/hotels
```