import { normalizeCulturalText } from './cultural';
import type { CulturalItemResponse } from '@/services/culturalApi';

export const outfitColors = [
  { hex: '#C0392B', label: 'Đỏ son' },
  { hex: '#8D3025', label: 'Đỏ trầm' },
  { hex: '#D4AF37', label: 'Hoàng vàng' },
  { hex: '#1E4D2B', label: 'Xanh cổ vịt' },
  { hex: '#1A365D', label: 'Xanh lam' },
  { hex: '#677D68', label: 'Xanh lá nhạt' },
  { hex: '#A47A91', label: 'Tím sen' },
  { hex: '#E8B4A6', label: 'Hồng đào' },
  { hex: '#895B3F', label: 'Nâu đất' },
  { hex: '#FDFBF7', label: 'Trắng ngà' },
  { hex: '#FFFFFF', label: 'Trắng lụa' },
  { hex: '#292524', label: 'Đen mực' },
];

export function toColorHex(value: string) {
  if (/^#[\da-f]{6}$/i.test(value)) return value.toUpperCase();
  const text = normalizeCulturalText(value);
  if (text.includes('do')) return '#C0392B';
  if (text.includes('vang')) return '#D4AF37';
  if (text.includes('co vit')) return '#1E4D2B';
  if (text.includes('trang')) return '#FFFFFF';
  if (text.includes('lam')) return '#1A365D';
  return undefined;
}

export function colorName(hex: string) {
  return outfitColors.find(color => color.hex === hex.toUpperCase())?.label || hex.toUpperCase();
}

export function garmentKind(name: string) {
  const text = normalizeCulturalText(name);
  if (text.includes('nhat binh')) return 'nhat-binh';
  if (text.includes('giao linh')) return 'giao-linh';
  if (text.includes('tu than')) return 'tu-than';
  if (text.includes('tac') || text.includes('ngu than')) return 'ao-tac';
  if (text.includes('ao dai')) return 'ao-dai';
  return 'other';
}

export function accessoryName(item: CulturalItemResponse, gender: 'female' | 'male') {
  const name = normalizeCulturalText(item.name);
  return name.includes('man') && name.includes('khan dong')
    ? (gender === 'male' ? 'Khăn đóng truyền thống' : 'Mấn truyền thống') : item.name;
}

export function museumStudioHref(item: CulturalItemResponse) {
  return `/studio?${item.category === 'GARMENT' ? 'garmentId' : 'accessoryId'}=${item.id}`;
}

export const occasionOptions = ['Lễ cưới truyền thống', 'Dịp Tết Nguyên Đán', 'Chụp ảnh di sản / nghệ thuật', 'Nghi lễ / Dâng hương', 'Dạo phố / Sự kiện văn hóa', 'Sinh hoạt hằng ngày'];
export const regionOptions = ['Miền Bắc', 'Miền Trung (Hoàng gia Huế)', 'Miền Nam'];
export const styleOptions = ['Cổ điển Hoàng gia', 'Nho nhã Sĩ phu', 'Tân thời Duyên dáng', 'Dân gian Mộc mạc'];
