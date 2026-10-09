'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Search, RotateCcw, Shirt, Gem, ArrowUpRight } from 'lucide-react';
import type { CulturalItemResponse } from '@/services/culturalApi';
import { normalizeCulturalText } from '@/lib/cultural';
import { WardrobeIllustration } from './WardrobeIllustration';

interface Props {
  items: CulturalItemResponse[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  selectedIds: number[];
  onSelect: (item: CulturalItemResponse) => void;
  showAccessories?: boolean;
  fill?: boolean;
  gender?: 'female' | 'male';
  selectedColor?: string;
}

export function WardrobePicker({ items, loading, error, onRetry, selectedIds, onSelect, showAccessories = true, fill = false, gender = 'female', selectedColor }: Props) {
  const [category, setCategory] = useState('GARMENT');
  const [query, setQuery] = useState('');
  const visible = items.filter(item => item.category === category && normalizeCulturalText(`${item.name} ${item.region || ''}`).includes(normalizeCulturalText(query.trim())));
  const tabs = showAccessories ? [{ id: 'GARMENT', label: 'Y phục', icon: Shirt }, { id: 'ACCESSORY', label: 'Phụ kiện', icon: Gem }] : [{ id: 'GARMENT', label: 'Y phục', icon: Shirt }];

  return <div className={`flex min-h-0 flex-col gap-2 ${fill ? 'flex-1' : ''}`} data-wardrobe-picker>
    <div className="flex shrink-0 items-center gap-1 border-b border-stone-200" aria-label="Loại trang phục">
      {tabs.map(tab => <button key={tab.id} type="button" aria-pressed={category === tab.id} onClick={() => { setCategory(tab.id); setQuery(''); }} className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs transition ${category === tab.id ? 'border-red-800 text-red-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-900'}`}><tab.icon size={14} />{tab.label}<span className="rounded-full bg-stone-100 px-1.5 text-[10px] text-stone-500">{items.filter(item => item.category === tab.id).length}</span></button>)}
    </div>
    <label className="flex shrink-0 items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-stone-400">
      <Search size={17} /><input aria-label="Tìm trang phục trong bảo tàng" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm tên y phục, vùng miền…" className="min-w-0 flex-1 bg-transparent text-xs text-stone-800 outline-none" />
    </label>
    {loading ? <div className="grid min-h-0 grid-cols-2 gap-2 overflow-y-auto" role="status" aria-label="Đang tải tủ đồ">{[0,1,2,3].map(key => <div key={key} className="h-32 animate-pulse rounded-xl bg-stone-100" />)}</div>
      : error ? <div role="alert" className="rounded-xl bg-red-50 p-4 text-xs text-red-900"><p>{error}</p><button type="button" onClick={onRetry} className="mt-3 flex items-center gap-2 font-semibold"><RotateCcw size={14} />Tải lại tủ đồ</button></div>
      : !visible.length ? <p className="py-12 text-center text-sm text-stone-500">{query ? 'Chưa có món đồ khớp từ khóa này.' : 'Danh mục này đang được bổ sung.'}</p>
      : <div className={`grid min-h-0 auto-rows-max grid-cols-2 content-start gap-2 overflow-y-auto overscroll-contain p-1 ${fill ? 'flex-1' : 'max-h-[510px]'}`} aria-label="Danh mục bảo tàng">
        {visible.map(item => {
          const selected = selectedIds.includes(item.id);
          return <article key={item.id} data-item-id={item.id} className={`relative h-max self-start rounded-xl border text-left transition ${selected ? 'border-red-800 bg-red-50/50 ring-1 ring-red-800' : 'border-stone-200 bg-white hover:border-amber-700'}`}>
            <button
              type="button"
              aria-label={`${item.category === 'GARMENT' ? 'Mặc thử' : selected ? 'Bỏ' : 'Thêm'} ${item.name}`}
              aria-pressed={selected}
              onClick={() => onSelect(item)}
              className="group block w-full overflow-hidden rounded-xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-[radial-gradient(ellipse_at_45%_30%,#fffdf6,#ede5d8)] [&>svg]:transition-transform group-hover:[&>svg]:scale-105">
                <WardrobeIllustration item={item} gender={gender} color={selected ? selectedColor : undefined} />
                {selected && <span className="absolute left-1.5 top-1.5 rounded-full bg-red-800 p-1 text-white"><Check size={11} /></span>}
              </span>
              <span className="block px-2 py-2"><span className="line-clamp-2 min-h-8 font-serif text-xs font-semibold leading-4 text-stone-900">{item.name}</span></span>
            </button>
            <Link
              href={`/cultural/detail?id=${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Tìm hiểu thêm về ${item.name} trong bảo tàng (mở tab mới)`}
              aria-describedby={`wardrobe-more-${item.id}`}
              className="group/museum absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg border border-white/70 bg-white/95 text-stone-600 shadow-sm transition hover:bg-red-800 hover:text-white focus-visible:bg-red-800 focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
            >
              <ArrowUpRight size={15} aria-hidden="true" />
              <span id={`wardrobe-more-${item.id}`} role="tooltip" className="pointer-events-none invisible absolute right-0 top-full z-10 mt-1.5 whitespace-nowrap rounded-md bg-stone-900 px-2 py-1.5 text-[10px] text-white opacity-0 shadow-md transition group-hover/museum:visible group-hover/museum:opacity-100 group-focus-visible/museum:visible group-focus-visible/museum:opacity-100">Tìm hiểu thêm</span>
            </Link>
          </article>;
        })}
      </div>}
    <p className="shrink-0 text-[10px] leading-relaxed text-stone-500">Bấm món đồ để mặc thử; bấm lại phụ kiện để bỏ.</p>
  </div>;
}
