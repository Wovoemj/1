'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, Heart } from 'lucide-react';
import { useState } from 'react';

const mockRecommendations = [
  { id: 1, name: '三亚亚龙湾万豪度假酒店', type: 'hotel', price: 1288, rating: 4.8, reviews: 2341, image: '/images/hotel1.jpg', tags: ['亲子', '海景'] },
  { id: 2, name: '丽江古城深度体验3日游', type: 'experience', price: 899, rating: 4.9, reviews: 1567, image: '/images/lijiang-tour.jpg', tags: ['文化', '深度'] },
  { id: 3, name: '成都大熊猫繁育基地门票', type: 'ticket', price: 55, rating: 4.7, reviews: 8923, image: '/images/panda.jpg', tags: ['亲子', '必玩'] },
  { id: 4, name: '上海-三亚往返机票', type: 'flight', price: 1560, rating: 4.5, reviews: 890, image: '/images/flight.jpg', tags: ['直飞', '特价'] },
  { id: 5, name: '桂林漓江竹筏漂流', type: 'experience', price: 218, rating: 4.8, reviews: 4521, image: '/images/lijing.jpg', tags: ['自然', '必玩'] },
  { id: 6, name: '西安兵马俑+华清宫一日游', type: 'experience', price: 358, rating: 4.6, reviews: 3210, image: '/images/bingmayong.jpg', tags: ['历史', '跟团'] },
];

export function RecommendationGrid() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const typeLabels: Record<string, string> = {
    hotel: '酒店',
    experience: '体验',
    ticket: '门票',
    flight: '机票',
  };

  const typeColors: Record<string, string> = {
    hotel: 'bg-green-100 text-green-700',
    experience: 'bg-purple-100 text-purple-700',
    ticket: 'bg-orange-100 text-orange-700',
    flight: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockRecommendations.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[item.type]}`}>
                {typeLabels[item.type]}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${favorites.has(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
              />
            </button>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{item.rating}</span>
              <span className="text-sm text-gray-400">({item.reviews}条评价)</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {item.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-blue-600">¥{item.price}</span>
              <span className="text-sm text-gray-400">起</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
