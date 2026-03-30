import './globals.css';

export const metadata = {
  title: 'TravelAI - 智能旅游助手',
  description: 'AI驱动的智能旅游平台，个性化行程规划、智能推荐、一站式预订',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
