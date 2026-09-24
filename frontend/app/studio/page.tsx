'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { validateCulturalOutfit, saveOutfit } from '@/services/outfitApi';
import { CulturalValidationResponse } from '@/types';
import { VirtualMannequin } from '@/components/VirtualMannequin';
import {
  Palette,
  ShieldCheck,
  Bookmark,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Loader2,
  Shirt,
  ExternalLink,
  RefreshCw,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react';

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
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([
    'Khăn đóng chỉ vàng',
    'Guốc thêu',
  ]);

  // Toggle Visibility for Middle Studio Canvas (Ẩn / Hiện Studio Trung Tâm)
  const [isStudioVisible, setIsStudioVisible] = useState<boolean>(true);

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

  // Automatic trigger cultural validation on outfit/gender change
  const handleValidate = async () => {
    setValidating(true);
    try {
      const res = await validateCulturalOutfit({
        garment: primaryGarment,
        color: selectedColor,
        occasion,
        region,
        gender,
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
  }, [primaryGarment, selectedColor, occasion, region, gender, selectedAccessories]);

  const toggleAccessory = (acc: string) => {
    if (selectedAccessories.includes(acc)) {
      setSelectedAccessories(selectedAccessories.filter((a) => a !== acc));
    } else {
      setSelectedAccessories([...selectedAccessories, acc]);
    }
  };

  // Auto-Fix 1-click feature for Cultural Violations
  const handleAutoFix = () => {
    if (primaryGarment === 'Áo Nhật Bình' && gender === 'male') {
      setGender('female');
    }
    if (gender === 'male') {
      setSelectedAccessories((prev) => prev.filter((a) => !a.includes('Mấn')));
    }
    if (selectedColor === 'Màu Trắng Tơ Tằm' && occasion.includes('cưới')) {
      setSelectedColor('Màu Đỏ Nhạt');
    }
    if (primaryGarment === 'Áo Nhật Bình' && occasion.includes('hằng ngày')) {
      setOccasion('Lễ cưới truyền thống');
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
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Action Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-amber-900 text-xs font-semibold">
            <Palette className="w-3.5 h-3.5" />
            <span>Phòng Thay Đồ Ảo & Thẩm Định Nghi Lễ</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-red-950 mt-1">
            Studio Phối Đồ Việt Phục
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Thiết kế y phục cổ truyền với ma-nơ-canh ảo trung tâm và trí tuệ thẩm định di sản real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle Button: Show / Hide Central Mannequin Studio */}
          <button
            onClick={() => setIsStudioVisible(!isStudioVisible)}
            className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl border border-stone-300 text-xs transition-all flex items-center space-x-2"
          >
            {isStudioVisible ? <EyeOff className="w-4 h-4 text-stone-600" /> : <Eye className="w-4 h-4 text-amber-700" />}
            <span>{isStudioVisible ? 'Ẩn Studio Trung Tâm' : 'Hiện Ma-nơ-canh Studio'}</span>
          </button>

          <button
            onClick={handleSaveOutfit}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className="w-4 h-4" />}
            <span>{isAuthenticated ? 'Lưu Phối Đồ Vào Lookbook' : 'Đăng nhập để Lưu Phối Đồ'}</span>
          </button>
        </div>
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

      {/* DYNAMIC LAYOUT: SMOOTH TRANSITION BETWEEN 3-COLUMN CENTRAL STUDIO AND CLEAN 2-COLUMN VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT CONTROLS WORKSPACE (Adapts to 4 or 6 Cols) */}
        {/* ========================================================= */}
        <div className={`${isStudioVisible ? 'lg:col-span-4' : 'lg:col-span-6'} space-y-6 bg-white p-6 rounded-2xl border border-amber-200 shadow-sm transition-all duration-500`}>
          <h2 className="font-serif font-bold text-lg text-stone-900 pb-2 border-b border-stone-100">
            1. Tùy Chỉnh Y Phục & Phụ Kiện
          </h2>

          {/* Outfit Name Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Tên Phối Đồ Cá Nhân
            </label>
            <input
              type="text"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-xl font-serif font-bold text-stone-900 text-base focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Garment Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Chọn Loại Cổ Phục / Y Phục Chính
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
              Tông Màu Chủ Đạo
            </label>
            <div className="flex flex-wrap gap-2.5">
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
                  <span
                    className="w-4 h-4 rounded-full border border-stone-300"
                    style={{ backgroundColor: c.hex }}
                  ></span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accessories Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Chọn Phụ Kiện Đi Kèm
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
                    {isSelected ? '✓ ' : '+ '}
                    {acc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occasion & Region Details */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
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
                <option value="Miền Bắc">Miền Bắc (Thăng Long / Phố cổ)</option>
                <option value="Miền Trung (Hoàng gia Huế)">Miền Trung (Hoàng gia Huế)</option>
                <option value="Miền Nam">Miền Nam (Nhà rường / Sông nước)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER VIRTUAL MANNEQUIN FITTING STUDIO (5 Cols - TOGGLEABLE) */}
        {/* ========================================================= */}
        {isStudioVisible && (
          <div className="lg:col-span-5 space-y-4 transition-all duration-500">
            <VirtualMannequin
              garment={primaryGarment}
              colorName={selectedColor}
              colorHex={colorOptions.find((c) => c.label === selectedColor)?.hex || '#C0392B'}
              accessories={selectedAccessories}
              region={region}
              occasion={occasion}
              style={style}
              gender={gender}
              onGenderChange={(g) => setGender(g)}
              validationResult={validationResult}
              onAutoFix={handleAutoFix}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT CULTURAL VALIDATION & CITATIONS CARD (Adapts to 3 or 6 Cols) */}
        {/* ========================================================= */}
        <div className={`${isStudioVisible ? 'lg:col-span-3' : 'lg:col-span-6'} space-y-6 transition-all duration-500`}>
          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Thẩm Định Di Sản
                </h3>
              </div>
              {validating && <Loader2 className="w-4 h-4 animate-spin text-amber-700" />}
            </div>

            {validationResult ? (
              <div className="space-y-4">
                {/* Status Badge */}
                <div
                  className={`p-3.5 rounded-xl border flex items-start space-x-2.5 text-xs font-bold ${
                    validationResult.status === 'COMPLIANT'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : validationResult.status === 'CAUTION'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-red-50 border-red-300 text-red-950'
                  }`}
                >
                  {validationResult.status === 'COMPLIANT' && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {validationResult.status === 'CAUTION' && (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  {validationResult.status === 'NON_COMPLIANT' && (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-serif font-bold">
                      {validationResult.status === 'COMPLIANT'
                        ? '✓ Phù hợp nghi thức di sản'
                        : validationResult.status === 'CAUTION'
                        ? '⚠️ Cảnh báo bối cảnh văn hóa'
                        : '❌ Vi phạm quy chuẩn nghi lễ'}
                    </p>
                    {validationResult.status === 'NON_COMPLIANT' && (
                      <p className="text-[10px] text-red-800 font-normal mt-0.5">
                        Phát hiện điểm chưa chuẩn mực lịch sử.
                      </p>
                    )}
                  </div>
                </div>

                {/* Violation Issues Display */}
                {validationResult.issues && validationResult.issues.length > 0 && (
                  <div className="p-3.5 bg-red-50/90 rounded-xl border border-red-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-red-900 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5 text-red-700" />
                        <span>Chi tiết điểm Vi Phạm / Cảnh Báo:</span>
                      </p>
                    </div>
                    <ul className="list-disc list-inside text-xs text-red-800 space-y-1.5 leading-relaxed">
                      {validationResult.issues.map((iss, idx) => (
                        <li key={idx} className="font-medium">
                          {iss}
                        </li>
                      ))}
                    </ul>

                    {/* 1-Click Auto-Fix Button */}
                    <button
                      onClick={handleAutoFix}
                      className="w-full mt-2 py-2 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-amber-100 font-bold rounded-lg text-xs shadow transition-all flex items-center justify-center space-x-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Tự Động Sửa Cho Chuẩn Văn Hóa</span>
                    </button>
                  </div>
                )}

                {/* Cultural Notes */}
                {validationResult.notes && validationResult.notes.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-stone-800 flex items-center space-x-1">
                      <Info className="w-3.5 h-3.5 text-amber-700" />
                      <span>Ghi chú tri thức cổ phục:</span>
                    </p>
                    <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs text-stone-600 border border-stone-200">
                      {validationResult.notes.map((note, idx) => (
                        <p key={idx}>• {note}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Historical Sources & Citations */}
                {validationResult.sources && validationResult.sources.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                      Trích dẫn sử liệu xác thực:
                    </p>
                    {validationResult.sources.map((src, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 text-xs space-y-0.5"
                      >
                        <p className="font-bold text-amber-950">{src.title}</p>
                        <p className="text-[10px] text-stone-500">Tác giả/NXB: {src.publisher}</p>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-[10px] text-amber-800 hover:underline font-semibold space-x-1 mt-1"
                          >
                            <span>Xem tham khảo sử liệu</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic">Đang phân tích di sản văn hóa...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-stone-500 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-700" />
          <p className="text-xs font-medium">Đang khởi tạo Studio Phối Đồ Trung Tâm...</p>
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
