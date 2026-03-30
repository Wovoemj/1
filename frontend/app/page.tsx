'use client';

import { useState } from 'react';
import { Search, MapPin, Sparkles, Calendar, Plane, Hotel, Ticket, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DestinationCard } from '@/components/home/DestinationCard';
import { RecommendationGrid } from '@/components/home/RecommendationGrid';
import { FeatureSection } from '@/components/home/FeatureSection';

const destinations = [
  { name: '三亚', image: '/images/sanya.jpg', tag: '海滨度假', rating: 4.8 },
  { name: '丽江', image: '/images/lijiang.jpg', tag: '古城文化', rating: 4.7 },
  { name: '成都', image: '/images/chengdu.jpg', tag: '美食之旅', rating: 4.9 },
  { name: '桂林', image: '/images/guilin.jpg', tag: '山水风光', rating: 4.6 },
  { name: '西安', image: '/images/xian.jpg', tag: '历史古迹', rating: 4.8 },
  { name: '厦门', image: '/images/xiamen.jpg', tag: '文艺小资', rating: 4.5 },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'smart' | 'manual'>('smart');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/planner?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-white text-center mb-4"
          >
            AI 智能旅游规划
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 text-center mb-10 max-w-2xl"
          >
            告诉我们你的旅行想法，AI为你定制专属行程
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-2xl"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-2">
              {/* Tab Switch */}
              <div className="flex mb-2 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('smart')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'smart'
                      ? 'bg-white shadow text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  AI智能规划
                </button>
                <button
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'manual'
                      ? 'bg-white shadow text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  搜索目的地
                </button>
              </div>

              {/* Search Input */}
              <div className="flex items-center gap-2">
                {activeTab === 'smart' ? (
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="例如：3天三亚亲子游，预算5000，喜欢海滩和美食"
                      className="w-full py-3 text-gray-800 placeholder-gray-400 focus:outline-none text-base"
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="搜索目的地、景点、酒店..."
                      className="w-full py-3 text-gray-800 placeholder-gray-400 focus:outline-none text-base"
                    />
                  </div>
                )}
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  {activeTab === 'smart' ? '开始规划' : '搜索'}
                </button>
              </div>
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {['三亚3日游', '成都美食攻略', '丽江自由行', '亲子度假推荐'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    router.push(`/planner?query=${encodeURIComponent(tag)}`);
                  }}
                  className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full backdrop-blur-sm transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Service Icons */}
      <section className="relative z-20 -mt-8 max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-4 gap-4">
          {[
            { icon: Plane, label: '机票预订', color: 'text-blue-500', bg: 'bg-blue-50', href: '/booking/flights' },
            { icon: Hotel, label: '酒店预订', color: 'text-green-500', bg: 'bg-green-50', href: '/booking/hotels' },
            { icon: Ticket, label: '景点门票', color: 'text-orange-500', bg: 'bg-orange-50', href: '/booking/tickets' },
            { icon: Calendar, label: '行程规划', color: 'text-purple-500', bg: 'bg-purple-50', href: '/planner' },
          ].map(({ icon: Icon, label, color, bg, href }) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className={`${bg} ${color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm text-gray-700 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">热门目的地</h2>
            <p className="text-gray-500 mt-1">探索最受欢迎的旅行目的地</p>
          </div>
          <button
            onClick={() => router.push('/guide')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            查看全部 →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((dest, index) => (
            <DestinationCard key={dest.name} destination={dest} index={index} />
          ))}
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <h2 className="text-3xl font-bold text-gray-900">为你推荐</h2>
          </div>
          <RecommendationGrid />
        </div>
      </section>

      {/* Feature Highlights */}
      <FeatureSection />
    </div>
  );
}
