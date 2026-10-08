import React from 'react';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { PageFrame } from '@/components/PageFrame';
import { AuthModal } from '@/components/AuthModal';
import { Be_Vietnam_Pro, Playfair_Display } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});

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
    <html lang="vi" className={`${beVietnamPro.variable} ${playfairDisplay.variable}`}>
      <body className={`${beVietnamPro.className} min-h-screen flex flex-col bg-amber-50/30 font-sans antialiased text-stone-900`}>
        <AuthProvider>
          <Navbar />
          <PageFrame>{children}</PageFrame>
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
