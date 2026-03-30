"""
智能行程规划服务
"""
import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime, date

from openai import AsyncOpenAI
from .rag_service import RAGService


class ItineraryService:
    """AI行程规划服务"""

    def __init__(self, rag_service: RAGService):
        self.rag = rag_service
        self.openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def generate_itinerary(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        生成个性化行程

        Args:
            request: {
                "destination": "三亚",
                "start_date": "2024-03-01",
                "end_date": "2024-03-05",
                "travelers": 2,
                "budget": 5000,
                "preferences": ["海边", "美食", "亲子"],
                "travel_style": "休闲度假"
            }
        """
        destination = request.get("destination", "")
        days = request.get("days", 3)
        preferences = request.get("preferences", [])
        travel_style = request.get("travel_style", "休闲度假")
        budget = request.get("budget", 0)
        travelers = request.get("travelers", 1)

        # 检索目的地信息
        query = f"{destination} 旅游攻略 景点推荐 美食 住宿"
        context = await self.rag.retrieve(query, top_k=8)

        context_text = "\n".join([item['text'] for item in context])

        prompt = f"""请为以下旅行需求生成详细的行程规划：

目的地: {destination}
旅行天数: {days}天
出行人数: {travelers}人
预算: {budget}元
偏好: {', '.join(preferences)}
旅行风格: {travel_style}

参考信息:
{context_text}

请按以下JSON格式输出行程：
{{
    "title": "行程标题",
    "destination": "目的地",
    "days": {days},
    "total_budget": 预估总花费,
    "daily_plans": [
        {{
            "day": 1,
            "date": "日期",
            "theme": "当日主题",
            "activities": [
                {{
                    "time": "09:00",
                    "activity": "活动名称",
                    "location": "地点",
                    "duration": "2小时",
                    "cost": 100,
                    "tips": "小贴士",
                    "type": "scenic/meal/transport/accommodation"
                }}
            ],
            "meals": {{
                "breakfast": "推荐早餐",
                "lunch": "推荐午餐",
                "dinner": "推荐晚餐"
            }},
            "daily_budget": 800
        }}
    ],
    "transport_suggestions": "交通建议",
    "accommodation_suggestions": "住宿建议",
    "packing_list": ["物品清单"],
    "tips": ["注意事项"]
}}"""

        response = await self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一个专业的旅行规划师，请根据用户需求生成详细、实用的行程规划。只输出JSON格式。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=3000
        )

        # 解析行程
        try:
            itinerary = json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            itinerary = {
                "title": f"{destination}{days}日游",
                "raw_response": response.choices[0].message.content,
                "note": "行程解析中，请稍后查看"
            }

        return itinerary

    async def optimize_itinerary(self, itinerary: Dict[str, Any],
                                 feedback: str) -> Dict[str, Any]:
        """根据反馈优化行程"""
        prompt = f"""请根据以下反馈优化行程：

原始行程:
{json.dumps(itinerary, ensure_ascii=False, indent=2)}

用户反馈: {feedback}

请输出优化后的完整行程JSON。"""

        response = await self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一个专业的旅行规划师，请根据用户反馈优化行程。只输出JSON格式。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=3000
        )

        try:
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            return {"error": "优化失败", "raw": response.choices[0].message.content}

    async def estimate_budget(self, itinerary: Dict[str, Any]) -> Dict[str, Any]:
        """估算行程预算"""
        daily_plans = itinerary.get("daily_plans", [])
        total = sum(day.get("daily_budget", 0) for day in daily_plans)

        return {
            "total_budget": total,
            "daily_average": total / len(daily_plans) if daily_plans else 0,
            "breakdown": {
                "accommodation": total * 0.3,
                "meals": total * 0.25,
                "transport": total * 0.15,
                "tickets": total * 0.2,
                "misc": total * 0.1
            }
        }
