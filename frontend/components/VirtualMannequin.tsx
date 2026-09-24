'use client';

import React, { useState } from 'react';
import { Sparkles, ZoomIn, RotateCcw, ShieldCheck, Eye } from 'lucide-react';

interface VirtualMannequinProps {
  garment: string;
  colorName: string;
  colorHex: string;
  accessories: string[];
  region: string;
  occasion: string;
  isCompliant?: boolean;
}

export const VirtualMannequin: React.FC<VirtualMannequinProps> = ({
  garment,
  colorName,
  colorHex,
  accessories,
  region,
  occasion,
  isCompliant = true,
}) => {
  const [modelGender, setModelGender] = useState<'female' | 'male'>('female');
  const [zoomLevel, setZoomLevel] = useState<'full' | 'upper'>('full');
  const [bgTheme, setBgTheme] = useState<'palace' | 'studio' | 'garden'>('palace');

  // Background style definitions
  const bgStyles = {
    palace: 'from-amber-950 via-red-950 to-stone-900',
    studio: 'from-stone-900 via-stone-800 to-neutral-900',
    garden: 'from-emerald-950 via-stone-900 to-amber-950',
  };

  // Garment SVG paths and visual styling mapping
  const getGarmentStyle = () => {
    switch (garment) {
      case 'Áo Nhật Bình':
        return {
          type: 'nhatbinh',
          neckline: 'V-collar rectangular neck',
          sleeves: 'Wide multicolored bands',
          pattern: 'Imperial Cloud & Phoenix Embroidery',
        };
      case 'Áo Giao Lĩnh':
        return {
          type: 'giaolinh',
          neckline: 'Crossed-collar front',
          sleeves: 'Flowing traditional sleeves',
          pattern: 'Minimalist Silk Wave',
        };
      case 'Áo Tấc (Áo Ngũ Thân)':
        return {
          type: 'aotac',
          neckline: 'High standing collar',
          sleeves: 'Extra wide ceremonial sleeves',
          pattern: 'Five-Element Royal Brocade',
        };
      case 'Áo Dài Truyền Thống':
        return {
          type: 'aodai',
          neckline: 'High mandarin collar',
          sleeves: 'Fitted long sleeves',
          pattern: 'Lotus Silk Weave',
        };
      default:
        return {
          type: 'standard',
          neckline: 'Standing collar',
          sleeves: 'Traditional sleeves',
          pattern: 'Brocade Motif',
        };
    }
  };

  const garmentInfo = getGarmentStyle();

  const hasHeadwear = accessories.some((a) =>
    a.includes('Khăn đóng') || a.includes('Mấn') || a.includes('Nón lá')
  );
  const hasNecklace = accessories.some((a) => a.includes('Vòng cổ'));
  const hasFan = accessories.some((a) => a.includes('Quạt'));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-amber-300/40 shadow-2xl bg-stone-950 text-amber-50">
      {/* Header controls bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 bg-stone-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-amber-500/20 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-serif font-bold tracking-wider text-amber-200 uppercase text-[11px]">
            Ma-nơ-canh Thay Đồ Ảo (Virtual Mannequin)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Gender toggle */}
          <div className="flex bg-stone-800/80 p-0.5 rounded-lg border border-stone-700 text-[10px] font-semibold">
            <button
              onClick={() => setModelGender('female')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                modelGender === 'female' ? 'bg-amber-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              Ma-nơ-canh Nữ
            </button>
            <button
              onClick={() => setModelGender('male')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                modelGender === 'male' ? 'bg-amber-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              Ma-nơ-canh Nam
            </button>
          </div>

          {/* Zoom Toggle */}
          <button
            onClick={() => setZoomLevel(zoomLevel === 'full' ? 'upper' : 'full')}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 rounded-lg border border-stone-700 text-amber-300 transition-all"
            title="Đổi góc nhìn (Full body / Upper body)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Fitting Room Studio Canvas */}
      <div
        className={`relative min-h-[460px] md:min-h-[520px] flex items-center justify-center bg-gradient-to-b ${bgStyles[bgTheme]} transition-all duration-700 overflow-hidden`}
      >
        {/* Background Decorative Imperial Pillars & Curtains */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Royal Silk Drapes background effects */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-red-950/80 to-transparent border-r border-amber-500/10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-red-950/80 to-transparent border-l border-amber-500/10 pointer-events-none"></div>

        {/* Dynamic Pedestal Stand */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-12 rounded-[100%] bg-gradient-to-r from-amber-900/60 via-amber-600/40 to-amber-900/60 border border-amber-400/30 blur-[1px] shadow-2xl"></div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-4 rounded-[100%] bg-amber-400/20 blur-sm"></div>

        {/* SVG VIRTUAL MANNEQUIN & DYNAMIC GARMENT RENDERER */}
        <div
          className={`relative z-10 transition-transform duration-500 transform ${
            zoomLevel === 'upper' ? 'scale-150 translate-y-20' : 'scale-100'
          }`}
        >
          <svg
            viewBox="0 0 320 540"
            className="w-72 h-[440px] md:w-80 md:h-[480px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
          >
            <defs>
              {/* Garment Fabric Gradient */}
              <linearGradient id="fabricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorHex} stopOpacity="1" />
                <stop offset="50%" stopColor={colorHex} stopOpacity="0.85" />
                <stop offset="100%" stopColor="#1a0000" stopOpacity="0.9" />
              </linearGradient>

              {/* Gold Embroidery Thread Gradient */}
              <linearGradient id="goldBrocade" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>

              {/* Mannequin Wooden Body Texture Gradient */}
              <linearGradient id="mannequinSkin" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E2D1C3" />
                <stop offset="50%" stopColor="#FDFCFB" />
                <stop offset="100%" stopColor="#C9B5A3" />
              </linearGradient>
            </defs>

            {/* --- MANNEQUIN BASE DISPLAY --- */}
            {/* Head Silhouette */}
            <ellipse cx="160" cy="75" rx="24" ry="32" fill="url(#mannequinSkin)" stroke="#B8860B" strokeWidth="0.8" />
            {/* Neck */}
            <rect x="153" y="103" width="14" height="22" rx="4" fill="url(#mannequinSkin)" />
            {/* Shoulder Stand */}
            <path d="M 120 125 Q 160 120 200 125 L 210 145 L 110 145 Z" fill="url(#mannequinSkin)" opacity="0.9" />

            {/* --- GARMENT LAYER 1: LOWER TROUSERS / INNER SKIRT --- */}
            <path
              d="M 125 250 L 195 250 L 215 480 L 105 480 Z"
              fill="#FDFBF7"
              stroke="#D4AF37"
              strokeWidth="0.5"
            />
            {/* Trousers fold lines */}
            <line x1="160" y1="250" x2="160" y2="475" stroke="#E5D9C5" strokeWidth="1" strokeDasharray="3 3" />

            {/* --- GARMENT LAYER 2: PRIMARY TRADITIONAL GARMENT (BODY & SLEEVES) --- */}
            {/* Left Sleeve */}
            <path
              d="M 122 128 L 65 240 L 95 260 L 132 175 Z"
              fill="url(#fabricGradient)"
              stroke="url(#goldBrocade)"
              strokeWidth="1.5"
            />
            {/* Right Sleeve */}
            <path
              d="M 198 128 L 255 240 L 225 260 L 188 175 Z"
              fill="url(#fabricGradient)"
              stroke="url(#goldBrocade)"
              strokeWidth="1.5"
            />

            {/* Main Garment Body */}
            {garment === 'Áo Nhật Bình' ? (
              // Áo Nhật Bình Rectangular Front Collar & Flap
              <g>
                <path
                  d="M 122 128 C 140 123 180 123 198 128 L 210 390 L 110 390 Z"
                  fill="url(#fabricGradient)"
                  stroke="url(#goldBrocade)"
                  strokeWidth="2"
                />
                {/* Rectangular Collar (Cổ Vuông Nhật Bình) */}
                <path d="M 145 125 L 175 125 L 175 230 L 145 230 Z" fill="none" stroke="url(#goldBrocade)" strokeWidth="4" />
                <path d="M 148 125 L 172 125 L 172 227 L 148 227 Z" fill="#900C3F" opacity="0.8" />
                {/* Five-color sleeve bands (Ngũ sắc) */}
                <rect x="68" y="225" width="22" height="5" fill="#E74C3C" />
                <rect x="70" y="230" width="22" height="5" fill="#F1C40F" />
                <rect x="72" y="235" width="22" height="5" fill="#2ECC71" />
                <rect x="74" y="240" width="22" height="5" fill="#3498DB" />

                <rect x="230" y="225" width="22" height="5" fill="#E74C3C" />
                <rect x="228" y="230" width="22" height="5" fill="#F1C40F" />
                <rect x="226" y="235" width="22" height="5" fill="#2ECC71" />
                <rect x="224" y="240" width="22" height="5" fill="#3498DB" />
              </g>
            ) : garment === 'Áo Giao Lĩnh' ? (
              // Áo Giao Lĩnh Crossed Collar
              <g>
                <path
                  d="M 122 128 C 140 123 180 123 198 128 L 215 420 L 105 420 Z"
                  fill="url(#fabricGradient)"
                  stroke="url(#goldBrocade)"
                  strokeWidth="1.8"
                />
                {/* Crossed lapel (Vạt vắt chéo) */}
                <path d="M 130 126 L 185 200 L 185 415" fill="none" stroke="url(#goldBrocade)" strokeWidth="3" />
                <path d="M 190 126 L 150 180" fill="none" stroke="url(#goldBrocade)" strokeWidth="3" />
              </g>
            ) : (
              // Áo Tấc / Áo Dài / Áo Ngũ Thân High Collar
              <g>
                <path
                  d="M 122 128 C 140 123 180 123 198 128 L 212 430 L 108 430 Z"
                  fill="url(#fabricGradient)"
                  stroke="url(#goldBrocade)"
                  strokeWidth="1.8"
                />
                {/* Standing Mandarin Collar */}
                <path d="M 148 112 Q 160 108 172 112 L 174 128 Q 160 125 146 128 Z" fill="url(#goldBrocade)" />
                {/* Traditional Pearl Buttons (Khuy ngọc) */}
                <circle cx="160" cy="138" r="2.5" fill="#FFF" stroke="#B8860B" />
                <circle cx="168" cy="155" r="2.5" fill="#FFF" stroke="#B8860B" />
                <circle cx="175" cy="172" r="2.5" fill="#FFF" stroke="#B8860B" />
                {/* Side Overlap line */}
                <path d="M 160 138 C 170 148 180 160 182 220 L 182 425" fill="none" stroke="url(#goldBrocade)" strokeWidth="1.5" />
              </g>
            )}

            {/* Gold Brocade Dragon/Phoenix Center Emblem */}
            <circle cx="160" cy="210" r="18" fill="none" stroke="url(#goldBrocade)" strokeWidth="1.5" strokeDasharray="4 2" />
            <path d="M 152 210 Q 160 200 168 210 T 152 210" fill="none" stroke="url(#goldBrocade)" strokeWidth="1" />

            {/* --- ACCESSORIES LAYERS --- */}
            {/* 1. Headwear (Khăn đóng / Mấn) */}
            {hasHeadwear && (
              <g>
                {/* Khăn đóng mấn xếp nếp */}
                <ellipse cx="160" cy="54" rx="28" ry="12" fill="#800000" stroke="url(#goldBrocade)" strokeWidth="2" />
                <ellipse cx="160" cy="52" rx="25" ry="9" fill="#B8860B" opacity="0.6" />
                <path d="M 135 54 Q 160 62 185 54" fill="none" stroke="url(#goldBrocade)" strokeWidth="1.5" />
              </g>
            )}

            {/* 2. Necklace (Vòng cổ ngọc trai) */}
            {hasNecklace && (
              <path
                d="M 142 132 Q 160 165 178 132"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeDasharray="1 3"
              />
            )}

            {/* 3. Handheld Accessory (Quạt xếp) */}
            {hasFan && (
              <g transform="translate(210, 240) rotate(-15)">
                <path d="M 0 0 L -25 -35 A 35 35 0 0 1 25 -35 Z" fill="#D4AF37" stroke="#8B0000" strokeWidth="1" />
                <line x1="0" y1="0" x2="0" y2="-33" stroke="#8B0000" strokeWidth="1" />
                <line x1="0" y1="0" x2="-15" y2="-30" stroke="#8B0000" strokeWidth="0.8" />
                <line x1="0" y1="0" x2="15" y2="-30" stroke="#8B0000" strokeWidth="0.8" />
              </g>
            )}
          </svg>
        </div>

        {/* Imperial Cultural Compliance Seal Tag */}
        {isCompliant && (
          <div className="absolute bottom-4 right-4 bg-amber-950/90 border border-amber-400/60 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center space-x-2 text-[11px] shadow-lg animate-bounce">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-serif font-bold text-amber-200">Đã Thẩm Định Nghi Lễ</p>
              <p className="text-[9px] text-amber-400/80">Chuẩn mực Cố Đô Huế</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Details Bar */}
      <div className="p-4 bg-stone-900 border-t border-amber-500/20 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] uppercase text-stone-400 block font-semibold">Y Phục Đang Thay:</span>
          <span className="font-serif font-bold text-amber-300">{garment}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-stone-400 block font-semibold">Tông Màu Sắc:</span>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="w-3 h-3 rounded-full border border-stone-400" style={{ backgroundColor: colorHex }}></span>
            <span className="font-semibold text-stone-200">{colorName}</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase text-stone-400 block font-semibold">Bối Cảnh Vùng Miền:</span>
          <span className="font-semibold text-stone-200">{region}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-stone-400 block font-semibold">Số Phụ Kiện Phối:</span>
          <span className="font-semibold text-amber-400">{accessories.length} Phụ kiện</span>
        </div>
      </div>
    </div>
  );
};
