'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { MannequinFigure } from '@/components/mannequin/MannequinFigure';
import { hasAccessoryPreview } from '@/lib/outfit';

interface Props {
  garment: string;
  colorName: string;
  colorHex: string;
  accessories: string[];
  region: string;
  gender: 'female' | 'male';
  onGenderChange: (gender: 'female' | 'male') => void;
}

export function VirtualMannequin({ garment, colorName, colorHex, accessories, gender, onGenderChange }: Props) {
  const [zoomed, setZoomed] = useState(false);
  const pendingAccessories = accessories.filter(name => !hasAccessoryPreview(name));

  return <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#ded7cb] bg-[#f4f0e8]" data-mannequin>
    <div className="z-10 flex shrink-0 items-center justify-between gap-2 border-b border-[#ded7cb]/70 bg-[#faf8f3] px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="hidden pl-1 text-[10px] text-stone-400 xl:inline">Dáng thử</span>
        <div className="flex gap-0.5 rounded-lg bg-[#eee9df] p-0.5" aria-label="Dáng ma-nơ-canh">
          {(['female', 'male'] as const).map(value => <button key={value} type="button" data-gender={value} aria-pressed={gender === value} onClick={() => onGenderChange(value)} className={`rounded-md px-4 py-1.5 text-[11px] transition ${gender === value ? 'bg-white font-semibold text-red-950 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>{value === 'female' ? 'Nữ' : 'Nam'}</button>)}
        </div>
      </div>
      <button type="button" onClick={() => setZoomed(value => !value)} aria-label={zoomed ? 'Xem toàn thân' : 'Xem cận cảnh'} aria-pressed={zoomed} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] text-stone-500 transition hover:bg-[#eee9df] hover:text-stone-900">{zoomed ? <ZoomOut size={15} /> : <ZoomIn size={15} />}<span className="hidden sm:inline">{zoomed ? 'Toàn thân' : 'Cận cảnh'}</span></button>
    </div>
    <div className="relative min-h-0 flex-1 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 45% 28%, #fffcf5 0%, #f2ede3 52%, #e3dbce 100%)' }}>
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[11%] left-1/2 top-[5%] w-[68%] max-w-[370px] -translate-x-1/2 rounded-t-[48%] border border-white/80 bg-white/15 shadow-[0_0_70px_#fff9]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] border-t border-[#cfc4b2]/30 bg-gradient-to-b from-[#ddd3c2]/20 to-[#e6dfd3]/60" />
      <div className="absolute inset-0 px-2 pb-1 pt-2 transition-transform duration-300 motion-reduce:transition-none" style={{ transform: zoomed ? 'scale(1.65)' : undefined, transformOrigin: 'center 6%' }}>
        <MannequinFigure garment={garment} colorName={colorName} colorHex={colorHex} accessories={accessories} gender={gender} />
      </div>
    </div>
    {pendingAccessories.length > 0 && <p role="status" className="max-h-20 shrink-0 overflow-y-auto border-t border-[#ded7cb]/70 bg-[#faf8f3] px-4 py-2 text-[10px] leading-relaxed text-stone-600" data-pending-accessory-preview>Phụ kiện đã chọn, chưa có mô phỏng: {pendingAccessories.join(', ')}.</p>}
    <div className="hidden shrink-0 items-center justify-between gap-2 border-t border-[#ded7cb]/70 bg-[#faf8f3] px-4 py-2.5 text-[10px] text-stone-400 lg:flex"><span className="flex min-w-0 items-center gap-1.5"><span className="h-2 w-2 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: colorHex }} /><span className="truncate text-stone-600">{colorName}</span></span><span className="text-right">Mô phỏng phom dáng & màu sắc</span></div>
  </div>;
}
