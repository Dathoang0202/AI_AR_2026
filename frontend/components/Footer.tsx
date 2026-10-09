'use client';

import Link from 'next/link';
import { ArrowUp, ArrowUpRight, BookOpen } from 'lucide-react';
import { publicUrl } from '@/lib/public-url';
import './footer.css';

const navigation = [
  { title: 'Khám phá', links: [
    { href: '/cultural', label: 'Bảo tàng Việt phục' },
    { href: '/rentals', label: 'Địa điểm thuê' },
    { href: '/assistant', label: 'Trợ lý Việt phục' },
  ] },
  { title: 'Sáng tạo', links: [
    { href: '/onboarding', label: 'Tạo bộ phối mới' },
    { href: '/studio', label: 'Studio phối đồ' },
    { href: '/lookbook', label: 'Lookbook của bạn' },
  ] },
];

export function Footer() {
  function backToTop() {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  return <footer className="site-footer">
    <div className="site-footer-inner">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link href="/" className="site-footer-logo" aria-label="vlaura — Trang chủ"><span className="site-footer-logo-art" style={{ backgroundImage: `url(${publicUrl('/images/vlaura-footer-logo.png')})` }} aria-hidden="true" /><span className="sr-only">vlaura</span></Link>
          <p className="site-footer-description">Khám phá câu chuyện y phục, thử những cách phối mới và giữ lại cảm hứng của bạn.</p>
        </div>

        {navigation.map(group => <nav key={group.title} className="site-footer-nav" aria-label={`${group.title} ở chân trang`}><h2>{group.title}</h2><ul>{group.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}<ArrowUpRight size={13} aria-hidden="true" /></Link></li>)}</ul></nav>)}

        <div className="site-footer-sources"><BookOpen size={23} strokeWidth={1.4} aria-hidden="true" /><h2>Hiểu để thêm yêu</h2><p>Câu chuyện, hình ảnh và nguồn tham khảo được đặt trong hồ sơ của từng y phục.</p><Link href="/cultural">Tìm hiểu từ bộ sưu tập<ArrowUpRight size={15} aria-hidden="true" /></Link></div>
      </div>

      <div className="site-footer-bottom"><p>© {new Date().getFullYear()} vlaura</p><span>Khí chất thiên thu.</span><button type="button" onClick={backToTop}>Lên đầu trang<ArrowUp size={15} aria-hidden="true" /></button></div>
    </div>
  </footer>;
}
