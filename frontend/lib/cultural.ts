import type { CulturalItemResponse } from '@/services/culturalApi';
import { workbookVisual } from './workbookCatalog';

export function normalizeCulturalText(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

export function categoryLabel(category: string) {
  return category === 'GARMENT' ? 'Y phục truyền thống' : category === 'ACCESSORY' ? 'Phụ kiện' : 'Tư liệu di sản';
}

export function filterCulturalItems(items: CulturalItemResponse[], query: string, category: string, period: string) {
  const terms = normalizeCulturalText(query.trim()).split(/\s+/).filter(Boolean);
  return items.filter(item => {
    const text = normalizeCulturalText([item.name, item.itemType, item.usageCategory, item.description, item.historicalPeriod, item.region, item.significance].filter(Boolean).join(' '));
    return (category === 'ALL' || item.category === category)
      && (period === 'ALL' || item.historicalPeriod === period)
      && terms.every(term => text.includes(term));
  });
}

export function getMuseumImage(name: string, variant: 'card' | 'detail' = 'card') {
  const normalized = normalizeCulturalText(name);
  if (normalized.includes('nhat binh')) return variant === 'detail' ? '/images/museum/nhat-binh-detail.jpg' : '/images/museum/nhat-binh.jpg';
  if (normalized.includes('giao linh')) return '/images/museum/giao-linh.jpg';
  return getMuseumPhoto(name)?.src || getMuseumIllustration(name);
}

export function getMuseumIllustration(name: string) {
  const normalized = normalizeCulturalText(name);
  if (normalized.includes('nhat binh')) return '/images/museum/nhat-binh.jpg';
  if (normalized.includes('giao linh')) return '/images/museum/giao-linh.jpg';
  const drawing = workbookVisual(normalized);
  return drawing ? `/images/museum/${drawing.kind}.svg` : undefined;
}

interface MuseumPhoto {
  keywords: string[];
  src: string;
  title: string;
  author: string;
  sourceUrl: string;
  license?: string;
  licenseUrl?: string;
  contain?: boolean;
}

const museumPhotos: MuseumPhoto[] = [
  {
    keywords: ['vien linh'], src: '/images/museum/vien-linh-photo.jpg', contain: true,
    title: 'Áo viên lĩnh xanh trên giá trưng bày — sản phẩm may hiện đại',
    author: 'Áo Dài Cô Sáu', sourceUrl: 'https://www.saigonaodai.net/shop/ao-vien-linh/',
  },
  {
    keywords: ['doi kham'], src: '/images/museum/doi-kham-photo.jpg', contain: true,
    title: 'Áo đối khâm trắng trên giá trưng bày — sản phẩm may hiện đại',
    author: 'Áo Dài Cô Sáu', sourceUrl: 'https://www.saigonaodai.net/shop/ao-doi-kham/',
  },
  {
    keywords: ['guoc moc'], src: '/images/museum/guoc-moc-photo.jpg', contain: true,
    title: 'Guốc gỗ quai gấm — ảnh sản phẩm thủ công hiện đại',
    author: 'Guốc Mộc Sài Gòn', sourceUrl: 'https://guocmoc.com.vn/shop/',
  },
  {
    keywords: ['bo tu'], src: '/images/museum/bo-tu-photo.jpg', contain: true,
    title: 'Chi tiết bổ tử trên phẩm phục triều Nguyễn — ảnh trang trí trên áo, không phải toàn bộ áo',
    author: 'Bảo tàng Lịch sử Quốc gia · bài Đinh Quỳnh Hoa',
    sourceUrl: 'https://baotanglichsu.vn/VI/Articles/3096/18573/bo-tu-tren-pham-phuc-quan-trieu-nguyen.html',
  },
  {
    keywords: ['con mien'], src: '/images/museum/con-mien-photo.jpg', contain: true,
    title: 'Long cổn tế giao — phần áo tham khảo cho Côn Miện, ảnh không gồm mũ và toàn bộ bộ lễ phục',
    author: 'Bảo tàng Lịch sử Quốc gia · bài TS Trần Đức Anh Sơn',
    sourceUrl: 'https://baotanglichsu.vn/vi/Articles/3101/18620/long-phung-trinh-tuong.html',
  },
  {
    keywords: ['mang bao'], src: '/images/museum/mang-bao-photo.jpg', contain: true,
    title: 'Mãng bào của hoàng tử triều Nguyễn',
    author: 'Bảo tàng Lịch sử Quốc gia · bài TS Trần Đức Anh Sơn',
    sourceUrl: 'https://baotanglichsu.vn/vi/Articles/3101/18620/long-phung-trinh-tuong.html',
  },
  {
    keywords: ['tran thu'], src: '/images/museum/tran-thu-photo.jpg', contain: true,
    title: 'Áo trấn thủ Bác Hồ tặng đồng chí Nguyễn Đức Lô sau Chiến dịch Biên giới năm 1950',
    author: 'Đoàn Thảo · Báo Quân đội nhân dân',
    sourceUrl: 'https://www.qdnd.vn/tu-lieu-ho-so/van-kien-tu-lieu/hien-vat-chien-thang-ao-tran-thu-bac-ho-tang-nguoi-dau-tien-su-dung-sung-bazooka-780585',
  },
  {
    keywords: ['quai thao'], src: '/images/museum/quai-thao-photo.jpg', contain: true,
    title: 'Nón quai thao kèm dây đeo trên giá trưng bày — sản phẩm biểu diễn hiện đại',
    author: 'Trang Phục Biểu Diễn Ánh Sáng',
    sourceUrl: 'https://trangphucdienanhsang.com/san-pham/non-quai-thao-01/',
  },
  {
    keywords: ['hai cung dinh'], src: '/images/museum/hai-photo.jpg', contain: true,
    title: 'Đôi hài của hoàng hậu Nam Phương trang trí hình chim phượng',
    author: 'Bảo tàng Lịch sử Quốc gia · bài TS Trần Đức Anh Sơn',
    sourceUrl: 'https://baotanglichsu.vn/vi/Articles/3101/18781/hai-chau-got-ngoc.html',
  },
  {
    keywords: ['dai ngoc'], src: '/images/museum/dai-ngoc-photo.jpg', contain: true,
    title: 'Các phiến đai ngọc bọc vàng nạm đá quý — chi tiết trang trí của đai lưng',
    author: 'Đại Dương · Dân Trí / Bảo tàng Lịch sử Quốc gia',
    sourceUrl: 'https://baotanglichsu.vn/vi/Articles/3091/18045/tinh-xao-trang-suc-co-viet-nam.html',
  },
  {
    keywords: ['kieng'], src: '/images/museum/kieng-photo.jpg', contain: true,
    title: 'Vòng cổ bạc thế kỷ XIX–XX trong sưu tập trang sức triều Nguyễn',
    author: 'Đại Dương · Dân Trí / Bảo tàng Lịch sử Quốc gia',
    sourceUrl: 'https://baotanglichsu.vn/vi/Articles/3091/18045/tinh-xao-trang-suc-co-viet-nam.html',
  },
  {
    keywords: ['tram cai'], src: '/images/museum/tram-photo.jpg', contain: true,
    title: 'Trâm hoa thời chúa Nguyễn, thế kỷ XVIII',
    author: 'Đại Dương · Dân Trí / Bảo tàng Lịch sử Quốc gia',
    sourceUrl: 'https://baotanglichsu.vn/vi/Articles/3091/18045/tinh-xao-trang-suc-co-viet-nam.html',
  },
  {
    keywords: ['kim khanh', 'kim bai'], src: '/images/museum/kim-khanh-photo.jpg', contain: true,
    title: 'Kim khánh Ân tứ bằng vàng nạm ngọc trai',
    author: 'Bảo tàng Lịch sử Quốc gia · bài Trần Đức Anh Sơn',
    sourceUrl: 'https://baotanglichsu.vn/vi/Articles/3101/19023/kim-bai-kim-khanh-ngoc-khanh-thoi-nguyen.html',
  },
  {
    keywords: ['ao yem'], src: '/images/museum/ao-yem-color.jpg', contain: true,
    title: 'Ảnh màu phụ nữ Hà Nội mặc áo yếm, Léon Busy, thập niên 1910',
    author: 'Léon Busy / Musée départemental Albert-Kahn',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Two_girls_sitting_near_the_tank_wore_the_traditional_costume_-_white_brassiere,_black_pants,_light-colored_belt_and_conical_hat_-_L%C3%A9on_Busy_(1874-1951).jpg',
    license: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Public_domain',
  },
  {
    keywords: ['hoang bao'], src: '/images/museum/hoang-bao-photo.jpg', contain: true,
    title: 'Cận cảnh long bào của vua Bảo Đại trong bộ sưu tập tư nhân; ảnh chi tiết, không thể hiện toàn bộ áo',
    author: 'Marie-Lan Nguyen / Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bao_Dai_imperial_robe_private_collection_EDAV.jpg',
    license: 'Public domain', licenseUrl: 'https://commons.wikimedia.org/wiki/Public_domain',
  },
  {
    keywords: ['canh chuon', 'phoc dau', 'o sa'], src: '/images/museum/canh-chuon-photo.jpg', contain: true,
    title: 'Mũ quan triều Nguyễn thế kỷ XIX–đầu XX bằng kim loại thếp vàng, có hai cánh dài',
    author: 'Daderot / Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Official_hat,_Nguyen_dynasty,_19th_to_early_20th_century,_gilded_metal_-_National_Museum_of_Vietnamese_History_-_Hanoi,_Vietnam_-_DSC05595.JPG',
    license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
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
