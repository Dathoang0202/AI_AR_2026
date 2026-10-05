'use client';

import { FormEvent, Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { recommendOutfit } from '@/services/outfitApi';
import { OutfitRecommendationResponse } from '@/types';
import { ColorPalette } from '@/components/wardrobe/ColorPalette';
import { ArtifactImage } from '@/components/museum/ArtifactImage';
import { colorName, occasionOptions, regionOptions, styleOptions, toColorHex } from '@/lib/outfit';

const occasionNotes = ['Trang trọng, đậm nét truyền thống', 'Sum vầy và du xuân', 'Kể chuyện qua từng nếp áo', 'Chỉn chu trong không gian nghi lễ', 'Gần gũi, thoải mái và có điểm nhấn', 'Nhẹ nhàng cho những ngày thường'];
const styleNotes = ['Trang trọng · tinh tế', 'Thanh nhã · điềm đạm', 'Mềm mại · hiện đại', 'Mộc mạc · gần gũi'];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [occasion, setOccasion] = useState(occasionOptions[0]);
  const [region, setRegion] = useState(regionOptions[0]);
  const [style, setStyle] = useState(styleOptions[0]);
  const [colors, setColors] = useState(['#C0392B', '#D4AF37']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<OutfitRecommendationResponse[] | null>(null);

  useEffect(() => {
    setGender(searchParams.get('gender') === 'male' ? 'male' : 'female');
    const nextOccasion = searchParams.get('occasion');
    const nextRegion = searchParams.get('region');
    const nextStyle = searchParams.get('style');
    if (nextOccasion && occasionOptions.includes(nextOccasion)) setOccasion(nextOccasion);
    if (nextRegion && regionOptions.includes(nextRegion)) setRegion(nextRegion);
    if (nextStyle && styleOptions.includes(nextStyle)) setStyle(nextStyle);
    try {
      const palette = JSON.parse(searchParams.get('colors') || 'null');
      if (Array.isArray(palette)) setColors(Array.from(new Set(palette.filter(value => typeof value === 'string').map(toColorHex).filter((value): value is string => !!value))).slice(0, 8));
    } catch {}
    setResults(null);
  }, [searchParams]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError('');
    try {
      // Start with context only. The recommendation service chooses from the museum catalog.
      const response = await recommendOutfit({ occasion, region, style, gender, preferredColors: colors });
      if (response.success && response.data?.length) {
        setResults(response.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else setError(response.error?.message || 'Chưa có y phục phù hợp. Hãy thử một bối cảnh khác.');
    } finally { setLoading(false); }
  }

  function tryOutfit(item: OutfitRecommendationResponse) {
    const query = new URLSearchParams({ garmentId: String(item.culturalItemId), name: item.name, occasion, region, style, gender, colors: JSON.stringify(item.colors), accessories: JSON.stringify(item.accessories) });
    router.push(`/studio?${query}`);
  }

  return <div className="space-y-7 pb-8">
    <header className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end">
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.18em] text-amber-800">01 Bối cảnh <span className="mx-2 text-stone-300">/</span> 02 Gợi ý <span className="mx-2 text-stone-300">/</span> 03 Phòng phối đồ</p>
        <h1 className="font-serif text-3xl font-semibold text-red-950 md:text-4xl">{results ? 'Những bộ phối dành cho bạn' : 'Bạn sẽ mặc trong dịp nào?'}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-500">{results ? 'Chọn một gợi ý để thử màu và phụ kiện trong Studio.' : 'Bắt đầu từ bối cảnh và phong cách. Chúng mình sẽ gợi ý y phục từ bộ sưu tập bảo tàng.'}</p>
      </div>
      <Link href="/studio" className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-semibold text-amber-800">Tự phối trong Studio <ArrowUpRight size={15} /></Link>
    </header>

    {!results ? <form onSubmit={submit}>
      <fieldset disabled={loading} className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-amber-800">01 · BỐI CẢNH</p>
          <h2 className="mb-5 font-serif text-2xl font-semibold">Một dịp, một câu chuyện</h2>
          <div className="grid gap-3 sm:grid-cols-2" aria-label="Dịp sử dụng">
            {occasionOptions.map((value, index) => <button key={value} type="button" aria-pressed={occasion === value} onClick={() => setOccasion(value)} className={`relative rounded-xl border p-4 text-left transition ${occasion === value ? 'border-red-800 bg-red-50/50 ring-1 ring-red-800' : 'border-stone-200 hover:border-amber-700'}`}>
              <span className="mb-3 flex items-center justify-between text-[10px] text-amber-800">0{index + 1}{occasion === value && <Check size={14} />}</span>
              <span className="block pr-1 text-xs font-semibold text-stone-900">{value}</span>
              <span className="mt-2 block text-[11px] leading-relaxed text-stone-500">{occasionNotes[index]}</span>
            </button>)}
          </div>
          <label className="mt-6 block text-xs text-stone-600">Không gian văn hóa
            <select aria-label="Vùng miền" value={region} onChange={event => setRegion(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm text-stone-900">{regionOptions.map(value => <option key={value}>{value}</option>)}</select>
          </label>
          <fieldset className="mt-5"><legend className="mb-2 text-xs text-stone-600">Dáng ma-nơ-canh mặc thử</legend>
            <div className="grid grid-cols-2 gap-2">{(['female', 'male'] as const).map(value => <button key={value} type="button" data-gender={value} aria-pressed={gender === value} onClick={() => setGender(value)} className={`rounded-xl border px-4 py-2.5 text-xs ${gender === value ? 'border-red-800 bg-red-50 font-semibold text-red-900' : 'border-stone-200 text-stone-500'}`}>{value === 'female' ? 'Nữ' : 'Nam'}</button>)}</div>
          </fieldset>
        </section>
        <div className="space-y-5">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-amber-800">02 · PHONG CÁCH</p>
            <h2 className="mb-5 font-serif text-2xl font-semibold">Dấu ấn bạn yêu thích</h2>
            <div className="grid grid-cols-2 gap-3" aria-label="Phong cách">{styleOptions.map((value, index) => <button key={value} type="button" aria-pressed={style === value} onClick={() => setStyle(value)} className={`rounded-xl border p-3 text-left ${style === value ? 'border-red-800 bg-red-50/50 text-red-950' : 'border-stone-200 text-stone-600'}`}><span className="block text-xs font-semibold">{value}</span><span className="mt-2 block text-[10px] text-stone-500">{styleNotes[index]}</span></button>)}</div>
          </section>
          <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-amber-800">03 · MÀU SẮC</p>
            <h2 className="mb-2 font-serif text-2xl font-semibold">Bảng màu của bạn</h2>
            <p className="mb-5 text-xs leading-relaxed text-stone-500">Chọn những màu bạn thích. Mỗi gợi ý sẽ tạo một cách phối riêng; màu đứng đầu từng gợi ý sẽ được mặc thử trong Studio.</p>
            <ColorPalette values={colors} onChange={setColors} multiple />
          </section>
          <div>
            {error && <p role="alert" className="mb-3 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-red-950 disabled:opacity-50">{loading ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}{loading ? 'Đang tìm bộ phối…' : 'Khám phá gợi ý phối đồ'}<ArrowRight size={16} /></button>
          </div>
        </div>
      </fieldset>
    </form> : <section className="space-y-6" aria-label="Gợi ý phối đồ">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#f2ede4] p-5"><p className="text-xs leading-relaxed text-stone-600">{occasion} · {region}<br /><strong className="mt-1 inline-block text-stone-800">{style} · Dáng {gender === 'male' ? 'nam' : 'nữ'}</strong></p><button onClick={() => setResults(null)} className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs"><RotateCcw size={14} />Đổi bối cảnh</button></div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{results.map((item, index) => <article key={item.culturalItemId} data-recommendation-id={item.culturalItemId} className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <Link href={`/cultural/${item.culturalItemId}`} target="_blank" rel="noopener noreferrer" aria-label={`Xem ${item.primaryGarment} trong bảo tàng (mở tab mới)`} className="relative block h-64 bg-[#f2ede4] [&_img]:h-full [&_img]:w-full [&_img]:object-contain"><ArtifactImage name={item.primaryGarment} src={item.imageUrl} /><span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[11px] text-amber-900">Xem trong bảo tàng <ArrowUpRight size={12} /></span></Link>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div><p className="text-[10px] uppercase tracking-wide text-amber-800">Gợi ý {index + 1} · {item.historicalPeriod}</p><h2 className="mt-2 font-serif text-xl font-semibold text-red-950">{item.primaryGarment}</h2></div>
          {!!item.matchReasons?.length && <div className="rounded-xl bg-amber-50/70 p-3"><p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900">Vì sao phù hợp</p><ul className="space-y-1 text-xs leading-relaxed text-stone-700">{item.matchReasons.map(reason => <li key={reason}>• {reason}</li>)}</ul></div>}
          <p className="line-clamp-3 text-xs leading-relaxed text-stone-500">{item.culturalContext}</p>
          <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-stone-500">Màu chính → màu điểm</p><div className="flex flex-wrap gap-2">{item.colors.map((hex, colorIndex) => <span key={`${hex}-${colorIndex}`} title={colorName(hex)} className="inline-flex items-center gap-1 rounded-full border border-stone-200 px-2 py-1 text-[11px] text-stone-700"><span className="h-4 w-4 rounded-full border border-stone-200" style={{ backgroundColor: hex }} />{colorName(hex)}</span>)}</div></div>
          <p className="text-xs leading-relaxed text-stone-600"><strong>Phụ kiện:</strong> {item.accessories.join(', ') || 'Tự chọn trong Studio'}</p>
          <p className="text-xs leading-relaxed text-stone-500">{item.stylingAdvice}</p>
          <button onClick={() => tryOutfit(item)} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-red-900 px-4 py-3 text-xs font-semibold text-white">Mặc thử trong Studio <ArrowRight size={15} /></button>
        </div>
      </article>)}</div>
    </section>}
  </div>;
}

export default function OnboardingPage() {
  return <Suspense fallback={<p className="py-16 text-center text-stone-500">Đang mở gợi ý phối đồ…</p>}><OnboardingContent /></Suspense>;
}
