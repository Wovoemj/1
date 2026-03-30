import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">智旅</span>
            </Link>
            <p className="text-sm leading-relaxed">
              AI驱动的智能旅游平台，让每一次旅行都充满惊喜。
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">产品服务</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/planner" className="hover:text-white transition-colors">AI行程规划</Link></li>
              <li><Link href="/booking/flights" className="hover:text-white transition-colors">机票预订</Link></li>
              <li><Link href="/booking/hotels" className="hover:text-white transition-colors">酒店预订</Link></li>
              <li><Link href="/booking/tickets" className="hover:text-white transition-colors">景点门票</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">帮助支持</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white transition-colors">帮助中心</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">关于我们</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">用户协议</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">联系我们</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@zhilv.travel
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                400-888-0000
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs">
          <p>© 2024 智旅科技. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
