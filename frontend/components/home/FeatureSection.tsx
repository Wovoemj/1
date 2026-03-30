'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI智能规划',
    description: '基于大语言模型，输入你的旅行想法即可获得个性化行程方案',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    title: '智能推荐',
    description: '深度学习算法分析你的偏好，推荐最适合的景点、酒店和体验',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Globe,
    title: '实时信息',
    description: '整合航班、天气、汇率等实时数据，让决策更精准',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Shield,
    title: '安心保障',
    description: '平台担保交易，7x24小时客服支持，退改无忧',
    color: 'from-green-500 to-emerald-500',
  },
];

export function FeatureSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">为什么选择智旅？</h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          结合AI技术与专业旅游知识，打造全新的智能旅行体验
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
