'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, MapPin, Settings, LogOut, ChevronRight, Package, Star, Calendar, Award } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const menuItems = [
  { icon: Package, label: '我的订单', desc: '查看所有预订记录', href: '/user/orders' },
  { icon: Heart, label: '我的收藏', desc: '收藏的景点和攻略', href: '/user/favorites' },
  { icon: MapPin, label: '旅行足迹', desc: '查看你的旅行地图', href: '/user/footprints' },
  { icon: Star, label: '我的评价', desc: '查看和管理评价', href: '/user/reviews' },
  { icon: Calendar, label: '我的行程', desc: '已保存的行程方案', href: '/user/itineraries' },
  { icon: Settings, label: '账号设置', desc: '修改个人信息', href: '/user/settings' },
];

const mockOrders = [
  { orderNo: 'TR20240301001', product: '三亚亚龙湾万豪度假酒店', status: '已完成', amount: 1288, date: '2024-03-01' },
  { orderNo: 'TR20240215002', product: '上海-三亚往返机票', status: '已使用', amount: 1560, date: '2024-02-15' },
  { orderNo: 'TR20240210003', product: '蜈支洲岛门票', status: '已退款', amount: 136, date: '2024-02-10' },
];

export default function UserPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');

  const statusColors: Record<string, string> = {
    '已完成': 'bg-green-100 text-green-700',
    '已使用': 'bg-gray-100 text-gray-600',
    '已退款': 'bg-red-100 text-red-700',
    '待支付': 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.nickname || '旅行者'}</h1>
            <p className="text-white/80 mt-1">{user?.phone || '138****8888'}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1">
                <Award className="w-4 h-4" />
                黄金会员
              </span>
              <span className="text-sm text-white/70">积分: 2,680</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { label: '全部订单', value: 12 },
            { label: '待支付', value: 1 },
            { label: '待评价', value: 3 },
            { label: '收藏', value: 28 },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
        {menuItems.map((item, idx) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <item.icon className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">{item.label}</div>
              <div className="text-sm text-gray-400">{item.desc}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
          </button>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">最近订单</h2>
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div key={order.orderNo} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <div className="font-medium text-gray-900">{order.product}</div>
                <div className="text-sm text-gray-400 mt-1">
                  {order.orderNo} · {order.date}
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <div className="text-lg font-bold text-gray-900 mt-1">¥{order.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
