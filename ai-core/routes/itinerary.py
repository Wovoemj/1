"""行程规划路由"""
from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import List, Dict, Optional

router = APIRouter()


class ItineraryRequest(BaseModel):
    destination: str
    start_date: str
    end_date: Optional[str] = None
    days: int = 3
    travelers: int = 1
    budget: Optional[float] = None
    preferences: List[str] = []
    travel_style: str = "休闲度假"


class OptimizeRequest(BaseModel):
    itinerary: Dict
    feedback: str


@router.post("/generate")
async def generate_itinerary(req: ItineraryRequest, request: Request):
    """AI生成行程"""
    rag_service = request.app.state.rag_service
    from services.itinerary_service import ItineraryService

    service = ItineraryService(rag_service)
    result = await service.generate_itinerary(req.model_dump())
    return result


@router.post("/optimize")
async def optimize_itinerary(req: OptimizeRequest, request: Request):
    """优化行程"""
    rag_service = request.app.state.rag_service
    from services.itinerary_service import ItineraryService

    service = ItineraryService(rag_service)
    result = await service.optimize_itinerary(req.itinerary, req.feedback)
    return result


@router.post("/budget")
async def estimate_budget(itinerary: Dict, request: Request):
    """预算估算"""
    rag_service = request.app.state.rag_service
    from services.itinerary_service import ItineraryService

    service = ItineraryService(rag_service)
    result = await service.estimate_budget(itinerary)
    return result


@router.get("/templates")
async def get_templates():
    """获取行程模板"""
    return {
        "templates": [
            {
                "id": 1,
                "name": "三亚亲子3日游",
                "destination": "三亚",
                "days": 3,
                "tags": ["亲子", "海边", "度假"],
                "popularity": 4800
            },
            {
                "id": 2,
                "name": "丽江深度5日游",
                "destination": "丽江",
                "days": 5,
                "tags": ["古镇", "雪山", "文化"],
                "popularity": 3200
            },
            {
                "id": 3,
                "name": "北京历史7日游",
                "destination": "北京",
                "days": 7,
                "tags": ["历史", "文化", "美食"],
                "popularity": 5600
            },
            {
                "id": 4,
                "name": "成都美食4日游",
                "destination": "成都",
                "days": 4,
                "tags": ["美食", "熊猫", "休闲"],
                "popularity": 4100
            }
        ]
    }
