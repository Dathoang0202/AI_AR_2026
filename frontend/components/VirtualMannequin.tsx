'use client';

import React, { useState, useEffect } from 'react';
import { ZoomIn, ShieldCheck, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw, X } from 'lucide-react';

interface VirtualMannequinProps {
  garment: string;
  colorName: string;
  colorHex: string;
  accessories: string[];
  region: string;
  occasion: string;
  style: string;
  gender: 'female' | 'male';
  onGenderChange: (gender: 'female' | 'male') => void;
  validationResult?: {
    status: 'COMPLIANT' | 'CAUTION' | 'NON_COMPLIANT';
    issues: string[];
    notes: string[];
  } | null;
  onAutoFix?: () => void;
}

export const VirtualMannequin: React.FC<VirtualMannequinProps> = ({
  garment,
  colorName,
  colorHex,
  accessories,
  region,
  occasion,
  style,
  gender,
  onGenderChange,
  validationResult,
  onAutoFix,
}) => {
  const [renderMode, setRenderMode] = useState<'svg' | 'image'>('svg');
  const [zoomLevel, setZoomLevel] = useState<'full' | 'upper'>('full');
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);

  // Reset banner dismissal when outfit or validation changes
  useEffect(() => {
    setIsBannerDismissed(false);
  }, [garment, colorName, gender, accessories, occasion]);

  // Dynamic Background Theme based on Selected Region & Style
  const getThemeStyle = () => {
    if (region.includes('Bắc')) {
      return {
        bg: 'from-amber-950 via-stone-900 to-amber-900 border-amber-500/40',
        title: 'Bối Cảnh Cố Đô Thăng Long / Phố Cổ Hà Nội',
      };
    } else if (region.includes('Nam')) {
      return {
        bg: 'from-emerald-950 via-stone-900 to-amber-950 border-emerald-500/40',
        title: 'Bối Cảnh Nhà Rường Nam Bộ / Sông Nước',
      };
    } else {
      return {
        bg: 'from-red-950 via-amber-950 to-stone-950 border-amber-500/40',
        title: 'Bối Cảnh Cung Điện Hoàng Gia Huế',
      };
    }
  };

  const themeConfig = getThemeStyle();

  const isViolated = validationResult?.status === 'NON_COMPLIANT';
  const isCaution = validationResult?.status === 'CAUTION';
  const isCompliant = validationResult?.status === 'COMPLIANT';

  const hasHeadwear = accessories.some((a) =>
    a.includes('Khăn đóng') || a.includes('Mấn') || a.includes('Nón lá')
  );
  const hasNecklace = accessories.some((a) => a.includes('Vòng cổ'));
  const hasFan = accessories.some((a) => a.includes('Quạt'));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 shadow-2xl bg-stone-950 text-amber-50 transition-all duration-300">
      {/* Top Header Toolbar */}
      <div className="bg-stone-900/95 backdrop-blur-md px-4 py-3 border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="font-serif font-bold text-amber-200 uppercase tracking-wider text-[11px]">
            {themeConfig.title}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Male vs Female Mannequin Switch */}
          <div className="flex bg-stone-800 p-0.5 rounded-lg border border-stone-700 text-[11px]">
            <button
              onClick={() => onGenderChange('female')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                gender === 'female'
                  ? 'bg-gradient-to-r from-red-700 to-amber-700 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              👩 Ma-nơ-canh Nữ (Thon Gọn)
            </button>
            <button
              onClick={() => onGenderChange('male')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                gender === 'male'
                  ? 'bg-gradient-to-r from-blue-800 to-indigo-800 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              👨 Ma-nơ-canh Nam (Vai Rộng)
            </button>
          </div>

          {/* Mode Switch: Vector SVG vs Real Image */}
          <button
            onClick={() => setRenderMode(renderMode === 'svg' ? 'image' : 'svg')}
            className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center space-x-1 transition-all ${
              renderMode === 'image'
                ? 'bg-amber-600 border-amber-400 text-stone-950'
                : 'bg-stone-800 border-stone-700 text-amber-300 hover:bg-stone-700'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>{renderMode === 'image' ? 'Ảnh Thật' : 'Vector'}</span>
          </button>

          {/* Zoom Toggle */}
          <button
            onClick={() => setZoomLevel(zoomLevel === 'full' ? 'upper' : 'full')}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 rounded-lg border border-stone-700 text-amber-300 transition-all"
            title="Đổi góc nhìn (Toàn thân / Cận cảnh)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* STRICT FIXED-HEIGHT FITTING STUDIO CANVAS (PREVENTS JUMPING UP AND DOWN) */}
      <div
        className={`relative h-[540px] md:h-[580px] flex items-center justify-center bg-gradient-to-b ${themeConfig.bg} transition-all duration-700 overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)] [background-size:28px_28px]"></div>

        {/* FLOATING ABSOLUTE VIOLATION BANNER WITH CLOSE / DISMISS BUTTON */}
        {isViolated && !isBannerDismissed && (
          <div className="absolute top-4 left-4 right-4 z-30 bg-red-950/95 border-2 border-red-500 backdrop-blur-md p-3 rounded-xl shadow-2xl flex items-center justify-between text-xs animate-bounce">
            <div className="flex items-center space-x-2.5 text-red-200">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <p className="font-bold text-red-100">VI PHẠM QUY CHUẨN NGHI LỄ VĂN HÓA!</p>
                <p className="text-[10px] text-red-300">
                  {validationResult?.issues[0] || 'Trang phục chưa phù hợp với giới tính hoặc nghi lễ.'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              {onAutoFix && (
                <button
                  onClick={onAutoFix}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-[11px] shadow flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Tự Động Sửa</span>
                </button>
              )}
              {/* Dismiss Button */}
              <button
                onClick={() => setIsBannerDismissed(true)}
                className="p-1.5 bg-red-900/90 hover:bg-red-800 text-red-100 rounded-lg border border-red-700 text-xs font-bold transition-all"
                title="Tắt thông báo này"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Pedestal Stand Base (Fixed Position) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 h-14 rounded-[100%] bg-gradient-to-r from-amber-950 via-amber-600/40 to-amber-950 border-2 border-amber-400/40 shadow-2xl"></div>

        {/* MANNEQUIN CANVAS (FIXED ABSOLUTE CENTER - NO JUMPING) */}
        <div
          className={`absolute top-12 left-1/2 -translate-x-1/2 transition-transform duration-500 transform ${
            zoomLevel === 'upper' ? 'scale-140 translate-y-20' : 'scale-100'
          }`}
        >
          {renderMode === 'image' ? (
            /* REAL IMAGE MODE WITH OVERLAYS */
            <div className="relative w-72 h-[460px] flex items-center justify-center">
              <img
                src={
                  gender === 'male'
                    ? '/images/mannequin/male-mannequin.png'
                    : '/images/mannequin/female-mannequin.png'
                }
                alt="Mannequin Body"
                className="absolute inset-0 w-full h-full object-contain filter drop-shadow-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  setRenderMode('svg');
                }}
              />
            </div>
          ) : (
            /* HIGHLY DISTINCT MALE VS FEMALE SVG MANNEQUIN */
            <svg
              viewBox="0 0 340 540"
              className="w-72 h-[450px] md:w-84 md:h-[490px] filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
            >
              <defs>
                <linearGradient id="fabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colorHex} stopOpacity="1" />
                  <stop offset="65%" stopColor={colorHex} stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#1a0000" stopOpacity="0.95" />
                </linearGradient>

                <linearGradient id="goldBrocade" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFE082" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>

                <linearGradient id="femaleSkin" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5E6D3" />
                  <stop offset="50%" stopColor="#FFF8F0" />
                  <stop offset="100%" stopColor="#D9C3B0" />
                </linearGradient>

                <linearGradient id="maleSkin" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C69C7B" />
                  <stop offset="50%" stopColor="#E2C4A8" />
                  <stop offset="100%" stopColor="#A87C59" />
                </linearGradient>
              </defs>

              {/* MANNEQUIN BODY SILHOUETTES */}
              {gender === 'female' ? (
                /* FEMALE MANNEQUIN: SLENDER WAIST, FEMININE HEAD & HAIR BUN */
                <g id="female-mannequin-base">
                  <ellipse cx="170" cy="70" rx="20" ry="28" fill="url(#femaleSkin)" stroke="#B8860B" strokeWidth="0.8" />
                  <ellipse cx="170" cy="45" rx="14" ry="10" fill="#2B1810" />
                  <circle cx="170" cy="42" r="4" fill="#D4AF37" />
                  <rect x="164" y="98" width="12" height="24" rx="3" fill="url(#femaleSkin)" />
                  <path
                    d="M 135 122 Q 170 116 205 122 L 210 175 Q 170 205 130 175 Z"
                    fill="url(#femaleSkin)"
                    opacity="0.9"
                  />
                  <rect x="156" y="440" width="12" height="30" fill="url(#femaleSkin)" />
                  <rect x="172" y="440" width="12" height="30" fill="url(#femaleSkin)" />
                  <path d="M 152 468 L 170 468 L 168 475 L 152 475 Z" fill="#800000" stroke="#D4AF37" strokeWidth="1" />
                  <path d="M 168 468 L 186 468 L 184 475 L 168 475 Z" fill="#800000" stroke="#D4AF37" strokeWidth="1" />
                </g>
              ) : (
                /* MALE MANNEQUIN: TALL, BROAD V-TAPER MUSCULAR SHOULDERS (250px WIDE) */
                <g id="male-mannequin-base">
                  <path d="M 144 50 Q 170 42 196 50 L 198 80 Q 170 102 142 80 Z" fill="url(#maleSkin)" stroke="#B8860B" strokeWidth="1" />
                  <path d="M 144 50 C 144 32 196 32 196 50 Z" fill="#151515" />
                  <rect x="160" y="96" width="20" height="28" rx="2" fill="url(#maleSkin)" />
                  <path
                    d="M 110 120 Q 170 110 230 120 L 236 195 Q 170 208 104 195 Z"
                    fill="url(#maleSkin)"
                    opacity="0.95"
                  />
                  <rect x="150" y="440" width="16" height="35" fill="#1A1A1A" stroke="#B8860B" strokeWidth="1" />
                  <rect x="174" y="440" width="16" height="35" fill="#1A1A1A" stroke="#B8860B" strokeWidth="1" />
                </g>
              )}

              {/* LOWER TROUSERS / SKIRT LAYER */}
              <path
                d={
                  gender === 'female'
                    ? 'M 132 235 L 208 235 L 226 470 L 114 470 Z'
                    : 'M 118 235 L 222 235 L 238 475 L 102 475 Z'
                }
                fill="#FDFBF7"
                stroke="#D4AF37"
                strokeWidth="1"
              />

              {/* PRIMARY GARMENT LAYER */}
              <path
                d={
                  gender === 'female'
                    ? 'M 135 124 L 75 235 L 108 255 L 145 170 Z'
                    : 'M 110 120 L 42 235 L 82 260 L 130 170 Z'
                }
                fill="url(#fabricGrad)"
                stroke="url(#goldBrocade)"
                strokeWidth="1.8"
              />
              <path
                d={
                  gender === 'female'
                    ? 'M 205 124 L 265 235 L 232 255 L 195 170 Z'
                    : 'M 230 120 L 298 235 L 258 260 L 210 170 Z'
                }
                fill="url(#fabricGrad)"
                stroke="url(#goldBrocade)"
                strokeWidth="1.8"
              />

              {/* Distinct Main Garment Cuts */}
              {garment === 'Áo Nhật Bình' ? (
                <g>
                  <path
                    d="M 135 124 C 155 118 185 118 205 124 L 222 395 L 118 395 Z"
                    fill="url(#fabricGrad)"
                    stroke="url(#goldBrocade)"
                    strokeWidth="2"
                  />
                  <path d="M 152 120 L 188 120 L 188 235 L 152 235 Z" fill="none" stroke="url(#goldBrocade)" strokeWidth="4.5" />
                  <path d="M 155 120 L 185 120 L 185 232 L 155 232 Z" fill="#800000" opacity="0.85" />
                  <rect x="76" y="222" width="28" height="6" fill="#E74C3C" />
                  <rect x="79" y="228" width="28" height="6" fill="#F1C40F" />
                  <rect x="82" y="234" width="28" height="6" fill="#2ECC71" />

                  <rect x="236" y="222" width="28" height="6" fill="#E74C3C" />
                  <rect x="233" y="228" width="28" height="6" fill="#F1C40F" />
                  <rect x="230" y="234" width="28" height="6" fill="#2ECC71" />
                </g>
              ) : garment === 'Áo Giao Lĩnh' ? (
                <g>
                  <path
                    d={
                      gender === 'female'
                        ? 'M 135 124 C 155 118 185 118 205 124 L 225 425 L 115 425 Z'
                        : 'M 110 120 C 160 112 180 112 230 120 L 242 435 L 98 435 Z'
                    }
                    fill="url(#fabricGrad)"
                    stroke="url(#goldBrocade)"
                    strokeWidth="2"
                  />
                  <path d="M 140 121 L 198 205 L 198 420" fill="none" stroke="url(#goldBrocade)" strokeWidth="3.5" />
                  <path d="M 200 121 L 160 180" fill="none" stroke="url(#goldBrocade)" strokeWidth="3.5" />
                </g>
              ) : (
                <g>
                  <path
                    d={
                      gender === 'female'
                        ? 'M 135 124 C 155 118 185 118 205 124 L 220 440 L 120 440 Z'
                        : 'M 110 120 C 150 112 190 112 230 120 L 242 445 L 98 445 Z'
                    }
                    fill="url(#fabricGrad)"
                    stroke="url(#goldBrocade)"
                    strokeWidth="2"
                  />
                  <path d="M 156 108 Q 170 104 184 108 L 186 124 Q 170 120 154 124 Z" fill="url(#goldBrocade)" />
                  <circle cx="170" cy="132" r="3" fill="#FFF" stroke="#B8860B" strokeWidth="1" />
                  <circle cx="178" cy="150" r="3" fill="#FFF" stroke="#B8860B" strokeWidth="1" />
                  <circle cx="186" cy="168" r="3" fill="#FFF" stroke="#B8860B" strokeWidth="1" />
                  {gender === 'male' && (
                    <line x1="170" y1="132" x2="170" y2="445" stroke="url(#goldBrocade)" strokeWidth="1.5" />
                  )}
                </g>
              )}

              <circle cx="170" cy="205" r="20" fill="none" stroke="url(#goldBrocade)" strokeWidth="1.8" strokeDasharray="4 2" />

              {/* ACCESSORIES OVERLAYS */}
              {hasHeadwear && (
                <g>
                  {gender === 'female' ? (
                    <g>
                      <ellipse cx="170" cy="48" rx="28" ry="12" fill="#800000" stroke="url(#goldBrocade)" strokeWidth="2" />
                      <ellipse cx="170" cy="46" rx="24" ry="9" fill="#D4AF37" opacity="0.7" />
                    </g>
                  ) : (
                    <g>
                      <ellipse cx="170" cy="42" rx="34" ry="11" fill="#111111" stroke="url(#goldBrocade)" strokeWidth="2" />
                      <rect x="138" y="42" width="64" height="14" fill="#222222" rx="2" stroke="url(#goldBrocade)" strokeWidth="1.2" />
                    </g>
                  )}
                </g>
              )}

              {hasNecklace && (
                <path d="M 152 130 Q 170 165 188 130" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="1 3" />
              )}

              {hasFan && (
                <g transform="translate(225, 235) rotate(-15)">
                  <path d="M 0 0 L -28 -38 A 38 38 0 0 1 28 -38 Z" fill="#D4AF37" stroke="#8B0000" strokeWidth="1" />
                </g>
              )}
            </svg>
          )}
        </div>

        {/* IMPERIAL CULTURAL STAMP OR VIOLATION STAMP */}
        {isViolated ? (
          <div className="absolute bottom-4 right-4 bg-red-950/95 border-2 border-red-500 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-2xl animate-bounce flex items-center space-x-2 text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="font-serif font-bold text-red-100 text-xs">VI PHẠM QUY CHUẨN VĂN HÓA</p>
              <p className="text-[9px] text-red-300">Không phù hợp nghi lễ di sản</p>
            </div>
          </div>
        ) : isCompliant ? (
          <div className="absolute bottom-4 right-4 bg-amber-950/90 border border-amber-400/60 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center space-x-2 text-xs shadow-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-serif font-bold text-amber-200 text-xs">Đã Thẩm Định Nghi Lễ</p>
              <p className="text-[9px] text-amber-400/80">Chuẩn mực Cố Đô Huế</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer Info Bar */}
      <div className="p-4 bg-stone-900 border-t border-amber-500/20 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] uppercase text-stone-400 block font-semibold">Ma-nơ-canh Hiển Thị:</span>
          <span className="font-serif font-bold text-amber-300">
            {gender === 'female' ? '👩 Nữ (Dáng eo thon)' : '👨 Nam (Vai rộng V-taper)'}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-stone-400 block font-semibold">Y Phục Đang Mặc:</span>
          <span className="font-semibold text-stone-200">{garment}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-stone-400 block font-semibold">Bối Cảnh Di Sản:</span>
          <span className="font-semibold text-amber-400">{region}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-stone-400 block font-semibold">Trạng Thái Kiểm Định:</span>
          <span className={`font-bold ${isViolated ? 'text-red-400' : isCaution ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isViolated ? '❌ Vi phạm quy chuẩn' : isCaution ? '⚠️ Cảnh báo nghi lễ' : '✓ Chuẩn nghi lễ'}
          </span>
        </div>
      </div>
    </div>
  );
};
