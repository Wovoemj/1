"""AI对话路由"""
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str
    message: str
    user_id: Optional[int] = None
    history: Optional[List[Dict]] = None


class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []
    tools_used: List[Dict] = []
    session_id: str


@router.post("/completion", response_model=ChatResponse)
async def chat_completion(req: ChatRequest, request: Request):
    """AI对话接口 - RAG + Agent"""
    rag_service = request.app.state.rag_service

    # 使用RAG生成回答
    result = await rag_service.chat(
        query=req.message,
        session_id=req.session_id,
        conversation_history=req.history
    )

    return ChatResponse(
        answer=result["answer"],
        sources=result.get("sources", []),
        tools_used=[],
        session_id=req.session_id
    )


@router.post("/stream")
async def chat_stream(req: ChatRequest, request: Request):
    """流式对话（SSE）"""
    from fastapi.responses import StreamingResponse
    import json

    async def generate():
        rag_service = request.app.state.rag_service
        context = await rag_service.retrieve(req.message)

        context_text = "\n".join([item['text'] for item in context])

        messages = [
            {"role": "system", "content": "你是TravelAI智能旅游助手，帮助用户规划旅行、推荐目的地。"},
        ]
        if req.history:
            messages.extend(req.history[-6:])
        messages.append({"role": "user", "content": f"{req.message}\n\n参考信息:\n{context_text}"})

        client = rag_service.openai_client
        stream = await client.chat.completions.create(
            model=rag_service.chat_model,
            messages=messages,
            temperature=0.7,
            max_tokens=2000,
            stream=True
        )

        async for chunk in stream:
            if chunk.choices[0].delta.content:
                data = json.dumps({"content": chunk.choices[0].delta.content}, ensure_ascii=False)
                yield f"data: {data}\n\n"

        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """获取对话历史"""
    # TODO: 从数据库查询
    return {"session_id": session_id, "messages": []}
