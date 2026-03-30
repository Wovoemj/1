'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { api } from '@/lib/api';
import type { ChatMessage } from '@/types';

export function AIChatBot() {
  const { messages, isOpen, isLoading, toggleChat, addMessage, setLoading, clearChat } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await api.ai.chat(useChatStore.getState().sessionId, input.trim());
      if (response.data) {
        addMessage(response.data);
      }
    } catch (error) {
      // Fallback: simulate AI response
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: getAIResponse(input.trim()),
        timestamp: new Date().toISOString(),
        suggestions: getSuggestions(input.trim()),
      };
      addMessage(aiMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center z-50 transition-shadow"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI旅行助手</h3>
                  <p className="text-white/70 text-xs">随时为您规划旅行</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs"
                >
                  新对话
                </button>
                <button
                  onClick={toggleChat}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-blue-500" />
                  </div>
                  <h4 className="text-gray-800 font-medium mb-2">你好！我是AI旅行助手</h4>
                  <p className="text-gray-500 text-sm mb-6">我可以帮你规划行程、推荐目的地、预订服务</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['推荐三亚3日行程', '成都必去景点', '亲子游推荐'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                          setTimeout(handleSend, 100);
                        }}
                        className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white rounded-2xl rounded-tr-md'
                        : 'bg-white text-gray-800 rounded-2xl rounded-tl-md shadow-sm border border-gray-100'
                    } px-4 py-3`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {msg.suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setInput(s);
                            }}
                            className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-md shadow-sm border border-gray-100 px-4 py-3">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的旅行需求..."
                  rows={1}
                  className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 max-h-32"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Simulated AI responses (fallback when API is unavailable)
function getAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('三亚')) {
    return `为您推荐三亚3日行程：\n\n🏖️ **Day 1: 亚龙湾**\n- 上午：抵达三亚，入住亚龙湾万豪酒店\n- 下午：亚龙湾沙滩放松\n- 晚上：海鲜大餐（第一市场）\n\n🐠 **Day 2: 蜈支洲岛**\n- 全天：蜈支洲岛一日游，潜水/浮潜\n- 晚上：三亚湾看日落\n\n🌴 **Day 3: 南山+天涯海角**\n- 上午：南山文化旅游区\n- 下午：天涯海角\n- 返程\n\n预计预算：约4500元/人（含机票酒店）`;
  }
  if (q.includes('成都')) {
    return `成都必去景点推荐：\n\n🐼 **大熊猫繁育研究基地** — 一定要早上去，熊猫最活跃\n🏛️ **武侯祠 & 锦里** — 三国文化+小吃一条街\n🍵 **宽窄巷子** — 体验成都慢生活\n🌶️ **火锅推荐** — 小龙坎、蜀大侠、海底捞\n\n建议游玩2-3天，最佳季节3-5月和9-11月。`;
  }
  if (q.includes('亲子')) {
    return `亲子游推荐目的地：\n\n1️⃣ **三亚** — 海滩、水上乐园、热带天堂森林公园\n2️⃣ **广州长隆** — 动物园+欢乐世界+水上乐园\n3️⃣ **上海迪士尼** — 适合3岁以上小朋友\n4️⃣ **成都** — 看熊猫+美食之旅\n5️⃣ **厦门** — 鼓浪屿+沙滩+文艺小清新\n\n需要我帮你规划具体行程吗？`;
  }
  return `感谢您的咨询！关于"${query}"，我可以从以下几个方面帮您：\n\n🔍 搜索目的地信息\n📋 制定个性化行程\n🏨 推荐酒店和机票\n💰 预算估算\n\n请告诉我更多细节，比如目的地、天数、预算等，我来为您定制方案！`;
}

function getSuggestions(query: string): string[] {
  const q = query.toLowerCase();
  if (q.includes('三亚')) return ['推荐海景酒店', '三亚美食攻略', '3天预算多少'];
  if (q.includes('成都')) return ['成都3日行程', '推荐火锅店', '怎么去熊猫基地'];
  return ['帮我规划行程', '推荐目的地', '查看热门景点'];
}
