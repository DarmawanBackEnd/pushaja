'use client';

import React, { useState, useTransition } from 'react';
import { loginUser } from '@/actions/auth.action';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await loginUser(formData);
      
      if (!res.success) {
        setError(res.error || 'Login gagal.');
      } else {
        setSuccessMsg(`Selamat datang kembali, ${res.name}! Mengalihkan...`);
        
        // Simulasikan pengalihan ke dashboard admin jika role superadmin/moderator
        setTimeout(() => {
          if (res.role === 'superadmin' || res.role === 'moderator') {
            router.push('/admin/dashboard');
          } else {
            router.push('/');
          }
          router.refresh();
        }, 1200);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center relative overflow-hidden px-4 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      {/* Pendaran Bulatan Hiasan Cahaya Latar Belakang Lembut (Premium Light Glassmorphism) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#A3E635]/15 blur-[90px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200/80 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/80 space-y-8 animate-in fade-in duration-300">
        
        {/* Logo & Judul Form */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block text-3xl font-black tracking-tight text-[#1E40AF] hover:scale-105 active:scale-95 transition-all duration-300">
            push<span className="text-[#A3E635] drop-shadow-[0_1px_1px_rgba(30,64,175,0.8)]">aja</span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Selamat Datang Kembali</h2>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold">
            Masuk untuk mengelola dashboard keahlian digital Anda.
          </p>
        </div>

        {/* Notifikasi Sukses / Gagal */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex gap-2 items-center animate-in slide-in-from-top-2">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold flex gap-2 items-center animate-in slide-in-from-top-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google SSO Button */}
        <button 
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Lanjutkan dengan Google
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Atau masuk dengan email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block text-left">Alamat Email</label>
            <div className="relative">
              <input 
                type="email" 
                name="email" 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] placeholder-slate-400 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block text-left">Kata Sandi</label>
              <a href="#" className="text-[10px] sm:text-xs font-black text-[#1E40AF] hover:underline">Lupa Password?</a>
            </div>
            <div className="relative">
              <input 
                type="password" 
                name="password" 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] placeholder-slate-400 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Tombol Submit */}
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full rounded-2xl bg-gradient-to-r from-[#1E40AF] to-indigo-700 py-4 text-xs sm:text-sm font-black text-white hover:brightness-110 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Memproses Masuk...
              </span>
            ) : 'Masuk Sekarang ➔'}
          </button>
        </form>

        {/* Footer form */}
        <div className="text-center text-xs font-bold text-slate-400 pt-5 border-t border-slate-100">
          Belum punya akun? <Link href="/register" className="text-[#1E40AF] hover:underline">Mulai Daftar Akun</Link>
        </div>

      </div>
    </div>
  );
}
