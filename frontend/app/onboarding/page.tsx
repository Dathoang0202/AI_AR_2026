'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recommendOutfit } from '@/services/outfitApi';
import { OutfitRecommendationResponse } from '@/types';
import { Sparkles, MapPin, Calendar, Palette, ArrowRight, Loader2, AlertCircle, Shirt, CheckCircle2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  // Questionnaire form states
  const [occasion, setOccasion] = useState('Lễ cưới truyền thống');
  const [region, setRegion] = useState('Miền Bắc');
  const [style, setStyle] = useState('Cổ điển Hoàng gia');
  const [preferredColors, setPreferredColors] = useState<string[]>(['Màu Đỏ Nhạt', 'Màu Vàng']);
  const [rentalIntent, setRentalIntent] = useState('RENT');

  // Async UI states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<OutfitRecommendationResponse[] | null>(null);

  const occasionOptions = [
    'Lễ cưới truyền thống',
    'Dịp Tết Nguyên Đán',
    'Chụp ảnh di sản / nghệ thuật',
    'Nghi lễ / Dâng hương',
    'Dạo phố / Sự kiện văn hóa',
  ];

  const regionOptions = ['Miền Bắc', 'Miền Trung (Hoàng gia Huế)', 'Miền Nam'];

  const styleOptions = [
    'Cổ điển Hoàng gia',
    'Nho nhã Sĩ phu',
    'Tân thời Duyên dáng',
    'Dân gian Mộc mạc',
  ];

  const colorOptions = [
    { label: 'Màu Đỏ Nhạt', hex: '#C0392B' },
    { label: 'Màu Vàng', hex: '#D4AF37' },
    { label: 'Màu Xanh Cổ Vịt', hex: '#1E4D2B' },
    { label: 'Màu Trắng Tơ Tằm', hex: '#FFFFFF' },
    { label: 'Màu Xanh Lam', hex: '#1A365D' },
  ];

  const toggleColor = (colorLabel: string) => {
    if (preferredColors.includes(colorLabel)) {
      setPreferredColors(preferredColors.filter((c) => c !== colorLabel));
    } else {
      setPreferredColors([...preferredColors, colorLabel]);
    }
  };

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await recommendOutfit({
        occasion,
        region,
        style,
        preferredColors,
        rentalIntent,
      });

      if (res.success && res.data) {
        setRecommendations(res.data);
      } else {
        setErrorMsg(res.error?.message || 'Không thể lấy gợi ý trang phục từ máy chủ.');
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối máy chủ REST API');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecommendation = (item: OutfitRecommendationResponse) => {
    const query = new URLSearchParams({
      garment: item.primaryGarment,
      name: item.name,
      occasion,
      region,
      style,
      colors: item.colors.join(','),
      accessories: item.accessories.join(','),
    }).toString();
    router.push(`/studio?${query}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-100 border border-red-200 rounded-full text-red-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bước 1: Khảo Sát Nhu Cầu Phối Đồ</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-red-950">Tìm Kiếm Gợi Ý Việt Phục Chuẩn Nhu Cầu</h1>
        <p className="text-xs text-stone-600 max-w-xl mx-auto">
          Chọn các tiêu chí bối cảnh, vùng miền và sở thích màu sắc để thuật toán văn hóa sinh ra các gợi ý trang phục tối ưu.
        </p>
      </div>

      {!recommendations ? (
        <form onSubmit={handleRecommend} className="bg-white rounded-2xl border border-amber-200 p-6 md:p-8 shadow-sm space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-800 text-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Lỗi xử lý API</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Occasion Selection */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 font-serif font-bold text-stone-900 text-sm">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>1. Bạn dự định mặc Việt Phục cho dịp nào?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {occasionOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setOccasion(opt)}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                    occasion === opt
                      ? 'border-red-800 bg-red-50 text-red-900 font-bold shadow-sm'
                      : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:border-amber-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Region Selection */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 font-serif font-bold text-stone-900 text-sm">
              <MapPin className="w-4 h-4 text-amber-700" />
              <span>2. Vùng miền / Phong cách văn hóa vùng</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {regionOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRegion(opt)}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                    region === opt
                      ? 'border-red-800 bg-red-50 text-red-900 font-bold shadow-sm'
                      : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:border-amber-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 font-serif font-bold text-stone-900 text-sm">
              <Shirt className="w-4 h-4 text-amber-700" />
              <span>3. Định hình phong cách mong muốn</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {styleOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStyle(opt)}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                    style === opt
                      ? 'border-red-800 bg-red-50 text-red-900 font-bold shadow-sm'
                      : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:border-amber-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Color Preferences */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 font-serif font-bold text-stone-900 text-sm">
              <Palette className="w-4 h-4 text-amber-700" />
              <span>4. Gam màu ưa thích</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((c) => {
                const isSelected = preferredColors.includes(c.label);
                return (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => toggleColor(c.label)}
                    className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center space-x-2 transition-all ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50 text-amber-900 font-bold shadow-sm'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }}></span>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Hệ thống đang phân tích thuật toán văn hóa...</span>
              </>
            ) : (
              <>
                <span>Nhận Gợi Ý Phối Đồ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Recommendations Results Display */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-amber-100/60 border border-amber-300 p-4 rounded-xl">
            <div>
              <p className="text-xs text-amber-900 font-bold">Kết quả phân tích cho:</p>
              <p className="text-sm font-serif text-stone-800 font-bold">{occasion} • {region} • {style}</p>
            </div>
            <button
              onClick={() => setRecommendations(null)}
              className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50"
            >
              Thay đổi tiêu chí
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded-full border border-red-200">
                      Gợi ý #{idx + 1}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">{item.historicalPeriod}</span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-red-950">{item.name}</h3>

                  <div className="p-3 bg-stone-50 rounded-xl space-y-2 text-xs text-stone-700">
                    <p><strong>Y phục chính:</strong> {item.primaryGarment}</p>
                    <p><strong>Cấu thành:</strong> {item.garments.join(', ')}</p>
                    <p><strong>Phụ kiện đi kèm:</strong> {item.accessories.join(', ')}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-stone-800">Bảng phối màu gợi ý:</p>
                    <div className="flex space-x-2">
                      {item.colors.map((c, cIdx) => (
                        <div key={cIdx} className="flex items-center space-x-1 border border-stone-200 px-2 py-0.5 rounded text-[10px] bg-stone-50">
                          <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c }}></span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50">
                    "{item.culturalContext}"
                  </p>
                </div>

                <button
                  onClick={() => handleSelectRecommendation(item)}
                  className="w-full py-2.5 bg-red-800 hover:bg-red-900 text-amber-200 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Chọn & Tùy Chỉnh Trong Studio</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
