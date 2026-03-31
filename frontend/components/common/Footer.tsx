import Link from 'next/link';

const productLinks = [
  { href: '/planner', label: 'AI行程规划', icon: '🤖' },
  { href: '/booking', label: '机票预订', icon: '✈️' },
  { href: '/booking', label: '酒店预订', icon: '🏨' },
  { href: '/booking', label: '景点门票', icon: '🎫' },
];

const supportLinks = [
  { href: '/guide', label: '旅游攻略', icon: '📖' },
  { href: '#', label: '帮助中心', icon: '❓' },
  { href: '#', label: '用户协议', icon: '📋' },
  { href: '#', label: '隐私政策', icon: '🔒' },
];

const socialLinks = [
  { icon: '📱', label: '微信公众号' },
  { icon: '💬', label: '在线客服' },
  { icon: '📧', label: '邮箱联系' },
  { icon: '🐦', label: '官方微博' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🌍</span>
              </div>
              <span className="text-xl font-bold text-white">TravelAI</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              AI驱动的智能旅游平台，让每一次旅行都充满惊喜。
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s, i) => (
                <button
                  key={i}
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-colors text-lg"
                  title={s.label}
                  aria-label={s.label}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">产品服务</h3>
            <ul className="space-y-3 text-sm">
              {productLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="flex items-center gap-2 hover:text-white transition-colors group">
                    <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">帮助支持</h3>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="flex items-center gap-2 hover:text-white transition-colors group">
                    <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">联系我们</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span>📧</span> support@travelai.com
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span> 400-888-0000
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span> 工作日 9:00-18:00
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span> 北京市海淀区中关村
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">订阅旅行灵感</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded-lg outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-blue-500"
                />
                <button className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                  订阅
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © 2024 TravelAI. All rights reserved. 京ICP备XXXXXXXX号
            </p>
            <div className="flex gap-6 text-xs text-gray-500">
              <Link href="#" className="hover:text-white transition-colors">用户协议</Link>
              <Link href="#" className="hover:text-white transition-colors">隐私政策</Link>
              <Link href="#" className="hover:text-white transition-colors">网站地图</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
