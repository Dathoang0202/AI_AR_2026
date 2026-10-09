'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import { CulturalDetail } from '@/components/museum/CulturalDetail';

function DetailContent() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get('id') || '';
  const id = Number(rawId);

  if (!/^\d+$/.test(rawId) || !Number.isSafeInteger(id) || id <= 0) {
    return <div className="museum-state"><Search size={36} /><h1>Không tìm thấy hiện vật</h1><p>Đường dẫn hiện vật không hợp lệ hoặc hiện vật không còn trong bộ sưu tập.</p><Link href="/cultural" className="museum-button museum-button-primary"><ArrowLeft size={16} />Quay lại bảo tàng</Link></div>;
  }

  return <CulturalDetail key={id} id={id} />;
}

export default function CulturalDetailPage() {
  return <Suspense fallback={<div className="museum-state" role="status">Đang mở hồ sơ hiện vật…</div>}><DetailContent /></Suspense>;
}
