'use client';

import React from 'react';
import Link from 'next/link';
import { Shirt, Sparkles, BookOpen, MapPin, Bookmark, MessageSquare, ShieldCheck, ArrowRight, Palette } from 'lucide-react';

export default function HomePage() {
  const outfitCategories = [
    {
      name: 'Áo Nhật Bình',
      period: 'Triều Nguyễn (1802 - 1945)',
      desc: 'Trang trọng lễ phục cao quý của Hoàng hậu, Công chúa và Mệnh phụ triều Nguyễn với hoa văn thêu phượng cổ kính.',
      badge: 'Lễ Phục Hoàng Gia',
      color: 'from-amber-700 to-red-900',
    },
    {
      name: 'Áo Giao Lĩnh',
      period: 'Lý - Trần - Lê',
      desc: 'Chiếc áo cổ giao nhau kinh điển của nền y phục cổ Việt Nam, thể hiện vẻ đẹp mộc mạc mà đài các cổ xưa.',
      badge: 'Cổ Y Triều Đại',
      color: 'from-red-800 to-stone-900',
    },
    {
      name: 'Áo Tấc / Ngũ Thân',
      period: 'Thế kỷ XVIII - XX',
      desc: 'Áo ngũ thân tay thụt rộng rãi, đại diện cho phong thái nho nhã, tôn kính và khiêm nhường của sĩ phu Việt.',
      badge: 'Nho Nhã Truyền Thống',
      color: 'from-blue-900 to-amber-800',
    },
    {
      name: 'Áo Dài Truyền Thống',
      period: 'Hiện Đại & Tân Thời',
      desc: 'Biểu tượng quốc phục Việt Nam tôn vinh vóc dáng thanh thoát, duyên dáng trong mọi dịp lễ hội và sự kiện trọng đại.',
      badge: 'Quốc Phục Biểu Tượng',
      color: 'from-amber-600 to-red-800',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-white p-8 md:p-16 border border-amber-500/30 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-60"></div>
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Nền Tảng Việt Phục Thông Minh</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-amber-100 leading-tight">
            Tôn Vinh Di Sản <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
              Y Phục Truyền Thống Việt
            </span>
          </h1>

          <p className="text-stone-300 text-base md:text-lg leading-relaxed">
            Khám phá chiều sâu lịch sử, nhận gợi ý phối đồ cá nhân hóa theo từng sự kiện, tự tay sáng tạo trong Studio phối đồ và kiểm chứng chuẩn mực nghi lễ văn hóa.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/onboarding"
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all flex items-center space-x-2"
            >
              <Shirt className="w-5 h-5" />
              <span>Bắt đầu Phối đồ Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/studio"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all flex items-center space-x-2"
            >
              <Palette className="w-5 h-5 text-amber-300" />
              <span>Khám phá Studio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-red-950">Trải Nghiệm Toàn Diện VIỆT PHỤC STUDIO</h2>
          <p className="text-sm text-stone-600">Quy trình khép kín giúp bạn dễ dàng làm quen, trải nghiệm và sở hữu bộ trang phục truyền thống ưng ý.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Gợi Ý Phối Đồ AI</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Nhập vùng miền, dịp tham dự (Tết, lễ cưới, chụp ảnh) để hệ thống sinh ra cấu hình bộ trang phục chuẩn nghi thức.
            </p>
            <Link href="/onboarding" className="inline-flex items-center text-xs font-bold text-red-800 hover:text-red-900 space-x-1">
              <span>Bắt đầu Onboarding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Kiểm Trả Chuẩn Mực Văn Hóa</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Tự động đối soát màu sắc, hoa văn và phụ kiện với nguồn tư liệu lịch sử chính thống để tránh các sai lệch nghi lễ.
            </p>
            <Link href="/studio" className="inline-flex items-center text-xs font-bold text-red-800 hover:text-red-900 space-x-1">
              <span>Thử nghiệm Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Lookbook Cá Nhân</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Lưu trữ danh sách các phối đồ ưa thích, theo dõi lịch sử chỉnh sửa và chia sẻ phối đồ tinh tế của riêng bạn.
            </p>
            <Link href="/lookbook" className="inline-flex items-center text-xs font-bold text-red-800 hover:text-red-900 space-x-1">
              <span>Xem Lookbook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Outfit Showcase */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-serif font-bold text-red-950">Bảng Tàng Việt Phục Đương Đại</h2>
            <p className="text-xs text-stone-600 mt-1">Các kiểu dáng trang phục truyền thống nổi bật được tích hợp trong Studio</p>
          </div>
          <Link href="/cultural" className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1">
            <span>Tra cứu từ điển</span>
            <BookOpen className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {outfitCategories.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div className={`h-32 bg-gradient-to-br ${item.color} p-4 flex flex-col justify-between text-white relative`}>
                <span className="self-start text-[10px] font-bold px-2 py-0.5 bg-black/40 rounded-full border border-white/20">
                  {item.badge}
                </span>
                <div>
                  <h3 className="font-serif font-bold text-lg text-amber-200">{item.name}</h3>
                  <p className="text-[11px] text-stone-300">{item.period}</p>
                </div>
              </div>
              <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                <Link
                  href={`/studio?garment=${encodeURIComponent(item.name)}`}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg transition-colors text-center block"
                >
                  Phối đồ với {item.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
