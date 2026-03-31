'use client';

import React, { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import AIChatBot from '@/components/ai/AIChatBot';

interface BookingItem {
  id: number;
  name: string;
  location: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  emoji: string;
  gradient: string;
  tags: string[];
}

const hotels: BookingItem[] = [
  { id: 1, name: '三亚亚龙湾万豪度假酒店', location: '三亚·亚龙湾', price: 1280, originalPrice: 1680, rating: 4.8, reviews: 3245, emoji: '🏨', gradient: 'from-blue-400 to-cyan-500', tags: ['海景', '亲子', '含早'] },
  { id: 2, name: '丽江古城花间堂', location: '丽江·古城', price: 680, originalPrice: 880, rating: 4.7, reviews: 2180, emoji: '🏡', gradient: 'from-emerald-400 to-teal-500', tags: ['古城', '庭院', '特色'] },
  { id: 3, name: '北京王府井希尔顿', location: '北京·东城', price: 980, originalPrice: 1280, rating: 4.6, reviews: 4560, emoji: '🏢', gradient: 'from-red-400 to-orange-500', tags: ['市中心', '商务', '地铁口'] },
  { id: 4, name: '成都太古里博舍酒店', location: '成都·锦江', price: 1180, originalPrice: 1580, rating: 4.9, reviews: 1890, emoji: '✨', gradient: 'from-purple-400 to-pink-500', tags: ['太古里', '设计', '网红'] },
];

const tickets: BookingItem[] = [
  { id: 1, name: '故宫博物院', location: '北京', price: 60, rating: 4.9, reviews: 85600, emoji: '🏛️', gradient: 'from-red-500 to-orange-500', tags: ['世界遗产', '5A景区', '历史'] },
  { id: 2, name: '蜈支洲岛', location: '三亚', price: 168, rating: 4.7, reviews: 32100, emoji: '🏝️', gradient: 'from-cyan-400 to-blue-500', tags: ['海岛', '潜水', '亲子'] },
  { id: 3, name: '玉龙雪山', location: '丽江', price: 180, rating: 4.9, reviews: 28900, emoji: '🏔️', gradient: 'from-gray-400 to-blue-500', tags: ['雪山', '索道', '自然'] },
  { id: 4, name: '秦始皇兵马俑', location: '西安', price: 120, rating: 4.9, reviews: 67800, emoji: '🗿', gradient: 'from-amber-500 to-red-600', tags: ['世界遗产', '5A景区', '历史'] },
];

const flights = [
  { id: 1, name: '上海 → 三亚', location: '东方航空', price: 680, originalPrice: 980, rating: 4.5, reviews: 1200, emoji: '✈️', gradient: 'from-blue-500 to-indigo-500', tags: ['直飞', '09:30出发', '经济舱'] },
  { id: 2, name: '北京 → 成都', location: '国航', price: 520, originalPrice: 780, rating: 4.6, reviews: 890, emoji: '✈️', gradient: 'from-red-500 to-orange-500', tags: ['直飞', '14:00出发', '经济舱'] },
  { id: 3, name: '上海 → 丽江', location: '春秋航空', price: 450, originalPrice: 680, rating: 4.3, reviews: 560, emoji: '✈️', gradient: 'from-emerald-500 to-teal-500', tags: ['经停', '07:00出发', '经济舱'] },
  { id: 4, name: '广州 → 西安', location: '南方航空', price: 580, originalPrice: 850, rating: 4.7, reviews: 780, emoji: '✈️', gradient: 'from-purple-500 to-pink-500', tags: ['直飞', '11:00出发', '经济舱'] },
];

type TabKey = 'flight' | 'hotel' | 'ticket';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'flight', label: '机票', icon: '✈️' },
  { key: 'hotel', label: '酒店', icon: '🏨' },
  { key: 'ticket', label: '门票', icon: '🎫' },
];

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('flight');
  const [fromCity, setFromCity] = useState('上海');
  const [toCity, setToCity] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const currentItems = activeTab === 'hotel' ? hotels : activeTab === 'ticket' ? tickets : flights;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero搜索区 */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-10 text-7xl animate-float">✈️</div>
          <div className="absolute bottom-5 right-10 text-6xl animate-float" style={{ animationDelay: '1s' }}>🏨</div>
          <div className="absolute top-10 right-1/3 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>🎫</div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">🎫 预订中心</h1>
            <p className="text-lg opacity-90">机票、酒店、门票一站搞定，轻松出行</p>
          </div>

          {/* 标签切换 */}
          <div className="flex gap-3 mb-6 justify-center">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* 搜索表单 */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            {activeTab === 'flight' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="text-sm text-gray-500 font-medium">出发城市</label>
                  <input
                    value={fromCity}
                    onChange={e => setFromCity(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    placeholder="上海"
                  />
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <button className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-100 transition" title="交换城市">
                    ⇄
                  </button>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">到达城市</label>
                  <input
                    value={toCity}
                    onChange={e => setToCity(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    placeholder="三亚"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">出发日期</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={e => setTravelDate(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>
                <div>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                    🔍 搜索机票
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'hotel' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-sm text-gray-500 font-medium">目的地 / 酒店名</label>
                  <input className="w-full mt-1.5 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" placeholder="三亚" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">入住日期</label>
                  <input type="date" className="w-full mt-1.5 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">退房日期</label>
                  <input type="date" className="w-full mt-1.5 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" />
                </div>
                <div>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                    🔍 搜索酒店
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'ticket' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-sm text-gray-500 font-medium">景点名称 / 目的地</label>
                  <input className="w-full mt-1.5 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" placeholder="故宫 / 北京" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">游玩日期</label>
                  <input type="date" className="w-full mt-1.5 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" />
                </div>
                <div>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                    🔍 搜索门票
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 推荐列表 */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">
              {activeTab === 'hotel' ? '🏨 热门酒店' : activeTab === 'ticket' ? '🎫 热门景点' : '✈️ 热门航线'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {activeTab === 'hotel' ? '精选高评分住宿，舒适出行' : activeTab === 'ticket' ? '热门景区门票，提前预订享优惠' : '特价机票，热门航线推荐'}
            </p>
          </div>
          <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            查看全部 →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentItems.map(item => (
            <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
              {/* 封面 */}
              <div className={`h-40 bg-gradient-to-br ${item.gradient} relative flex items-center justify-center overflow-hidden`}>
                <span className="text-7xl opacity-20 group-hover:scale-125 transition-transform duration-500">{item.emoji}</span>
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {item.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/90 text-gray-700 text-xs rounded-full font-medium backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                {item.originalPrice && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                    省¥{item.originalPrice - item.price}
                  </div>
                )}
              </div>

              {/* 内容 */}
              <div className="p-4">
                <h3 className="font-bold line-clamp-1 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">📍 {item.location}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-orange-500 font-bold text-lg">¥{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through ml-1">¥{item.originalPrice}</span>
                    )}
                    <span className="text-xs text-gray-400 ml-0.5">起</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span className="text-yellow-500">⭐</span> {item.rating}
                    <span className="text-gray-300">|</span>
                    <span>{item.reviews > 1000 ? (item.reviews / 1000).toFixed(1) + 'k' : item.reviews}评</span>
                  </div>
                </div>

                <button className="w-full mt-3 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg active:scale-95 transition-all text-sm">
                  立即预订
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 底部保障 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: '🛡️', title: '价格保障', desc: '买贵退差价' },
            { icon: '🔒', title: '安全支付', desc: '资金安全保障' },
            { icon: '🔄', title: '无忧退改', desc: '灵活退改政策' },
            { icon: '📞', title: '7×24客服', desc: '随时为您服务' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      <AIChatBot />
    </div>
  );
}
