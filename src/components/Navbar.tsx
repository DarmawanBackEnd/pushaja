'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCurrentSession, logoutUser } from '@/actions/auth.action';
import { getUserProfile } from '@/actions/account.action';

/**
 * KOMPONEN: Navbar
 * 
 * APA komponen ini?
 * Komponen navigasi utama untuk "pushaja" yang dirancang persis menyerupai gaya minimalis
 * premium milik Fastwork.
 * 
 * MENGAPA ditulis seperti ini?
 * 1. `'use client'`: Navbar membutuhkan interaktivitas dinamis seperti mengontrol dropdown 
 *    menu ("Mempekerjakan"), status klik menu mobile, dan transisi efek aktif.
 * 2. Visual Bersih (White Theme): Menggunakan latar belakang putih bersih (`bg-white`), 
 *    perbatasan abu-abu tipis (`border-slate-200`), dan tautan berwarna gelap (`text-slate-700`) 
 *    yang sangat kontras dan profesional.
 * 3. Menghilangkan Fitur Bahasa: Sesuai ulasan umpan balik Anda, ikon bendera Indonesia / 
 *    pemilihan bahasa ditiadakan agar menjaga antarmuka tetap bersih dan berfokus pada fitur inti.
 */
export default function Navbar() {
  const [isHireOpen, setIsHireOpen] = useState(false);
  // State untuk menu mobile (responsif layar hp)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State untuk session dan profile
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCurrentSession().then(s => setSession(s));
    getUserProfile().then(p => setProfile(p));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* ----------------------------------------------------
              BAGIAN KIRI: LOGO PUSHAJA
             ---------------------------------------------------- */}
          <div className="flex items-center gap-8 shrink-0">
            <a href="/" className="flex items-center group">
              <div className="relative w-32 h-9 transition-transform group-hover:scale-105">
                <Image 
                  src="/logo%20pushaja.png"
                  alt="Logo pushaja" 
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </a>

            {/* Menu Navigasi Tengah (Desktop Only) */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <a href="#" className="hover:text-[#1E40AF] transition-colors">Jobboard</a>
              
              {/* Dropdown Mempekerjakan */}
              <div className="relative">
                <button 
                  onClick={() => setIsHireOpen(!isHireOpen)}
                  onBlur={() => setTimeout(() => setIsHireOpen(false), 200)}
                  className="flex items-center gap-1 hover:text-[#1E40AF] transition-colors focus:outline-none"
                >
                  Mempekerjakan
                  <svg className={`h-4 w-4 transition-transform duration-200 ${isHireOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu Box */}
                {isHireOpen && (
                  <div className="absolute left-0 mt-3 w-56 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <a href="#" className="block rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] transition-colors">
                      Buat Project Baru (Brief)
                    </a>
                    <a href="#" className="block rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] transition-colors">
                      Cari Berdasarkan Keahlian
                    </a>
                    <a href="#" className="block rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] transition-colors">
                      Panduan Rekrutmen Freelancer
                    </a>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* ----------------------------------------------------
              BAGIAN KANAN: TOMBOL AKSI & USER REGISTER
             ---------------------------------------------------- */}
          <div className="hidden md:flex items-center gap-6 text-sm font-bold shrink-0">
            {session ? (
              // TAMPILAN SETELAH LOGIN (FOTO PROFIL & DROPDOWN PENGATURAN)
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
                >
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-slate-800">{profile?.name || session.name}</p>
                    <p className="text-xs font-semibold text-slate-400 capitalize">{session.role}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E40AF] to-[#A3E635] flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden relative">
                    {profile?.profilePicture ? (
                      <Image src={profile.profilePicture} alt="Profile" fill className="object-cover" />
                    ) : (
                      (profile?.name || session.name) ? (profile?.name || session.name).charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  <svg className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Pengaturan */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-4 py-2 border-b border-slate-50 mb-2">
                      <p className="text-xs font-bold text-slate-400">Akun Anda</p>
                    </div>
                    {session.role === 'superadmin' || session.role === 'moderator' ? (
                      <a href="/admin/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Dashboard Admin
                      </a>
                    ) : null}

                    {session.role === 'freelancer' ? (
                      <a href="/freelancer/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Dashboard Freelancer
                      </a>
                    ) : null}

                    {session.role === 'client' ? (
                      <a href="/freelancer/apply" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Daftar sebagai Freelancer
                      </a>
                    ) : null}
                    
                    <a href="/chat/order-dummy-123" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] transition-colors">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      Kotak Pesan
                    </a>

                    <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] transition-colors">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                      Kupon Diskon
                    </a>

                    <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] transition-colors">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      Favorit
                    </a>
                    
                    <a href="/account/settings" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] transition-colors">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Pengaturan Akun
                    </a>

                    <div className="h-[1px] bg-slate-100 my-1"></div>
                    
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                      <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // TAMPILAN SEBELUM LOGIN (TOMBOL DAFTAR / MASUK)
              <>
                {/* Link Daftar sebagai Freelancer (Warna aksen biru elegan) */}
                <a href="/freelancer/apply" className="text-slate-600 hover:text-[#1E40AF] transition-colors font-semibold">
                  Daftar sebagai freelancer
                </a>
                
                {/* Garis Pembatas Vertikal tipis */}
                <div className="h-5 w-[1px] bg-slate-200"></div>

                {/* Tombol Masuk */}
                <a href="/login" className="text-slate-600 hover:text-[#1E40AF] transition-colors font-semibold">
                  Masuk
                </a>

                {/* Tombol Daftar / Registrasi (Blue Pill Button) */}
                <a 
                  href="/register" 
                  className="rounded-full bg-[#1E40AF] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 hover:bg-[#1e40af]/90 hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  Daftar
                </a>
              </>
            )}
          </div>

          {/* Tombol Burger Menu (Mobile Only) */}
          <div className="flex md:hidden items-center shrink-0">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200 transition-all focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* ----------------------------------------------------
          MOBILE MENU PANEL (TAMPIL HANYA DI HP)
         ---------------------------------------------------- */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-6 shadow-inner animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-sm font-bold text-slate-700">
            <a href="#" className="block py-2 hover:text-[#1E40AF]">Jobboard</a>
            <a href="#" className="block py-2 hover:text-[#1E40AF]">Cari Freelancer</a>
            
            {session ? (
              <>
                <div className="h-[1px] bg-slate-100 my-2"></div>
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E40AF] to-[#A3E635] flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden relative shrink-0">
                    {profile?.profilePicture ? (
                      <Image src={profile.profilePicture} alt="Profile" fill className="object-cover" />
                    ) : (
                      (profile?.name || session.name) ? (profile?.name || session.name).charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{profile?.name || session.name}</p>
                    <p className="text-xs font-semibold text-slate-400 capitalize">{session.role}</p>
                  </div>
                </div>
                <div className="h-[1px] bg-slate-100 my-2"></div>
                {session.role === 'superadmin' || session.role === 'moderator' ? (
                  <a href="/admin/dashboard" className="block py-2 hover:text-[#1E40AF]">Dashboard Admin</a>
                ) : null}
                {session.role === 'freelancer' ? (
                  <a href="/freelancer/dashboard" className="block py-2 hover:text-[#1E40AF]">Dashboard Freelancer</a>
                ) : null}
                {session.role === 'client' ? (
                  <a href="/freelancer/apply" className="block py-2 hover:text-[#1E40AF]">Daftar sebagai Freelancer</a>
                ) : null}
                <Link href="/chat/order-dummy-123" className="block py-2 hover:text-[#1E40AF]">Kotak Pesan</Link>
                <a href="#" className="block py-2 hover:text-[#1E40AF]">Kupon Diskon</a>
                <a href="#" className="block py-2 hover:text-[#1E40AF]">Favorit</a>
                <a href="/account/settings" className="block py-2 hover:text-[#1E40AF]">Pengaturan Akun</a>
                <button onClick={handleLogout} className="block py-2 text-left text-rose-600 hover:text-rose-700">Keluar</button>
              </>
            ) : (
              <>
                <a href="/freelancer/apply" className="block py-2 text-[#1E40AF] hover:underline">Daftar sebagai freelancer</a>
                
                <div className="h-[1px] bg-slate-100 my-2"></div>
                
                <a href="/login" className="block py-2 text-center text-slate-600 hover:text-[#1E40AF]">Masuk</a>
                <a 
                  href="/register" 
                  className="block rounded-full bg-[#1E40AF] py-3 text-center text-white hover:bg-[#1e40af]/90 shadow-md transition-all"
                >
                  Daftar Akun
                </a>
              </>
            )}

          </nav>
        </div>
      )}
    </header>
  );
}
