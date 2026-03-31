'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import AIChatBot from '@/components/ai/AIChatBot';

interface Destination {
  id: number;
  name: string;
  name_en: string;
  description: string;
  cover_emoji: string;
  gradient: string;
  rating: number;
  tags: string[];
  best_season: string;
  avg_cost: string;
  highlights: string[];
}

const destinations: Destination[] = [
  {
    id: 1, name: '三亚', name_en: 'Sanya',
    description: '中国最南端的热带滨海旅游城市，椰风海韵，碧海蓝天',
    cover_emoji: '🏖️', gradient: 'from-cyan-400 to-blue-500',
    rating: 4.7, tags: ['海边', '度假', '免税购物'], best_season: '10月-次年4月', avg_cost: '3000-8000',
    highlights: ['亚龙湾', '蜈支洲岛', '天涯海角', '南山寺']
  },
  {
    id: 2, name: '丽江', name_en: 'Lijiang',
    description: '世界文化遗产古城，纳西族文化圣地，雪山与古镇的完美融合',
    cover_emoji: '🏔️', gradient: 'from-emerald-400 to-teal-600',
    rating: 4.6, tags: ['古镇', '雪山', '民族文化'], best_season: '3月-5月', avg_cost: '2000-5000',
    highlights: ['玉龙雪山', '丽江古城', '束河古镇', '蓝月谷']
  },
  {
    id: 3, name: '北京', name_en: 'Beijing',
    description: '千年古都，历史文化的交汇点，感受中华文明的厚重底蕴',
    cover_emoji: '🏛️', gradient: 'from-red-500 to-orange-500',
    rating: 4.8, tags: ['历史', '文化', '美食'], best_season: '9月-10月', avg_cost: '2500-6000',
    highlights: ['故宫', '长城', '颐和园', '天坛']
  },
  {
    id: 4, name: '成都', name_en: 'Chengdu',
    description: '天府之国，熊猫故乡，一座来了就不想走的城市',
    cover_emoji: '🐼', gradient: 'from-green-400 to-emerald-600',
    rating: 4.8, tags: ['美食', '熊猫', '休闲'], best_season: '3月-6月', avg_cost: '2000-5000',
    highlights: ['大熊猫基地', '宽窄巷子', '锦里', '都江堰']
  },
  {
    id: 5, name: '上海', name_en: 'Shanghai',
    description: '魔都上海，东方巴黎，摩登与传统的完美交融',
    cover_emoji: '🌃', gradient: 'from-purple-500 to-pink-500',
    rating: 4.7, tags: ['都市', '购物', '夜景'], best_season: '3月-5月', avg_cost: '3000-7000',
    highlights: ['外滩', '东方明珠', '迪士尼', '田子坊']
  },
  {
    id: 6, name: '西安', name_en: "Xi'an",
    description: '十三朝古都，丝绸之路起点，穿越千年的历史之旅',
    cover_emoji: '🏯', gradient: 'from-amber-500 to-red-600',
    rating: 4.7, tags: ['历史', '美食', '文化'], best_season: '3月-5月', avg_cost: '2000-4500',
    highlights: ['兵马俑', '大雁塔', '回民街', '华清宫']
  },
];

const aiFeatures = [
  { icon: '🗺️', title: '智能行程规划', desc: 'AI一键生成个性化行程，省时省心', link: '/planner', color: 'from-blue-500 to-cyan-500' },
  { icon: '💬', title: '旅行智能问答', desc: '7×24小时AI客服，随时解答旅行问题', link: '#chat', color: 'from-purple-500 to-pink-500' },
  { icon: '📸', title: '图片景点识别', desc: '拍照识别景点，自动推荐相关攻略', link: '#', color: 'from-green-500 to-emerald-500' },
  { icon: '💰', title: '智能预算估算', desc: '根据行程自动计算费用，明明白白出行', link: '/planner', color: 'from-orange-500 to-amber-500' },
];

const hotTags = ['三亚亲子游', '丽江古城三日', '北京文化深度', '成都美食之旅', '桂林阳朔', '厦门鼓浪屿', '杭州西湖', '新疆自驾'];

