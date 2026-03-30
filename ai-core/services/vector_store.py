"""
向量数据库服务 - 基于 Milvus
"""
import os
from typing import List, Dict, Any, Optional

from pymilvus import connections, Collection, CollectionSchema, FieldSchema, DataType, utility


class VectorStoreService:
    """Milvus 向量存储服务"""

    def __init__(self):
        self.host = os.getenv("MILVUS_HOST", "localhost")
        self.port = os.getenv("MILVUS_PORT", "19530")
        self.collection_name = "travel_knowledge"
        self.dimension = 1536  # OpenAI ada-002 embedding dimension
        self.collection = None

    async def initialize(self):
        """初始化向量数据库连接和集合"""
        connections.connect(host=self.host, port=self.port)

        if not utility.has_collection(self.collection_name):
            self._create_collection()
        else:
            self.collection = Collection(self.collection_name)
            self.collection.load()

        print(f"✅ Milvus 连接成功: {self.host}:{self.port}")

    def _create_collection(self):
        """创建集合"""
        fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=8192),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=self.dimension),
            FieldSchema(name="source_type", dtype=DataType.VARCHAR, max_length=50),
            FieldSchema(name="source_id", dtype=DataType.INT64),
            FieldSchema(name="metadata", dtype=DataType.VARCHAR, max_length=4096),
        ]
        schema = CollectionSchema(fields=fields, description="旅游知识库向量存储")
        self.collection = Collection(name=self.collection_name, schema=schema)

        # 创建索引
        index_params = {
            "metric_type": "COSINE",
            "index_type": "IVF_FLAT",
            "params": {"nlist": 128}
        }
        self.collection.create_index(field_name="embedding", index_params=index_params)
        self.collection.load()

    async def insert(self, texts: List[str], embeddings: List[List[float]],
                     source_types: List[str], source_ids: List[int],
                     metadatas: Optional[List[str]] = None):
        """批量插入向量"""
        if metadatas is None:
            metadatas = ["{}"] * len(texts)

        data = [texts, embeddings, source_types, source_ids, metadatas]
        self.collection.insert(data)
        self.collection.flush()
        return len(texts)

    async def search(self, embedding: List[float], top_k: int = 5,
                     source_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """向量相似度搜索"""
        search_params = {"metric_type": "COSINE", "params": {"nprobe": 16}}

        expr = None
        if source_type:
            expr = f'source_type == "{source_type}"'

        results = self.collection.search(
            data=[embedding],
            anns_field="embedding",
            param=search_params,
            limit=top_k,
            expr=expr,
            output_fields=["text", "source_type", "source_id", "metadata"]
        )

        items = []
        for hits in results:
            for hit in hits:
                items.append({
                    "text": hit.entity.get("text"),
                    "source_type": hit.entity.get("source_type"),
                    "source_id": hit.entity.get("source_id"),
                    "metadata": hit.entity.get("metadata"),
                    "score": hit.score
                })
        return items

    async def delete_by_source(self, source_type: str, source_id: int):
        """按来源删除向量"""
        expr = f'source_type == "{source_type}" and source_id == {source_id}'
        self.collection.delete(expr)

    async def get_stats(self) -> Dict[str, Any]:
        """获取统计信息"""
        return {
            "collection": self.collection_name,
            "entity_count": self.collection.num_entities,
            "dimension": self.dimension
        }
