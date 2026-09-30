'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Bookmark, CheckCircle, AlertTriangle, Loader2, Shirt, ExternalLink, Sparkles, X, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { validateCulturalOutfit, saveOutfit } from '@/services/outfitApi';
import { CulturalValidationResponse } from '@/types';
import { CulturalItemResponse } from '@/services/culturalApi';
import { VirtualMannequin } from '@/components/VirtualMannequin';
import { OutfitNameEditor } from '@/components/studio/OutfitNameEditor';
import { WardrobePicker } from '@/components/wardrobe/WardrobePicker';
import { ColorPalette } from '@/components/wardrobe/ColorPalette';
import { useMuseumCatalog } from '@/hooks/useMuseumCatalog';
import { accessoryName, colorName, garmentKind, occasionOptions, regionOptions, styleOptions, toColorHex } from '@/lib/outfit';

function readList(value: string | null): string[] {
  if (value === null) return [];
  try { const parsed = JSON.parse(value); if (Array.isArray(parsed)) return parsed.filter(item => typeof item === 'string'); } catch {}
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

function StudioContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated, openAuthModal } = useAuth();
  const catalog = useMuseumCatalog();
  const [garmentId, setGarmentId] = useState<number>();
  const [outfitName, setOutfitName] = useState('Phối đồ của tôi');
  const [hasCustomName, setHasCustomName] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [palette, setPalette] = useState(['#C0392B']);
  const [selectedColor, setSelectedColor] = useState('#C0392B');
  const [occasion, setOccasion] = useState(occasionOptions[0]);
  const [region, setRegion] = useState(regionOptions[1]);
  const [style, setStyle] = useState(styleOptions[0]);
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [accessories, setAccessories] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [check, setCheck] = useState<{ key: string; result?: CulturalValidationResponse; error?: string }>();
  const [checkAttempt, setCheckAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [mobilePanel, setMobilePanel] = useState<'wardrobe' | 'colors' | 'context'>('wardrobe');
  const [detailTab, setDetailTab] = useState<'colors' | 'context'>('colors');
  const garment = catalog.items.find(item => item.id === garmentId && item.category === 'GARMENT');
  const primaryGarment = garment?.name || '';
  const validationKey = JSON.stringify([primaryGarment, selectedColor, occasion, region, gender, accessories, checkAttempt]);
  // A result is usable only for the exact current outfit, including the mannequin.
  const validation = check?.key === validationKey ? check.result : undefined;
  const validationError = check?.key === validationKey ? check.error : undefined;
  const validating = !!garment && !validation && !validationError;

  useEffect(() => {
    if (catalog.loading || catalog.error) return;
    const garments = catalog.items.filter(item => item.category === 'GARMENT');
    const requestedId = searchParams.get('garmentId');
    const legacyName = searchParams.get('garment');
    const match = requestedId ? garments.find(item => item.id === Number(requestedId))
      : legacyName ? garments.find(item => item.name === legacyName || (garmentKind(legacyName) !== 'other' && garmentKind(item.name) === garmentKind(legacyName))) : garments[0];
    setGarmentId(match?.id);
    setNotice((requestedId || legacyName) && !match ? 'Y phục được gửi sang không còn trong bảo tàng. Bạn chọn lại từ tủ đồ nhé.' : '');
    const nextGender = searchParams.get('gender') === 'male' ? 'male' : 'female';
    setGender(nextGender);
    const incomingName = searchParams.get('name')?.trim().slice(0, 150);
    setOutfitName(incomingName || (match ? `Phối đồ cùng ${match.name}` : 'Phối đồ của tôi'));
    setHasCustomName(!!incomingName);
    setIsEditingName(false);
    setOccasion(searchParams.get('occasion') || occasionOptions[0]);
    setRegion(searchParams.get('region') || regionOptions[1]);
    setStyle(searchParams.get('style') || styleOptions[0]);
    const incomingColors = Array.from(new Set(readList(searchParams.get('colors')).map(toColorHex).filter((value): value is string => !!value))).slice(0, 8);
    setPalette(incomingColors.length ? incomingColors : ['#C0392B']);
    setSelectedColor(incomingColors[0] || '#C0392B');
    const incoming = readList(searchParams.get('accessories'));
    const requestedAccessory = searchParams.get('accessoryId');
    if (requestedAccessory) {
      const item = catalog.items.find(item => item.id === Number(requestedAccessory) && item.category === 'ACCESSORY');
      if (item) incoming.push(accessoryName(item, nextGender));
      else setNotice('Phụ kiện được gửi sang không còn trong bảo tàng. Bạn có thể chọn món khác.');
    }
    setAccessories(Array.from(new Set(incoming)));
  }, [catalog.items, catalog.loading, catalog.error, searchParams]);

  useEffect(() => {
    if (!primaryGarment) return;
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    validateCulturalOutfit({ garment: primaryGarment, color: `${colorName(selectedColor)} ${selectedColor}`, occasion, region, gender, accessories }, controller.signal)
      .then(result => {
        if (active) setCheck({ key: validationKey, result: result.success ? result.data : undefined, error: result.success && result.data ? undefined : 'Chưa kiểm tra được. Bạn thử lại nhé.' });
      }).finally(() => clearTimeout(timeout));
    return () => { active = false; controller.abort(); clearTimeout(timeout); };
  }, [validationKey, primaryGarment, selectedColor, occasion, region, gender, accessories]);

  function selectItem(item: CulturalItemResponse) {
    setSaveMessage(''); setNotice('');
    if (item.category === 'GARMENT') { setGarmentId(item.id); if (!hasCustomName) setOutfitName(`Phối đồ cùng ${item.name}`); }
    else {
      const variants = [accessoryName(item, 'female'), accessoryName(item, 'male')];
      setAccessories(previous => previous.some(name => variants.includes(name)) ? previous.filter(name => !variants.includes(name)) : [...previous, accessoryName(item, gender)]);
    }
  }

  function changeGender(next: 'female' | 'male') {
    // Keep the selected outfit visible so an incompatible combination can be explained.
    setGender(next); setSaveMessage('');
  }

  function chooseColor(hex: string) {
    setSelectedColor(hex);
    setPalette(previous => [hex, ...previous.filter(value => value !== hex)].slice(0, 8));
    setSaveMessage('');
  }

  function autoFix() {
    if (['nhat-binh', 'tu-than'].includes(garmentKind(primaryGarment)) && gender === 'male') {
      const replacement = catalog.items.find(item => item.category === 'GARMENT' && garmentKind(item.name) === 'ao-tac');
      if (replacement) { setGarmentId(replacement.id); if (!hasCustomName) setOutfitName(`Phối đồ cùng ${replacement.name}`); }
    }
    setAccessories(previous => previous.map(name => {
      const item = catalog.items.find(item => item.category === 'ACCESSORY' && [accessoryName(item, 'female'), accessoryName(item, 'male')].includes(name));
      return item ? accessoryName(item, gender) : name;
    }));
    if (['#FFFFFF', '#FDFBF7', '#D4AF37'].includes(selectedColor)) chooseColor('#C0392B');
    if (garmentKind(primaryGarment) === 'nhat-binh' && occasion.includes('hằng ngày')) setOccasion('Chụp ảnh di sản / nghệ thuật');
    setSaveMessage('');
  }

  async function save() {
    if (!isAuthenticated) { openAuthModal(); return; }
    if (!garment) return;
    setSaving(true); setSaveMessage('');
    try {
      const result = await saveOutfit({ name: outfitName.trim() || `Phối đồ cùng ${primaryGarment}`, primaryGarment, gender, colors: palette, accessories, occasion, region, style, culturalNotes: validation ? [...validation.issues, ...validation.notes].join('; ') : 'Chưa có kết quả kiểm tra văn hóa.' });
      setSaveMessage(result.success ? 'Đã lưu phối đồ vào Lookbook.' : result.error?.message || 'Chưa lưu được phối đồ. Bạn thử lại nhé.');
    } finally { setSaving(false); }
  }

  const selectedIds = catalog.items.filter(item => item.id === garmentId || (item.category === 'ACCESSORY' && [accessoryName(item, 'female'), accessoryName(item, 'male')].some(name => accessories.includes(name)))).map(item => item.id);
  const suggestionQuery = new URLSearchParams({ occasion, region, style, gender, colors: JSON.stringify(palette) });
  const statusText = validating ? 'Đang kiểm tra bối cảnh…' : validationError ? 'Chưa có kết quả kiểm tra' : !garment ? 'Chọn y phục để kiểm tra' : validation?.status === 'NON_COMPLIANT' ? 'Chưa phù hợp bối cảnh' : validation?.status === 'CAUTION' ? 'Có điểm cần cân nhắc' : 'Chưa thấy xung đột';
  const statusClass = validation?.status === 'NON_COMPLIANT' ? 'border-red-200 bg-red-50 text-red-900' : validation?.status === 'COMPLIANT' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900';

  return <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-3" data-studio-workbench>
    <header className="flex shrink-0 items-center justify-between gap-3">
      <div><p className="hidden text-[9px] uppercase tracking-[.2em] text-amber-800 sm:block">MỘT GÓC DÀNH CHO CẢM HỨNG</p><h1 className="font-serif text-xl font-semibold text-red-950 sm:text-2xl">Studio phối đồ</h1></div>
      <div className="flex gap-2"><Link href={`/onboarding?${suggestionQuery}`} className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-[11px] font-semibold text-stone-700"><Sparkles size={14} /><span className="hidden sm:inline">Gợi ý theo bối cảnh</span><span className="sm:hidden">Gợi ý</span></Link><button onClick={save} disabled={saving || !garment || isEditingName} title={isEditingName ? 'Xác nhận tên bộ phối trước khi lưu' : undefined} className="inline-flex items-center gap-2 rounded-xl bg-red-900 px-3 py-2.5 text-[11px] font-semibold text-white disabled:opacity-50">{saving ? <Loader2 className="animate-spin" size={14} /> : <Bookmark size={14} />}<span>{isAuthenticated ? 'Lưu phối đồ' : 'Lưu'}</span></button></div>
    </header>
    {(notice || saveMessage) && <div role="status" className="flex shrink-0 items-center justify-between gap-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900"><p>{notice || saveMessage}</p><button aria-label="Đóng thông báo" onClick={() => { setNotice(''); setSaveMessage(''); }}><X size={14} /></button></div>}
    <div className="flex shrink-0 gap-1 rounded-xl bg-stone-100 p-1 lg:hidden" aria-label="Công cụ phối đồ">{([{ id: 'wardrobe', label: 'Tủ đồ' }, { id: 'colors', label: 'Màu sắc' }, { id: 'context', label: 'Bối cảnh' }] as const).map(tab => <button key={tab.id} aria-pressed={mobilePanel === tab.id} onClick={() => { setMobilePanel(tab.id); if (tab.id !== 'wardrobe') setDetailTab(tab.id); }} className={`flex-1 rounded-lg py-2 text-[11px] ${mobilePanel === tab.id ? 'bg-white font-semibold text-red-900 shadow-sm' : 'text-stone-500'}`}>{tab.label}</button>)}</div>
    <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,.85fr)] gap-3 lg:grid-cols-[270px_minmax(0,1fr)_280px] lg:grid-rows-1 xl:grid-cols-[300px_minmax(0,1fr)_300px]">
      <aside className={`order-2 min-h-0 flex-col rounded-2xl border border-stone-200 bg-white p-3 lg:order-1 lg:flex ${mobilePanel === 'wardrobe' ? 'flex' : 'hidden'}`} aria-label="Tủ trang phục">
        <div className="flex shrink-0 items-center justify-between"><h2 className="font-serif text-lg font-semibold">Tủ trang phục</h2><Link href="/cultural" target="_blank" rel="noopener noreferrer" className="text-amber-800" aria-label="Mở bảo tàng trong tab mới"><ArrowUpRight size={16} /></Link></div>
        <WardrobePicker {...catalog} onRetry={catalog.retry} selectedIds={selectedIds} onSelect={selectItem} fill />
      </aside>
      <section className="order-1 flex min-h-0 min-w-0 flex-col gap-2 lg:order-2" aria-label="Phòng mặc thử">
        <div className="shrink-0 space-y-1 px-1">
          <OutfitNameEditor key={searchParams.toString()} value={outfitName} disabled={catalog.loading || saving} onEditingChange={setIsEditingName} onChange={name => { setOutfitName(name); setHasCustomName(true); setSaveMessage(''); }} />
          <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-stone-500"><p className="min-w-0 truncate" title={primaryGarment}>{garment ? `Đang mặc: ${primaryGarment}` : 'Chọn y phục từ tủ đồ'}</p>{garment && <Link href={`/cultural/${garment.id}`} target="_blank" rel="noopener noreferrer" aria-label="Mở hồ sơ y phục trong bảo tàng" className="shrink-0 rounded text-amber-800 hover:text-red-900"><ArrowUpRight size={14} /></Link>}</div>
        </div>
        <div className="min-h-0 flex-1">{garment ? <VirtualMannequin garment={primaryGarment} colorName={colorName(selectedColor)} colorHex={selectedColor} accessories={accessories} region={region} gender={gender} onGenderChange={changeGender} /> : <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-stone-100 p-5 text-center text-xs text-stone-500"><Shirt size={36} strokeWidth={1} /><p>Chọn y phục để bắt đầu mặc thử.</p></div>}</div>
        <div className="flex min-h-8 shrink-0 items-center gap-2 overflow-x-auto whitespace-nowrap" aria-label="Phụ kiện đang phối">{accessories.length ? accessories.map(name => <button key={name} onClick={() => { setAccessories(previous => previous.filter(value => value !== name)); setSaveMessage(''); }} className="flex shrink-0 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[10px] text-stone-700" aria-label={`Bỏ ${name}`}>{name}<X size={12} /></button>) : <p className="px-1 text-[10px] text-stone-500">Thêm điểm nhấn từ mục Phụ kiện trong tủ đồ.</p>}</div>
        <button onClick={() => { setMobilePanel('context'); setDetailTab('context'); }} className={`shrink-0 rounded-lg border px-3 py-2 text-left text-[11px] lg:hidden ${statusClass}`} data-mobile-validation>{statusText}</button>
      </section>
      <aside className={`order-3 min-h-0 flex-col gap-3 lg:flex ${mobilePanel === 'wardrobe' ? 'hidden' : 'flex'}`} aria-label="Tùy chỉnh phối đồ">
        <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-stone-200 bg-white p-4">
          <div className="mb-3 hidden shrink-0 gap-4 border-b border-stone-100 lg:flex">{(['colors', 'context'] as const).map(tab => <button key={tab} aria-pressed={detailTab === tab} onClick={() => setDetailTab(tab)} className={`border-b-2 pb-2 text-xs font-semibold ${detailTab === tab ? 'border-red-800 text-red-900' : 'border-transparent text-stone-400'}`}>{tab === 'colors' ? 'Màu sắc' : 'Bối cảnh'}</button>)}</div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            {detailTab === 'colors' ? <div className="space-y-4"><div><h2 className="font-serif text-lg font-semibold">Sắc màu y phục</h2><p className="mt-1 text-[10px] leading-relaxed text-stone-500">Thử tông màu có sẵn hoặc tạo sắc màu riêng.</p></div><ColorPalette values={[selectedColor]} onChange={colors => chooseColor(colors[0])} />{palette.length > 1 && <div><p className="mb-2 text-[10px] text-stone-500">Màu trong bộ phối</p><div className="flex flex-wrap gap-2">{palette.map(hex => <button key={hex} aria-label={`Thử màu ${hex}`} aria-pressed={hex === selectedColor} title={colorName(hex)} onClick={() => chooseColor(hex)} style={{ backgroundColor: hex }} className={`h-6 w-6 rounded-full border border-stone-300 ${hex === selectedColor ? 'ring-1 ring-red-800 ring-offset-2' : ''}`} />)}</div></div>}</div>
              : <div className="space-y-3"><h2 className="font-serif text-lg font-semibold">Câu chuyện bộ phối</h2>{([{ label: 'Dịp sử dụng', value: occasion, options: occasionOptions, change: setOccasion }, { label: 'Vùng miền', value: region, options: regionOptions, change: setRegion }, { label: 'Phong cách', value: style, options: styleOptions, change: setStyle }]).map(field => <label key={field.label} className="block text-[11px] text-stone-500">{field.label}<select aria-label={field.label} value={field.value} onChange={event => { field.change(event.target.value); setSaveMessage(''); }} className="mt-1.5 w-full rounded-lg border border-stone-200 bg-white p-2 text-xs text-stone-900">{Array.from(new Set([...field.options, field.value])).map(value => <option key={value}>{value}</option>)}</select></label>)}</div>}
          </div>
        </section>
        <section className={`hidden max-h-[42%] min-h-0 shrink-0 flex-col rounded-2xl border p-4 lg:flex ${mobilePanel === 'context' ? '!flex' : ''} ${statusClass}`} aria-live="polite" data-cultural-check data-status={validation?.status || (validationError ? 'ERROR' : 'PENDING')}>
          <h2 className="mb-2 flex shrink-0 items-center gap-2 text-xs font-semibold">{validating ? <Loader2 size={15} className="animate-spin" /> : validation?.status === 'COMPLIANT' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}{statusText}</h2>
          <div className="min-h-0 overflow-y-auto overscroll-contain text-[11px] leading-relaxed">
            {validationError && <><p>{validationError}</p><button onClick={() => setCheckAttempt(value => value + 1)} className="mt-2 underline">Kiểm tra lại</button></>}
            {validation && <><div className="space-y-2">{validation.issues.map(issue => <p key={issue}>{issue}</p>)}</div>{validation.issues.length > 0 && <button onClick={autoFix} className="my-2 rounded-lg border border-current/20 bg-white/70 px-3 py-2 text-[10px] font-semibold">Điều chỉnh phối đồ</button>}<p className="mt-1 text-[10px] opacity-70">Đối chiếu các quy tắc hiện có, không phải chứng nhận phục dựng.</p><details className="mt-2"><summary className="cursor-pointer text-[10px] underline underline-offset-2">Ghi chú & nguồn tham khảo</summary><div className="mt-2 space-y-2">{validation.notes.map(note => <p key={note}>{note}</p>)}{validation.sources.map((source, index) => <a key={index} href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">{source.title}<ExternalLink size={12} /></a>)}</div></details></>}
          </div>
        </section>
      </aside>
    </div>
  </div>;
}

export default function StudioPage() {
  return <Suspense fallback={<p className="py-16 text-center text-stone-500">Đang mở Studio…</p>}><StudioContent /></Suspense>;
}