const tabs = [
  { key: 'recommend', label: '🔥 推荐', icon: '🔥' },
  { key: 'domestic', label: '国内', icon: '🇨🇳' },
  { key: 'overseas', label: '境外', icon: '🌏' },
  { key: 'hotels', label: '酒店', icon: '🏨' },
  { key: 'flights', label: '机票', icon: '✈️' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('recommend');
  const [searchQuery, setSearchQuery] = useState('');
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Staggered card animation
    const timer = setTimeout(() => {
      destinations.forEach((_, i) => {
        setTimeout(() => {
          setAnimatedCards(prev => new Set([...prev, i]));
        }, i * 100);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/guide?keyword=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero区域 */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-24 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-float">✈️</div>
          <div className="absolute top-20 right-20 text-6xl animate-float" style={{ animationDelay: '1s' }}>🏖️</div>
          <div className="absolute bottom-10 left-1/4 text-7xl animate-float" style={{ animationDelay: '2s' }}>🏔️</div>
          <div className="absolute bottom-20 right-1/3 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>🌴</div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm mb-6 backdrop-blur-sm">
            <span className="animate-pulse">✨</span>
            <span>AI大模型驱动 · 百万用户信赖</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            AI驱动的
            <span className="block">智能旅行规划</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            一句话描述你的旅行愿望，AI为你定制专属行程，让每一次旅行都充满惊喜
          </p>

          {/* 搜索框 */}
          <div className="bg-white rounded-2xl p-2 flex items-center shadow-2xl max-w-2xl mx-auto">
            <span className="pl-4 text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="搜索目的地、景点、攻略..."
              className="flex-1 px-3 py-3 text-gray-800 outline-none text-lg bg-transparent"
            />
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              搜索
            </button>
          </div>

          {/* 快捷标签 */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {hotTags.map(tag => (
              <Link
                key={tag}
                href={`/guide?keyword=${encodeURIComponent(tag)}`}
                className="px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm cursor-pointer hover:bg-white/30 transition-all border border-white/20"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 分类标签 */}
      <div className="max-w-7xl mx-auto px-4 -mt-5 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 font-medium ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label.replace(tab.icon + ' ', '')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 目的地卡片 */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">🌴 热门目的地</h2>
            <p className="text-gray-500 text-sm mt-1">精选国内热门旅游城市，开启你的精彩旅程</p>
          </div>
          <Link href="/guide" className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1">
            查看全部 <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <div
              key={dest.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${
                animatedCards.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* 封面区域 */}
              <div className={`h-52 bg-gradient-to-br ${dest.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 group-hover:scale-125 transition-transform duration-700">
                  {dest.cover_emoji}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* 标签 */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {dest.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-white/90 text-gray-700 text-xs rounded-full font-medium backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 评分 */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-white text-sm font-bold">{dest.rating}</span>
                </div>

                {/* 底部城市名 */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-2xl font-bold">{dest.name}</h3>
                  <p className="text-white/80 text-sm">{dest.name_en}</p>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-5">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dest.description}</p>

                {/* 热门景点 */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {dest.highlights.map(h => (
                    <span key={h} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
                      {h}
                    </span>
                  ))}
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    <span className="mr-3">🗓️ {dest.best_season}</span>
                    <span>💰 ¥{dest.avg_cost}</span>
                  </div>
                  <Link href={`/guide?destination=${dest.name}`} className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
                    查看攻略 →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI功能区 */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">🤖 AI旅行助手</h2>
          <p className="text-gray-500">大模型驱动，让旅行规划更智能</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {aiFeatures.map((item, i) => (
            <Link
              key={i}
              href={item.link}
              className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
              <div className="mt-4 text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                立即体验 →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 旅行灵感区 */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">✨ 旅行灵感</h2>
              <p className="text-gray-500 text-sm mt-1">来自旅行者的精彩分享</p>
            </div>
            <Link href="/guide" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              更多攻略 →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '三亚5天4晚亲子游全攻略', author: '旅行达人小王', likes: 2341, emoji: '🏖️', color: 'from-cyan-400 to-blue-500' },
              { title: '云南自驾游：丽江-香格里拉-梅里雪山', author: '自驾玩家', likes: 1892, emoji: '🏔️', color: 'from-emerald-400 to-teal-600' },
              { title: '成都3天美食地图：从早吃到晚', author: '吃货小分队', likes: 3215, emoji: '🍜', color: 'from-orange-400 to-red-500' },
            ].map((post, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className={`h-40 bg-gradient-to-br ${post.color} flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500`}>
                  {post.emoji}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1">❤️ {post.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 数据统计 */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500万+', label: '服务用户', icon: '👥' },
              { value: '10万+', label: '精选攻略', icon: '📖' },
              { value: '98%', label: '好评率', icon: '⭐' },
              { value: '24/7', label: 'AI在线', icon: '🤖' },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <AIChatBot />
    </div>
  );
}
