'use client';

import React, { useEffect, useState } from 'react';
import { getRentalProviders, RentalProviderResponse } from '@/services/rentalApi';
import { MapPin, Phone, Globe, Info, Search, Loader2, AlertCircle, Tag, Navigation } from 'lucide-react';

export default function RentalsPage() {
  const [providers, setProviders] = useState<RentalProviderResponse[]>([]);
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cityOptions = [
    { label: 'Tất cả các tỉnh/thành', value: 'ALL' },
    { label: 'Hà Nội', value: 'Hà Nội' },
    { label: 'Thừa Thiên Huế', value: 'Huế' },
    { label: 'TP. Hồ Chí Minh', value: 'Hồ Chí Minh' },
  ];

  const fetchProviders = async (city?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const filterCity = city && city !== 'ALL' ? city : undefined;
      const res = await getRentalProviders(filterCity);
      if (res.success && res.data) {
        setProviders(res.data);
      } else {
        setErrorMsg(res.error?.message || 'Không thể lấy dữ liệu điểm thuê.');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối máy chủ REST API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders(selectedCity === 'ALL' ? undefined : selectedCity);
  }, [selectedCity]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders(searchCity);
  };

  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // In actual production, convert coordinates to city via reverse geocoding
          alert(`Đã nhận tọa độ: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}. Tự động gợi ý điểm thuê gần nhất!`);
        },
        () => {
          alert('Không thể lấy vị trí tự động. Bạn có thể chọn thành phố thủ công bên dưới.');
        }
      );
    } else {
      alert('Trình duyệt không hỗ trợ định vị tự động.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white p-8 rounded-2xl shadow-md border border-amber-500/30">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <MapPin className="w-4 h-4" />
          <span>SLICE 3 — Bản Đồ & Địa Điểm Thuê Việt Phục</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-amber-100">Tìm Kiếm Điểm Thuê Trang Phục Uy Tín</h1>
        <p className="text-sm text-stone-300 mt-2 max-w-2xl">
          Định vị các nhà cung cấp dịch vụ cho thuê Việt Phục theo khu vực địa lý, hỗ trợ cả tìm kiếm vị trí tự động và nhập vị trí thủ công.
        </p>

        {/* Location Search Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
          <form onSubmit={handleManualSearch} className="flex-1 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Nhập thành phố thủ công (ví dụ: Hà Nội, Huế...)"
              className="w-full pl-9 pr-4 py-2.5 bg-white text-stone-900 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </form>

          <button
            onClick={handleGeolocation}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center space-x-1.5 shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Vị trí hiện tại</span>
          </button>
        </div>
      </div>

      {/* City Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-amber-200 pb-3">
        <span className="text-xs font-bold text-stone-700 uppercase tracking-wider mr-2">Thành phố:</span>
        {cityOptions.map((c) => (
          <button
            key={c.value}
            onClick={() => setSelectedCity(c.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCity === c.value
                ? 'bg-red-800 text-amber-200 font-bold shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-amber-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Demo Data Alert Notice */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center space-x-3 text-amber-900 text-xs">
        <Info className="w-5 h-5 text-amber-700 shrink-0" />
        <span>Ghi chú: Toàn bộ danh sách điểm thuê được dán nhãn dữ liệu thử nghiệm (Demo data) rõ ràng. Nút liên hệ sẽ hiển thị thông tin trực tiếp.</span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center text-stone-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-700" />
          <p className="text-xs">Đang tải danh sách điểm thuê từ máy chủ REST API...</p>
        </div>
      )}

      {/* Error State */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-800 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !errorMsg && providers.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-amber-200 text-center space-y-3 shadow-sm">
          <MapPin className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800">Không tìm thấy điểm thuê ở khu vực này</h3>
          <p className="text-xs text-stone-500">Thử tìm kiếm với tên thành phố khác.</p>
        </div>
      )}

      {/* Success State — Grid of Rental Providers */}
      {!loading && providers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {providers.map((prov) => (
            <div key={prov.id} className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  {prov.isDemoData && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 text-stone-600 rounded border border-stone-200">
                      Demo Data
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-amber-800">{prov.city}</span>
                </div>

                <h3 className="font-serif font-bold text-xl text-red-950">{prov.name}</h3>

                <p className="text-xs text-stone-600 flex items-start space-x-1.5">
                  <MapPin className="w-4 h-4 text-red-800 shrink-0 mt-0.5" />
                  <span>{prov.address}</span>
                </p>

                {prov.phone && (
                  <p className="text-xs text-stone-600 flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="font-semibold text-stone-800">{prov.phone}</span>
                  </p>
                )}

                {/* Rental Items List & Pricing */}
                {prov.items && prov.items.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <p className="text-[11px] font-bold text-stone-700 uppercase">Trang phục cho thuê & Đơn giá:</p>
                    <div className="space-y-1.5">
                      {prov.items.map((item) => (
                        <div key={item.id} className="p-2 bg-amber-50/50 rounded-lg border border-amber-200/50 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-semibold text-stone-900">{item.name}</p>
                            <span className="text-[10px] text-stone-500">{item.category}</span>
                          </div>
                          <span className="font-serif font-bold text-red-900 shrink-0 ml-2">
                            {Number(item.pricePerDay).toLocaleString('vi-VN')} đ/ngày
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex space-x-2">
                <a
                  href={`tel:${prov.phone}`}
                  className="flex-1 py-2 bg-red-800 hover:bg-red-900 text-amber-200 text-xs font-bold rounded-xl text-center shadow transition-all flex items-center justify-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi Liên Hệ</span>
                </a>
                {prov.website && (
                  <a
                    href={prov.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl transition-colors"
                    title="Website nhà cung cấp"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
