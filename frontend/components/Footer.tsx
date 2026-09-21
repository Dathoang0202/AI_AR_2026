import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-amber-900/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-serif font-bold text-base flex items-center justify-center">
                VP
              </div>
              <span className="font-serif font-bold text-lg text-amber-400">VIỆT PHỤC STUDIO</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Nền tảng ứng dụng công nghệ khám phá, phối đồ truyền thống Việt Nam và kiểm chứng chuẩn mực văn hóa di sản.
            </p>
          </div>

          <div>
            <h3 className="font-serif font-bold text-amber-400 text-sm tracking-wider uppercase mb-4">Tính năng</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/onboarding" className="hover:text-amber-300 transition-colors">Tạo gợi ý trang phục</Link></li>
              <li><Link href="/studio" className="hover:text-amber-300 transition-colors">Phối đồ Studio</Link></li>
              <li><Link href="/cultural" className="hover:text-amber-300 transition-colors">Từ điển Văn hóa</Link></li>
              <li><Link href="/rentals" className="hover:text-amber-300 transition-colors">Tìm điểm thuê</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-amber-400 text-sm tracking-wider uppercase mb-4">Các loại Việt Phục</h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>Áo Dài Truyền Thống & Tân Thời</li>
              <li>Áo Nhật Bình Hoàng Gia Huế</li>
              <li>Áo Giao Lĩnh (Lý - Trần - Lê)</li>
              <li>Áo Tấc & Áo Ngũ Thân Tay Thụt</li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-amber-400 text-sm tracking-wider uppercase mb-4">Nguồn tư liệu</h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Mọi dữ liệu văn hóa được tham chiếu nghiêm ngặt từ các bộ sử liệu và ấn phẩm như: Khâm Định Đại Nam Hội Điển Sự Lệ, Ngàn Năm Áo Mũ.
            </p>
            <span className="inline-block px-2 py-1 bg-amber-950 text-amber-300 text-xs rounded border border-amber-800">
              Chuẩn xác & Tôn vinh Di sản
            </span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>© 2026 Việt Phục Studio. Tất cả các quyền được bảo lưu.</p>
          <p className="mt-2 md:mt-0">Thiết kế chuẩn hóa trải nghiệm đa nền tảng Responsive.</p>
        </div>
      </div>
    </footer>
  );
};
