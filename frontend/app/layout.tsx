import React from 'react';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';

export const metadata = {
  title: 'Việt Phục Studio — Khám Phá & Phối Đồ Trang Phục Truyền Thống Việt Nam',
  description: 'Nền tảng ứng dụng web thông minh giúp tìm hiểu, gợi ý, phối đồ Việt Phục và kiểm tra chuẩn mực văn hóa di sản.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-amber-50/30">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
