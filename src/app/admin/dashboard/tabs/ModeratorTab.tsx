'use client';

import React, { useState, useTransition } from 'react';
import { createModerator, updateModerator, deleteModerator } from '@/actions/admin.action';

interface ModeratorTabProps {
  moderators: any[];
  userRole: string;
  onRefresh: (newModerators: any[]) => void;
}

export default function ModeratorTab({ moderators, userRole, onRefresh }: ModeratorTabProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit Modal State
  const [editingMod, setEditingMod] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // Fallback Mock data if empty
  const MOCK_MODS = [
    { id: 'mock-mod-1', name: 'Rahmat Hidayat', email: 'rahmat@gmail.com', roleLevel: 'moderator' }
  ];

  const displayMods = moderators.length > 0 ? moderators : MOCK_MODS;

  if (userRole !== 'superadmin') {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-200/60 p-12 text-center shadow-sm flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-3">
          <svg className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <title>Dilarang Masuk</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h4 className="text-sm font-extrabold text-rose-600 uppercase tracking-wider">Akses Terbatas</h4>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          Halaman manajemen moderator hanya dapat diakses dan dikelola secara eksklusif oleh **Superadmin** utama.
        </p>
      </div>
    );
  }

  // Aksi Menambah Moderator Baru
  const handleAddModerator = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createModerator(formData);
      if (res.success) {
        setSuccessMsg('Moderator baru berhasil ditambahkan dan disimpan terenkripsi!');
        form.reset();
        
        // Simulasikan penambahan instan ke state list
        const newMod = {
          id: 'mod-' + Math.random().toString(),
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          roleLevel: 'moderator'
        };
        onRefresh([...moderators, newMod]);
      } else {
        setErrorMsg(res.error || 'Gagal menambahkan moderator.');
      }
    });
  };

  // Aksi Update Moderator
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMod) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const isMock = editingMod.id.startsWith('mock-');
      if (isMock) {
        // Simulasikan update lokal
        const updated = displayMods.map(m => m.id === editingMod.id ? { ...m, name: editName } : m);
        onRefresh(updated.filter(m => !m.id.startsWith('mock')));
        setSuccessMsg('Simulasi update moderator berhasil!');
        setEditingMod(null);
        return;
      }

      const res = await updateModerator(editingMod.id, editName, editPassword);
      if (res.success) {
        setSuccessMsg('Moderator berhasil diperbarui!');
        // Update list lokal
        const updated = moderators.map(m => m.id === editingMod.id ? { ...m, name: editName } : m);
        onRefresh(updated);
        setEditingMod(null);
      } else {
        setErrorMsg(res.error || 'Gagal memperbarui moderator.');
      }
    });
  };

  // Aksi Hapus Moderator
  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun moderator ini secara permanen?')) return;
    
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const isMock = id.startsWith('mock-');
      if (isMock) {
        onRefresh(moderators); // bersihkan mock
        setSuccessMsg('Simulasi penghapusan moderator berhasil!');
        return;
      }

      const res = await deleteModerator(id);
      if (res.success) {
        setSuccessMsg('Moderator berhasil dihapus dari sistem!');
        onRefresh(moderators.filter(m => m.id !== id));
      } else {
        setErrorMsg(res.error || 'Gagal menghapus moderator.');
      }
    });
  };

  return (
    <div className="grid md:grid-cols-12 gap-8 text-left animate-in fade-in duration-300">
      
      {/* Kolom Kiri: Form Add Moderator (md:col-span-5) */}
      <div className="md:col-span-5 bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[2rem] shadow-sm self-start space-y-6">
        
        <div>
          <h2 className="text-lg font-black text-slate-900">Tambah Akun Moderator</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Memperluas tim manajemen pushaja</p>
        </div>

        {/* Notifikasi Status Tambah */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex gap-2 items-center animate-in fade-in">
            <svg className="h-4.5 w-4.5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <title>Peringatan</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold flex gap-2 items-center animate-in fade-in">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAddModerator} className="space-y-4">
          
          {/* Nama */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Nama Lengkap</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="Contoh: Rian Hidayat"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Alamat Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="rian@pushaja.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Kata Sandi Default</label>
            <input 
              type="password" 
              name="password" 
              required 
              placeholder="Minimal 6 karakter"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-[#1E40AF] hover:bg-blue-800 py-3 text-xs font-black text-white active:scale-[0.98] transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            {isPending ? 'Menyimpan...' : '➕ Daftarkan Moderator'}
          </button>
        </form>

      </div>

      {/* Kolom Kanan: Daftar Moderator Terdaftar (md:col-span-7) */}
      <div className="md:col-span-7 bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[2rem] shadow-sm space-y-6">
        
        <div>
          <h2 className="text-lg font-black text-slate-900">Daftar Moderator</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Moderator yang berwenang meninjau jasa & sengketa</p>
        </div>

        {/* Tabel Moderator */}
        <div className="overflow-x-auto rounded-2xl border border-slate-150">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="p-4">Nama</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayMods.map((mod) => (
                <tr key={mod.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-xs font-semibold text-slate-700">
                  <td className="p-4 font-bold text-slate-800">{mod.name}</td>
                  <td className="p-4">{mod.email}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {/* Edit */}
                    <button
                      onClick={() => {
                        setEditingMod(mod);
                        setEditName(mod.name);
                        setEditPassword('');
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-[#1E40AF] hover:text-white hover:border-[#1E40AF] transition-all cursor-pointer"
                    >
                      Ubah
                    </button>
                    {/* Hapus */}
                    <button
                      onClick={() => handleDelete(mod.id)}
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

      {/* ----------------------------------------------------
          MODAL UBAH / UPDATE MODERATOR
         ---------------------------------------------------- */}
      {editingMod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-2xl space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900">Ubah Data Moderator</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Ubah nama atau reset sandi {editingMod.email}</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Kata Sandi Baru (Kosongkan jika tidak diubah)</label>
                <input 
                  type="password" 
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Min 6 karakter jika ingin mereset"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMod(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-black text-slate-500 hover:bg-slate-100 transition-all cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-[#1E40AF] hover:bg-blue-800 py-3 text-xs font-black text-white active:scale-95 transition-all shadow-md cursor-pointer text-center"
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
