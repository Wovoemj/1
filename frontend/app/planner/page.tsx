'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles, MapPin, Calendar, DollarSign, Clock, ChevronDown,
  Utensils, Camera, Bed, Car, Star, GripVertical, Plus, Trash2,
  Loader2
} from 'lucide-react';
import { usePlannerStore } from '@/lib/store';
import { api } from '@/lib/api';
import type { Itinerary, ItineraryDay, Activity } from '@/types';

// Mock generated itinerary
const mockItinerary: Itinerary = {
  id: 1,
  userId: 1,
  title: '三亚3日亲子游',
  startDate: '2024-04-01',
  endDate: '2024-04-03',
  budget: 5000,
  tags: ['亲子', '海岛', '度假'],
  isPublic: false,
  createdAt: new Date().toISOString(),
  days: [
    {
      day: 1,
      date: '2024-04-01',
      activities: [
        { id: 'a1', time: '09:00', title: '抵达三亚凤凰机场', description: '乘坐MU1234航班抵达', location: { latitude: 18.3029, longitude: 109.4122, address: '三亚凤凰国际机场', city: '三亚', country: '中国' }, duration: 60, cost: 0, type: 'transport', bookingRequired: false },
        { id: 'a2', time: '11:00', title: '入住亚龙湾万豪度假酒店', description: '海景房，含早餐', location: { latitude: 18.2317, longitude: 109.6452, address: '亚龙湾国家旅游度假区', city: '三亚', country: '中国' }, duration: 60, cost: 1288, type: 'hotel', bookingRequired: true },
        { id: 'a3', time: '14:00', title: '亚龙湾沙滩', description: '沙滩漫步、游泳、亲子玩沙', location: { latitude: 18.2280, longitude: 109.6430, address: '亚龙湾', city: '三亚', country: '中国' }, duration: 180, cost: 0, type: 'attraction', bookingRequired: false },
        { id: 'a4', time: '18:30', title: '第一市场海鲜大餐', description: '买海鲜加工，推荐阿浪海鲜加工店', location: { latitude: 18.2520, longitude: 109.5010, address: '第一市场', city: '三亚', country: '中国' }, duration: 90, cost: 300, type: 'restaurant', bookingRequired: false },
      ],
      notes: '第一天以休闲为主，适应气候',
    },
    {
      day: 2,
      date: '2024-04-02',
      activities: [
        { id: 'a5', time: '08:00', title: '蜈支洲岛一日游', description: '含往返船票+岛上项目', location: { latitude: 18.3100, longitude: 109.7600, address: '蜈支洲岛', city: '三亚', country: '中国' }, duration: 480, cost: 680, type: 'activity', bookingRequired: true },
        { id: 'a6', time: '17:00', title: '三亚湾看日落', description: '椰梦长廊漫步', location: { latitude: 18.2530, longitude: 109.4700, address: '三亚湾', city: '三亚', country: '中国' }, duration: 60, cost: 0, type: 'attraction', bookingRequired: false },
      ],
    },
    {
      day: 3,
      date: '2024-04-03',
      activities: [
        { id: 'a7', time: '09:00', title: '南山文化旅游区', description: '108米海上观音，素斋午餐', location: { latitude: 18.3000, longitude: 109.2000, address: '南山文化旅游区', city: '三亚', country: '中国' }, duration: 240, cost: 150, type: 'attraction', bookingRequired: true },
        { id: 'a9', time: '15:00', title: '天涯海角', description: '经典打卡地标', location: { latitude: 18.3000, longitude: 109.3500, address: '天涯海角游览区', city: '三亚', country: '中国' }, duration: 120, cost: 68, type: 'attraction', bookingRequired: true },
        { id: 'a10', time: '18:00', title: '前往机场返程', description: '', location: { latitude: 18.3029, longitude: 109.4122, address: '三亚凤凰国际机场', city: '三亚', country: '中国' }, duration: 60, cost: 0, type: 'transport', bookingRequired: false },
      ],
      notes: '最后一天安排轻松，留足返程时间',
    },
  ],
};

