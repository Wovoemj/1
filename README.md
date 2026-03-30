# 智能旅游助手平台 - Travel AI Assistant

## 项目架构

```
travel-ai-platform/
├── frontend/          # 用户端 Web 应用 (Next.js + TypeScript)
├── admin/             # 管理端 (React + Ant Design)
├── backend/           # 微服务后端 (Spring Boot)
│   ├── gateway-service/
│   ├── user-service/
│   ├── product-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── ai-service/
│   ├── recommend-service/
│   └── notification-service/
├── database/          # 数据库迁移与种子
├── ai-core/           # AI 核心模块 (Python)
│   ├── rag/           # RAG 知识库
│   ├── agents/        # 智能体框架
│   ├── embeddings/    # 向量化服务
│   └── tools/         # AI 工具集
├── deploy/            # 部署配置
│   ├── docker/
│   ├── k8s/
│   └── monitoring/
└── docs/              # 项目文档
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 14, TypeScript, TailwindCSS, React Query |
| 管理端 | React 18, Ant Design 5, ECharts |
| 后端 | Spring Boot 3, gRPC, MyBatis Plus |
| AI | LangChain, OpenAI, Milvus |
| 数据库 | PostgreSQL, Redis, Elasticsearch |
| 基础设施 | Docker, Kubernetes, Prometheus, Grafana |
| CI/CD | GitHub Actions |

## 快速启动

```bash
# 使用 Docker Compose 启动所有服务
docker-compose up -d

# 访问
# 用户端: http://localhost:3000
# 管理端: http://localhost:3001
# API网关: http://localhost:8080
# AI服务: http://localhost:8000
```

## 环境要求

- Docker 24+
- Docker Compose v2
- Node.js 18+
- Java 17+
- Python 3.11+
