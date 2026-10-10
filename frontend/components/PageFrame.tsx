'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function PageFrame({ children }: { children: React.ReactNode }) {
  // Static exports use /studio/; keep the same viewport layout as /studio.
  const pathname = usePathname().replace(/\/+$/, '') || '/';
  const isStudio = pathname === '/studio';
  if (isStudio) return <main className="h-[calc(100dvh-65px)] min-h-0 w-full overflow-hidden px-3 py-3 sm:px-5" data-studio-frame>{children}</main>;
  return <><main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">{children}</main><Footer /></>;
}
