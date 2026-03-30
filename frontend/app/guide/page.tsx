'use client';

import React, { useState } from 'react';

interface Guide {
  id: number;
  title: string;
  author: string;
  destination: string;
  cover: string;
  views: number;
  likes: number;
  tags: string[];
  excerpt: string;
}

export default function GuidePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const guides: Guide[] = [
    { id: 1, title: '三亚五日深度游攻略', author: '旅行达人', destination: '三亚', cover: '', views: 12500, likes: 890, tags: ['攻略', '自由行'], excerpt: '详细介绍了三亚的最佳游玩路线、美食推荐、住宿选择...' },
    { id: 2, title: '丽江古城+玉龙雪山完美行程', author: '背包客小王', destination: '丽江', cover: '', views: 8900, likes: 650, tags: ['攻略', '雪山'], excerpt: '从丽江古城出发，到玉龙雪山，再到蓝月谷...' },
    { id: 3, title: '北京七日历史文化之旅', author: '历史控', destination: '北京', cover: '', views: 15000, likes: 1200, tags: ['攻略', '历史'], excerpt: '故宫、长城、颐和园...带你看遍千年古都' },
    { id: 4, title: '成都美食地图大全', author: '吃货小分队', destination: '成都', cover: '', views: 20000, likes: 1800, tags: ['攻略', '美食'], excerpt: '从火锅到串串，从担担面到龙抄手...' },
    { id: 5, title: '桂林阳朔三天两夜自驾攻略', author: '自驾游达人', destination: '桂林', cover: '', views: 6700, likes: 420, tags: ['攻略', '自驾'], excerpt: '漓江、遇龙河、十里画廊，自驾走最美路线...' },
    { id: 6, title: '西安不只有兵马俑', author: '文化旅者', destination: '西安', cover: '', views: 9800, likes: 780, tags: ['攻略', '文化'], excerpt: '回民街美食、大雁塔夜景、华山日出...' },
  ];

  const categories = [
    { key: 'all', label: '全部' },
    { key: 'domestic', label: '国内游' },
    { key: 'food', label: '美食' },
    { key: 'culture', label: '文化' },
    { key: 'nature', label: '自然风光' },
    { key: 'self-drive', label: '自驾游' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TravelAI</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600 hover:text-blue-500">首页</a>
            <a href="/planner" className="text-gray-600 hover:text-blue-500">行程规划</a>
            <a href="/booking" className="text-gray-600 hover:text-blue-500">预订</a>
            <a href="/user" className="text-gray-600 hover:text-blue-500">我的</a>
          </div>
        </div>
      </nav>

      {/* Banner */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">📚 旅游攻略</h1>
          <p className="mt-2 opacity-90">百万旅行者的经验分享，助你轻松出行</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 分类 */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2 rounded-full whitespace-nowrap transition ${
                activeCategory === cat.key ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 攻略列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map(guide => (
            <div key={guide.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer">
              <div className="h-44 bg-gradient-to-br from-teal-400 to-green-500 relative flex items-center justify-center">
                <span className="text-5xl opacity-40">📖</span>
                <div className="absolute top-3 right-3 bg-white/90 text-xs px-2 py-1 rounded-full">{guide.destination}</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{guide.title}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{guide.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-xs">👤</div>
                    <span className="text-sm text-gray-500">{guide.author}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>👁 {guide.views}</span>
                    <span>❤️ {guide.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 写攻略入口 */}
        <div className="mt-12 bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">✍️ 分享你的旅行故事</h3>
          <p className="text-gray-500 mb-4">写下你的旅途见闻，帮助更多旅行者</p>
          <button className="px-8 py-3 bg-teal-500 text-white rounded-full font-bold hover:bg-teal-600 transition">
            开始写攻略
          </button>
        </div>
      </div>
    </div>
  );
}
