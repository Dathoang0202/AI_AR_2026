'use client';

import Link from 'next/link';
import { ArrowUpRight, Edit3, EyeOff, Globe, Lock, Trash2 } from 'lucide-react';
import { MannequinFigure } from '@/components/mannequin/MannequinFigure';
import { colorName, toColorHex } from '@/lib/outfit';
import type { OutfitResponse } from '@/types';

export function OutfitCard({ outfit, onEdit, onDelete }: {
  outfit: OutfitResponse;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const colors = (outfit.colors || []).map(toColorHex).filter((value): value is string => !!value);
  const color = colors[0] || '#C0392B';
  const gender = outfit.gender || 'female';
  const accessories = outfit.accessories || [];
  const params = new URLSearchParams({
    name: outfit.name, garment: outfit.primaryGarment, gender,
    occasion: outfit.occasion, region: outfit.region, style: outfit.style,
    colors: JSON.stringify(colors.length ? colors : [color]), accessories: JSON.stringify(accessories),
  });
  const href = `/studio?${params}`;
  const visibility = outfit.visibility === 'PUBLIC' ? 'Công khai' : outfit.visibility === 'UNLISTED' ? 'Có liên kết' : 'Riêng tư';
  const VisibilityIcon = outfit.visibility === 'PUBLIC' ? Globe : outfit.visibility === 'UNLISTED' ? EyeOff : Lock;

  return <article data-lookbook-id={outfit.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
    <Link href={href} aria-label={`Thử bộ ${outfit.name} trong Studio`} className="relative block h-72 overflow-hidden bg-[#F2EEE5] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-800 sm:h-80">
      <div aria-hidden="true" className="absolute inset-x-[18%] bottom-7 top-8 rounded-t-full border border-white/90 bg-gradient-to-b from-white/60 to-transparent" />
      <div className="relative h-full px-5 pb-1 pt-4 transition-transform duration-300 group-hover:scale-[1.025]">
        <MannequinFigure garment={outfit.primaryGarment} colorName={colorName(color)} colorHex={color} accessories={accessories} gender={gender} />
      </div>
      <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] text-stone-600"><VisibilityIcon size={11} />{visibility}</span>
      <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-medium text-red-900 shadow-sm">Thử trong Studio<ArrowUpRight size={14} /></span>
    </Link>
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold text-red-950"><Link href={href} className="hover:underline">{outfit.name}</Link></h2>
          <p className="mt-1 text-xs text-stone-500">{outfit.primaryGarment}</p>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <button onClick={onEdit} aria-label={`Chỉnh sửa ${outfit.name}`} title="Chỉnh tên và quyền riêng tư" className="rounded-lg p-2 text-stone-500 hover:bg-amber-50 hover:text-amber-800"><Edit3 size={15} /></button>
          <button onClick={onDelete} aria-label={`Xóa ${outfit.name}`} title="Xóa khỏi Lookbook" className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-800"><Trash2 size={15} /></button>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-stone-600">{outfit.occasion}<span className="text-stone-300"> · </span>{outfit.style}</p>
      <div className="flex flex-wrap items-center gap-1.5" aria-label="Bảng màu đã lưu">
        {colors.map((hex, index) => <span key={`${hex}-${index}`} title={colorName(hex)} aria-label={`${index === 0 ? 'Màu áo: ' : ''}${colorName(hex)}`} className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: hex }} />)}
        <span className="ml-1 text-[11px] text-stone-500">{colorName(color)}</span>
      </div>
      {accessories.length > 0 && <p className="text-[11px] leading-relaxed text-stone-500">{accessories.join(' · ')}</p>}
      {!outfit.gender && <p className="text-[10px] text-stone-500">Bộ lưu cũ chưa có lựa chọn ma-nơ-canh; đang xem trên mẫu nữ.</p>}
      {outfit.culturalNotes && <details className="text-[11px] leading-relaxed text-stone-500"><summary className="cursor-pointer hover:text-red-800">Ghi chú văn hóa</summary><p className="mt-2">{outfit.culturalNotes}</p></details>}
      <div className="mt-auto flex justify-between gap-2 border-t border-stone-100 pt-3 text-[10px] text-stone-400"><span>{outfit.region}</span><time dateTime={outfit.createdAt}>{new Date(outfit.createdAt).toLocaleDateString('vi-VN')}</time></div>
    </div>
  </article>;
}
