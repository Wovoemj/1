'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Destination {
  id: number;
  name: string;
  description: string;
  cover_image: string;
  rating: number;
  tags: string[];
  best_season: string;
}

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recommend');

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    // 模拟数据
    setDestinations([
      { id: 1, name: '三亚', description: '中国最南端的热带滨海旅游城市', cover_image: '/images/sanya.jpg', rating: 4.7, tags: ['海边', '度假'], best_season: '10月-次年4月' },
      { id: 2, name: '丽江', description: '世界文化遗产古城，纳西族文化圣地', cover_image: '/images/lijiang.jpg', rating: 4.6, tags: ['古镇', '雪山'], best_season: '3月-5月' },
      { id: 3, name: '北京', description: '千年古都，历史文化的交汇点', cover_image: '/images/beijing.jpg', rating: 4.8, tags: ['历史', '文化'], best_season: '9月-10月' },
      { id: 4, name: '成都', description: '天府之国，熊猫故乡，美食之都', cover_image: '/images/chengdu.jpg', rating: 4.8, tags: ['美食', '熊猫'], best_season: '3月-6月' },
      { id: 5, name: '上海', description: '国际大都市，中西文化交融', cover_image: '/images/shanghai.jpg', rating: 4.7, tags: ['都市', '购物'], best_season: '3月-5月' },
      { id: 6, name: '西安', description: '十三朝古都，丝绸之路起点', cover_image: '/images/xian.jpg', rating: 4.7, tags: ['历史', '美食'], best_season: '3月-5月' },
    ]);
  };

  const tabs = [
    { key: 'recommend', label: '🔥 推荐' },
    { key: 'domestic', label: '🇨🇳 国内' },
    { key: 'overseas', label: '🌏 境外' },
    { key: 'hotels', label: '🏨 酒店' },
    { key: 'flights', label: '✈️ 机票' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TravelAI</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/planner" className="text-gray-600 hover:text-blue-500">行程规划</a>
            <a href="/guide" className="text-gray-600 hover:text-blue-500">攻略</a>
            <a href="/booking" className="text-gray-600 hover:text-blue-500">预订</a>
            <a href="/user" className="text-gray-600 hover:text-blue-500">我的</a>
          </div>
        </div>
      </nav>

      {/* Hero区域 */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI驱动的智能旅行规划</h1>
          <p className="text-xl opacity-90 mb-8">一句话描述你的旅行愿望，AI为你定制专属行程</p>

          {/* 搜索框 */}
          <div className="bg-white rounded-2xl p-2 flex items-center shadow-xl max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索目的地、景点、攻略..."
              className="flex-1 px-4 py-3 text-gray-800 outline-none text-lg"
            />
            <button className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition">
              🔍 搜索
            </button>
          </div>

          {/* 快捷标签 */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['三亚亲子游', '丽江古城', '北京文化之旅', '成都美食', '桂林山水'].map(tag => (
              <span key={tag} className="px-4 py-1.5 bg-white/20 rounded-full text-sm cursor-pointer hover:bg-white/30 transition">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 分类标签 */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 目的地瀑布流 */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">🌴 热门目的地</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map(dest => (
            <div key={dest.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                  {dest.name === '三亚' ? '🏖️' : dest.name === '丽江' ? '🏔️' : dest.name === '北京' ? '🏛️' : dest.name === '成都' ? '🐼' : dest.name === '上海' ? '🌃' : '🏯'}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-white text-xl font-bold">{dest.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-3">{dest.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {dest.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    ⭐ <span className="text-gray-700 text-sm">{dest.rating}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-400">最佳季节: {dest.best_season}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI功能卡片 */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">🤖 AI旅行助手</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: '🗺️', title: '智能行程', desc: 'AI一键生成个性化行程', link: '/planner' },
            { icon: '💬', title: '旅行问答', desc: '7x24小时智能客服', link: '#' },
            { icon: '📸', title: '图片识别', desc: '拍照识别景点推荐攻略', link: '#' },
            { icon: '💰', title: '预算估算', desc: '智能估算旅行花费', link: '/planner' },
          ].map((item, i) => (
            <a key={i} href={item.link} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition">{item.icon}</div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* 底部 */}
      <footer className="bg-gray-800 text-gray-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-3">
              <span className="text-2xl">🌍</span>
              <span className="text-xl font-bold">TravelAI</span>
            </div>
            <p className="text-sm">AI驱动的智能旅游平台，让每一次旅行都充满惊喜。</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">产品</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/planner" className="hover:text-white">行程规划</a></li>
              <li><a href="/guide" className="hover:text-white">旅游攻略</a></li>
              <li><a href="/booking" className="hover:text-white">预订服务</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">支持</h4>
            <ul className="space-y-2 text-sm">
              <li>帮助中心</li>
              <li>联系我们</li>
              <li>隐私政策</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">关注我们</h4>
            <div className="flex gap-3 text-2xl">
              <span>📱</span><span>💬</span><span>📧</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-sm">© 2024 TravelAI. All rights reserved.</div>
      </footer>
    </div>
  );
}
