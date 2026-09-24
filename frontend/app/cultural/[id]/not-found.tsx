import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function ArtifactNotFound() {
  return <div className="museum-state"><Search size={36} /><h1>Không tìm thấy hiện vật</h1><p>Đường dẫn hiện vật không hợp lệ hoặc hiện vật không còn trong bộ sưu tập.</p><Link href="/cultural" className="museum-button museum-button-primary"><ArrowLeft size={16} />Quay lại bảo tàng</Link></div>;
}
