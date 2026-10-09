'use client';

import { useState } from 'react';
import { ImageOff, Landmark } from 'lucide-react';
import { getMuseumImage, getMuseumIllustration, getMuseumPhoto, safeSourceUrl } from '@/lib/cultural';
import { publicUrl } from '@/lib/public-url';

interface ArtifactImageProps {
  name: string;
  src?: string;
  priority?: boolean;
  variant?: 'card' | 'detail';
}

export function ArtifactImage({ name, src, priority = false, variant = 'card' }: ArtifactImageProps) {
  // Remount the image state when the route or source changes.
  return <ImageContent key={`${name}:${src}:${variant}`} name={name} src={src} priority={priority} variant={variant} />;
}

function ImageContent({ name, src, priority, variant }: ArtifactImageProps) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const curatedImage = getMuseumImage(name, variant);
  const photo = getMuseumPhoto(name);
  const illustration = getMuseumIllustration(name);
  const original = src?.startsWith('/') && !src.startsWith('//') ? src : safeSourceUrl(src);
  // Keep an explicitly labelled drawing available when a curated photo cannot load.
  // Old API portraits are not used in place of an approved catalog image.
  const activeSource = (curatedImage ? [curatedImage, illustration] : [original]).find(source => source && !failedSources.includes(source));
  const isIllustration = !!activeSource && (activeSource === illustration || (!photo && !!illustration));

  if (!activeSource) return (
    <div className="museum-image-placeholder" role="img" aria-label={`Chưa có hình ảnh ${name}`}>
      <Landmark size={40} strokeWidth={1} /><span>{name}</span><small><ImageOff size={13} />Hình ảnh đang được cập nhật</small>
    </div>
  );

  return <>
    {/* The API accepts arbitrary image hosts; retain the source without Next image host restrictions. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={publicUrl(activeSource)} style={photo?.contain || isIllustration ? { objectFit: 'contain' } : undefined} alt={isIllustration ? `Hình minh họa ${name}` : name} loading={priority ? 'eager' : 'lazy'} decoding="async" onError={() => setFailedSources(previous => [...previous, activeSource])} />
    {isIllustration && <span className="museum-illustration-label" title="Hình minh họa phom dáng; không phải ảnh hiện vật hoặc bản phục dựng lịch sử.">Hình minh họa</span>}
  </>;
}
