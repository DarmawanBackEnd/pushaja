'use client';

import React, { useState, useTransition } from 'react';
import { registerUser } from '@/actions/auth.action';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Briefcase 
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.set('role', 'client'); // Secara default ketika mendaftar otomatis menjadi client/user
    
    startTransition(async () => {
      const res = await registerUser(formData);
      
      if (!res.success) {
        setError(res.error || 'Pendaftaran gagal.');
      } else {
        setSuccessMsg('Akun Anda berhasil terdaftar dengan aman! Mengalihkan ke halaman masuk...');
        
        setTimeout(() => {
          router.push('/login');
        }, 1800);
      }
    });
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-white text-slate-800 flex flex-col lg:flex-row selection:bg-[#A3E635] selection:text-[#1E40AF]">
      
      {/* ----------------------------------------------------
          KOLOM KIRI: BACKGROUND GAMBAR & SHOWCASE BRANDING
         ---------------------------------------------------- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-8 xl:p-12 h-full">
        {/* Background Image dengan overlay gradient premium */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/auth-bg.jpg" 
            alt="PushAja Community" 
            fill 
            priority 
            className="object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/50 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-[#1E40AF]/25 mix-blend-multiply"></div>
        </div>

        {/* Bagian Atas: Badge Platform & Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95 duration-200">
            <div className="relative w-44 h-12">
              <Image 
                src="/logo-dinkop-kota-serang-new.png" 
                alt="Logo DinkopUKM Kota Serang" 
                fill 
                priority 
                className="object-contain object-left" 
              />
            </div>
          </Link>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#A3E635] text-[11px] font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gabung Komunitas</span>
          </div>
        </div>

        {/* Bagian Tengah / Bawah: Headline & Nilai Tambah */}
        <div className="relative z-10 space-y-5 max-w-lg my-auto">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/30 text-[#A3E635] text-[10px] font-black uppercase tracking-widest">
              <Briefcase className="w-3 h-3" /> Peluang Digital Tanpa Batas
            </div>
            <h1 className="text-2xl xl:text-3xl font-black text-white leading-snug tracking-tight">
              Mulai Karir & Bisnis Anda Bersama <span className="text-[#A3E635]">PushAja</span>.
            </h1>
            <p className="text-slate-300 text-xs xl:text-sm leading-relaxed font-medium">
              Bergabung bersama ribuan klien dan talenta terverifikasi untuk bertransaksi dan mengembangkan proyek digital dengan garansi aman.
            </p>
          </div>

          {/* Fitur Unggulan dalam Card Transparan Glassmorphism */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <div className="flex items-center gap-1.5 text-white font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
                <span>Bebas Risiko Tipu-Tipu</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-normal">Sistem rekening bersama dan kontrak cerdas menjaga transaksi aman.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <div className="flex items-center gap-1.5 text-white font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
                <span>Pendaftaran Cepat</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-normal">Cukup 1 menit untuk memiliki akun dan menjelajah ribuan jasa.</p>
            </div>
          </div>
        </div>

        {/* Footer Kolom Kiri */}
        <div className="relative z-10 text-[11px] text-slate-400 font-medium border-t border-white/10 pt-3 flex justify-between items-center">
          <span>© {new Date().getFullYear()} PushAja Indonesia</span>
          <span>Platform Marketplace Digital</span>
        </div>
      </div>

      {/* ----------------------------------------------------
          KOLOM KANAN: FORM REGISTER (COMPACT, NO SCROLL)
         ---------------------------------------------------- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50/70 relative h-full overflow-hidden">
        
        {/* Ambient Background Glow Lembut */}
        <div className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] rounded-full bg-blue-200/40 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] rounded-full bg-[#A3E635]/20 blur-[70px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[430px] bg-white border border-slate-200/80 p-5 sm:p-7 rounded-[2rem] shadow-xl shadow-slate-200/60 space-y-3.5 sm:space-y-4 animate-in fade-in duration-300">
          
          {/* Navigasi Kembali ke Home */}
          <div className="flex items-center justify-between pb-0.5">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#1E40AF] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Register</span>
          </div>

          {/* Logo Brand Konsisten dengan Navbar */}
          <div className="text-center space-y-1">
            <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95 duration-200">
              <div className="relative w-44 h-12 mx-auto">
                <Image 
                  src="/logo-dinkop-kota-serang-new.png"
                  alt="Logo DinkopUKM Kota Serang" 
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Daftar Akun Baru</h2>
            <p className="text-slate-500 text-xs font-medium leading-tight">
              Bergabung bersama ribuan talenta digital terbaik di Indonesia.
            </p>
          </div>

          {/* Notifikasi Sukses / Gagal */}
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex gap-2 items-center animate-in slide-in-from-top-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold flex gap-2 items-center animate-in slide-in-from-top-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google SSO Button */}
          <button 
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Daftar dengan Google</span>
          </button>

          <div className="relative flex items-center py-0.5">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Atau email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form Pendaftaran dengan Ikon Rapi & Grid Compact */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Grid 2 Kolom: Nama Lengkap & Nomor HP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block text-left">Nama Lengkap</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="Nama Anda"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/15 placeholder-slate-400 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block text-left">No. HP (Opsional)</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="0812..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/15 placeholder-slate-400 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block text-left">Alamat Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="nama@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 sm:py-2.5 pl-10 pr-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/15 placeholder-slate-400 font-semibold"
                />
              </div>
            </div>

            {/* Kata Sandi */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block text-left">Kata Sandi Baru</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name="password" 
                  required 
                  placeholder="Min. 6 karakter"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 sm:py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/15 placeholder-slate-400 font-semibold"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Tombol Submit */}
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full rounded-xl bg-gradient-to-r from-[#1E40AF] to-indigo-700 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-white hover:brightness-110 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center mt-2"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Memproses Pendaftaran...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <span>Daftar Akun Baru</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Footer form */}
          <div className="text-center text-xs font-semibold text-slate-400 pt-2 border-t border-slate-100">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="text-[#1E40AF] font-bold hover:underline">
              Masuk Sekarang
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