const activityIcons: Record<string, any> = {
  attraction: Camera,
  restaurant: Utensils,
  transport: Car,
  hotel: Bed,
  activity: Star,
};

export default function PlannerPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [step, setStep] = useState<'input' | 'generating' | 'result'>('input');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(5000);
  const [travelStyle, setTravelStyle] = useState('休闲度假');
  const [customRequirements, setCustomRequirements] = useState(initialQuery);
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);

  const handleGenerate = async () => {
    setStep('generating');

    // Simulate AI generation delay
    setTimeout(() => {
      setGeneratedItinerary(mockItinerary);
      setStep('result');
    }, 3000);
  };

  if (step === 'generating') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">AI正在为您规划行程...</h2>
          <div className="space-y-3 text-gray-500 text-sm">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              🔍 正在搜索{destination || '目的地'}热门景点...
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              🧠 正在生成个性化行程方案...
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
              💰 正在计算预算估算...
            </motion.p>
          </div>
          <div className="w-64 mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'result' && generatedItinerary) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{generatedItinerary.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {generatedItinerary.startDate} ~ {generatedItinerary.endDate}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> 预算 ¥{generatedItinerary.budget}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('input')} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              重新规划
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
              保存行程
            </button>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">💰 预算估算</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '交通', value: 1560, icon: '✈️' },
              { label: '住宿', value: 2576, icon: '🏨' },
              { label: '餐饮', value: 900, icon: '🍜' },
              { label: '门票/活动', value: 898, icon: '🎫' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
                <div className="text-lg font-bold text-gray-900">¥{item.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <span className="text-gray-500">总计：</span>
            <span className="text-2xl font-bold text-blue-600">¥5,934</span>
            <span className="text-gray-400 text-sm ml-2">/人</span>
          </div>
        </div>

        {/* Daily Itinerary */}
        <div className="space-y-8">
          {generatedItinerary.days.map((day) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: day.day * 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h3 className="text-white font-semibold text-lg">Day {day.day} — {day.date}</h3>
                {day.notes && <p className="text-white/80 text-sm mt-1">{day.notes}</p>}
              </div>
              <div className="p-6 space-y-4">
                {day.activities.map((activity, idx) => {
                  const Icon = activityIcons[activity.type] || Star;
                  return (
                    <div key={activity.id} className="flex gap-4 group">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-blue-500" />
                        </div>
                        {idx < day.activities.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-100 my-1" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-blue-600">{activity.time}</span>
                          {activity.bookingRequired && (
                            <span className="px-1.5 py-0.5 bg-orange-50 text-orange-600 text-xs rounded font-medium">
                              需预订
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        {activity.description && (
                          <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activity.duration}分钟</span>
                          {activity.cost > 0 && (
                            <span className="flex items-center gap-1">💰 ¥{activity.cost}</span>
                          )}
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {activity.location.address}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Input step
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI智能行程规划</h1>
        <p className="text-gray-500">告诉我们你的旅行想法，AI为你量身定制行程</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            目的地
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="你想去哪里？例如：三亚、丽江、成都"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Days & Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              出行天数
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>{d}天</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              预算（元/人）
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              placeholder="5000"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">旅行风格</label>
          <div className="flex flex-wrap gap-2">
            {['休闲度假', '深度文化', '亲子游', '蜜月浪漫', '穷游背包', '美食探店', '摄影打卡'].map((style) => (
              <button
                key={style}
                onClick={() => setTravelStyle(style)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  travelStyle === style
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Sparkles className="w-4 h-4 inline mr-1" />
            特殊需求（可选）
          </label>
          <textarea
            value={customRequirements}
            onChange={(e) => setCustomRequirements(e.target.value)}
            placeholder="例如：带3岁小孩、想住海景房、不吃辣..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!destination}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          生成行程
        </button>
      </div>
    </div>
  );
}
