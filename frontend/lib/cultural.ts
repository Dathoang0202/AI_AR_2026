import type { CulturalItemResponse } from '@/services/culturalApi';

export function normalizeCulturalText(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

export function categoryLabel(category: string) {
  return category === 'GARMENT' ? 'Y phục truyền thống' : category === 'ACCESSORY' ? 'Phụ kiện' : 'Tư liệu di sản';
}

export function filterCulturalItems(items: CulturalItemResponse[], query: string, category: string, period: string) {
  const terms = normalizeCulturalText(query.trim()).split(/\s+/).filter(Boolean);
  return items.filter(item => {
    const text = normalizeCulturalText([item.name, item.description, item.historicalPeriod, item.region, item.significance].filter(Boolean).join(' '));
    return (category === 'ALL' || item.category === category)
      && (period === 'ALL' || item.historicalPeriod === period)
      && terms.every(term => text.includes(term));
  });
}

export function getIllustration(name: string, variant: 'card' | 'detail' = 'card') {
  const normalized = normalizeCulturalText(name);
  if (normalized.includes('nhat binh')) return variant === 'detail' ? '/images/museum/nhat-binh-detail.jpg' : '/images/museum/nhat-binh.jpg';
  if (normalized.includes('giao linh')) return '/images/museum/giao-linh.jpg';
  return undefined;
}

export function safeSourceUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}
