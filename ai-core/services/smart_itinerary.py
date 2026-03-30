"""
智能行程服务 - 增强版（含用户画像）
"""
import json
from typing import Dict, Any, List, Optional

from .rag_service import RAGService
from .user_profile import UserProfileService


class SmartItineraryService:
    """增强版行程规划（结合RAG + 用户画像）"""

    def __init__(self, rag_service: RAGService):
        self.rag = rag_service
        self.profile_service = UserProfileService()

    async def generate_personalized_itinerary(
        self,
        user_id: int,
        destination: str,
        days: int,
        budget: float = 0,
        preferences: List[str] = None,
        travel_style: str = "休闲度假"
    ) -> Dict[str, Any]:
        """生成个性化行程"""

        # 1. 获取用户画像
        profile_context = await self.profile_service.generate_recommendation_context(user_id)

        # 2. 检索目的地知识
        search_query = f"{destination} 旅游攻略 景点推荐 美食 住宿 {' '.join(preferences or [])}"
        context = await self.rag.retrieve(search_query, top_k=8)
        knowledge = "\n".join([item['text'] for item in context])

        # 3. 构建增强prompt
        enhanced_request = {
            "destination": destination,
            "days": days,
            "budget": budget,
            "preferences": preferences or [],
            "travel_style": travel_style,
            "user_profile": profile_context,
            "destination_knowledge": knowledge
        }

        return enhanced_request

    async def analyze_cost_breakdown(self, itinerary: Dict[str, Any]) -> Dict[str, Any]:
        """分析费用明细"""
        daily_plans = itinerary.get("daily_plans", [])
        total = 0
        breakdown = {"accommodation": 0, "meals": 0, "transport": 0, "tickets": 0, "shopping": 0, "misc": 0}

        for day in daily_plans:
            for activity in day.get("activities", []):
                cost = activity.get("cost", 0)
                total += cost
                act_type = activity.get("type", "misc")
                if act_type in breakdown:
                    breakdown[act_type] += cost
                else:
                    breakdown["misc"] += cost

        return {
            "total_cost": total,
            "breakdown": breakdown,
            "daily_average": total / len(daily_plans) if daily_plans else 0,
            "cost_tips": self._generate_cost_tips(breakdown, total)
        }

    def _generate_cost_tips(self, breakdown: Dict[str, float], total: float) -> List[str]:
        """生成省钱建议"""
        tips = []
        if total == 0:
            return tips

        if breakdown.get("accommodation", 0) / total > 0.4:
            tips.append("住宿占比偏高，可以考虑民宿或青旅节省开支")
        if breakdown.get("meals", 0) / total > 0.3:
            tips.append("餐饮开支较多，推荐尝试当地小吃街，性价比更高")
        if breakdown.get("transport", 0) / total > 0.2:
            tips.append("交通费用较高，建议购买当地交通卡或使用拼车服务")

        tips.append("提前预订机票和酒店通常能享受更多折扣")
        return tips
