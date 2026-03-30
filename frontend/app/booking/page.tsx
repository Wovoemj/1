'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Hotel, Ticket, Star, Search, MapPin, Calendar, Users, Filter, ChevronDown, Heart } from 'lucide-react';

type BookingTab = 'flights' | 'hotels' | 'tickets' | 'experiences';

const tabs: { key: BookingTab; label: string; icon: any }[] = [
  { key: 'flights', label: '机票', icon: Plane },
  { key: 'hotels', label: '酒店', icon: Hotel },
  { key: 'tickets', label: '景点门票', icon: Ticket },
  { key: 'experiences', label: '当地体验', icon: Star },
];

const mockFlights = [
  { id: 1, airline: '南方航空', flightNo: 'CZ1234', departure: '08:00', arrival: '11:30', from: '上海浦东', to: '三亚凤凰', price: 780, duration: '3h30m', stops: '直飞' },
  { id: 2, airline: '东方航空', flightNo: 'MU5678', departure: '10:15', arrival: '13:45', from: '上海浦东', to: '三亚凤凰', price: 850, duration: '3h30m', stops: '直飞' },
  { id: 3, airline: '海南航空', flightNo: 'HU9012', departure: '14:30', arrival: '18:00', from: '上海虹桥', to: '三亚凤凰', price: 720, duration: '3h30m', stops: '直飞' },
  { id: 4, airline: '春秋航空', flightNo: '9C3456', departure: '19:00', arrival: '22:30', from: '上海浦东', to: '三亚凤凰', price: 560, duration: '3h30m', stops: '直飞' },
];

const mockHotels = [
  { id: 1, name: '三亚亚龙湾万豪度假酒店', rating: 4.8, reviews: 2341, price: 1288, stars: 5, area: '亚龙湾', amenities: ['泳池', '海景', 'SPA', '早餐'] },
  { id: 2, name: '三亚海棠湾希尔顿酒店', rating: 4.7, reviews: 1892, price: 980, stars: 5, area: '海棠湾', amenities: ['泳池', '海景', '健身房'] },
  { id: 3, name: '三亚湾红树林度假世界', rating: 4.5, reviews: 3210, price: 520, stars: 4, area: '三亚湾', amenities: ['泳池', '水上乐园', '儿童乐园'] },
  { id: 4, name: '大东海亚朵酒店', rating: 4.6, reviews: 1567, price: 380, stars: 4, area: '大东海', amenities: ['早餐', '健身房', '书吧'] },
];

const mockTickets = [
  { id: 1, name: '蜈支洲岛门票+船票', price: 136, originalPrice: 168, rating: 4.8, reviews: 8923, tag: '必玩' },
  { id: 2, name: '南山文化旅游区门票', price: 122, originalPrice: 150, rating: 4.7, reviews: 5678, tag: '文化' },
  { id: 3, name: '天涯海角门票', price: 68, originalPrice: 81, rating: 4.5, reviews: 12345, tag: '经典' },
  { id: 4, name: '亚龙湾热带天堂森林公园', price: 158, originalPrice: 175, rating: 4.6, reviews: 4567, tag: '自然' },
];

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>('flights');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">预订中心</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === key
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      {activeTab === 'flights' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">出发城市</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input type="text" defaultValue="上海" className="bg-transparent w-full focus:outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">到达城市</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input type="text" defaultValue="三亚" className="bg-transparent w-full focus:outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">出发日期</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input type="date" defaultValue="2024-04-01" className="bg-transparent w-full focus:outline-none text-sm" />
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                搜索
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {activeTab === 'flights' && (
        <div className="space-y-4">
          {mockFlights.map((flight, idx) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{flight.departure}</div>
                    <div className="text-sm text-gray-400">{flight.from}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-400">{flight.airline} {flight.flightNo}</div>
                    <div className="w-24 h-px bg-gray-300 my-1 relative">
                      <Plane className="w-3 h-3 text-gray-400 absolute -top-1.5 left-1/2 -translate-x-1/2" />
                    </div>
                    <div className="text-xs text-gray-400">{flight.duration} · {flight.stops}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{flight.arrival}</div>
                    <div className="text-sm text-gray-400">{flight.to}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">¥{flight.price}</div>
                  <div className="text-xs text-gray-400">经济舱</div>
                  <button className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    预订
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockHotels.map((hotel, idx) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-4xl">🏨</div>
              <div className="p-5">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{hotel.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span>⭐ {hotel.rating}</span>
                  <span>({hotel.reviews}条评价)</span>
                  <span>· {hotel.area}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {hotel.amenities.map((a) => (
                    <span key={a} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{a}</span>
                  ))}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">¥{hotel.price}</span>
                    <span className="text-sm text-gray-400">/晚</span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    预订
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockTickets.map((ticket, idx) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full font-medium">{ticket.tag}</span>
                  <h3 className="font-semibold text-gray-900 mt-2 mb-1">{ticket.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>⭐ {ticket.rating}</span>
                    <span>({ticket.reviews}条评价)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 line-through">¥{ticket.originalPrice}</div>
                  <div className="text-2xl font-bold text-blue-600">¥{ticket.price}</div>
                  <button className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    购买
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'experiences' && (
        <div className="text-center py-20 text-gray-400">
          <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>当地体验即将上线...</p>
        </div>
      )}
    </div>
  );
}
