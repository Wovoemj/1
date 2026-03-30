# API Documentation

## AI服务 API (端口: 8000)

### 对话接口

#### POST /api/ai/chat/completion
AI对话 - RAG + Agent模式

**请求体:**
```json
{
  "session_id": "session_xxx",
  "message": "帮我规划三亚3日游",
  "user_id": 1,
  "history": [
    {"role": "user", "content": "你好"},
    {"role": "assistant", "content": "你好！有什么可以帮你的？"}
  ]
}
```

**响应:**
```json
{
  "answer": "好的，为您规划三亚3日游...",
  "sources": ["destination", "guide"],
  "tools_used": [{"name": "get_weather", "args": {"city": "三亚"}}],
  "session_id": "session_xxx"
}
```

#### POST /api/ai/chat/stream
流式对话 (SSE)

**请求体:** 同上

**响应:** Server-Sent Events流

### 行程规划

#### POST /api/ai/itinerary/generate
AI生成行程

**请求体:**
```json
{
  "destination": "三亚",
  "start_date": "2024-03-01",
  "days": 3,
  "travelers": 2,
  "budget": 5000,
  "preferences": ["海边", "美食", "亲子"],
  "travel_style": "休闲度假"
}
```

#### POST /api/ai/itinerary/optimize
优化行程

**请求体:**
```json
{
  "itinerary": { /* 原始行程JSON */ },
  "feedback": "第2天太赶了，希望轻松一点"
}
```

### 知识库

#### POST /api/ai/knowledge/add
添加知识条目

#### POST /api/ai/knowledge/batch-add
批量添加知识

#### GET /api/ai/knowledge/search?q=xxx
搜索知识库

---

## 后端 API (端口: 8080)

### 用户服务

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/users/login | 登录 |
| POST | /api/users/register | 注册 |
| GET | /api/users/profile | 获取用户信息 |
| PUT | /api/users/profile | 更新用户信息 |

### 产品服务

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/products/public/destinations | 获取目的地列表 |
| GET | /api/products/public/destinations/:id | 目的地详情 |
| GET | /api/products/public/pois | 获取POI列表 |
| GET | /api/products/public/search | 搜索产品 |
| GET | /api/products/public/guides | 获取攻略列表 |

### 订单服务

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/orders/create | 创建订单 |
| GET | /api/orders/list | 订单列表 |
| GET | /api/orders/:orderNo | 订单详情 |
| POST | /api/orders/:orderNo/cancel | 取消订单 |

### 支付服务

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/payments/create | 创建支付 |
| GET | /api/payments/status/:no | 查询支付状态 |
| POST | /api/payments/refund | 退款 |

### 推荐服务

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/recommend/personalized | 个性化推荐 |
| GET | /api/recommend/similar/:id | 相似推荐 |
| GET | /api/recommend/hot | 热门推荐 |
| GET | /api/recommend/guess-you-like | 猜你喜欢 |

### 通知服务

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/notifications/sms/send | 发送短信 |
| GET | /api/notifications/list | 通知列表 |
| POST | /api/notifications/:id/read | 标记已读 |
