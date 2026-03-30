"""智能推荐路由"""
from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class RecommendRequest(BaseModel):
    user_id: int
    preferences: Optional[List[str]] = None
    budget: Optional[float] = None
    travel_dates: Optional[str] = None
    travelers: Optional[int] = None


@router.post("/destinations")
async def recommend_destinations(req: RecommendRequest, request: Request):
    """推荐目的地"""
    rag_service = request.app.state.rag_service

    # 构建推荐查询
    query_parts = ["推荐旅游目的地"]
    if req.preferences:
        query_parts.append(f"偏好: {', '.join(req.preferences)}")
    if req.budget:
        query_parts.append(f"预算: {req.budget}元")

    query = " ".join(query_parts)
    context = await rag_service.retrieve(query, top_k=5)

    return {
        "recommendations": [
            {
                "id": item.get("source_id"),
                "name": item.get("text", "")[:50],
                "score": item.get("score", 0),
                "reason": "基于您的偏好推荐"
            }
            for item in context
        ]
    }


@router.get("/personalized/{user_id}")
async def personalized_recommend(user_id: int, request: Request):
    """个性化推荐"""
    # TODO: 结合用户画像和行为数据
    return {
        "user_id": user_id,
        "destinations": [
            {"name": "三亚", "reason": "您喜欢海边度假"},
            {"name": "成都", "reason": "您是美食爱好者"},
        ],
        "products": [],
        "guides": []
    }
