'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { validateCulturalOutfit, saveOutfit } from '@/services/outfitApi';
import { CulturalValidationResponse } from '@/types';
import { VirtualMannequin } from '@/components/VirtualMannequin';
import { Palette, ShieldCheck, Bookmark, CheckCircle, AlertTriangle, AlertCircle, Loader2, Shirt, ExternalLink } from 'lucide-react';

function StudioContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated, openAuthModal } = useAuth();

  // Outfit Studio customization state
  const [outfitName, setOutfitName] = useState('Phối Đồ Tự Chọn Việt Phục');
  const [primaryGarment, setPrimaryGarment] = useState('Áo Nhật Bình');
  const [selectedColor, setSelectedColor] = useState('Màu Đỏ Nhạt');
  const [occasion, setOccasion] = useState('Lễ cưới truyền thống');
  const [region, setRegion] = useState('Miền Trung (Hoàng gia Huế)');
  const [style, setStyle] = useState('Cổ điển Hoàng gia');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(['Khăn đóng chỉ vàng', 'Guốc thêu']);

  // Validation response state
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<CulturalValidationResponse | null>(null);

  // Save outfit state
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  const garmentOptions = [
    'Áo Nhật Bình',
    'Áo Giao Lĩnh',
    'Áo Tấc (Áo Ngũ Thân)',
    'Áo Dài Truyền Thống',
    'Áo Ngũ Thân Tay Thụt',
  ];

  const colorOptions = [
    { label: 'Màu Đỏ Nhạt', hex: '#C0392B' },
    { label: 'Màu Hoàng Vàng', hex: '#D4AF37' },
    { label: 'Màu Xanh Cổ Vịt', hex: '#1E4D2B' },
    { label: 'Màu Trắng Tơ Tằm', hex: '#FFFFFF' },
    { label: 'Màu Xanh Lam Phủ', hex: '#1A365D' },
  ];

  const accessoryOptions = [
    'Khăn đóng chỉ vàng',
    'Mấn thêu hoa',
    'Vòng cổ ngọc trai',
    'Nón lá xứ Huế',
    'Túi gấm thắt lưng',
    'Hài thêu nhung',
    'Quạt xếp trầm hương',
  ];

  // Initialize from search params if coming from Onboarding
  useEffect(() => {
    const garmentParam = searchParams.get('garment');
    const nameParam = searchParams.get('name');
    const occasionParam = searchParams.get('occasion');
    const regionParam = searchParams.get('region');
    const styleParam = searchParams.get('style');

    if (garmentParam) setPrimaryGarment(garmentParam);
    if (nameParam) setOutfitName(nameParam);
    if (occasionParam) setOccasion(occasionParam);
    if (regionParam) setRegion(regionParam);
    if (styleParam) setStyle(styleParam);
  }, [searchParams]);

  // Automatic trigger cultural validation on outfit change
  const handleValidate = async () => {
    setValidating(true);
    try {
      const res = await validateCulturalOutfit({
        garment: primaryGarment,
        color: selectedColor,
        occasion,
        region,
        accessories: selectedAccessories,
      });

      if (res.success && res.data) {
        setValidationResult(res.data);
      }
    } catch (e) {
      console.error('Validation error', e);
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => {
    handleValidate();
  }, [primaryGarment, selectedColor, occasion, region, selectedAccessories]);

  const toggleAccessory = (acc: string) => {
    if (selectedAccessories.includes(acc)) {
      setSelectedAccessories(selectedAccessories.filter((a) => a !== acc));
    } else {
      setSelectedAccessories([...selectedAccessories, acc]);
    }
  };

  const handleSaveOutfit = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setSaving(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    try {
      const res = await saveOutfit({
        name: outfitName,
        occasion,
        region,
        style,
        primaryGarment,
        colors: [selectedColor],
        accessories: selectedAccessories,
        culturalNotes: validationResult?.notes?.join('; ') || 'Đã kiểm tra chuẩn mực văn hóa.',
      });

      if (res.success) {
        setSaveSuccessMsg('Đã lưu thành công bộ trang phục vào Lookbook cá nhân của bạn!');
      } else {
        setSaveErrorMsg(res.error?.message || 'Lỗi khi lưu bộ trang phục.');
      }
    } catch (err: any) {
      setSaveErrorMsg('Không thể kết nối máy chủ backend');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-amber-900 text-xs font-semibold">
            <Palette className="w-3.5 h-3.5" />
            <span>Studio Phối Đồ Tương Tác</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-red-950 mt-1">Outfit Customization Studio</h1>
        </div>

        <button
          onClick={handleSaveOutfit}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
          <span>{isAuthenticated ? 'Lưu Phối Đồ Vào Lookbook' : 'Đăng nhập để Lưu Phối Đồ'}</span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-3 text-emerald-900 text-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{saveSuccessMsg}</span>
        </div>
      )}

      {saveErrorMsg && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-xl flex items-center space-x-3 text-red-900 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{saveErrorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customization Workspace - Left (2 cols) */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-amber-200 shadow-sm">
          {/* Outfit Name Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Tên Phối Đồ Cá Nhân
            </label>
            <input
              type="text"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl font-serif font-bold text-stone-900 text-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Garment Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              1. Chọn Loại Y Phục Chống
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {garmentOptions.map((g) => (
                <button
                  key={g}
                  onClick={() => setPrimaryGarment(g)}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                    primaryGarment === g
                      ? 'border-red-800 bg-red-50 text-red-900 font-bold shadow-sm'
                      : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:border-amber-300'
                  }`}
                >
                  <Shirt className="w-4 h-4 mb-1 text-amber-700" />
                  <span>{g}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              2. Tông Màu Chủ Đạo
            </label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setSelectedColor(c.label)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center space-x-2 transition-all ${
                    selectedColor === c.label
                      ? 'border-amber-700 bg-amber-50 text-amber-900 font-bold shadow-sm'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }}></span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accessories Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              3. Chọn Phụ Kiện Kèm Theo
            </label>
            <div className="flex flex-wrap gap-2">
              {accessoryOptions.map((acc) => {
                const isSelected = selectedAccessories.includes(acc);
                return (
                  <button
                    key={acc}
                    onClick={() => toggleAccessory(acc)}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-red-800 bg-red-800 text-amber-200 font-semibold'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{acc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occasion & Region Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Bối Cảnh Nghi Lễ
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded-lg text-xs"
              >
                <option value="Lễ cưới truyền thống">Lễ cưới truyền thống</option>
                <option value="Dịp Tết Nguyên Đán">Dịp Tết Nguyên Đán</option>
                <option value="Chụp ảnh di sản / nghệ thuật">Chụp ảnh di sản / nghệ thuật</option>
                <option value="Sinh hoạt hằng ngày">Sinh hoạt hằng ngày</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Vùng Miền Văn Hóa
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded-lg text-xs"
              >
                <option value="Miền Bắc">Miền Bắc</option>
                <option value="Miền Trung (Hoàng gia Huế)">Miền Trung (Hoàng gia Huế)</option>
                <option value="Miền Nam">Miền Nam</option>
              </select>
            </div>
          </div>
        </div>

        {/* Virtual Mannequin & Real-time Cultural Validation Card - Right (1 col) */}
        <div className="space-y-6">
          {/* Virtual Mannequin Rendering */}
          <VirtualMannequin
            garment={primaryGarment}
            colorName={selectedColor}
            colorHex={colorOptions.find((c) => c.label === selectedColor)?.hex || '#C0392B'}
            accessories={selectedAccessories}
            region={region}
            occasion={occasion}
            isCompliant={validationResult?.status === 'COMPLIANT'}
          />

          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-base text-stone-900">Kiểm Định Chuẩn Mực Văn Hóa</h3>
              </div>
              {validating && <Loader2 className="w-4 h-4 animate-spin text-amber-700" />}
            </div>

            {validationResult ? (
              <div className="space-y-4">
                {/* Status Badge */}
                <div
                  className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-bold ${
                    validationResult.status === 'COMPLIANT'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : validationResult.status === 'CAUTION'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  {validationResult.status === 'COMPLIANT' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  {validationResult.status === 'CAUTION' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  {validationResult.status === 'NON_COMPLIANT' && <AlertCircle className="w-4 h-4 text-red-600" />}
                  <span>
                    Trạng thái: {validationResult.status === 'COMPLIANT' ? 'Phù hợp nghi thức' : validationResult.status === 'CAUTION' ? 'Lưu ý bối cảnh' : 'Chưa phù hợp quy chuẩn'}
                  </span>
                </div>

                {/* Issues if any */}
                {validationResult.issues && validationResult.issues.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-red-800">Lưu ý & Khuyến nghị:</p>
                    <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                      {validationResult.issues.map((iss, idx) => (
                        <li key={idx}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cultural Notes */}
                {validationResult.notes && validationResult.notes.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-stone-800">Ghi chú di sản:</p>
                    <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs text-stone-600 border border-stone-200">
                      {validationResult.notes.map((note, idx) => (
                        <p key={idx}>• {note}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources & Citations */}
                {validationResult.sources && validationResult.sources.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">Trích dẫn sử liệu xác thực:</p>
                    {validationResult.sources.map((src, idx) => (
                      <div key={idx} className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200 text-xs space-y-0.5">
                        <p className="font-bold text-amber-950">{src.title}</p>
                        <p className="text-[10px] text-stone-500">NXB/Tác giả: {src.publisher}</p>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-[10px] text-amber-800 hover:underline font-semibold space-x-1"
                          >
                            <span>Xem tham khảo</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic">Đang cập nhật đánh giá văn hóa...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="py-16 text-center text-stone-500 space-y-2">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-700" />
        <p className="text-xs font-medium">Đang tải Studio Phối Đồ...</p>
      </div>
    }>
      <StudioContent />
    </Suspense>
  );
}
