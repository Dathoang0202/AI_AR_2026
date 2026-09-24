import type { Metadata } from 'next';
import './museum.css';

export const metadata: Metadata = {
  title: 'Bảo Tàng & Lịch Sử | Việt Phục Studio',
  description: 'Khám phá bộ sưu tập y phục Việt Nam, tìm hiểu niên đại, ý nghĩa văn hóa và nguồn tư liệu của từng trang phục.',
};

export default function CulturalLayout({ children }: { children: React.ReactNode }) {
  return <div className="museum-page">{children}</div>;
}
