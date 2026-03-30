'use client';

import { useState } from 'react';
import { Search, MapPin, Star, Clock, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = ['全部', '自然风光', '历史文化', '美食之旅', '亲子游', '海岛度假', '城市漫游'];

const guides = [
  { id: 1, title: '三亚5日深度游攻略', destination: '海南三亚', category: '海岛度假', cover: '🏖️', author: '旅行达人小王', likes: 2341, views: 15234, readTime: '15分钟', summary: '从亚龙湾到蜈支洲岛，带你玩转三亚最美海湾...' },
  { id: 2, title: '成都3日美食地图', destination: '四川成都', category: '美食之旅', cover: '🍜', author: '吃货小分队', likes: 1892, views: 12341, readTime: '10分钟', summary: '从火锅到串串，从担担面到甜水面，成都必吃清单...' },
  { id: 3, title: '丽江古城慢生活指南', destination: '云南丽江', category: '历史文化', cover: '🏔️', author: '文艺青年阿明', likes: 1567, views: 9876, readTime: '12分钟', summary: '在古城的石板路上漫步，在酒吧街听一首民谣...' },
  { id: 4, title: '桂林山水甲天下', destination: '广西桂林', category: '自然风光', cover: '⛰️', author: '摄影大师老李', likes: 2100, views: 13456, readTime: '8分钟', summary: '漓江竹筏、阳朔骑行、龙脊梯田...' },
  { id: 5, title: '上海迪士尼全攻略', destination: '上海', category: '亲子游', cover: '🏰', author: '宝妈日记', likes: 3200, views: 25678, readTime: '20分钟', summary: '带娃必看！从FP到隐藏玩法，一篇搞定迪士尼...' },
  { id: 6, title: '西安历史穿越之旅', destination: '陕西西安', category: '历史文化', cover: '🏛️', author: '历史控小张', likes: 1789, views: 11234, readTime: '14分钟', summary: '兵马俑、华清池、大雁塔、回民街...' },
];

export default function GuidePage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = guides.filter((g) => {
    const matchCategory = activeCategory === '全部' || g.category === activeCategory;
    const matchSearch = !searchQuery || g.title.includes(searchQuery) || g.destination.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">旅游攻略</h1>
        <p className="text-gray-500">精选旅行攻略，为你的旅程提供灵感和参考</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索目的地或攻略..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide, index) => (
          <motion.article
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-6xl">
              {guide.cover}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                  {guide.category}
                </span>
                <span className="text-xs text-gray-400">{guide.readTime}阅读</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {guide.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{guide.summary}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                  <span className="text-xs text-gray-500">{guide.author}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>❤️ {guide.likes}</span>
                  <span>👁 {guide.views}</span>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
