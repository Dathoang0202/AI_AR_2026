import { ArrowUpRight, Globe, MapPin, Phone, Store } from 'lucide-react';
import type { RentalProviderResponse } from '@/services/rentalApi';
import { safeSourceUrl } from '@/lib/cultural';
import { rentalPrice, startingPrice } from '@/lib/rentals';

export function RentalProviderCard({ provider, index, distance }: { provider: RentalProviderResponse; index: number; distance?: number }) {
  const price = startingPrice(provider);
  const website = safeSourceUrl(provider.website);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${provider.address}, ${provider.city}`)}`;

  return <article className="rental-card" data-provider-id={provider.id} aria-labelledby={`provider-${provider.id}`}>
    <div className="rental-provider-info">
      <div className="rental-provider-meta"><span className="rental-provider-number">{String(index + 1).padStart(2, '0')}</span><span className="rental-city-label"><MapPin size={12} />{provider.city}</span>{provider.isDemoData && <span className="rental-demo-badge">Demo data</span>}</div>
      <h3 id={`provider-${provider.id}`}>{provider.name}</h3>
      <p className="rental-address"><MapPin size={15} /><span>{provider.address}</span></p>
      {provider.phone && <a href={`tel:${provider.phone}`} className="rental-phone"><Phone size={14} /><span>{provider.phone}</span></a>}
      {distance !== undefined && <p className="rental-distance">Cách bạn khoảng {new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(distance)} km <span>· đường thẳng</span></p>}
      <div className="rental-provider-actions">
        {provider.phone && <a href={`tel:${provider.phone}`} className="rental-button rental-button-primary" aria-label={`Gọi liên hệ ${provider.name}`}><Phone size={14} />Gọi liên hệ</a>}
        {website && <a href={website} target="_blank" rel="noopener noreferrer" className="rental-website" aria-label={`Website ${provider.name} (mở tab mới)`}><Globe size={14} />Website<ArrowUpRight size={13} /></a>}
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="rental-map-link" aria-label={`Xem địa chỉ ${provider.name} trên bản đồ (mở tab mới)`}>Xem bản đồ<ArrowUpRight size={13} /></a>
      </div>
    </div>
    <div className="rental-inventory">
      <div className="rental-inventory-heading"><span><Store size={14} />DANH MỤC CHO THUÊ</span><span>{provider.items.length} lựa chọn</span></div>
      {provider.items.length ? <table className="rental-price-table"><caption className="sr-only">Trang phục, phân loại và giá thuê theo ngày tại {provider.name}</caption><thead><tr><th scope="col">Trang phục / Phân loại</th><th scope="col">Giá mỗi ngày</th></tr></thead><tbody>{provider.items.map(item => <tr key={item.id} data-rental-item={item.id}><td><span className="rental-item-name">{item.name}</span><span className="rental-item-category">{item.category}</span></td><td><strong>{Number.isFinite(Number(item.pricePerDay)) ? `${rentalPrice(Number(item.pricePerDay))} đ` : 'Liên hệ'}</strong><span>/ ngày</span></td></tr>)}</tbody></table> : <p className="rental-no-items">Danh mục và giá đang được cập nhật. Liên hệ cửa hàng để biết thêm.</p>}
      {price !== undefined && <div className="rental-starting-price"><span>Giá khởi điểm tại cửa hàng</span><p>Từ <strong>{rentalPrice(price)} đ</strong><span> / ngày</span></p></div>}
    </div>
  </article>;
}
