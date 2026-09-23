import { Suspense } from 'react';
import { MuseumCollection } from '@/components/museum/MuseumCollection';

export default function CulturalPage() {
  return <Suspense fallback={<div className="museum-state" role="status">Đang mở phòng trưng bày…</div>}><MuseumCollection /></Suspense>;
}
