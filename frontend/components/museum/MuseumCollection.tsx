'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowDown, ArrowUpRight, BookOpen, History, Landmark, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { getCulturalItems, CulturalItemResponse } from '@/services/culturalApi';
import { filterCulturalItems } from '@/lib/cultural';
import { ArtifactCard } from './ArtifactCard';

const categories = [
  { value: 'ALL', label: 'Tất cả hiện vật' },
  { value: 'GARMENT', label: 'Y phục truyền thống' },
  { value: 'ACCESSORY', label: 'Phụ kiện' },
];

export function MuseumCollection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'ALL';
  const category = categories.some(entry => entry.value === categoryParam) ? categoryParam : 'ALL';
  const period = searchParams.get('period') || 'ALL';
  const [draftQuery, setDraftQuery] = useState(query);
  const [items, setItems] = useState<CulturalItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => { setDraftQuery(query); }, [query]);
  useEffect(() => { setVisibleCount(8); }, [query, category, period]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    setLoading(true);
    setError(false);
    getCulturalItems(undefined, controller.signal).then(response => {
      if (!active) return;
      if (response.success && response.data) setItems(response.data);
      else setError(true);
    }).catch(() => { if (active) setError(true); }).finally(() => {
      clearTimeout(timeout);
      if (active) setLoading(false);
    });
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [attempt]);

  const periods = useMemo(() => Array.from(new Set(items.map(item => item.historicalPeriod).filter((value): value is string => !!value))), [items]);
  const filteredItems = useMemo(() => filterCulturalItems(items, query, category, period), [items, query, category, period]);
  const totalSources = useMemo(() => new Set(items.flatMap(item => (item.sources || []).map(source => source.url || source.title))).size, [items]);
  const activeFilters = !!query || category !== 'ALL' || period !== 'ALL';
  const returnTo = searchParams.toString() ? `/cultural?${searchParams.toString()}` : undefined;

  function updateFilters(updates: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'ALL') next.delete(key);
      else next.set(key, value);
    });
    router.replace(`/cultural${next.size ? `?${next.toString()}` : ''}`, { scroll: false });
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    updateFilters({ q: draftQuery.trim() });
  }

  function resetFilters() {
    setDraftQuery('');
    router.replace('/cultural', { scroll: false });
  }

  return <>
    <section className="museum-hero" aria-labelledby="museum-title">
      <div className="museum-hero-copy">
        <span className="museum-kicker"><span />BẢO TÀNG VIỆT PHỤC</span>
        <h1 id="museum-title">Kho lưu trữ<br />di sản <em>y phục Việt.</em></h1>
        <p className="museum-hero-subtitle">Theo nếp áo xưa, tìm về nguồn cội.</p>
        <p className="museum-hero-description">Khám phá vẻ đẹp của y phục truyền thống qua từng triều đại. Mỗi nếp áo, đường thêu và sắc màu đều lưu giữ một câu chuyện văn hóa Việt Nam.</p>
        <a href="#collection" className="museum-button museum-button-primary">Khám phá bộ sưu tập <ArrowDown size={16} /></a>
        <div className="museum-stats">
          <div><strong>{loading || error ? '—' : String(items.length).padStart(2, '0')}</strong><span>Hiện vật & y phục</span></div>
          <div><strong>{loading || error ? '—' : String(periods.length).padStart(2, '0')}</strong><span>Niên đại được lưu trữ</span></div>
          <div><strong>{loading || error ? '—' : String(totalSources).padStart(2, '0')}</strong><span>Nguồn tham khảo</span></div>
        </div>
      </div>
      <figure className="museum-hero-visual">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/museum/gallery.jpg" alt="Không gian trưng bày y phục truyền thống với ánh sáng ấm và tủ kính" fetchPriority="high" />
        <span className="museum-hero-image-note">KHÔNG GIAN DI SẢN · ẢNH MINH HỌA</span>
        <figcaption><span className="museum-hero-caption-icon"><Landmark size={23} strokeWidth={1.4} /></span><div><strong>Dấu ấn y phục qua từng triều đại</strong><span>Một hành trình kết nối quá khứ và hiện tại</span></div><ArrowUpRight size={22} /></figcaption>
      </figure>
    </section>

    <section id="collection" className="museum-collection" aria-labelledby="collection-title">
      <div className="museum-section-heading"><div><span className="museum-eyebrow">GÌN GIỮ TINH HOA · TIẾP NỐI DI SẢN</span><h2 id="collection-title">Bộ sưu tập y phục</h2></div><span className="museum-heading-note"><BookOpen size={16} />Mỗi hiện vật, một câu chuyện</span></div>
      <div className="museum-collection-toolbar">
        <div className="museum-categories" role="group" aria-label="Phân loại hiện vật">
          {categories.map(entry => <button key={entry.value} aria-pressed={category === entry.value} onClick={() => updateFilters({ category: entry.value })}>{entry.label}{entry.value === 'ALL' && !loading && !error && <span>{items.length}</span>}</button>)}
        </div>
        <form onSubmit={submitSearch} className="museum-search" role="search">
          <label htmlFor="museum-search" className="sr-only">Tìm kiếm hiện vật</label><Search size={17} />
          <input id="museum-search" type="search" placeholder="Tên áo, triều đại, vùng miền…" value={draftQuery} onChange={event => setDraftQuery(event.target.value)} />
          <button type="submit" aria-label="Tìm kiếm"><ArrowUpRight size={19} /></button>
        </form>
      </div>
      <div className="museum-filter-rail">
        <label htmlFor="museum-period"><History size={18} /><span>Niên đại & lịch sử</span></label>
        <select id="museum-period" value={period} onChange={event => updateFilters({ period: event.target.value })}>
          <option value="ALL">Tất cả niên đại</option>
          {period !== 'ALL' && !periods.includes(period) && <option value={period}>{period}</option>}
          {periods.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
        <span className="museum-results-count" aria-live="polite"><SlidersHorizontal size={15} />{loading ? 'Đang tải bộ sưu tập…' : error ? 'Chưa tải được bộ sưu tập' : `${filteredItems.length} hiện vật trong bộ sưu tập`}</span>
        {activeFilters && <button className="museum-text-button" onClick={resetFilters}><X size={14} />Xóa bộ lọc</button>}
      </div>
      {query && <p className="museum-query-label">Kết quả cho <strong>“{query}”</strong></p>}

      {loading ? <div className="museum-grid" role="status" aria-label="Đang tải hiện vật">{Array.from({ length: 4 }, (_, index) => <div key={index} className="museum-skeleton"><div /><span /><span /></div>)}</div>
        : error ? <div className="museum-state" role="alert"><AlertCircle size={34} strokeWidth={1.3} /><h3>Chưa thể mở bộ sưu tập</h3><p>Kết nối đang gián đoạn. Vui lòng thử tải lại sau ít phút.</p><button className="museum-button museum-button-primary" onClick={() => setAttempt(value => value + 1)}><RotateCcw size={16} />Thử lại</button></div>
        : filteredItems.length === 0 ? <div className="museum-state"><Search size={34} strokeWidth={1.3} /><h3>{items.length ? 'Chưa tìm thấy hiện vật phù hợp' : 'Bộ sưu tập đang được cập nhật'}</h3><p>{items.length ? 'Thử một từ khóa khác hoặc mở rộng niên đại và phân loại.' : 'Hẹn bạn quay lại để khám phá những câu chuyện y phục mới.'}</p>{activeFilters && <button className="museum-button museum-button-outline" onClick={resetFilters}>Xem tất cả hiện vật</button>}</div>
        : <><div className="museum-grid">{filteredItems.slice(0, visibleCount).map(item => <ArtifactCard key={item.id} item={item} returnTo={returnTo} />)}</div>
          <div className="museum-collection-end"><span>Đang trưng bày {Math.min(visibleCount, filteredItems.length)} / {filteredItems.length} hiện vật</span>{visibleCount < filteredItems.length && <button className="museum-button museum-button-outline" onClick={() => setVisibleCount(count => count + 8)}>Khám phá thêm hiện vật <ArrowDown size={16} /></button>}</div></>}
    </section>
    <aside className="museum-closing-note"><Landmark size={23} strokeWidth={1.2} /><p>Di sản không chỉ để ngắm nhìn.<br /><em>Di sản là để thấu hiểu và tiếp nối.</em></p><span>VIỆT PHỤC STUDIO</span></aside>
  </>;
}
