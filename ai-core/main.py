"""
智能旅游助手 - AI核心服务
基于 FastAPI + LangChain + RAG 架构
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.chat import router as chat_router
from routes.itinerary import router as itinerary_router
from routes.recommend import router as recommend_router
from routes.knowledge import router as knowledge_router
from services.vector_store import VectorStoreService
from services.rag_service import RAGService

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时初始化
    print("🚀 AI服务启动中...")
    vector_store = VectorStoreService()
    await vector_store.initialize()
    app.state.vector_store = vector_store
    app.state.rag_service = RAGService(vector_store)
    print("✅ AI服务就绪")
    yield
    # 关闭时清理
    print("🛑 AI服务关闭中...")


app = FastAPI(
    title="Travel AI Assistant API",
    description="智能旅游助手AI服务 - 行程规划/智能问答/推荐系统",
    version="1.0.0",
    lifespan=lifespan
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(chat_router, prefix="/api/ai/chat", tags=["AI对话"])
app.include_router(itinerary_router, prefix="/api/ai/itinerary", tags=["行程规划"])
app.include_router(recommend_router, prefix="/api/ai/recommend", tags=["智能推荐"])
app.include_router(knowledge_router, prefix="/api/ai/knowledge", tags=["知识库"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-core"}


@app.get("/")
async def root():
    return {
        "service": "Travel AI Assistant",
        "version": "1.0.0",
        "endpoints": [
            "/api/ai/chat",
            "/api/ai/itinerary",
            "/api/ai/recommend",
            "/api/ai/knowledge"
        ]
    }
