'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Bookmark, MapPin, Palette, RotateCcw, Sparkles } from 'lucide-react';
import { ArtifactImage } from '@/components/museum/ArtifactImage';
import { useMuseumCatalog } from '@/hooks/useMuseumCatalog';
import { garmentKind } from '@/lib/outfit';
import './home.css';

const journeys = [
  { number: '01', icon: BookOpen, title: 'Hiểu một nếp áo', description: 'Ghé bảo tàng, khám phá câu chuyện và nguồn tư liệu của từng y phục.', label: 'Khám phá bảo tàng', href: '/cultural' },
  { number: '02', icon: Palette, title: 'Phối một nét riêng', description: 'Chọn bối cảnh, thử sắc màu và phụ kiện trên ma-nơ-canh trong Studio.', label: 'Vào phòng phối đồ', href: '/studio' },
  { number: '03', icon: MapPin, title: 'Tìm nơi trải nghiệm', description: 'Xem địa điểm, danh mục trang phục và giá thuê theo ngày ở từng khu vực.', label: 'Tìm địa điểm thuê', href: '/rentals' },
];

export default function HomePage() {
  const catalog = useMuseumCatalog();
  const featured = ['nhat-binh', 'ngu-than', 'tu-than', 'ba-ba'].map(kind => catalog.items.find(item => item.category === 'GARMENT' && garmentKind(item.name) === kind)).filter((item): item is NonNullable<typeof item> => !!item);
  const garments = catalog.items.filter(item => item.category === 'GARMENT').length;

  return <div className="home-page">
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <p className="home-eyebrow"><span />DI SẢN TRONG ĐỜI SỐNG HÔM NAY</p>
        <h1 id="home-title">Khí chất<br /><em>thiên thu.</em></h1>
        <p className="home-intro">Từ câu chuyện của những nếp áo đến bộ phối mang dấu ấn của bạn. Cùng khám phá, thử mặc và tìm cảm hứng từ Việt phục.</p>
        <div className="home-actions">
          <Link href="/onboarding" className="home-button home-button-primary">Tạo bộ phối của bạn <ArrowRight size={17} /></Link>
          <Link href="/cultural" className="home-text-link">Ghé thăm bảo tàng <ArrowUpRight size={16} /></Link>
        </div>
        <div className="home-hero-note"><span className="home-note-icon"><Sparkles size={19} strokeWidth={1.5} /></span><p>Một dịp đặc biệt, một cách mặc riêng.<br /><span>Bắt đầu bằng bối cảnh bạn muốn trải nghiệm.</span></p></div>
      </div>
      <Link href="/cultural" className="home-hero-art" aria-label="Khám phá câu chuyện y phục trong bảo tàng">
        <div className="home-hero-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/museum/nhat-binh-detail.jpg`} alt="Y phục thêu sắc vàng trong không gian trưng bày" fetchPriority="high" />
          <span className="home-art-label">VIỆT PHỤC / MỘT GÓC DI SẢN</span>
        </div>
        <div className="home-art-caption"><div><p>CHUYỆN KỂ QUA Y PHỤC</p><h2>Vẻ đẹp từ những điều được gìn giữ</h2></div><span><ArrowUpRight size={24} strokeWidth={1.5} /></span></div>
      </Link>
    </section>

    <section className="home-journeys" aria-label="Hành trình trải nghiệm Việt phục">
      {journeys.map(({ number, icon: Icon, title, description, label, href }) => <Link href={href} key={number} className="home-journey">
        <div className="home-journey-top"><span>{number} /</span><Icon size={22} strokeWidth={1.4} /></div>
        <h2>{title}</h2><p>{description}</p><span className="home-journey-link">{label}<ArrowUpRight size={16} /></span>
      </Link>)}
    </section>

    <section className="home-collection" aria-labelledby="home-collection-title">
      <div className="home-section-heading"><div><p className="home-eyebrow">TỪ BỘ SƯU TẬP BẢO TÀNG</p><h2 id="home-collection-title">Mỗi nếp áo, một vẻ đẹp</h2><p>Gặp gỡ những dáng áo để bắt đầu hành trình của riêng bạn.</p></div><Link href="/cultural" className="home-text-link">Xem bộ sưu tập <ArrowRight size={16} /></Link></div>
      {catalog.loading ? <div className="home-collection-grid" role="status" aria-label="Đang tải bộ sưu tập">{[0, 1, 2, 3].map(value => <div className="home-collection-skeleton" key={value} />)}</div>
        : catalog.error ? <div className="home-state" role="alert"><p>Chưa tải được bộ sưu tập. Bạn thử lại nhé.</p><button onClick={catalog.retry}><RotateCcw size={15} />Tải lại bộ sưu tập</button></div>
        : featured.length ? <div className="home-collection-grid">{featured.map(item => <Link key={item.id} href={`/cultural/detail?id=${item.id}`} className="home-artifact" data-home-artifact={item.id}>
          <div className="home-artifact-image"><ArtifactImage name={item.name} src={item.imageUrl} /><span><ArrowUpRight size={19} /></span></div>
          <p className="home-artifact-period">{item.historicalPeriod}</p><h3>{item.name}</h3><p className="home-artifact-region">{item.region}</p>
        </Link>)}</div> : <div className="home-state"><BookOpen size={26} /><p>Bộ sưu tập đang được cập nhật. Bạn vẫn có thể khám phá các trải nghiệm bên dưới.</p></div>}
      {!catalog.loading && !catalog.error && garments > 0 && <div className="home-collection-foot"><span>{String(garments).padStart(2, '0')} y phục trong bảo tàng</span><span>Câu chuyện · Nguồn tư liệu · Mặc thử trong Studio</span></div>}
    </section>

    <section className="home-studio-invite" aria-labelledby="home-studio-title">
      <div className="home-invite-visual" aria-hidden="true"><span>ĐỎ SON</span><div className="home-color-swatches"><i style={{ background: '#8D3025' }} /><i style={{ background: '#D4AF37' }} /><i style={{ background: '#1E4D2B' }} /><i style={{ background: '#FDFBF7' }} /></div><span>VÀ NHỮNG SẮC MÀU CỦA BẠN</span></div>
      <div className="home-invite-copy"><p className="home-eyebrow">PHÒNG PHỐI ĐỒ CỦA BẠN</p><h2 id="home-studio-title">Thử một sắc màu.<br />Giữ lại một cảm hứng.</h2><p>Phối y phục cùng phụ kiện, tham khảo ghi chú văn hóa và lưu những bộ bạn yêu thích vào Lookbook.</p><div className="home-actions"><Link href="/studio" className="home-button home-button-primary">Mở Studio <ArrowRight size={17} /></Link><Link href="/lookbook" className="home-text-link"><Bookmark size={16} />Lookbook của tôi</Link></div></div>
    </section>

    <Link href="/rentals" className="home-rental-link"><span className="home-rental-icon"><MapPin size={26} strokeWidth={1.4} /></span><div><p>TỪ CẢM HỨNG ĐẾN TRẢI NGHIỆM</p><h2>Tìm một địa điểm thuê Việt phục</h2></div><span className="home-rental-action">Khám phá địa điểm <ArrowUpRight size={22} /></span></Link>
  </div>;
}
