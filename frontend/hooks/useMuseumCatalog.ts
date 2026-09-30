'use client';

import { useEffect, useState } from 'react';
import { CulturalItemResponse, getCulturalItems } from '@/services/culturalApi';

export function useMuseumCatalog() {
  const [items, setItems] = useState<CulturalItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    setLoading(true);
    setError('');
    getCulturalItems(undefined, controller.signal).then(result => {
      if (!active) return;
      if (result.success && result.data) {
        setItems(result.data.filter(item => ['GARMENT', 'ACCESSORY'].includes(item.category)));
      } else setError('Chưa tải được tủ đồ từ bảo tàng. Bạn thử lại nhé.');
    }).catch(() => { if (active) setError('Kết nối bị gián đoạn. Bạn thử tải lại tủ đồ nhé.'); })
      .finally(() => { clearTimeout(timeout); if (active) setLoading(false); });
    return () => { active = false; controller.abort(); clearTimeout(timeout); };
  }, [attempt]);

  return { items, loading, error, retry: () => setAttempt(value => value + 1) };
}
