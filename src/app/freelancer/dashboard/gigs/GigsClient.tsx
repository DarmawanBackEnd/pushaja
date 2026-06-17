'use client';

import React, { useState, useTransition, useRef } from 'react';
import { createGig, updateGig, deleteGig } from '@/actions/freelancer.gig.action';
import Image from 'next/image';

export default function GigsClient({ initialGigs, categories }: { initialGigs: any[], categories: any[] }) {
  const [gigs, setGigs] = useState(initialGigs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState('');
  
  // State form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    deliveryDays: '',
    categoryId: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', price: '', deliveryDays: '', categoryId: '' });
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (gig: any) => {
    setEditingId(gig.id);
    setFormData({
      title: gig.title,
      description: gig.description,
      price: gig.price.toString(),
      deliveryDays: gig.deliveryDays.toString(),
      categoryId: gig.categoryId
    });
    setImageFile(null);
    setImagePreview(gig.imageUrl || null);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jasa ini?')) return;
    startTransition(async () => {
      const res = await deleteGig(id);
      if (res.success) {
        setGigs(gigs.filter(g => g.id !== id));
      } else {
        alert(res.error);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.title || !formData.description || !formData.price || !formData.deliveryDays || !formData.categoryId) {
      setFormError('Semua kolom wajib diisi.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('price', formData.price);
    payload.append('deliveryDays', formData.deliveryDays);
    payload.append('categoryId', formData.categoryId);
    
    if (imageFile) {
      payload.append('imageFile', imageFile);
    }

    startTransition(async () => {
      if (editingId) {
        payload.append('id', editingId);
        const res = await updateGig(payload);
        if (res.success) {
          // Panggil reload aja biar simpel dapat image url baru
          window.location.reload();
        } else {
          setFormError(res.error || 'Gagal memperbarui.');
        }
      } else {
        const res = await createGig(payload);
        if (res.success) {
          window.location.reload();
        } else {
          setFormError(res.error || 'Gagal menyimpan.');
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Kelola Jasa (Gigs)</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Buat dan kelola layanan yang Anda tawarkan ke klien.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#1E40AF] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-800 transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Tambah Jasa
        </button>
      </div>

      {gigs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-lg font-black text-slate-800">Belum ada Jasa</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Anda belum membuat layanan apa pun. Mulai tawarkan keahlian Anda sekarang dengan membuat jasa pertama Anda!</p>
          <button onClick={handleOpenAdd} className="mt-6 text-[#1E40AF] font-bold hover:underline">Buat Jasa Baru</button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {gigs.map(gig => (
            <div key={gig.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {gig.imageUrl ? (
                <div className="w-full h-40 relative bg-slate-100 border-b border-slate-100">
                  <Image src={gig.imageUrl} alt={gig.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full h-40 relative bg-slate-100 border-b border-slate-100 flex items-center justify-center text-slate-300">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  gig.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                  gig.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {gig.status}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(gig)} className="text-slate-400 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(gig.id)} className="text-slate-400 hover:text-rose-600 transition-colors" disabled={isPending}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              
              <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug mb-1">{gig.title}</h3>
              <p className="text-xs font-semibold text-slate-400 mb-4">{gig.category?.name || 'Uncategorized'}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Harga</p>
                  <p className="text-sm font-black text-[#1E40AF]">Rp {Number(gig.price).toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Waktu</p>
                  <p className="text-sm font-black text-slate-700">{gig.deliveryDays} Hari</p>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-800">{editingId ? 'Edit Jasa' : 'Buat Jasa Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {formError && (
                <div className="mb-6 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {formError}
                </div>
              )}
              
              <form id="gigForm" onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 block">Cover Jasa (Banner)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 hover:border-[#1E40AF] transition-colors relative overflow-hidden"
                  >
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-xs font-semibold">Klik untuk unggah gambar (Opsional)</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Judul Layanan</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Contoh: Saya akan mendesain logo profesional"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 text-slate-800 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Deskripsi Detail</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Jelaskan secara spesifik apa yang Anda tawarkan..."
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 text-slate-800 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] resize-none"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Harga (Rp)</label>
                    <input 
                      type="number" 
                      min="10000"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="50000"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 text-slate-800 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Lama Pengerjaan (Hari)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={formData.deliveryDays}
                      onChange={(e) => setFormData({...formData, deliveryDays: e.target.value})}
                      placeholder="3"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 text-slate-800 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Kategori Jasa</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 text-slate-800 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] bg-white"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                form="gigForm"
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl font-bold bg-[#1E40AF] text-white hover:bg-blue-800 disabled:opacity-70 transition-colors shadow-md shadow-blue-500/20"
              >
                {isPending ? 'Menyimpan...' : 'Simpan Jasa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
