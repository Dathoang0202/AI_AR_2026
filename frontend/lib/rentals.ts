import type { RentalProviderResponse } from '@/services/rentalApi';

export type RentalPosition = { latitude: number; longitude: number };

export function startingPrice(provider: RentalProviderResponse) {
  const prices = provider.items.map(item => Number(item.pricePerDay)).filter(price => Number.isFinite(price) && price > 0);
  return prices.length ? Math.min(...prices) : undefined;
}

export function rentalPrice(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

/** Straight-line distance, not a travel time or road distance. */
export function rentalDistance(position: RentalPosition, provider: RentalProviderResponse) {
  const { latitude, longitude } = provider;
  if (typeof latitude !== 'number' || typeof longitude !== 'number' || !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return undefined;
  const radians = (value: number) => value * Math.PI / 180;
  const arc = Math.sin(radians(latitude - position.latitude) / 2) ** 2
    + Math.cos(radians(position.latitude)) * Math.cos(radians(latitude)) * Math.sin(radians(longitude - position.longitude) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, arc))));
}
