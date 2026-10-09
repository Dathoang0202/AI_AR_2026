import React from 'react';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { PageFrame } from '@/components/PageFrame';
import { AuthModal } from '@/components/AuthModal';

export const metadata = {
  title: 'vlaura — khí chất thiên thu',
  description: 'vlaura — khí chất thiên thu. Khám phá Việt phục, phối đồ và tìm hiểu di sản y phục Việt Nam.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-amber-50/30 font-sans antialiased text-stone-900">
        <AuthProvider>
          <Navbar />
          <PageFrame>{children}</PageFrame>
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
