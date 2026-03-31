'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import AIChatBot from '@/components/ai/AIChatBot';

interface Guide {
  id: number;
  title: string;
  author: string;
  destination: string;
  emoji: string;
  gradient: string;
  views: number;
  likes: number;
  tags: string[];
  excerpt: string;
  readTime: string;
}

const guides: Guide[] = [
  {
    id: 1, title: '三亚五日深度游攻略', author: '旅行达人', destination: '三亚',
    emoji: '🏖️', gradient: 'from-cyan-400 to-blue-500',
    views: 12500, likes: 890, tags: ['攻略', '自由行', '海边'],
    excerpt: '详细介绍了三亚的最佳游玩路线、美食推荐、住宿选择，带你玩转椰风海韵的热带天堂',
    readTime: '8分钟'
  },
  {
    id: 2, title: '丽江古城+玉龙雪山完美行程', author: '背包客小王', destination: '丽江',
    emoji: '🏔️', gradient: 'from-emerald-400 to-teal-600',
    views: 8900, likes: 650, tags: ['攻略', '雪山', '古镇'],
    excerpt: '从丽江古城出发，到玉龙雪山，再到蓝月谷，体验纳西文化与雪山的壮美',
    readTime: '6分钟'
  },
  {
    id: 3, title: '北京七日历史文化之旅', author: '历史控', destination: '北京',
    emoji: '🏛️', gradient: 'from-red-500 to-orange-500',
    views: 15000, likes: 1200, tags: ['攻略', '历史', '文化'],
    excerpt: '故宫、长城、颐和园、天坛...带你深度体验千年古都的文化底蕴',
    readTime: '10分钟'
  },
  {
    id: 4, title: '成都美食地图大全', author: '吃货小分队', destination: '成都',
    emoji: '🍜', gradient: 'from-orange-400 to-red-500',
    views: 20000, likes: 1800, tags: ['攻略', '美食', '必吃'],
    excerpt: '从火锅到串串，从担担面到龙抄手，3天带你吃遍成都大街小巷',
    readTime: '7分钟'
  },
  {
    id: 5, title: '桂林阳朔三天两夜自驾攻略', author: '自驾游达人', destination: '桂林',
    emoji: '🚣', gradient: 'from-green-400 to-emerald-600',
    views: 6700, likes: 420, tags: ['攻略', '自驾', '山水'],
    excerpt: '漓江、遇龙河、十里画廊，自驾走最美山水路线，赏桂林甲天下风光',
    readTime: '5分钟'
  },
  {
    id: 6, title: '西安不只有兵马俑', author: '文化旅者', destination: '西安',
    emoji: '🏯', gradient: 'from-amber-500 to-red-600',
    views: 9800, likes: 780, tags: ['攻略', '文化', '美食'],
    excerpt: '回民街美食、大雁塔夜景、华山日出，让你重新认识这座千年古都',
    readTime: '6分钟'
  },
];

const categories = [
  { key: 'all', label: '全部', icon: '📚' },
  { key: 'domestic', label: '国内游', icon: '🇨🇳' },
  { key: 'food', label: '美食探店', icon: '🍜' },
  { key: 'culture', label: '文化历史', icon: '🏛️' },
  { key: 'nature', label: '自然风光', icon: '🌿' },
  { key: 'self-drive', label: '自驾游', icon: '🚗' },
  { key: 'family', label: '亲子游', icon: '👨‍👩‍👧' },
];

export default function GuidePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-green-500 via-teal-500 to-emerald-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-10 text-7xl animate-float">📖</div>
          <div className="absolute bottom-5 right-10 text-6xl animate-float" style={{ animationDelay: '1s' }}>🗺️</div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm mb-4 backdrop-blur-sm">
            <span>📚 百万旅行者的真实分享</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">旅游攻略</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            来自旅行达人的真实经验，助你轻松规划每一次出行
          </p>

          {/* 搜索 */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-1 flex items-center border border-white/30">
              <span className="pl-4 text-white/70">🔍</span>
              <input
                type="text"
                placeholder="搜索攻略：目的地、关键词..."
                className="flex-1 px-3 py-3 bg-transparent text-white outline-none placeholder:text-white/60"
              />
              <button className="bg-white text-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
                搜索
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 分类标签 */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 font-medium ${
                activeCategory === cat.key
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* 攻略列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map(guide => (
            <div key={guide.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
              {/* 封面 */}
              <div className={`h-44 bg-gradient-to-br ${guide.gradient} relative flex items-center justify-center overflow-hidden`}>
                <span className="text-7xl opacity-20 group-hover:scale-125 transition-transform duration-500">{guide.emoji}</span>
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {guide.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-white/90 text-gray-700 text-xs rounded-full font-medium backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-xs">
                  📖 {guide.readTime}
                </div>
              </div>

              {/* 内容 */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full">{guide.destination}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{guide.excerpt}</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {guide.author[0]}
                    </div>
                    <span className="text-sm text-gray-500">{guide.author}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>👁 {guide.views > 1000 ? (guide.views / 1000).toFixed(1) + 'k' : guide.views}</span>
                    <span>❤️ {guide.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 加载更多 */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-white text-gray-600 rounded-full font-medium shadow-sm hover:shadow-md transition border border-gray-200">
            加载更多攻略 ↓
          </button>
        </div>

        {/* 写攻略入口 */}
        <div className="mt-12 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 left-10 text-6xl">✍️</div>
            <div className="absolute bottom-5 right-10 text-5xl">📝</div>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">✍️ 分享你的旅行故事</h3>
            <p className="opacity-90 mb-6 max-w-md mx-auto">写下你的旅途见闻，帮助更多旅行者发现美好目的地</p>
            <button className="px-8 py-3 bg-white text-teal-600 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
              开始写攻略
            </button>
          </div>
        </div>
      </div>

      <Footer />
      <AIChatBot />
    </div>
  );
}
