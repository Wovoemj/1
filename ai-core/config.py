"""AI服务配置"""
import os
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class AIConfig:
    """AI服务配置"""

    # OpenAI
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    chat_model: str = os.getenv("CHAT_MODEL", "gpt-4")
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "text-embedding-ada-002")
    max_tokens: int = int(os.getenv("MAX_TOKENS", "2000"))
    temperature: float = float(os.getenv("TEMPERATURE", "0.7"))

    # Milvus
    milvus_host: str = os.getenv("MILVUS_HOST", "localhost")
    milvus_port: str = os.getenv("MILVUS_PORT", "19530")
    milvus_collection: str = os.getenv("MILVUS_COLLECTION", "travel_knowledge")
    embedding_dimension: int = 1536

    # Redis
    redis_host: str = os.getenv("REDIS_HOST", "localhost")
    redis_port: int = int(os.getenv("REDIS_PORT", "6379"))
    redis_db: int = int(os.getenv("REDIS_DB", "0"))

    # 后端
    backend_url: str = os.getenv("BACKEND_URL", "http://gateway:8080/api")

    # RAG配置
    rag_top_k: int = 5
    rag_score_threshold: float = 0.7
    chunk_size: int = 500
    chunk_overlap: int = 50

    # Agent配置
    max_tool_iterations: int = 5
    conversation_history_limit: int = 6


config = AIConfig()
