'use client';

import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { colorName, outfitColors } from '@/lib/outfit';

export function ColorPalette({ values, onChange, multiple = false }: { values: string[]; onChange: (colors: string[]) => void; multiple?: boolean }) {
  const [custom, setCustom] = useState('#895B3F');
  const [error, setError] = useState('');
  const colors = [...outfitColors, ...values.filter(hex => !outfitColors.some(color => color.hex === hex)).map(hex => ({ hex, label: hex }))];
  function choose(hex: string) {
    setError('');
    if (!multiple) return onChange([hex]);
    if (values.includes(hex)) return onChange(values.filter(value => value !== hex));
    if (values.length >= 8) return setError('Bạn có thể chọn tối đa 8 màu cho một gợi ý.');
    onChange([...values, hex]);
  }
  function addCustom() {
    if (!/^#[\da-f]{6}$/i.test(custom)) return setError('Nhập mã màu gồm # và 6 ký tự, ví dụ #895B3F.');
    const hex = custom.toUpperCase();
    if (multiple && values.includes(hex)) return setError('Màu này đã có trong bảng màu đã chọn.');
    choose(hex);
  }
  return <div className="space-y-4" data-color-palette>
    <div className="grid max-w-[300px] grid-cols-6 gap-3">
      {colors.map(color => <button key={color.hex} type="button" onClick={() => choose(color.hex)} aria-label={`${color.label} ${color.hex}`} aria-pressed={values.includes(color.hex)} title={color.label} className={`relative aspect-square rounded-full border border-stone-300 shadow-sm ring-offset-2 ${values.includes(color.hex) ? 'ring-2 ring-red-800' : 'hover:ring-2 hover:ring-stone-300'}`} style={{ backgroundColor: color.hex }}>{values.includes(color.hex) && <Check size={14} className="absolute inset-0 m-auto rounded-full bg-white/90 p-0.5 text-stone-900" />}</button>)}
    </div>
    <div className="flex flex-wrap gap-2" aria-label="Màu đã chọn">{values.map(hex => <span key={hex} className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] text-stone-700"><span className="h-2.5 w-2.5 rounded-full border border-stone-200" style={{ backgroundColor: hex }} />{colorName(hex)}{multiple && <button type="button" aria-label={`Bỏ màu ${hex}`} onClick={() => onChange(values.filter(value => value !== hex))}><X size={12} /></button>}</span>)}</div>
    <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 p-2">
      <input type="color" aria-label="Chọn màu tùy chỉnh" value={/^#[\da-f]{6}$/i.test(custom) ? custom : '#895B3F'} onChange={event => setCustom(event.target.value.toUpperCase())} className="h-8 w-9 cursor-pointer border-0 bg-transparent" />
      <input aria-label="Mã màu tùy chỉnh" value={custom} onChange={event => setCustom(event.target.value)} maxLength={7} placeholder="#895B3F" className="min-w-0 flex-1 bg-transparent font-mono text-xs uppercase text-stone-700 outline-none" />
      <button type="button" onClick={addCustom} className="flex items-center gap-1 rounded-lg bg-stone-900 px-3 py-2 text-[11px] font-medium text-white"><Plus size={13} />{multiple ? 'Thêm' : 'Áp dụng'}</button>
    </div>
    {error && <p role="alert" className="text-xs text-red-800">{error}</p>}
  </div>;
}
