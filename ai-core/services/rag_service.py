"""
RAG 检索增强生成服务
"""
import os
from typing import List, Dict, Any, Optional

from openai import AsyncOpenAI
from .vector_store import VectorStoreService


class RAGService:
    """基于 RAG 的知识问答服务"""

    def __init__(self, vector_store: VectorStoreService):
        self.vector_store = vector_store
        self.openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.embedding_model = "text-embedding-ada-002"
        self.chat_model = os.getenv("CHAT_MODEL", "gpt-4")

    async def get_embedding(self, text: str) -> List[float]:
        """获取文本向量"""
        response = await self.openai_client.embeddings.create(
            model=self.embedding_model,
            input=text
        )
        return response.data[0].embedding

    async def retrieve(self, query: str, top_k: int = 5,
                       source_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """检索相关知识"""
        embedding = await self.get_embedding(query)
        results = await self.vector_store.search(embedding, top_k, source_type)
        return results

    async def generate_answer(self, query: str, context: List[Dict[str, Any]],
                              conversation_history: Optional[List[Dict]] = None) -> str:
        """基于检索结果生成回答"""
        # 构建上下文
        context_text = "\n\n".join([
            f"[来源: {item['source_type']}#{item['source_id']}]\n{item['text']}"
            for item in context
        ])

        # 构建系统提示
        system_prompt = """你是"TravelAI"——一个专业的智能旅游助手。你的职责是帮助用户规划旅行、推荐目的地、解答旅游相关问题。

核心能力：
1. 行程规划：根据用户需求生成个性化行程
2. 目的地推荐：基于用户偏好推荐适合的目的地
3. 旅游问答：解答签证、交通、住宿、美食等问题
4. 预算估算：帮助用户估算旅行花费

回答原则：
- 使用提供的参考信息回答，信息不足时说明并给出建议
- 回答要实用、具体，包含可操作的建议
- 语气友好、热情，体现对旅行的热爱
- 中文回答，适当使用emoji增加亲和力
- 涉及预订时引导用户使用平台功能"""

        # 构建消息
        messages = [{"role": "system", "content": system_prompt}]

        # 添加对话历史
        if conversation_history:
            messages.extend(conversation_history[-6:])  # 保留最近6轮

        # 添加用户查询和上下文
        user_message = f"""用户问题: {query}

参考信息:
{context_text if context_text else "暂无相关参考信息，请基于通用旅游知识回答。"}

请根据以上信息回答用户问题。"""
        messages.append({"role": "user", "content": user_message})

        # 调用LLM
        response = await self.openai_client.chat.completions.create(
            model=self.chat_model,
            messages=messages,
            temperature=0.7,
            max_tokens=2000
        )

        return response.choices[0].message.content

    async def chat(self, query: str, session_id: str,
                   conversation_history: Optional[List[Dict]] = None) -> Dict[str, Any]:
        """完整的RAG对话流程"""
        # 1. 检索相关知识
        context = await self.retrieve(query, top_k=5)

        # 2. 生成回答
        answer = await self.generate_answer(query, context, conversation_history)

        # 3. 提取引用来源
        sources = list(set([item['source_type'] for item in context]))

        return {
            "answer": answer,
            "sources": sources,
            "context_used": len(context),
            "session_id": session_id
        }

    async def add_knowledge(self, text: str, source_type: str,
                            source_id: int, metadata: Optional[str] = None):
        """添加知识到向量库"""
        # 分块处理长文本
        chunks = self._split_text(text)
        for chunk in chunks:
            embedding = await self.get_embedding(chunk)
            await self.vector_store.insert(
                texts=[chunk],
                embeddings=[embedding],
                source_types=[source_type],
                source_ids=[source_id],
                metadatas=[metadata or "{}"]
            )

    def _split_text(self, text: str, chunk_size: int = 500,
                    overlap: int = 50) -> List[str]:
        """文本分块"""
        if len(text) <= chunk_size:
            return [text]

        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start = end - overlap
        return chunks
