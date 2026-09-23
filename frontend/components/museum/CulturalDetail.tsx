'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowUpRight, BookOpen, Check, ChevronRight, ExternalLink, Landmark, Loader2, RotateCcw, Search, Share2, Shirt, X, ZoomIn } from 'lucide-react';
import { CulturalItemResponse, getCulturalItemById, getCulturalItems } from '@/services/culturalApi';
import { categoryLabel, safeSourceUrl } from '@/lib/cultural';
import { ArtifactImage } from './ArtifactImage';
import { ArtifactCard } from './ArtifactCard';

export function CulturalDetail({ id }: { id: number }) {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const backHref = from === '/cultural' || from?.startsWith('/cultural?') ? from : '/cultural';
  const [item, setItem] = useState<CulturalItemResponse | null>(null);
  const [related, setRelated] = useState<CulturalItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'missing' | 'connection' | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [tab, setTab] = useState('story');
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const [shareUrl, setShareUrl] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    setLoading(true);
    setError(null);
    getCulturalItemById(id, controller.signal).then(response => {
      if (!active) return;
      if (response.success && response.data) setItem(response.data);
      else setError(['RESOURCE_NOT_FOUND', 'HTTP_404'].includes(response.error?.code || '') ? 'missing' : 'connection');
    }).catch(() => { if (active) setError('connection'); }).finally(() => {
      clearTimeout(timeout);
      if (active) setLoading(false);
    });
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [id, attempt]);

  useEffect(() => {
    if (!item) return;
    document.title = `${item.name} | Bảo Tàng Việt Phục`;
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    getCulturalItems(item.category, controller.signal).then(response => {
      if (active && response.success && response.data) {
        setRelated(response.data.filter(candidate => candidate.id !== item.id).sort((a, b) => Number(b.historicalPeriod === item.historicalPeriod) - Number(a.historicalPeriod === item.historicalPeriod)).slice(0, 4));
      }
    }).catch(() => {}).finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [item]);

  async function shareItem() {
    const url = `${window.location.origin}/cultural/${id}`;
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
      setShareState('copied');
    } catch { setShareState('manual'); }
  }

  if (loading) return <div className="museum-state museum-detail-loading" role="status"><Loader2 className="animate-spin" size={30} /><p>Đang mở hồ sơ hiện vật…</p></div>;
  if (error || !item) return <div className="museum-state" role={error === 'connection' ? 'alert' : undefined}>
    {error === 'missing' ? <Search size={36} /> : <AlertCircle size={36} />}
    <h1>{error === 'missing' ? 'Không tìm thấy hiện vật' : 'Chưa thể mở hồ sơ hiện vật'}</h1>
    <p>{error === 'missing' ? 'Hiện vật này không còn trong bộ sưu tập. Mời bạn khám phá các y phục khác.' : 'Kết nối đang gián đoạn. Vui lòng thử tải lại sau ít phút.'}</p>
    <div className="museum-state-actions">{error !== 'missing' && <button className="museum-button museum-button-primary" onClick={() => setAttempt(value => value + 1)}><RotateCcw size={16} />Thử lại</button>}<Link href={backHref} className="museum-button museum-button-outline"><ArrowLeft size={16} />Quay lại bảo tàng</Link></div>
  </div>;

  const sources = item.sources || [];
  const tabs = [ { id: 'story', label: 'Câu chuyện y phục' }, { id: 'meaning', label: 'Ý nghĩa văn hóa' }, { id: 'sources', label: `Nguồn tư liệu (${sources.length})` } ];

  return <>
    <div className="museum-breadcrumb-row">
      <nav aria-label="Đường dẫn trang" className="museum-breadcrumb"><Link href={backHref}><Landmark size={15} />Bảo tàng</Link><ChevronRight size={14} /><Link href={`/cultural?category=${encodeURIComponent(item.category)}`}>{categoryLabel(item.category)}</Link><ChevronRight size={14} /><span aria-current="page">{item.name}</span></nav>
      <Link href={backHref} className="museum-back-link"><ArrowLeft size={15} />Về bộ sưu tập</Link>
    </div>
    <section className="museum-detail-hero" aria-labelledby="artifact-title">
      <div className="museum-detail-gallery">
        <button className="museum-detail-image" onClick={() => dialogRef.current?.showModal()} aria-label={`Phóng to ảnh ${item.name}`}>
          <ArtifactImage name={item.name} src={item.imageUrl} priority variant="detail" />
          <span className="museum-detail-image-label"><Landmark size={15} />DI SẢN Y PHỤC</span>
          <span className="museum-zoom-icon"><ZoomIn size={21} /></span>
        </button>
        <div className="museum-image-caption"><span><ZoomIn size={14} />Bấm vào ảnh để xem cận cảnh</span><span>VP / {String(item.id).padStart(3, '0')}</span></div>
      </div>
      <div className="museum-detail-info">
        <div className="museum-detail-tags"><span>{categoryLabel(item.category)}</span><span>HỒ SƠ VP-{String(item.id).padStart(3, '0')}</span></div>
        <p className="museum-eyebrow">BỘ SƯU TẬP DI SẢN VIỆT PHỤC</p>
        <h1 id="artifact-title">{item.name}</h1>
        <p className="museum-detail-era">{item.historicalPeriod || 'Niên đại đang được cập nhật'}</p>
        <p className="museum-detail-summary">{item.description}</p>
        <dl className="museum-specifications"><div><dt>Niên đại</dt><dd>{item.historicalPeriod || 'Đang cập nhật'}</dd></div><div><dt>Vùng văn hóa</dt><dd>{item.region || 'Đang cập nhật'}</dd></div><div><dt>Phân loại</dt><dd>{categoryLabel(item.category)}</dd></div><div><dt>Tư liệu tham khảo</dt><dd>{sources.length ? `${sources.length} nguồn được đính kèm` : 'Đang bổ sung tư liệu'}</dd></div></dl>
        <div className="museum-detail-actions">
          <Link className="museum-button museum-button-primary" href={item.category === 'GARMENT' ? `/studio?garment=${encodeURIComponent(item.name)}` : '/studio'}><Shirt size={18} />Khám phá trong Phòng Phối Đồ <ArrowUpRight size={17} /></Link>
          <button className="museum-button museum-button-outline" onClick={shareItem}>{shareState === 'copied' ? <Check size={17} /> : <Share2 size={17} />}{shareState === 'copied' ? 'Đã sao chép liên kết' : 'Chia sẻ tư liệu'}</button>
          <div role="status" className="museum-share-status">{shareState === 'copied' && 'Bạn có thể gửi liên kết này để chia sẻ trang phục.'}{shareState === 'manual' && <label>Sao chép liên kết để chia sẻ<input readOnly value={shareUrl} onFocus={event => event.target.select()} /></label>}</div>
        </div>
        <p className="museum-detail-footnote"><BookOpen size={15} />Tìm hiểu thêm câu chuyện và nguồn tham khảo bên dưới.</p>
      </div>
    </section>

    <section className="museum-record" aria-labelledby="record-title">
      <div className="museum-section-heading"><div><span className="museum-eyebrow">ĐỌC ĐỂ HIỂU · HIỂU ĐỂ GÌN GIỮ</span><h2 id="record-title">Câu chuyện sau từng nếp áo</h2></div><BookOpen size={26} strokeWidth={1.2} /></div>
      <div className="museum-record-tabs" role="tablist" aria-label="Hồ sơ hiện vật">{tabs.map((entry, index) => <button key={entry.id} id={`tab-${entry.id}`} role="tab" aria-selected={tab === entry.id} aria-controls="museum-record-panel" tabIndex={tab === entry.id ? 0 : -1} onClick={() => setTab(entry.id)} onKeyDown={event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault(); setTab(tabs[next].id); document.getElementById(`tab-${tabs[next].id}`)?.focus();
      }}>{entry.label}</button>)}</div>
      <div id="museum-record-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="museum-record-panel">
        {tab === 'story' && <div className="museum-story-grid"><div><span className="museum-eyebrow">NGUỒN GỐC & ĐẶC TRƯNG</span><h3>{item.name}</h3><p>{item.description}</p></div><aside><Landmark size={28} strokeWidth={1.2} /><h4>Dấu ấn di sản</h4><p>{item.significance || 'Ý nghĩa văn hóa của hiện vật đang được bổ sung.'}</p></aside></div>}
        {tab === 'meaning' && <div className="museum-meaning"><span className="museum-eyebrow">GIÁ TRỊ ĐƯỢC TIẾP NỐI</span><h3>Ý nghĩa trong văn hóa Việt</h3><p>{item.significance || 'Nội dung về ý nghĩa văn hóa đang được bổ sung cho hiện vật này.'}</p>{item.region && <span className="museum-meaning-region">Không gian văn hóa: {item.region}</span>}</div>}
        {tab === 'sources' && <div><span className="museum-eyebrow">TÌM HIỂU TỪ NGUỒN GỐC</span><h3>Nguồn tư liệu tham khảo</h3>{sources.length ? <div className="museum-sources">{sources.map((source, index) => {
          const url = safeSourceUrl(source.url);
          return <div key={source.id} className="museum-source"><span className="museum-source-number">{String(index + 1).padStart(2, '0')}</span><div><h4>{source.title}</h4>{source.publisher && <p>{source.publisher}</p>}</div>{url && <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Đọc ${source.title} (mở tab mới)`}>Đọc tư liệu <ExternalLink size={15} /></a>}</div>;
        })}</div> : <p>Nguồn tham khảo cho hiện vật này đang được bổ sung.</p>}</div>}
      </div>
    </section>

    {related.length > 0 && <section className="museum-related" aria-labelledby="related-title"><div className="museum-section-heading"><div><span className="museum-eyebrow">TIẾP TỤC HÀNH TRÌNH DI SẢN</span><h2 id="related-title">Có thể bạn muốn khám phá</h2></div><Link href="/cultural" className="museum-back-link">Toàn bộ bộ sưu tập <ArrowUpRight size={16} /></Link></div><div className="museum-grid">{related.map(candidate => <ArtifactCard key={candidate.id} item={candidate} />)}</div></section>}

    <dialog ref={dialogRef} className="museum-lightbox" aria-label={`Ảnh phóng to ${item.name}`} onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
      <div className="museum-lightbox-content"><button className="museum-lightbox-close" onClick={() => dialogRef.current?.close()} aria-label="Đóng ảnh phóng to" autoFocus><X size={24} /></button><div className="museum-lightbox-image"><ArtifactImage name={item.name} src={item.imageUrl} priority variant="detail" /></div><p>{item.name}</p></div>
    </dialog>
  </>;
}
