'use client';

import React, { useState, useRef, useEffect } from 'react';
import { aiClient } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是TravelAI智能助手 🌍\n\n我可以帮你：\n• 规划个性化行程\n• 推荐旅游目的地\n• 查询景点、酒店、机票\n• 解答旅行问题\n\n请问有什么可以帮你的？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session_${Date.now()}`);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let assistantMessage = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      await aiClient.chatStream(sessionId.current, userMessage, (chunk) => {
        assistantMessage += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantMessage };
          return newMessages;
        });
      });

      if (!assistantMessage) {
        // 回退到非流式
        const result = await aiClient.chat(sessionId.current, userMessage, messages);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: result.answer };
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: '抱歉，服务暂时不可用，请稍后再试 😅'
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    '帮我规划三亚3日游',
    '推荐国内亲子游目的地',
    '丽江有什么好吃的？',
    '北京3天旅游预算多少？'
  ];

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform z-50"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* 聊天窗口 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
              <div>
                <div className="font-bold">TravelAI 智能助手</div>
                <div className="text-xs opacity-80">随时为您服务</div>
              </div>
            </div>
          </div>

          {/* 消息区 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-wrap text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-white shadow-sm border rounded-bl-md'
                }`}>
                  {msg.content}
                  {isLoading && i === messages.length - 1 && msg.role === 'assistant' && (
                    <span className="inline-block ml-1 animate-pulse">▋</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 快捷问题 */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); }}
                  className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* 输入区 */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="输入你的旅行问题..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-300"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 disabled:opacity-50 transition"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
