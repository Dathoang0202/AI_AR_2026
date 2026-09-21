'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserOutfits, updateOutfit, deleteOutfit } from '@/services/outfitApi';
import { OutfitResponse } from '@/types';
import { Bookmark, Shirt, Trash2, Edit3, Loader2, AlertCircle, Plus, Globe, Lock, EyeOff, CheckCircle2, X } from 'lucide-react';

export default function LookbookPage() {
  const { isAuthenticated, openAuthModal } = useAuth();

  const [outfits, setOutfits] = useState<OutfitResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit Modal State
  const [editingOutfit, setEditingOutfit] = useState<OutfitResponse | null>(null);
  const [editName, setEditName] = useState('');
  const [editVisibility, setEditVisibility] = useState<'PRIVATE' | 'PUBLIC' | 'UNLISTED'>('PRIVATE');
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchOutfits = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await getUserOutfits();
      if (res.success && res.data) {
        setOutfits(res.data);
      } else {
        setErrorMsg(res.error?.message || 'Không thể lấy danh sách Lookbook từ máy chủ.');
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối máy chủ REST API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutfits();
  }, [isAuthenticated]);

  const openEditModal = (item: OutfitResponse) => {
    setEditingOutfit(item);
    setEditName(item.name);
    setEditVisibility(item.visibility || 'PRIVATE');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOutfit) return;

    setUpdateLoading(true);
    try {
      const res = await updateOutfit(editingOutfit.id, {
        name: editName,
        occasion: editingOutfit.occasion,
        region: editingOutfit.region,
        style: editingOutfit.style,
        primaryGarment: editingOutfit.primaryGarment,
        colors: editingOutfit.colors,
        accessories: editingOutfit.accessories,
        culturalNotes: editingOutfit.culturalNotes,
        visibility: editVisibility,
      });

      if (res.success && res.data) {
        setOutfits(outfits.map((o) => (o.id === editingOutfit.id ? res.data! : o)));
        setEditingOutfit(null);
      } else {
        alert(res.error?.message || 'Không thể cập nhật phối đồ.');
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phối đồ này khỏi Lookbook?')) return;

    try {
      const res = await deleteOutfit(id);
      if (res.success) {
        setOutfits(outfits.filter((o) => o.id !== id));
      }
    } catch (err) {
      alert('Không thể xóa phối đồ');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto my-16 bg-white p-8 rounded-2xl border border-amber-200 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
          <Bookmark className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-red-950">Lookbook Cá Nhân Được Bảo Vệ</h2>
          <p className="text-xs text-stone-600">
            Bạn cần đăng nhập tài khoản để xem, chỉnh sửa và quản lý bộ sưu tập trang phục Việt Phục của riêng mình.
          </p>
        </div>
        <button
          onClick={openAuthModal}
          className="px-6 py-3 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold text-sm rounded-xl shadow transition-all"
        >
          Đăng Nhập / Đăng Ký Tự Do
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-amber-900 text-xs font-semibold">
            <Bookmark className="w-3.5 h-3.5" />
            <span>SLICE 4 — Lookbook Cá Nhân & Quản Lý Quyền Riêng Tư</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-red-950 mt-1">Danh Sách Trang Phục Đã Lưu</h1>
        </div>

        <Link
          href="/studio"
          className="px-4 py-2 bg-red-800 hover:bg-red-900 text-amber-200 font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Phối Đồ Mới</span>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center text-stone-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-700" />
          <p className="text-xs">Đang tải bộ sưu tập từ máy chủ REST API...</p>
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
      {!loading && !errorMsg && outfits.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-amber-200 text-center space-y-4 shadow-sm">
          <Shirt className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800">Chưa có phối đồ nào trong Lookbook</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Hãy bắt đầu tạo phối đồ tùy chỉnh trong Studio và nhấn "Lưu Phối Đồ" để lưu vào bộ sưu tập của bạn.
          </p>
          <Link
            href="/studio"
            className="inline-block px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            Đến Studio Phối Đồ
          </Link>
        </div>
      )}

      {/* Success State — Grid of Outfits */}
      {!loading && outfits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif font-bold text-lg text-red-950">{item.name}</h3>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-stone-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Chỉnh sửa phối đồ"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa khỏi lookbook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1 text-stone-700">
                  <p><strong>Loại y phục:</strong> {item.primaryGarment}</p>
                  <p><strong>Phong cách:</strong> {item.style}</p>
                  <p><strong>Bối cảnh:</strong> {item.occasion}</p>
                  <p><strong>Vùng miền:</strong> {item.region}</p>
                </div>

                {item.colors && item.colors.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-stone-700">Màu sắc:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.colors.map((c, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-900 rounded border border-amber-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {item.accessories && item.accessories.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-stone-700">Phụ kiện:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.accessories.map((acc, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-700 rounded">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {item.culturalNotes && (
                  <p className="text-[11px] text-stone-500 italic bg-amber-50/40 p-2 rounded border border-amber-100">
                    "{item.culturalNotes}"
                  </p>
                )}
              </div>

              {/* Card Footer with Visibility Badge */}
              <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-[10px] text-stone-400">
                <span>Lưu lúc: {new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                <span
                  className={`px-2 py-0.5 rounded font-semibold flex items-center space-x-1 ${
                    item.visibility === 'PUBLIC'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.visibility === 'UNLISTED'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {item.visibility === 'PUBLIC' && <Globe className="w-3 h-3" />}
                  {item.visibility === 'UNLISTED' && <EyeOff className="w-3 h-3" />}
                  {(!item.visibility || item.visibility === 'PRIVATE') && <Lock className="w-3 h-3" />}
                  <span>{item.visibility || 'PRIVATE'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Outfit Modal Dialog */}
      {editingOutfit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-amber-200 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-red-950">Chỉnh Sửa Phối Đồ #{editingOutfit.id}</h3>
              <button
                onClick={() => setEditingOutfit(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Tên Phối Đồ
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Quyền Riêng Tư (Visibility)
                </label>
                <select
                  value={editVisibility}
                  onChange={(e) => setEditVisibility(e.target.value as any)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                >
                  <option value="PRIVATE">PRIVATE — Chỉ mình tôi xem</option>
                  <option value="PUBLIC">PUBLIC — Cùng chia sẻ công khai</option>
                  <option value="UNLISTED">UNLISTED — Chỉ ai có link mới xem được</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOutfit(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-4 py-2 bg-red-800 hover:bg-red-900 text-amber-200 rounded-lg text-xs font-bold shadow flex items-center space-x-1"
                >
                  {updateLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Cập nhật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
