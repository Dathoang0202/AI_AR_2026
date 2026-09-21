'use client';

import React, { useEffect, useState } from 'react';
import { getCulturalItems, searchCulturalItems, CulturalItemResponse } from '@/services/culturalApi';
import { BookOpen, Search, ShieldCheck, Loader2, AlertCircle, ExternalLink, Filter } from 'lucide-react';

export default function CulturalPage() {
  const [items, setItems] = useState<CulturalItemResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Y Phục (Garment)', value: 'GARMENT' },
    { label: 'Phụ Kiện (Accessory)', value: 'ACCESSORY' },
  ];

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let res;
      if (searchQuery.trim()) {
        res = await searchCulturalItems(searchQuery.trim());
      } else {
        const cat = selectedCategory === 'ALL' ? undefined : selectedCategory;
        res = await getCulturalItems(cat);
      }

      if (res.success && res.data) {
        setItems(res.data);
      } else {
        setErrorMsg(res.error?.message || 'Không thể lấy dữ liệu từ điển văn hóa.');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối máy chủ REST API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-white p-8 rounded-2xl shadow-md border border-amber-500/30">
        <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>SLICE 2 — Bách Khoa Toàn Thư Di Sản Việt Phục</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-amber-100">Từ Điển Văn Hóa & Tri Thức Di Sản</h1>
        <p className="text-sm text-stone-300 mt-2 max-w-2xl">
          Tra cứu kiến thức lịch sử, nguồn gốc, quy chuẩn nghi lễ và trích dẫn tư liệu chuẩn xác của từng trang phục truyền thống Việt Nam.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm Áo Nhật Bình, Áo Giao Lĩnh, Áo Tấc..."
              className="w-full pl-9 pr-4 py-2.5 bg-white text-stone-900 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow transition-all"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-amber-200 pb-3">
        <Filter className="w-4 h-4 text-amber-800" />
        <span className="text-xs font-bold text-stone-700 uppercase tracking-wider mr-2">Phân loại:</span>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat.value
                ? 'bg-red-800 text-amber-200 font-bold shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-amber-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center text-stone-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-700" />
          <p className="text-xs">Đang tải tư liệu di sản từ CSDL PostgreSQL/Flyway...</p>
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
      {!loading && !errorMsg && items.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-amber-200 text-center space-y-3 shadow-sm">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800">Không tìm thấy tư liệu phù hợp</h3>
          <p className="text-xs text-stone-500">Thử từ khóa khác hoặc chuyển sang danh mục tất cả.</p>
        </div>
      )}

      {/* Success State — Grid of Cultural Items */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                    {item.category}
                  </span>
                  {item.region && <span className="text-[11px] text-stone-500">{item.region}</span>}
                </div>

                <div>
                  <h3 className="font-serif font-bold text-xl text-red-950">{item.name}</h3>
                  {item.historicalPeriod && (
                    <p className="text-xs text-amber-800 font-semibold mt-0.5">{item.historicalPeriod}</p>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>

                {item.significance && (
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs text-stone-700">
                    <p className="font-bold text-amber-900 mb-0.5">Ý nghĩa văn hóa:</p>
                    <p className="italic">{item.significance}</p>
                  </div>
                )}
              </div>

              {/* Citations / Sources */}
              {item.sources && item.sources.length > 0 && (
                <div className="pt-3 border-t border-stone-100 space-y-1">
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Trích dẫn sử liệu xác thực:</p>
                  {item.sources.map((src) => (
                    <div key={src.id} className="flex justify-between items-center text-xs text-stone-600">
                      <span className="truncate font-medium">• {src.title} ({src.publisher})</span>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-700 hover:text-amber-900 shrink-0 ml-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
