'use client';

import React from 'react';
import AIPlanner from '@/components/planner/AIPlanner';

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TravelAI</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600 hover:text-blue-500">首页</a>
            <a href="/guide" className="text-gray-600 hover:text-blue-500">攻略</a>
            <a href="/booking" className="text-gray-600 hover:text-blue-500">预订</a>
            <a href="/user" className="text-gray-600 hover:text-blue-500">我的</a>
          </div>
        </div>
      </nav>

      <div className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">🗺️ AI智能行程规划</h1>
          <p className="text-gray-500 mt-2">告诉AI你的旅行愿望，它会为你量身定制完美行程</p>
        </div>
        <AIPlanner />
      </div>
    </div>
  );
}
