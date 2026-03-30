'use client';

import React, { useState } from 'react';

interface BookingItem {
  id: number;
  type: 'flight' | 'hotel' | 'ticket';
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
}

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<'flight' | 'hotel' | 'ticket'>('flight');
  const [fromCity, setFromCity] = useState('上海');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');

  const hotels: BookingItem[] = [
    { id: 1, type: 'hotel', name: '三亚亚龙湾万豪度假酒店', location: '三亚·亚龙湾', price: 1280, rating: 4.8, image: '' },
    { id: 2, type: 'hotel', name: '丽江古城花间堂', location: '丽江·古城', price: 680, rating: 4.7, image: '' },
    { id: 3, type: 'hotel', name: '北京王府井希尔顿', location: '北京·东城', price: 980, rating: 4.6, image: '' },
    { id: 4, type: 'hotel', name: '成都太古里博舍酒店', location: '成都·锦江', price: 1180, rating: 4.9, image: '' },
  ];

  const tickets: BookingItem[] = [
    { id: 1, type: 'ticket', name: '故宫博物院', location: '北京', price: 60, rating: 4.9, image: '' },
    { id: 2, type: 'ticket', name: '蜈支洲岛', location: '三亚', price: 168, rating: 4.7, image: '' },
    { id: 3, type: 'ticket', name: '玉龙雪山', location: '丽江', price: 180, rating: 4.9, image: '' },
    { id: 4, type: 'ticket', name: '秦始皇兵马俑', location: '西安', price: 120, rating: 4.9, image: '' },
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
            <a href="/guide" className="text-gray-600 hover:text-blue-500">攻略</a>
            <a href="/user" className="text-gray-600 hover:text-blue-500">我的</a>
          </div>
        </div>
      </nav>

      {/* 搜索区 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* 标签切换 */}
          <div className="flex gap-4 mb-6 justify-center">
            {[
              { key: 'flight' as const, label: '✈️ 机票', color: 'bg-blue-400' },
              { key: 'hotel' as const, label: '🏨 酒店', color: 'bg-indigo-400' },
              { key: 'ticket' as const, label: '🎫 门票', color: 'bg-purple-400' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-xl font-bold transition ${
                  activeTab === tab.key ? 'bg-white text-blue-600 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 搜索表单 */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            {activeTab === 'flight' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-gray-500">出发城市</label>
                  <input value={fromCity} onChange={e => setFromCity(e.target.value)} className="w-full mt-1 px-4 py-3 border rounded-xl" placeholder="上海" />
                </div>
                <div>
                  <label className="text-sm text-gray-500">到达城市</label>
                  <input value={toCity} onChange={e => setToCity(e.target.value)} className="w-full mt-1 px-4 py-3 border rounded-xl" placeholder="三亚" />
                </div>
                <div>
                  <label className="text-sm text-gray-500">出发日期</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 px-4 py-3 border rounded-xl" />
                </div>
                <div className="flex items-end">
                  <button className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition">🔍 搜索机票</button>
                </div>
              </div>
            )}
            {activeTab === 'hotel' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-gray-500">目的地</label>
                  <input className="w-full mt-1 px-4 py-3 border rounded-xl" placeholder="三亚" />
                </div>
                <div>
                  <label className="text-sm text-gray-500">入住日期</label>
                  <input type="date" className="w-full mt-1 px-4 py-3 border rounded-xl" />
                </div>
                <div>
                  <label className="text-sm text-gray-500">退房日期</label>
                  <input type="date" className="w-full mt-1 px-4 py-3 border rounded-xl" />
                </div>
                <div className="flex items-end">
                  <button className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition">🔍 搜索酒店</button>
                </div>
              </div>
            )}
            {activeTab === 'ticket' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-500">目的地</label>
                  <input className="w-full mt-1 px-4 py-3 border rounded-xl" placeholder="搜索景点名称" />
                </div>
                <div>
                  <label className="text-sm text-gray-500">游玩日期</label>
                  <input type="date" className="w-full mt-1 px-4 py-3 border rounded-xl" />
                </div>
                <div className="flex items-end">
                  <button className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition">🔍 搜索门票</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 推荐列表 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          {activeTab === 'hotel' ? '🏨 热门酒店' : activeTab === 'ticket' ? '🎫 热门景点' : '✈️ 热门航线'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(activeTab === 'hotel' ? hotels : tickets).map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer">
              <div className="h-36 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <span className="text-5xl opacity-40">{activeTab === 'hotel' ? '🏨' : '🎫'}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold line-clamp-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">📍 {item.location}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-orange-500 font-bold">¥{item.price} <span className="text-xs text-gray-400 font-normal">起</span></div>
                  <div className="flex items-center gap-1 text-sm">
                    ⭐ <span>{item.rating}</span>
                  </div>
                </div>
                <button className="w-full mt-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition">
                  立即预订
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
