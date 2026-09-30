'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, BookOpen, MapPin, Bookmark, MessageSquare, Shirt, User, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  const navLinks = [
    { href: '/', label: 'Trang chủ', icon: Sparkles },
    { href: '/onboarding', label: 'Tạo phối đồ', icon: Shirt },
    { href: '/studio', label: 'Studio Phối đồ', icon: Shirt },
    { href: '/cultural', label: 'Từ điển Việt Phục', icon: BookOpen },
    { href: '/rentals', label: 'Địa điểm Thuê', icon: MapPin },
    { href: '/lookbook', label: 'Lookbook', icon: Bookmark },
    { href: '/assistant', label: 'Trợ lý AI', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="group flex shrink-0 items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-700 via-red-700 to-amber-500 flex items-center justify-center text-white font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              VP
            </div>
            <div className="flex flex-col md:hidden xl:flex">
              <span className="font-serif text-sm font-bold leading-tight text-red-900 sm:text-lg">VIỆT PHỤC STUDIO</span>
              <span className="text-[10px] tracking-widest text-amber-700 uppercase">Tinh Hoa Áo Mũ Việt</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden min-w-0 flex-1 items-center justify-start gap-0.5 overflow-x-auto md:flex xl:justify-center">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-2 text-[11px] font-medium transition-colors xl:px-2 xl:text-xs ${
                    isActive
                      ? 'bg-red-800 text-amber-200 font-semibold'
                      : 'text-stone-700 hover:text-red-900 hover:bg-amber-50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Auth Controls */}
          <div className="flex shrink-0 items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <div title={user.fullName} className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-stone-800 text-sm">
                  <User className="w-4 h-4 text-amber-700" />
                  <span className="hidden max-w-[100px] truncate font-medium 2xl:inline">{user.fullName}</span>
                </div>
                <button
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-2 rounded-full text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="whitespace-nowrap px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 rounded-lg shadow-md hover:shadow-lg transition-all sm:px-4 sm:text-sm"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
