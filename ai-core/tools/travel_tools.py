"""
AI 工具集 - 供 LangChain Agent 使用
"""
import os
import json
from typing import Dict, Any, Optional
from datetime import datetime

import httpx


class TravelTools:
    """旅游AI工具箱"""

    BASE_URL = os.getenv("BACKEND_URL", "http://gateway:8080/api")

    @staticmethod
    async def search_attractions(destination: str, type: Optional[str] = None) -> str:
        """搜索目的地景点"""
        async with httpx.AsyncClient() as client:
            params = {"destination": destination}
            if type:
                params["type"] = type
            resp = await client.get(f"{TravelTools.BASE_URL}/products/public/pois", params=params)
            data = resp.json()
            return json.dumps(data, ensure_ascii=False, indent=2)

    @staticmethod
    async def search_hotels(destination: str, check_in: str, check_out: str,
                            budget: Optional[float] = None) -> str:
        """搜索酒店"""
        async with httpx.AsyncClient() as client:
            params = {
                "destination": destination,
                "check_in": check_in,
                "check_out": check_out
            }
            if budget:
                params["max_price"] = budget
            resp = await client.get(f"{TravelTools.BASE_URL}/products/public/hotels", params=params)
            return json.dumps(resp.json(), ensure_ascii=False, indent=2)

    @staticmethod
    async def search_flights(from_city: str, to_city: str, date: str) -> str:
        """搜索航班"""
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{TravelTools.BASE_URL}/products/public/flights", params={
                "from": from_city,
                "to": to_city,
                "date": date
            })
            return json.dumps(resp.json(), ensure_ascii=False, indent=2)

    @staticmethod
    async def get_weather(city: str, date: Optional[str] = None) -> str:
        """获取天气信息"""
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"https://wttr.in/{city}?format=j1")
            data = resp.json()
            current = data.get("current_condition", [{}])[0]
            return json.dumps({
                "city": city,
                "temperature": current.get("temp_C"),
                "feels_like": current.get("FeelsLikeC"),
                "weather": current.get("weatherDesc", [{}])[0].get("value"),
                "humidity": current.get("humidity"),
                "wind_speed": current.get("windspeedKmph"),
                "tip": f"{city}当前气温{current.get('temp_C')}°C，体感{current.get('FeelsLikeC')}°C"
            }, ensure_ascii=False, indent=2)

    @staticmethod
    async def get_exchange_rate(from_currency: str, to_currency: str) -> str:
        """获取汇率"""
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://api.exchangerate-api.com/v4/latest/{from_currency}"
            )
            data = resp.json()
            rate = data.get("rates", {}).get(to_currency, 0)
            return json.dumps({
                "from": from_currency,
                "to": to_currency,
                "rate": rate,
                "updated": data.get("date")
            }, ensure_ascii=False, indent=2)

    @staticmethod
    async def translate_text(text: str, target_lang: str = "en") -> str:
        """实时翻译"""
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://translation.googleapis.com/language/translate/v2",
                params={"key": os.getenv("GOOGLE_TRANSLATE_KEY", "")},
                data={"q": text, "target": target_lang}
            )
            data = resp.json()
            translation = data.get("data", {}).get("translations", [{}])[0].get("translatedText", "")
            return json.dumps({
                "original": text,
                "translation": translation,
                "target_lang": target_lang
            }, ensure_ascii=False, indent=2)

    @staticmethod
    async def calculate_budget(itinerary: Dict[str, Any], travelers: int = 1) -> str:
        """计算行程预算"""
        daily_plans = itinerary.get("daily_plans", [])
        total = sum(day.get("daily_budget", 0) for day in daily_plans) * travelers

        breakdown = {
            "accommodation": round(total * 0.30),
            "meals": round(total * 0.25),
            "transport": round(total * 0.15),
            "tickets": round(total * 0.20),
            "misc": round(total * 0.10)
        }

        return json.dumps({
            "total_per_person": total,
            "total_group": total * travelers,
            "travelers": travelers,
            "breakdown": breakdown,
            "tip": f"人均预算约 ¥{total}，{travelers}人合计约 ¥{total * travelers}"
        }, ensure_ascii=False, indent=2)


# 工具定义（LangChain格式）
TOOLS = [
    {
        "name": "search_attractions",
        "description": "搜索目的地的景点信息。输入: destination(目的地), type(可选: scenic/restaurant/shopping)",
        "function": TravelTools.search_attractions
    },
    {
        "name": "search_hotels",
        "description": "搜索酒店。输入: destination, check_in(入住日期), check_out(退房日期), budget(可选: 预算)",
        "function": TravelTools.search_hotels
    },
    {
        "name": "search_flights",
        "description": "搜索航班。输入: from_city(出发城市), to_city(到达城市), date(日期)",
        "function": TravelTools.search_flights
    },
    {
        "name": "get_weather",
        "description": "获取目的地天气。输入: city(城市名), date(可选: 日期)",
        "function": TravelTools.get_weather
    },
    {
        "name": "get_exchange_rate",
        "description": "查询汇率。输入: from_currency(源货币如CNY), to_currency(目标货币如USD)",
        "function": TravelTools.get_exchange_rate
    },
    {
        "name": "translate_text",
        "description": "翻译文本。输入: text(待翻译文本), target_lang(目标语言如en/ja/ko)",
        "function": TravelTools.translate_text
    },
    {
        "name": "calculate_budget",
        "description": "计算行程预算。输入: itinerary(行程JSON), travelers(人数)",
        "function": TravelTools.calculate_budget
    }
]
