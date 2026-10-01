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
  return getMuseumPhoto(name)?.src;
}

const museumPhotos = [
  {
    keywords: ['ao ba ba'], src: '/images/museum/ao-ba-ba.jpg',
    title: 'Bộ bà ba Bến Tre, 1968, tại Bảo tàng Phụ nữ Việt Nam', author: 'Daderot',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Costume_Ba_ba,_Viet,_Ben_Tre,_1968,_industrial_fabric_-_Vietnamese_Women%27s_Museum_-_Hanoi,_Vietnam_-_DSC04104.JPG",
    license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    keywords: ['ngu than tay chen'], src: '/images/museum/ao-ngu-than-tay-chen.jpg',
    title: 'Áo ngũ thân tay chẽn trên giá trưng bày', author: 'Hoài Giang Shop',
    sourceUrl: 'https://hoaigiangshop.com/san-pham/ao-dai-nam/nam-truyen-thong/ao-ngu-than-ao-tac-nam-tay-chen-mau-den',
    license: undefined, licenseUrl: undefined,
  },
  {
    keywords: ['trang phuc nu thai (thanh hoa)'], src: '/images/museum/trang-phuc-nu-thai.jpg',
    title: 'Trang phục Thái, Thanh Hóa, 1977, tại Bảo tàng Phụ nữ Việt Nam', author: 'Daderot',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Costume,_Thai,_Thanh_Hoa,_1977,_view_1,_cotton,_ikat,_patterns_woven_with_extra_threads_and_silk_embroidery_-_Vietnamese_Women%27s_Museum_-_Hanoi,_Vietnam_-_DSC03910.JPG",
    license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    keywords: ['non la'], src: '/images/museum/non-la.jpg',
    title: 'Nón lá Thanh Oai, 1999, tại Bảo tàng Phụ nữ Việt Nam', author: 'Daderot',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Conical_hat,_Viet,_Thanh_Oai,_Hanoi,_1999,_palm_leaves_with_bamboo_frame_-_Vietnamese_Women%27s_Museum_-_Hanoi,_Vietnam_-_DSC03996.JPG",
    license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    keywords: ['quat xep chang son'], src: '/images/museum/quat-xep.jpg',
    title: 'Các mẫu quạt xếp của làng nghề Chàng Sơn', author: 'Quạt Chàng Sơn · nguồn đăng ảnh',
    sourceUrl: 'https://quatchangson.vn/vi/post/dua-quat-chang-son-vuon-xa-2.htm',
    license: undefined, licenseUrl: undefined,
  },
  {
    keywords: ['khan ran'], src: '/images/museum/khan-ran.jpg',
    title: 'Khăn rằn Tân Châu chụp riêng', author: 'Nông Sản An Giang',
    sourceUrl: 'https://nongsanangiang.com/khan-ran-tan-chau-an-giang',
    license: undefined, licenseUrl: undefined,
  },
  {
    keywords: ['ao tac'],
    src: '/images/museum/ao-tac-display.jpg',
    title: 'Áo tấc tay thụng trên ma-nơ-canh',
    author: 'aodaibyhuna · Etsy',
    sourceUrl: 'https://www.etsy.com/listing/1812630628/ao-tac-for-men-vietnamese-traditional-ao',
    license: undefined,
    licenseUrl: undefined,
  },
  {
    keywords: ['khan dong'],
    src: '/images/museum/khan-dong-display.jpg',
    title: 'Khăn đóng gấm chụp riêng',
    author: 'Áo Dài Nét Đẹp Việt',
    sourceUrl: 'https://aodainetdepviet.com/collections/khan-d%E1%BB%91ng',
    license: undefined,
    licenseUrl: undefined,
  },
  {
    keywords: ['ao tu than'],
    src: '/images/museum/ao-tu-than.jpg',
    title: 'Áo tứ thân tại Bảo tàng Dân tộc học Việt Nam',
    author: 'Daderot',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Woman%27s_garment,_traditional_Viet_-_Vietnam_Museum_of_Ethnology_-_Hanoi,_Vietnam_-_DSC02552.JPG",
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    keywords: ['ao dai'],
    src: '/images/museum/ao-dai.jpg',
    title: 'Áo dài tại Bảo tàng Phụ nữ Việt Nam',
    author: 'Daderot',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ao_dai,_Viet,_Hanoi,_1971-1975,_synthetic_silk_-_Vietnamese_Women%27s_Museum_-_Hanoi,_Vietnam_-_DSC04127.JPG",
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
];

export function getMuseumPhoto(name: string) {
  const normalized = normalizeCulturalText(name);
  return museumPhotos.find(photo => photo.keywords.some(keyword => normalized.includes(keyword)));
}

export function safeSourceUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}
