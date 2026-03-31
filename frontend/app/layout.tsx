import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: {
    default: 'TravelAI - AI驱动的智能旅游平台',
    template: '%s | TravelAI',
  },
  description: 'AI智能行程规划、目的地推荐、一站式预订，让每一次旅行都充满惊喜',
  keywords: ['旅游', '行程规划', 'AI', '智能旅行', '旅游攻略', '预订'],
  authors: [{ name: 'TravelAI Team' }],
  openGraph: {
    title: 'TravelAI - AI驱动的智能旅游平台',
    description: '一句话描述你的旅行愿望，AI为你定制专属行程',
    type: 'website',
    locale: 'zh_CN',
    siteName: 'TravelAI',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
