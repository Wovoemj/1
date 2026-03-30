'use client';

import React, { useState } from 'react';
import { aiClient } from '@/lib/api';

interface DayPlan {
  day: number;
  date: string;
  theme: string;
  activities: Array<{
    time: string;
    activity: string;
    location: string;
    duration: string;
    cost: number;
    tips: string;
    type: string;
  }>;
  daily_budget: number;
}

interface Itinerary {
  title: string;
  destination: string;
  days: number;
  total_budget: number;
  daily_plans: DayPlan[];
  transport_suggestions: string;
  accommodation_suggestions: string;
  packing_list: string[];
  tips: string[];
}

export default function AIPlanner() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    destination: '',
    startDate: '',
    days: 3,
    travelers: 2,
    budget: 5000,
    preferences: [] as string[],
    travelStyle: '休闲度假'
  });
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const preferenceOptions = ['海边', '古镇', '美食', '购物', '文化', '冒险', '亲子', '蜜月', '摄影', '徒步'];
  const styleOptions = ['休闲度假', '深度体验', '冒险探索', '文化历史', '美食之旅'];

  const generateItinerary = async () => {
    setIsGenerating(true);
    try {
      const result = await aiClient.generateItinerary({
        destination: form.destination,
        start_date: form.startDate,
        days: form.days,
        travelers: form.travelers,
        budget: form.budget,
        preferences: form.preferences,
        travel_style: form.travelStyle,
      });
      setItinerary(result);
      setStep(3);
    } catch (error) {
      console.error('生成失败:', error);
      alert('行程生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0: // 选择目的地
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">🌍 你想去哪里？</h2>
            <input
              type="text"
              value={form.destination}
              onChange={e => setForm({ ...form, destination: e.target.value })}
              placeholder="输入目的地，如：三亚、丽江、北京..."
              className="w-full px-6 py-4 text-lg border-2 rounded-xl focus:border-blue-500 outline-none"
            />
            <div className="flex flex-wrap gap-2 justify-center">
              {['三亚', '丽江', '北京', '上海', '成都', '西安', '桂林', '厦门'].map(city => (
                <button
                  key={city}
                  onClick={() => setForm({ ...form, destination: city })}
                  className={`px-4 py-2 rounded-full border transition ${
                    form.destination === city ? 'bg-blue-500 text-white border-blue-500' : 'hover:border-blue-300'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
            <button
              onClick={() => form.destination && setStep(1)}
              disabled={!form.destination}
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-blue-600 transition"
            >
              下一步 →
            </button>
          </div>
        );

      case 1: // 基本信息
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">📅 行程安排</h2>

            <div>
              <label className="block text-sm font-medium mb-2">出发日期</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">旅行天数</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setForm({ ...form, days: Math.max(1, form.days - 1) })} className="w-10 h-10 bg-gray-100 rounded-full text-xl">-</button>
                  <span className="text-2xl font-bold">{form.days}</span>
                  <button onClick={() => setForm({ ...form, days: Math.min(30, form.days + 1) })} className="w-10 h-10 bg-gray-100 rounded-full text-xl">+</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">出行人数</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setForm({ ...form, travelers: Math.max(1, form.travelers - 1) })} className="w-10 h-10 bg-gray-100 rounded-full text-xl">-</button>
                  <span className="text-2xl font-bold">{form.travelers}</span>
                  <button onClick={() => setForm({ ...form, travelers: Math.min(20, form.travelers + 1) })} className="w-10 h-10 bg-gray-100 rounded-full text-xl">+</button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">人均预算（元）</label>
              <input
                type="range"
                min="500"
                max="20000"
                step="500"
                value={form.budget}
                onChange={e => setForm({ ...form, budget: Number(e.target.value) })}
                className="w-full"
              />
              <div className="text-center text-xl font-bold text-blue-600">¥{form.budget}</div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 py-3 border-2 rounded-xl font-bold hover:bg-gray-50 transition">← 上一步</button>
              <button onClick={() => setStep(2)} className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition">下一步 →</button>
            </div>
          </div>
        );

      case 2: // 偏好选择
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">✨ 你的旅行偏好</h2>

            <div>
              <label className="block text-sm font-medium mb-3">旅行标签（多选）</label>
              <div className="flex flex-wrap gap-2">
                {preferenceOptions.map(pref => (
                  <button
                    key={pref}
                    onClick={() => {
                      const prefs = form.preferences.includes(pref)
                        ? form.preferences.filter(p => p !== pref)
                        : [...form.preferences, pref];
                      setForm({ ...form, preferences: prefs });
                    }}
                    className={`px-4 py-2 rounded-full border-2 transition ${
                      form.preferences.includes(pref) ? 'bg-blue-500 text-white border-blue-500' : 'hover:border-blue-300'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">旅行风格</label>
              <div className="grid grid-cols-2 gap-2">
                {styleOptions.map(style => (
                  <button
                    key={style}
                    onClick={() => setForm({ ...form, travelStyle: style })}
                    className={`p-3 rounded-xl border-2 transition ${
                      form.travelStyle === style ? 'bg-blue-500 text-white border-blue-500' : 'hover:border-blue-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border-2 rounded-xl font-bold hover:bg-gray-50 transition">← 上一步</button>
              <button
                onClick={generateItinerary}
                disabled={isGenerating}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
              >
                {isGenerating ? '✨ AI生成中...' : '🚀 生成行程'}
              </button>
            </div>
          </div>
        );

      case 3: // 行程结果
        return itinerary ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">🎉 {itinerary.title}</h2>
              <p className="text-gray-500 mt-1">{itinerary.destination} · {itinerary.days}天 · 预算 ¥{itinerary.total_budget}</p>
            </div>

            {itinerary.daily_plans?.map((day, i) => (
              <div key={i} className="bg-white rounded-2xl border p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Day {day.day} - {day.theme}</h3>
                  <span className="text-sm text-gray-500">{day.date}</span>
                </div>
                <div className="space-y-2">
                  {day.activities?.map((act, j) => (
                    <div key={j} className="flex gap-3 items-start">
                      <span className="text-sm text-blue-500 font-mono w-12 shrink-0">{act.time}</span>
                      <div className="flex-1">
                        <div className="font-medium">{act.activity}</div>
                        <div className="text-sm text-gray-500">{act.location} · {act.duration}</div>
                        {act.tips && <div className="text-xs text-orange-500 mt-1">💡 {act.tips}</div>}
                      </div>
                      <span className="text-sm text-gray-400">¥{act.cost}</span>
                    </div>
                  ))}
                </div>
                <div className="text-right text-sm text-gray-500">日预算: ¥{day.daily_budget}</div>
              </div>
            ))}

            {itinerary.tips?.length > 0 && (
              <div className="bg-yellow-50 rounded-2xl p-5">
                <h4 className="font-bold mb-2">📌 温馨提示</h4>
                <ul className="space-y-1 text-sm">
                  {itinerary.tips.map((tip, i) => <li key={i}>• {tip}</li>)}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setStep(0); setItinerary(null); }} className="flex-1 py-3 border-2 rounded-xl font-bold hover:bg-gray-50">重新规划</button>
              <button className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600">保存行程</button>
            </div>
          </div>
        ) : null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {['目的地', '安排', '偏好', '行程'].map((label, i) => (
            <span key={i} className={`text-sm ${step >= i ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>{label}</span>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      {renderStep()}
    </div>
  );
}
