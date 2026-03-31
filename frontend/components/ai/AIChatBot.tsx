'use client';

import React, { useState, useRef, useEffect } from 'react';
import { aiApi } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: string[];
  tools_used?: any[];
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是TravelAI智能助手 🌍\n\n我可以帮你：\n• 🗺️ 规划个性化行程\n• 🏖️ 推荐旅游目的地\n• 🎫 查询景点、酒店、机票\n• ❓ 解答旅行问题\n• 🍜 推荐当地美食\n• 💰 估算旅行预算\n\n请问有什么可以帮你的？',
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(`session_${Date.now()}`);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const userMsgId = generateId();
    setInput('');

    setMessages(prev => [...prev, {
      id: userMsgId,
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    }]);
    setIsLoading(true);

    const assistantMsgId = generateId();
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }]);

    try {
      let assistantMessage = '';

      await aiApi.chatStream(
        sessionId.current,
        userMessage,
        (chunk) => {
          assistantMessage += chunk;
          setMessages(prev => prev.map(m =>
            m.id === assistantMsgId ? { ...m, content: assistantMessage } : m
          ));
        },
        () => {
          // onDone callback
        }
      );

      // 如果流式没有返回内容，回退到非流式
      if (!assistantMessage) {
        const result = await aiApi.chat(sessionId.current, userMessage);
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId ? {
            ...m,
            content: result.answer,
            sources: result.sources,
            tools_used: result.tools_used,
          } : m
        ));
      }
    } catch (error) {
      console.error('AI chat error:', error);
      setMessages(prev => prev.map(m =>
        m.id === assistantMsgId ? {
          ...m,
          content: '抱歉，服务暂时不可用，请稍后再试 😅\n\n你也可以直接浏览我们的攻略和行程规划功能。',
        } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    sessionId.current = `session_${Date.now()}`;
    setMessages([{
      id: 'welcome-reset',
      role: 'assistant',
      content: '对话已清空 🔄\n\n有什么新的旅行计划想聊聊吗？',
      timestamp: Date.now(),
    }]);
  };

  const quickQuestions = [
    { icon: '🏖️', text: '帮我规划三亚3日游' },
    { icon: '👨‍👩‍👧‍👦', text: '推荐国内亲子游目的地' },
    { icon: '🍜', text: '成都美食攻略' },
    { icon: '💰', text: '北京3天旅游预算多少？' },
    { icon: '🏔️', text: '云南最佳旅行季节' },
    { icon: '✈️', text: '境外免签国家推荐' },
  ];

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* 悬浮按钮 - 带脉冲动画 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl flex items-center justify-center text-white text-2xl hover:scale-110 active:scale-95 transition-all duration-200 z-50 group"
          aria-label="打开AI助手"
        >
          <span className="group-hover:scale-110 transition-transform">🤖</span>
          {/* 脉冲指示器 */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* 聊天窗口 */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-[400px] h-[600px]'
        }`}
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          {/* 头部 */}
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4 cursor-pointer select-none"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl backdrop-blur-sm">
                  🤖
                </div>
                <div>
                  <div className="font-bold text-sm">TravelAI 智能助手</div>
                  <div className="text-xs opacity-80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                    在线 · 随时为您服务
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); clearChat(); }}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition text-sm"
                  title="清空对话"
                  aria-label="清空对话"
                >
                  🔄
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition text-sm"
                  title="关闭"
                  aria-label="关闭聊天"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* 消息区 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-sm mr-2 shrink-0 mt-1 shadow-sm">
                        🤖
                      </div>
                    )}
                    <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                      <div className={`p-3 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md shadow-md'
                          : 'bg-white shadow-sm border border-gray-100 rounded-bl-md'
                      }`}>
                        {msg.content}
                        {isLoading && msg.id === messages[messages.length - 1]?.id && msg.role === 'assistant' && !msg.content && (
                          <div className="flex items-center gap-1 py-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </div>
                      <div className={`text-xs text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {formatTime(msg.timestamp)}
                        {msg.sources && msg.sources.length > 0 && (
                          <span className="ml-2 text-blue-400">📚 参考了{msg.sources.length}个来源</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* 快捷问题 */}
              {messages.length <= 2 && (
                <div className="px-4 pb-3 pt-1 border-t border-gray-100 bg-white">
                  <p className="text-xs text-gray-400 mb-2">💡 快捷问题</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickQuestion(q.text)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <span>{q.icon}</span>
                        {q.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 输入区 */}
              <div className="p-3 border-t bg-white">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="输入你的旅行问题..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white transition-all placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center hover:shadow-lg disabled:opacity-40 disabled:hover:shadow-none transition-all active:scale-95"
                    aria-label="发送消息"
                  >
                    {isLoading ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <span>➤</span>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  AI助手由大语言模型驱动，仅供参考
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
