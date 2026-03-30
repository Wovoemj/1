'use client';

import React, { useState } from 'react';

export default function UserPage() {
  const [activeTab, setActiveTab] = useState('orders');

  const user = {
    name: '旅行达人',
    avatar: '',
    level: '金卡会员',
    points: 2580,
    orders: 12,
    favorites: 45,
  };

  const orders = [
    { id: 'ORD202401001', product: '三亚亚龙湾万豪度假酒店', date: '2024-01-15', amount: 3840, status: '已完成' },
    { id: 'ORD202401002', product: '上海-三亚往返机票', date: '2024-01-20', amount: 2100, status: '已支付' },
    { id: 'ORD202401003', product: '蜈支洲岛门票+潜水套餐', date: '2024-01-22', amount: 580, status: '待支付' },
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
            <a href="/booking" className="text-gray-600 hover:text-blue-500">预订</a>
          </div>
        </div>
      </nav>

      {/* 用户信息 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 py-10">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl">👤</div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="opacity-90">{user.level} · {user.points} 积分</p>
          </div>
        </div>
      </div>

      {/* 统计 */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{user.orders}</div>
            <div className="text-sm text-gray-500">全部订单</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-500">2</div>
            <div className="text-sm text-gray-500">待支付</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">1</div>
            <div className="text-sm text-gray-500">待出行</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-500">{user.favorites}</div>
            <div className="text-sm text-gray-500">收藏</div>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tab */}
        <div className="flex gap-4 mb-6 border-b">
          {[
            { key: 'orders', label: '我的订单' },
            { key: 'itineraries', label: '我的行程' },
            { key: 'favorites', label: '我的收藏' },
            { key: 'settings', label: '账号设置' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-2 transition ${
                activeTab === tab.key ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-400">{order.id}</div>
                    <div className="font-bold mt-1">{order.product}</div>
                    <div className="text-sm text-gray-500 mt-1">📅 {order.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm px-3 py-1 rounded-full ${
                      order.status === '已完成' ? 'bg-green-100 text-green-600' :
                      order.status === '已支付' ? 'bg-blue-100 text-blue-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {order.status}
                    </div>
                    <div className="font-bold text-lg mt-2">¥{order.amount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'itineraries' && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-4">🗺️</div>
            <p>还没有行程记录</p>
            <a href="/planner" className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
              去创建行程 →
            </a>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-4">❤️</div>
            <p>还没有收藏内容</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-lg">账号设置</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b">
                <span>昵称</span>
                <span className="text-gray-500">{user.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span>手机号</span>
                <span className="text-gray-500">138****8888</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span>邮箱</span>
                <span className="text-gray-500">未绑定</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span>旅行偏好</span>
                <span className="text-gray-500">海边、美食</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
