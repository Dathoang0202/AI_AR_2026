'use client';

import { useState } from 'react';
import { ImageOff, Landmark } from 'lucide-react';
import { getIllustration, safeSourceUrl } from '@/lib/cultural';

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
  const illustration = getIllustration(name, variant);
  const original = src?.startsWith('/') && !src.startsWith('//') ? src : safeSourceUrl(src);
  const activeSource = [original, illustration].find(source => source && !failedSources.includes(source));

  if (!activeSource) return (
    <div className="museum-image-placeholder" role="img" aria-label={`Chưa có hình ảnh ${name}`}>
      <Landmark size={40} strokeWidth={1} /><span>{name}</span><small><ImageOff size={13} />Hình ảnh đang được cập nhật</small>
    </div>
  );

  return <>
    {/* The API accepts arbitrary image hosts; retain the source without Next image host restrictions. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={activeSource} className={activeSource === illustration ? 'museum-illustration-image' : undefined} alt={activeSource === illustration ? `Ảnh minh họa ${name}` : name} loading={priority ? 'eager' : 'lazy'} decoding="async" onError={() => setFailedSources(previous => [...previous, activeSource])} />
    {activeSource === illustration && <span className="museum-illustration-label">Ảnh minh họa</span>}
  </>;
}
