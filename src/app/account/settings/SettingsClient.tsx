'use client';

import React, { useState } from 'react';
import { updateProfile, updatePassword, deleteAccount } from '@/actions/account.action';
import Image from 'next/image';

export default function SettingsClient({ initialProfile }: { initialProfile: any }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'danger'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [profilePicPreview, setProfilePicPreview] = useState(initialProfile.profilePicture || null);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);

    if (res.success) {
      setMessage({ text: 'Profil berhasil diperbarui.', type: 'success' });
      // Reload page to reflect new profile pic across navbar
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setMessage({ text: res.error || 'Terjadi kesalahan.', type: 'error' });
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData(e.currentTarget);
    const res = await updatePassword(formData);

    if (res.success) {
      setMessage({ text: 'Kata sandi berhasil diperbarui.', type: 'success' });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ text: res.error || 'Terjadi kesalahan.', type: 'error' });
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("PERINGATAN: Apakah Anda yakin ingin menghapus akun secara permanen? Semua data transaksi, gig, dan riwayat akan hilang dan tidak dapat dipulihkan.");
    if (!confirmDelete) return;

    setLoading(true);
    const res = await deleteAccount();
    if (res.success) {
      window.location.href = '/';
    } else {
      setMessage({ text: res.error || 'Gagal menghapus akun.', type: 'error' });
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePicPreview(url);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/60 flex flex-col md:flex-row min-h-[600px]">
      
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2">
        <button 
          onClick={() => { setActiveTab('profile'); setMessage({text:'', type:''}); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'profile' ? 'bg-[#1E40AF] text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          Profil Umum
        </button>
        <button 
          onClick={() => { setActiveTab('security'); setMessage({text:'', type:''}); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'security' ? 'bg-[#1E40AF] text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Keamanan Sandi
        </button>
        
        <div className="flex-1"></div>
        <div className="h-[1px] bg-slate-200 my-2"></div>

        <button 
          onClick={() => { setActiveTab('danger'); setMessage({text:'', type:''}); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'danger' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Hapus Akun
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 sm:p-12">
        {message.text && (
          <div className={`mb-8 p-4 rounded-2xl flex items-start gap-3 border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {message.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <p className="font-medium text-sm">{message.text}</p>
          </div>
        )}

        {/* --- TAB: PROFIL --- */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Informasi Profil</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
              
              <div className="flex items-center gap-6 mb-8">
                <div className="relative w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center shrink-0 group">
                  {profilePicPreview ? (
                    <Image src={profilePicPreview} alt="Profile Preview" fill className="object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-slate-300">{initialProfile.name?.charAt(0)}</span>
                  )}
                  <label htmlFor="profilePictureInput" className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <svg className="w-6 h-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg></label>
                  <input id="profilePictureInput" type="file" name="profilePicture" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-700">Foto Profil</h3>
                  <p className="text-sm text-slate-500">Maksimal ukuran file 2MB (Format JPG/PNG)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
                  <input type="text" name="name" defaultValue={initialProfile.name} required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E40AF]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Utama</label>
                  <input type="email" name="email" defaultValue={initialProfile.email} required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E40AF]" />
                </div>
              </div>

              {'phone' in initialProfile && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nomor Telepon</label>
                  <input type="tel" name="phone" defaultValue={initialProfile.phone || ''} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E40AF]" />
                </div>
              )}

              <div className="pt-4">
                <button type="submit" disabled={loading} className="bg-[#1E40AF] text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-70">
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TAB: KEAMANAN --- */}
        {activeTab === 'security' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Keamanan & Sandi</h2>
            <p className="text-slate-500 mb-8">Pastikan akun Anda menggunakan kata sandi yang kuat dan unik.</p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Kata Sandi Saat Ini</label>
                <input type="password" name="oldPassword" required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E40AF]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Kata Sandi Baru</label>
                <input type="password" name="newPassword" required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E40AF]" />
              </div>
              <div className="pt-4">
                <button type="submit" disabled={loading} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors shadow-lg shadow-slate-500/20 disabled:opacity-70">
                  {loading ? 'Memperbarui...' : 'Perbarui Sandi'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TAB: DANGER ZONE --- */}
        {activeTab === 'danger' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-rose-600 mb-2">Zona Berbahaya</h2>
            <p className="text-slate-500 mb-8">Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.</p>
            
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 max-w-2xl">
              <h3 className="text-lg font-bold text-rose-800 mb-2">Hapus Akun Permanen</h3>
              <p className="text-rose-600/80 mb-6 text-sm leading-relaxed">
                Menghapus akun Anda akan menghapus semua riwayat transaksi, pengaturan profil, order aktif, dan gigs secara permanen dari server pushaja.
              </p>
              <button 
                onClick={handleDeleteAccount}
                disabled={loading}
                className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-500/20 disabled:opacity-70"
              >
                {loading ? 'Memproses...' : 'Ya, Hapus Akun Saya'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
