const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Prefix assets from public/ when hosted under a GitHub Pages project path. */
export function publicUrl(path: string): string {
  return path.startsWith('/') && !path.startsWith('//') ? `${basePath}${path}` : path;
}
