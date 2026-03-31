'use client';

import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import AIPlanner from '@/components/planner/AIPlanner';
import AIChatBot from '@/components/ai/AIChatBot';

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-10 text-7xl animate-float">🗺️</div>
          <div className="absolute bottom-5 right-10 text-6xl animate-float" style={{ animationDelay: '1s' }}>✈️</div>
          <div className="absolute top-10 right-1/3 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>🏔️</div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm mb-4 backdrop-blur-sm">
            <span className="animate-pulse">✨</span>
            <span>AI大模型驱动 · 个性化定制</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">🗺️ AI智能行程规划</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            告诉AI你的旅行愿望——目的地、天数、预算、偏好，它会为你量身定制完美行程
          </p>
        </div>
      </div>

      {/* 功能说明 */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🎯', title: '精准匹配', desc: '根据你的偏好和预算精准推荐' },
            { icon: '⚡', title: '秒级生成', desc: 'AI秒级生成完整行程方案' },
            { icon: '🔄', title: '随时优化', desc: '不满意？一键重新规划' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-bold text-sm">{item.title}</h3>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-8">
        <AIPlanner />
      </div>

      <Footer />
      <AIChatBot />
    </div>
  );
}
