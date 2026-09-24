import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CulturalDetail } from '@/components/museum/CulturalDetail';

export default function CulturalDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!/^\d+$/.test(params.id) || !Number.isSafeInteger(id) || id <= 0) notFound();
  return <Suspense fallback={<div className="museum-state" role="status">Đang mở hồ sơ hiện vật…</div>}><CulturalDetail key={id} id={id} /></Suspense>;
}
