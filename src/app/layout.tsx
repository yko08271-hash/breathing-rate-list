import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '呼吸数リスト',
  description: '犬の呼吸数記録アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
