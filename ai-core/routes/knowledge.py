"""知识库管理路由"""
from fastapi import APIRouter, Request, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class KnowledgeItem(BaseModel):
    text: str
    source_type: str  # destination/poi/guide/user_review
    source_id: int
    metadata: Optional[str] = None


class BatchKnowledgeItem(BaseModel):
    items: List[KnowledgeItem]


@router.post("/add")
async def add_knowledge(item: KnowledgeItem, request: Request):
    """添加知识条目"""
    rag_service = request.app.state.rag_service
    await rag_service.add_knowledge(
        text=item.text,
        source_type=item.source_type,
        source_id=item.source_id,
        metadata=item.metadata
    )
    return {"success": True, "message": "知识添加成功"}


@router.post("/batch-add")
async def batch_add_knowledge(batch: BatchKnowledgeItem, request: Request):
    """批量添加知识"""
    rag_service = request.app.state.rag_service
    count = 0
    for item in batch.items:
        await rag_service.add_knowledge(
            text=item.text,
            source_type=item.source_type,
            source_id=item.source_id,
            metadata=item.metadata
        )
        count += 1
    return {"success": True, "count": count}


@router.post("/upload")
async def upload_knowledge(file: UploadFile = File(...), request: Request = None):
    """上传知识文件"""
    content = await file.read()
    text = content.decode("utf-8")

    rag_service = request.app.state.rag_service
    await rag_service.add_knowledge(
        text=text,
        source_type="uploaded",
        source_id=0
    )
    return {"success": True, "filename": file.filename}


@router.get("/search")
async def search_knowledge(q: str, top_k: int = 5, request: Request = None):
    """搜索知识库"""
    rag_service = request.app.state.rag_service
    results = await rag_service.retrieve(q, top_k=top_k)
    return {"query": q, "results": results}


@router.get("/stats")
async def get_stats(request: Request):
    """获取知识库统计"""
    vector_store = request.app.state.vector_store
    stats = await vector_store.get_stats()
    return stats
