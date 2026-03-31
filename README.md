# 🌍 智能旅游助手平台 - TravelAI

> AI驱动的智能旅游平台，集成行程规划、目的地推荐、预订服务和智能客服于一体。

## ✨ 核心特性

- 🤖 **AI智能行程规划** — 一句话描述需求，AI自动生成个性化行程
- 🗺️ **智能目的地推荐** — 基于用户画像和协同过滤的精准推荐
- 🏨 **一站式预订** — 机票、酒店、景点门票统一预订
- 💬 **7×24智能客服** — 基于RAG的旅游知识问答
- 📊 **管理后台** — 完整的内容、订单、用户管理与数据看板

## 🏗️ 系统架构

```
travel-ai/
├── frontend/                # 用户端 Web 应用 (Next.js 14 + TypeScript + TailwindCSS)
│   ├── app/                 # App Router 页面
│   │   ├── page.tsx         # 首页 - 搜索 + 推荐 + 目的地展示
│   │   ├── planner/         # AI行程规划
│   │   ├── guide/           # 旅游攻略
│   │   ├── booking/         # 预订中心
│   │   └── user/            # 个人中心
│   ├── components/          # UI组件库
│   │   ├── ai/              # AI助手组件
│   │   ├── common/          # 通用组件 (Header/Footer)
│   │   ├── home/            # 首页组件
│   │   └── planner/         # 行程规划组件
│   ├── lib/                 # 工具库 (API客户端/状态管理)
│   └── types/               # TypeScript类型定义
├── admin/                   # 管理端 (React 18 + Ant Design 5)
│   └── src/                 # 管理后台源码
├── backend/                 # 微服务后端 (Spring Boot 3)
│   ├── gateway-service/     # API网关 - 限流/鉴权/路由
│   ├── user-service/        # 用户服务 - 注册/登录/会员
│   ├── product-service/     # 产品服务 - 目的地/POI/产品
│   ├── order-service/       # 订单服务 - 状态机/退改
│   ├── payment-service/     # 支付服务 - 多渠道支付
│   ├── ai-service/          # AI服务 - 调用AI核心
│   ├── recommend-service/   # 推荐服务 - 协同过滤+深度学习
│   └── notification-service/# 通知服务 - 短信/邮件/推送
├── ai-core/                 # AI核心模块 (Python FastAPI + LangChain)
│   ├── agents/              # 智能体框架 (Function Calling)
│   ├── services/            # 核心服务 (RAG/向量/行程/推荐)
│   ├── routes/              # API路由 (对话/行程/推荐/知识库)
│   └── tools/               # AI工具集 (搜索/天气/汇率/翻译)
├── database/                # 数据库 (PostgreSQL + PostGIS)
│   ├── migrations/          # 数据库迁移脚本
│   └── seeds/               # 种子数据
├── deploy/                  # 部署配置
│   ├── k8s/                 # Kubernetes部署清单
│   └── monitoring/          # 监控配置 (Prometheus + Grafana)
├── docs/                    # 项目文档
├── docker-compose.yml       # Docker编排 (一键启动全部服务)
└── .github/                 # CI/CD流水线
```

## 🛠️ 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| **前端** | Next.js 14, TypeScript, TailwindCSS, React Query | SSR/SSG + 响应式设计 |
| **管理端** | React 18, Ant Design 5, ECharts, Vite | 企业级管理后台 |
| **后端** | Spring Boot 3, gRPC, MyBatis Plus, Nacos | 微服务架构 |
| **AI核心** | FastAPI, LangChain, OpenAI, Milvus | RAG + Agent架构 |
| **数据库** | PostgreSQL 16 + PostGIS, Redis 7, Elasticsearch 8 | 关系+缓存+搜索+向量 |
| **消息队列** | RocketMQ 5 | 异步订单/通知处理 |
| **基础设施** | Docker, Kubernetes, Prometheus, Grafana | 容器化+监控告警 |
| **CI/CD** | GitHub Actions | 自动化构建部署 |

## 🚀 快速启动

### 环境要求

- Docker 24+ & Docker Compose v2
- Node.js 18+
- Python 3.11+ (AI核心)
- Java 17+ (后端服务)

### 一键启动

```bash
# 克隆项目
git clone https://github.com/Wovoemj/1.git
cd 1

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 OpenAI API Key 等配置

# 启动全部服务
docker-compose up -d

# 查看服务状态
docker-compose ps
```

### 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 用户端 | http://localhost:3000 | 旅游网站前端 |
| 管理端 | http://localhost:3001 | 管理后台 |
| API网关 | http://localhost:8080 | 统一API入口 |
| AI服务 | http://localhost:8000 | AI核心服务 |
| Grafana | http://localhost:3100 | 监控看板 |
| Prometheus | http://localhost:9090 | 指标采集 |

### 本地开发

```bash
# 前端开发
cd frontend
pnpm install
pnpm dev

# AI核心开发
cd ai-core
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 后端开发 (需要Java环境)
cd backend/user-service
mvn spring-boot:run
```

## 📖 API文档

启动后访问：
- AI服务API文档: http://localhost:8000/docs
- 后端API文档: http://localhost:8080/swagger-ui.html

详细API说明见 [docs/api.md](docs/api.md)

## 🧪 测试

```bash
# 前端测试
cd frontend && pnpm test

# AI核心测试
cd ai-core && pytest

# 后端测试
cd backend && mvn test
```

## 📝 开发规范

- **代码风格**: ESLint + Prettier (前端), Google Style (Java), Black (Python)
- **提交规范**: Conventional Commits
- **分支策略**: Git Flow (main/develop/feature/hotfix)

## 📄 License

MIT License
