import Link from 'next/link';
import { ArrowUpRight, BookOpen, MapPin } from 'lucide-react';
import type { CulturalItemResponse } from '@/services/culturalApi';
import { categoryLabel } from '@/lib/cultural';
import { ArtifactImage } from './ArtifactImage';

export function ArtifactCard({ item, returnTo }: { item: CulturalItemResponse; returnTo?: string }) {
  const href = `/cultural/${item.id}${returnTo ? `?from=${encodeURIComponent(returnTo)}` : ''}`;
  return (
    <Link href={href} className="museum-artifact-card" aria-label={`Khám phá ${item.name}`}>
      <div className="museum-artifact-image">
        <ArtifactImage name={item.name} src={item.imageUrl} />
        <span className="museum-artifact-number">VP / {String(item.id).padStart(3, '0')}</span>
        <span className="museum-artifact-open"><ArrowUpRight size={21} /></span>
      </div>
      <div className="museum-artifact-body">
        <span className="museum-eyebrow museum-period-label">{item.historicalPeriod || categoryLabel(item.category)}</span>
        <h3>{item.name}</h3>
        {item.region && <span className="museum-artifact-region"><MapPin size={12} />{item.region}</span>}
        <p>{item.description}</p>
        <div className="museum-artifact-bottom"><span><BookOpen size={13} />{item.sources?.length ? `${item.sources.length} nguồn tư liệu` : categoryLabel(item.category)}</span><span>Xem chi tiết <ArrowUpRight size={15} /></span></div>
      </div>
    </Link>
  );
}
