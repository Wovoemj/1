import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AIChatBot } from '@/components/ai/AIChatBot';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: '智旅 - AI智能旅游助手',
  description: 'AI驱动的智能旅游规划平台，为您提供个性化行程规划、景点推荐、酒店机票预订一站式服务',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <Header />
        <main className="min-h-[calc(100vh-160px)]">{children}</main>
        <Footer />
        <AIChatBot />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
