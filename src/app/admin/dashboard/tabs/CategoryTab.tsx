'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { 
  createCategoryGroup, 
  updateCategoryGroup, 
  deleteCategoryGroup,
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategoryGroups,
  getCategoriesList
} from '@/actions/admin.action';

interface CategoryTabProps {
  categories: any[];
  categoryGroups: any[];
  onRefresh: (newCategories: any[]) => void;
  onRefreshGroups: (newGroups: any[]) => void;
  onUpdateStats: () => void;
}

export default function CategoryTab({ 
  categories, 
  categoryGroups, 
  onRefresh, 
  onRefreshGroups, 
  onUpdateStats 
}: CategoryTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'grup' | 'kelola'>('grup');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 1. STATE KATEGORI GRUP (DARI PROPS DILINDUNGI SINKRONISASI)
  const [groups, setGroups] = useState<any[]>(categoryGroups);
  
  useEffect(() => {
    setGroups(categoryGroups);
  }, [categoryGroups]);

  // Form State untuk Kategori Grup
  const [groupName, setGroupName] = useState('');
  const [groupSlug, setGroupSlug] = useState('');
  const [groupIcon, setGroupIcon] = useState('');
  
  // Edit Grup Modal State
  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupSlug, setEditGroupSlug] = useState('');
  const [editGroupIcon, setEditGroupIcon] = useState('');

  // 2. STATE KELOLA KATEGORI / JENIS LAYANAN
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('');
  const [catImageFile, setCatImageFile] = useState<File | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  // Edit Kategori Modal State
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [editCatImageUrl, setEditCatImageUrl] = useState('');
  const [editCatImageFile, setEditCatImageFile] = useState<File | null>(null);
  const [editGroupId, setEditGroupId] = useState('');

  // Auto-generate slug helpers
  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
    setGroupSlug(generateSlug(e.target.value));
  };

  const handleEditGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditGroupName(e.target.value);
    setEditGroupSlug(generateSlug(e.target.value));
  };

  const handleCatNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCatName(e.target.value);
    setCatSlug(generateSlug(e.target.value));
  };

  const handleEditCatNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditCatName(e.target.value);
    setEditCatSlug(generateSlug(e.target.value));
  };

  // ==========================================
  // ACTION HANDLERS: KATEGORI GRUP (REAL CRUD POSTGRESQL)
  // ==========================================
  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!groupName || !groupSlug) {
      setError('Nama dan slug kategori grup wajib diisi.');
      return;
    }

    startTransition(async () => {
      const res = await createCategoryGroup(groupName, groupSlug, groupIcon || null);
      if (res.success) {
        const freshGroups = await getCategoryGroups();
        onRefreshGroups(freshGroups);
        setGroupName('');
        setGroupSlug('');
        setGroupIcon('');
        setSuccess(`Kategori grup "${groupName}" berhasil disimpan ke PostgreSQL!`);
      } else {
        setError(res.error || 'Gagal menambahkan kategori grup.');
      }
    });
  };

  const handleUpdateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await updateCategoryGroup(editingGroup.id, editGroupName, editGroupSlug, editGroupIcon || null);
      if (res.success) {
        const freshGroups = await getCategoryGroups();
        onRefreshGroups(freshGroups);
        setSuccess(`Kategori grup "${editGroupName}" berhasil diperbarui di database!`);
        setEditingGroup(null);
      } else {
        setError(res.error || 'Gagal memperbarui kategori grup.');
      }
    });
  };

  const handleDeleteGroup = (id: string) => {
    const groupToDelete = groups.find(g => g.id === id);
    if (!groupToDelete) return;

    if (confirm(`Apakah Anda yakin ingin menghapus kelompok "${groupToDelete.name}"?\nJenis layanan di bawahnya tidak terhapus melainkan klasifikasinya dikosongkan.`)) {
      setError(null);
      setSuccess(null);

      startTransition(async () => {
        const res = await deleteCategoryGroup(id);
        if (res.success) {
          const freshGroups = await getCategoryGroups();
          onRefreshGroups(freshGroups);
          
          // Juga refresh daftar kategori karena relasi grup mereka telah dilepas
          const freshCats = await getCategoriesList();
          onRefresh(freshCats);
          
          setSuccess(`Kategori grup "${groupToDelete.name}" berhasil dihapus.`);
        } else {
          setError(res.error || 'Gagal menghapus kategori grup.');
        }
      });
    }
  };

  // ==========================================
  // ACTION HANDLERS: KATEGORI / JENIS LAYANAN (REAL CRUD POSTGRESQL)
  // ==========================================
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!catName || !catSlug) {
      setError('Nama dan Slug jenis layanan wajib diisi.');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('name', catName);
      formData.append('slug', catSlug);
      formData.append('categoryGroupId', selectedGroupId || '');
      formData.append('imageUrl', catImageUrl || '');
      if (catImageFile) {
        formData.append('imageFile', catImageFile);
      }

      const res = await createCategory(formData);
      if (res.success) {
        const freshCats = await getCategoriesList();
        onRefresh(freshCats);
        setCatName('');
        setCatSlug('');
        setCatImageUrl('');
        setCatImageFile(null);
        
        // Reset element file input
        const fileInput = document.getElementById('cat-image-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        setSelectedGroupId('');
        setSuccess(`Jenis layanan "${catName}" berhasil diterbitkan ke basis data pushaja!`);
        onUpdateStats();
      } else {
        setError(res.error || 'Gagal menambahkan kategori jasa.');
      }
    });
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', editingCat.id);
      formData.append('name', editCatName);
      formData.append('slug', editCatSlug);
      formData.append('categoryGroupId', editGroupId || '');
      formData.append('imageUrl', editCatImageUrl || '');
      if (editCatImageFile) {
        formData.append('imageFile', editCatImageFile);
      }

      const res = await updateCategory(formData);
      if (res.success) {
        const freshCats = await getCategoriesList();
        onRefresh(freshCats);
        setSuccess('Jenis layanan berhasil diperbarui di database!');
        setEditCatImageFile(null);
        setEditingCat(null);
      } else {
        setError(res.error || 'Gagal memperbarui jenis layanan.');
      }
    });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jenis layanan ini?')) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.success) {
        const freshCats = await getCategoriesList();
        onRefresh(freshCats);
        setSuccess('Jenis layanan berhasil dihapus dari database PostgreSQL.');
        onUpdateStats();
      } else {
        setError(res.error || 'Gagal menghapus jenis layanan.');
      }
    });
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-300">
      
      {/* Sub-Tabs Navigasi Layanan Kustom pushaja */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveSubTab('grup'); setError(null); setSuccess(null); }}
          className={`pb-4 px-6 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'grup'
              ? 'border-[#1E40AF] text-[#1E40AF]'
              : 'border-transparent text-slate-400 hover:text-slate-655'
          }`}
        >
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <title>Kelola Kategori Grup</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          1. Kelola Kategori Grup (Klasifikasi Utama)
        </button>

        <button
          onClick={() => { setActiveSubTab('kelola'); setError(null); setSuccess(null); }}
          className={`pb-4 px-6 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'kelola'
              ? 'border-[#1E40AF] text-[#1E40AF]'
              : 'border-transparent text-slate-400 hover:text-slate-655'
          }`}
        >
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <title>Kelola Jenis Layanan</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          2. Kelola Jenis Layanan (Kategori Jasa)
        </button>
      </div>

      {/* Alert Status */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex gap-2 items-center animate-in slide-in-from-top-2">
          <svg className="h-4.5 w-4.5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <title>Peringatan</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold flex gap-2 items-center animate-in slide-in-from-top-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{success}</span>
        </div>
      )}

      {/* ====================================================
          SUB-TAB 1: KELOLA KATEGORI GRUP (CRUD)
         ==================================================== */}
      {activeSubTab === 'grup' && (
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Form Add Group */}
          <div className="md:col-span-5 bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[2rem] shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Tambah Kategori Grup Baru</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Klasifikasi utama (Contoh: Gaya Hidup, Web & IT)</p>
            </div>

            <form onSubmit={handleAddGroup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Nama Kategori Grup</label>
                <input 
                  type="text" 
                  value={groupName}
                  onChange={handleGroupNameChange}
                  required 
                  placeholder="Contoh: Gaya Hidup & Hobi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Slug Grup (SEO)</label>
                <input 
                  type="text" 
                  value={groupSlug}
                  onChange={(e) => setGroupSlug(generateSlug(e.target.value))}
                  required 
                  placeholder="gaya-hidup-hobi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Icon Kategori Grup (SVG Code)</label>
                <textarea 
                  value={groupIcon}
                  onChange={(e) => setGroupIcon(e.target.value)}
                  placeholder="Masukkan tag SVG lengkap (misal: <svg>...</svg>)"
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-[#1E40AF] hover:bg-blue-800 py-3 text-xs font-black text-white active:scale-[0.98] transition-all shadow-md shadow-blue-500/10 cursor-pointer text-center"
              >
                {isPending ? 'Menyimpan...' : '➕ Tambah Kategori Grup'}
              </button>
            </form>
          </div>

          {/* Table List Groups */}
          <div className="md:col-span-7 bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[2rem] shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Daftar Kategori Grup</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Tabel klasifikasi grup pushaja di PostgreSQL</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-150">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="p-4 w-12 text-center">Ikon</th>
                    <th className="p-4">Nama Grup</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g) => (
                    <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-xs font-semibold text-slate-700">
                      <td className="p-4 text-center">
                        {g.icon ? (
                          <div 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#1E40AF]"
                            dangerouslySetInnerHTML={{ __html: g.icon }}
                          />
                        ) : (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-55 border border-slate-100 text-slate-400 font-black">
                            —
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-800">{g.name}</td>
                      <td className="p-4 text-slate-500">{g.slug}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingGroup(g);
                            setEditGroupName(g.name);
                            setEditGroupSlug(g.slug);
                            setEditGroupIcon(g.icon || '');
                          }}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-[#1E40AF] hover:text-white hover:border-[#1E40AF] transition-all cursor-pointer"
                        >
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(g.id)}
                          className="rounded-lg border border-rose-100 bg-rose-50 text-rose-500 px-3 py-1.5 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ====================================================
          SUB-TAB 2: KELOLA JENIS LAYANAN (CRUD)
         ==================================================== */}
      {activeSubTab === 'kelola' && (
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Form Add Category (Jenis Layanan) */}
          <div className="md:col-span-5 bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[2rem] shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Tambah Jenis Layanan Baru</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Tentukan jenis jasa spesifik untuk database</p>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              
              {/* DROPDOWN KATEGORI GRUP */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Kelompok Kategori (Group)</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                >
                  <option value="">-- Pilih Kelompok Kategori --</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              {/* Nama Kategori / Jenis Layanan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Nama Jenis Layanan</label>
                <input 
                  type="text" 
                  value={catName}
                  onChange={handleCatNameChange}
                  required 
                  placeholder="Contoh: Pijat Tradisional / Cleaning Service"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Slug Layanan (SEO)</label>
                <input 
                  type="text" 
                  value={catSlug}
                  onChange={(e) => setCatSlug(generateSlug(e.target.value))}
                  required 
                  placeholder="pijat-tradisional"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                />
              </div>

              {/* KELOMPOK UNGGAH BERKAS / IMAGE URL */}
              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-2xl space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Unggah Foto (File Upload)</label>
                  <input 
                    id="cat-image-file"
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCatImageFile(e.target.files[0]);
                        setCatImageUrl('');
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#1E40AF]/10 file:text-[#1E40AF] hover:file:bg-[#1E40AF]/20 cursor-pointer"
                  />
                  {catImageFile && (
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5 mt-1 animate-in fade-in">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      File terpilih: {catImageFile.name} ({(catImageFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[9px] text-slate-400 font-black tracking-widest uppercase">Atau Gunakan Link</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Link Gambar (URL)</label>
                  <input 
                    type="url" 
                    value={catImageUrl}
                    disabled={!!catImageFile}
                    onChange={(e) => setCatImageUrl(e.target.value)}
                    placeholder={catImageFile ? "Memprioritaskan file upload..." : "https://images.unsplash.com/..."}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-[#1E40AF] hover:bg-blue-800 py-3 text-xs font-black text-white active:scale-[0.98] transition-all shadow-md shadow-blue-500/10 cursor-pointer text-center"
              >
                {isPending ? 'Menerbitkan...' : '➕ Terbitkan Jenis Layanan'}
              </button>
            </form>
          </div>

          {/* Table List Categories (Jenis Layanan) */}
          <div className="md:col-span-7 bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[2rem] shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Daftar Jenis Layanan</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Tabel data categories di database pushaja</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-150">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="p-4 w-16 text-center">Visual</th>
                    <th className="p-4">Jenis Layanan</th>
                    <th className="p-4">Kelompok (Group)</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-xs font-semibold text-slate-700">
                      <td className="p-4 text-center">
                        {cat.imageUrl ? (
                          <img 
                            src={cat.imageUrl} 
                            alt={cat.name}
                            className="h-10 w-14 object-cover rounded-lg border border-slate-200"
                          />
                        ) : (
                          <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-blue-500 uppercase tracking-widest">
                            No Pic
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-800">{cat.name}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-[#1E40AF]">
                          {cat.categoryGroup?.name || 'Belum Terklasifikasi'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{cat.slug}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingCat(cat);
                            setEditCatName(cat.name);
                            setEditCatSlug(cat.slug);
                            setEditCatImageUrl(cat.imageUrl || '');
                            setEditGroupId(cat.categoryGroupId || '');
                            setEditCatImageFile(null);
                          }}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-[#1E40AF] hover:text-white hover:border-[#1E40AF] transition-all cursor-pointer"
                        >
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="rounded-lg border border-rose-100 bg-rose-50 text-rose-500 px-3 py-1.5 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ====================================================
          MODAL UBAH / EDIT KATEGORI GRUP
         ==================================================== */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-2xl space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900">Ubah Kategori Grup</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Ubah nama, slug, atau ikon kelompok utama</p>
            </div>

            <form onSubmit={handleUpdateGroup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Nama Kategori Grup</label>
                <input 
                  type="text" 
                  value={editGroupName}
                  onChange={handleEditGroupNameChange}
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Slug Grup</label>
                <input 
                  type="text" 
                  value={editGroupSlug}
                  onChange={(e) => setEditGroupSlug(generateSlug(e.target.value))}
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Ikon Kategori Grup (SVG Code)</label>
                <textarea 
                  value={editGroupIcon}
                  onChange={(e) => setEditGroupIcon(e.target.value)}
                  placeholder="Masukkan tag SVG lengkap (misal: <svg>...</svg>)"
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGroup(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-black text-slate-500 hover:bg-slate-100 transition-all cursor-pointer text-center animate-in fade-in"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-[#1E40AF] hover:bg-blue-800 py-3 text-xs font-black text-white active:scale-95 transition-all shadow-md cursor-pointer text-center animate-in fade-in"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL UBAH / EDIT KATEGORI (JENIS LAYANAN)
         ==================================================== */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-2xl space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900">Ubah Data Jenis Layanan</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Ubah klasifikasi jenis layanan di basis data</p>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Kelompok Kategori (Group)</label>
                <select
                  value={editGroupId}
                  onChange={(e) => setEditGroupId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                >
                  <option value="">-- Pilih Kelompok Kategori --</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Nama Jenis Layanan</label>
                <input 
                  type="text" 
                  value={editCatName}
                  onChange={handleEditCatNameChange}
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Slug Layanan</label>
                <input 
                  type="text" 
                  value={editCatSlug}
                  onChange={(e) => setEditCatSlug(generateSlug(e.target.value))}
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                />
              </div>

              {/* KELOMPOK UNGGAH BERKAS / IMAGE URL */}
              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-2xl space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Unggah Foto Baru (File Upload)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setEditCatImageFile(e.target.files[0]);
                        setEditCatImageUrl('');
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#1E40AF]/10 file:text-[#1E40AF] hover:file:bg-[#1E40AF]/20 cursor-pointer"
                  />
                  {editCatImageFile && (
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5 mt-1 animate-in fade-in">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      File baru terpilih: {editCatImageFile.name} ({(editCatImageFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[9px] text-slate-400 font-black tracking-widest uppercase">Atau Gunakan Link</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Link Gambar Baru (URL)</label>
                  <input 
                    type="url" 
                    value={editCatImageUrl}
                    disabled={!!editCatImageFile}
                    onChange={(e) => setEditCatImageUrl(e.target.value)}
                    placeholder={editCatImageFile ? "Memprioritaskan file upload..." : "https://images.unsplash.com/..."}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-805 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-black text-slate-500 hover:bg-slate-100 transition-all cursor-pointer text-center animate-in fade-in"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-[#1E40AF] hover:bg-blue-800 py-3 text-xs font-black text-white active:scale-95 transition-all shadow-md cursor-pointer text-center animate-in fade-in"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
