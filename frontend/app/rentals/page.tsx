'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Loader2, MapPin, Navigation, Palette, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { getRentalProviders, RentalProviderResponse } from '@/services/rentalApi';
import { normalizeCulturalText } from '@/lib/cultural';
import { rentalDistance, RentalPosition, startingPrice } from '@/lib/rentals';
import { RentalProviderCard } from '@/components/rentals/RentalProviderCard';
import './rentals.css';

export default function RentalsPage() {
  const [providers, setProviders] = useState<RentalProviderResponse[]>([]);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('ALL');
  const [sort, setSort] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [position, setPosition] = useState<RentalPosition>();
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    setLoading(true); setError('');
    getRentalProviders(undefined, controller.signal).then(result => {
      if (!active) return;
      if (result.success && result.data) setProviders(result.data);
      else setError('Chưa tải được danh sách địa điểm. Bạn thử kết nối lại nhé.');
    }).catch(() => { if (active) setError('Kết nối bị gián đoạn. Bạn thử lại nhé.'); })
      .finally(() => { clearTimeout(timeout); if (active) setLoading(false); });
    return () => { active = false; controller.abort(); clearTimeout(timeout); };
  }, [attempt]);

  const cities = Array.from(new Set(providers.map(provider => provider.city))).sort((a, b) => a.localeCompare(b, 'vi'));
  const terms = normalizeCulturalText(query.trim()).split(/\s+/).filter(Boolean);
  const visible = providers.filter(provider => {
    const text = normalizeCulturalText([provider.name, provider.address, provider.city, ...provider.items.flatMap(item => [item.name, item.category])].join(' '));
    return (city === 'ALL' || provider.city === city) && terms.every(term => text.includes(term));
  }).map(provider => ({ provider, distance: position ? rentalDistance(position, provider) : undefined }))
    .sort((a, b) => {
      if (sort === 'price') return (startingPrice(a.provider) ?? Infinity) - (startingPrice(b.provider) ?? Infinity) || a.provider.id - b.provider.id;
      if (sort === 'name') return a.provider.name.localeCompare(b.provider.name, 'vi');
      if (sort === 'distance') return (a.distance ?? Infinity) - (b.distance ?? Infinity) || a.provider.id - b.provider.id;
      return a.provider.id - b.provider.id;
    });
  const hasFilters = query.trim() !== '' || city !== 'ALL';
  const ready = !loading && !error;

  function resetFilters() { setQuery(''); setCity('ALL'); }

  function locate() {
    setLocationMessage('');
    if (!navigator.geolocation) { setLocationMessage('Trình duyệt chưa hỗ trợ định vị. Bạn có thể chọn khu vực bên dưới.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(result => {
      setPosition({ latitude: result.coords.latitude, longitude: result.coords.longitude });
      setSort('distance'); setLocating(false);
      setLocationMessage('Đã sắp xếp các kết quả theo khoảng cách đường thẳng từ vị trí của bạn.');
    }, () => {
      setLocating(false);
      setLocationMessage('Chưa lấy được vị trí. Bạn có thể cho phép định vị trong trình duyệt hoặc chọn khu vực bên dưới.');
    }, { timeout: 10000, maximumAge: 300000 });
  }

  return <div className="rentals-page">
    <header className="rentals-hero">
      <div><p className="rentals-eyebrow"><span />TỪ BỘ PHỐI ĐẾN TRẢI NGHIỆM</p><h1>Tìm nơi thuê<br /><em>bộ Việt phục của bạn.</em></h1><p className="rentals-intro">Một nơi để xem địa chỉ, so sánh trang phục và tham khảo giá thuê. Chọn khu vực, tìm bộ đồ yêu thích rồi kết nối với cửa hàng.</p></div>
      <dl className="rentals-overview" aria-label="Tổng quan danh sách"><div><dt>Địa điểm</dt><dd>{ready ? String(providers.length).padStart(2, '0') : '—'}</dd></div><div><dt>Khu vực</dt><dd>{ready ? String(cities.length).padStart(2, '0') : '—'}</dd></div><div><dt>Lựa chọn trang phục</dt><dd>{ready ? String(providers.reduce((count, provider) => count + provider.items.length, 0)).padStart(2, '0') : '—'}</dd></div></dl>
    </header>

    <div className="rentals-search-bar">
      <label className="rentals-search"><Search size={19} strokeWidth={1.5} /><span className="sr-only">Tìm cửa hàng, địa chỉ hoặc trang phục</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm cửa hàng, khu vực hoặc tên trang phục…" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Xóa từ khóa"><X size={16} /></button>}</label>
      <button className="rental-button rentals-locate" disabled={locating} onClick={locate}>{locating ? <Loader2 className="animate-spin" size={16} /> : <Navigation size={16} />}{locating ? 'Đang lấy vị trí…' : 'Gần vị trí của tôi'}</button>
    </div>
    {locationMessage && <div className="rentals-location-message" role="status"><p>{locationMessage}</p>{position && <button onClick={() => { setPosition(undefined); setSort('default'); setLocationMessage(''); }}>Bỏ vị trí<X size={13} /></button>}</div>}

    <div className="rentals-layout">
      <aside className="rentals-sidebar" aria-label="Bộ lọc địa điểm">
        <div className="rentals-filter-title"><h2><SlidersHorizontal size={15} />Thu hẹp tìm kiếm</h2>{hasFilters && <button onClick={resetFilters}>Đặt lại</button>}</div>
        <fieldset className="rentals-city-filter"><legend>Khu vực</legend><div className="rentals-city-options">{['ALL', ...cities].map(value => <button key={value} type="button" data-city={value} aria-pressed={city === value} onClick={() => setCity(value)}><span className="rentals-radio" aria-hidden="true">{city === value && <Check size={10} strokeWidth={3} />}</span><span>{value === 'ALL' ? 'Tất cả khu vực' : value}</span><small>{ready ? value === 'ALL' ? providers.length : providers.filter(provider => provider.city === value).length : '—'}</small></button>)}</div></fieldset>
        <div className="rentals-sidebar-note"><p>Cần thêm cảm hứng?</p><Palette size={27} strokeWidth={1.2} /><h3>Thử phối trước<br />khi chọn thuê.</h3><span>Khám phá màu sắc và dáng áo trong phòng phối đồ của bạn.</span><Link href="/studio">Ghé Studio<ArrowUpRight size={15} /></Link></div>
      </aside>

      <section className="rentals-results" aria-labelledby="rentals-results-title">
        <div className="rentals-results-toolbar"><div><p className="rentals-eyebrow">DANH SÁCH ĐỊA ĐIỂM</p><h2 id="rentals-results-title" aria-live="polite">{loading ? 'Đang tải địa điểm…' : error ? 'Chưa tải được danh sách' : `${visible.length} địa điểm`}{ready && hasFilters && <span> / {providers.length} trong danh sách</span>}</h2></div><label className="rentals-sort">Sắp xếp<select aria-label="Sắp xếp địa điểm" value={sort} onChange={event => setSort(event.target.value)}><option value="default">Mặc định</option><option value="price">Giá khởi điểm tăng dần</option><option value="name">Tên cửa hàng A–Z</option><option value="distance" disabled={!position}>Gần vị trí của tôi</option></select></label></div>
        {hasFilters && <div className="rentals-active-filters" aria-label="Bộ lọc đang áp dụng">{city !== 'ALL' && <button onClick={() => setCity('ALL')} aria-label="Bỏ lọc khu vực">{city}<X size={12} /></button>}{query.trim() && <button onClick={() => setQuery('')} aria-label="Bỏ lọc từ khóa">“{query.trim()}”<X size={12} /></button>}</div>}
        {loading ? <div className="rentals-loading" role="status" aria-label="Đang tải địa điểm thuê">{[0, 1, 2].map(value => <div key={value} className="rental-skeleton"><span /><i /><i /></div>)}</div>
          : error ? <div className="rentals-state" role="alert"><MapPin size={32} strokeWidth={1.2} /><h3>Chưa kết nối được với danh sách</h3><p>{error}</p><button onClick={() => setAttempt(value => value + 1)} className="rental-button rental-button-primary"><RotateCcw size={15} />Tải lại địa điểm</button></div>
          : visible.length ? <><div className="rentals-list">{visible.map(({ provider, distance }, index) => <RentalProviderCard key={provider.id} provider={provider} distance={distance} index={index} />)}</div><p className="rentals-list-end">Đang hiển thị {visible.length} / {providers.length} địa điểm{hasFilters ? ' theo bộ lọc của bạn' : ' trong danh sách'}.</p></>
            : <div className="rentals-state"><Search size={32} strokeWidth={1.2} /><h3>{providers.length ? 'Chưa tìm thấy địa điểm phù hợp' : 'Danh sách đang được cập nhật'}</h3><p>{providers.length ? 'Thử từ khóa khác hoặc mở rộng khu vực tìm kiếm.' : 'Bạn có thể ghé Studio để khám phá các bộ phối trong lúc chờ.'}</p>{hasFilters && <button onClick={resetFilters} className="rental-button rental-button-primary"><RotateCcw size={15} />Xóa bộ lọc</button>}</div>}
      </section>
    </div>
  </div>;
}
