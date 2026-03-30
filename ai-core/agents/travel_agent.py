"""
LangChain 智能体 - 旅游助手Agent
"""
import os
import json
from typing import List, Dict, Any, Optional

from openai import AsyncOpenAI
from ..tools.travel_tools import TravelTools, TOOLS


class TravelAgent:
    """基于 Function Calling 的旅游智能体"""

    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = os.getenv("CHAT_MODEL", "gpt-4")

        # OpenAI function definitions
        self.functions = [
            {
                "name": "search_attractions",
                "description": "搜索目的地的景点、餐厅、购物等信息",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "destination": {"type": "string", "description": "目的地名称"},
                        "type": {"type": "string", "enum": ["scenic", "restaurant", "shopping"],
                                 "description": "搜索类型"}
                    },
                    "required": ["destination"]
                }
            },
            {
                "name": "search_hotels",
                "description": "搜索酒店住宿",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "destination": {"type": "string", "description": "目的地"},
                        "check_in": {"type": "string", "description": "入住日期 YYYY-MM-DD"},
                        "check_out": {"type": "string", "description": "退房日期 YYYY-MM-DD"},
                        "budget": {"type": "number", "description": "每晚预算"}
                    },
                    "required": ["destination", "check_in", "check_out"]
                }
            },
            {
                "name": "search_flights",
                "description": "搜索航班机票",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "from_city": {"type": "string", "description": "出发城市"},
                        "to_city": {"type": "string", "description": "到达城市"},
                        "date": {"type": "string", "description": "出发日期 YYYY-MM-DD"}
                    },
                    "required": ["from_city", "to_city", "date"]
                }
            },
            {
                "name": "get_weather",
                "description": "获取目的地天气信息",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {"type": "string", "description": "城市名称"},
                        "date": {"type": "string", "description": "日期（可选）"}
                    },
                    "required": ["city"]
                }
            },
            {
                "name": "get_exchange_rate",
                "description": "查询汇率",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "from_currency": {"type": "string", "description": "源货币代码"},
                        "to_currency": {"type": "string", "description": "目标货币代码"}
                    },
                    "required": ["from_currency", "to_currency"]
                }
            },
            {
                "name": "translate_text",
                "description": "翻译文本到目标语言",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "text": {"type": "string", "description": "待翻译文本"},
                        "target_lang": {"type": "string", "description": "目标语言代码"}
                    },
                    "required": ["text", "target_lang"]
                }
            },
            {
                "name": "calculate_budget",
                "description": "计算行程预算",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "itinerary": {"type": "string", "description": "行程JSON字符串"},
                        "travelers": {"type": "integer", "description": "出行人数"}
                    },
                    "required": ["itinerary"]
                }
            }
        ]

        # 工具映射
        self.tool_map = {
            "search_attractions": TravelTools.search_attractions,
            "search_hotels": TravelTools.search_hotels,
            "search_flights": TravelTools.search_flights,
            "get_weather": TravelTools.get_weather,
            "get_exchange_rate": TravelTools.get_exchange_rate,
            "translate_text": TravelTools.translate_text,
            "calculate_budget": TravelTools.calculate_budget,
        }

    async def run(self, messages: List[Dict[str, str]],
                  max_iterations: int = 5) -> Dict[str, Any]:
        """
        运行Agent循环

        Args:
            messages: 对话历史
            max_iterations: 最大工具调用次数
        """
        tools_used = []
        current_messages = messages.copy()

        for i in range(max_iterations):
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=current_messages,
                functions=self.functions,
                function_call="auto",
                temperature=0.7
            )

            choice = response.choices[0]
            message = choice.message

            # 检查是否需要调用工具
            if choice.finish_reason == "function_call":
                func_name = message.function_call.name
                func_args = json.loads(message.function_call.arguments)

                tools_used.append({
                    "name": func_name,
                    "args": func_args
                })

                # 执行工具
                tool_func = self.tool_map.get(func_name)
                if tool_func:
                    try:
                        result = await tool_func(**func_args)
                    except Exception as e:
                        result = json.dumps({"error": str(e)})
                else:
                    result = json.dumps({"error": f"Unknown tool: {func_name}"})

                # 将结果加入消息
                current_messages.append({
                    "role": "assistant",
                    "content": None,
                    "function_call": {
                        "name": func_name,
                        "arguments": message.function_call.arguments
                    }
                })
                current_messages.append({
                    "role": "function",
                    "name": func_name,
                    "content": result
                })
            else:
                # 最终回答
                return {
                    "answer": message.content,
                    "tools_used": tools_used,
                    "iterations": i + 1
                }

        return {
            "answer": "抱歉，我在处理您的请求时遇到了问题，请稍后再试。",
            "tools_used": tools_used,
            "iterations": max_iterations
        }
