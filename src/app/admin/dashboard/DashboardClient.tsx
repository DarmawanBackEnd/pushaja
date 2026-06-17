'use client';

import React, { useState, useTransition } from 'react';
import { logoutUser } from '@/actions/auth.action';
import { approveGig, rejectGig } from '@/actions/admin.action';
import { useRouter } from 'next/navigation';

// Impor Tab Komponen Moduler Baru
import OverviewTab from './tabs/OverviewTab';
import ModeratorTab from './tabs/ModeratorTab';
import VerificationTab from './tabs/VerificationTab';
import CategoryTab from './tabs/CategoryTab';
import UserTab from './tabs/UserTab';

interface DashboardClientProps {
  session: { id: string; name: string; email: string; role: string };
  initialStats: {
    totalUsers: number;
    totalGigs: number;
    totalOrders: number;
    totalDisputes: number;
    pendingGigsCount: number;
    escrowBalance: number;
  };
  initialPendingGigs: any[];
  initialDisputes: any[];
  initialModerators: any[];
  initialUnverified: any[];
  initialCategories: any[];
  initialCategoryGroups: any[];
  initialUsers: any[];
}

type TabType = 'ringkasan' | 'gigs' | 'sengketa' | 'moderator' | 'categories' | 'users';

export default function DashboardClient({
  session,
  initialStats,
  initialPendingGigs,
  initialDisputes,
  initialModerators,
  initialUnverified,
  initialCategories,
  initialCategoryGroups,
  initialUsers,
}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('ringkasan');
  const [isPending, startTransition] = useTransition();

  // Sidebar Submenu Dropdown Toggle State
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(true);

  // State untuk data dinamis terpusat
  const [stats, setStats] = useState(initialStats);
  const [pendingGigs, setPendingGigs] = useState(initialPendingGigs);
  const [disputes, setDisputes] = useState(initialDisputes);
  const [moderators, setModerators] = useState(initialModerators);
  const [unverifiedList, setUnverifiedList] = useState(initialUnverified);
  const [categories, setCategories] = useState(initialCategories);
  const [categoryGroups, setCategoryGroups] = useState(initialCategoryGroups);
  const [usersList, setUsersList] = useState(initialUsers);

  // Notifikasi Aksi
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // MOCK DATA jika database kosong
  const MOCK_PENDING_GIGS = [
    {
      id: 'mock-gig-1',
      title: 'Desain Kustom Karakter 3D Game & Rendering di Blender',
      price: 1850000,
      deliveryDays: 5,
      freelancer: { name: 'Rian Hidayat', email: 'rian@gmail.com', isVerified: true },
      category: { name: 'Desain & Seni' }
    },
    {
      id: 'mock-gig-2',
      title: 'Integrasi Payment Gateway Midtrans & Xendit di Laravel 11',
      price: 2500000,
      deliveryDays: 3,
      freelancer: { name: 'Doni Kusuma', email: 'doni@gmail.com', isVerified: false },
      category: { name: 'Web Programming' }
    }
  ];

  const MOCK_DISPUTES = [
    {
      id: 'mock-dispute-1',
      reason: 'Freelancer mengirimkan file kosong tidak sesuai brief spesifikasi awal aplikasi.',
      status: 'open',
      complainant: { name: 'Budi Hartono (Klien)', role: 'client' },
      order: { id: 'ORD-98725', totalAmount: 4500000 }
    },
    {
      id: 'mock-dispute-2',
      reason: 'Klien membatalkan proyek secara sepihak padahal pengerjaan coding sudah mencapai 90%.',
      status: 'investigating',
      complainant: { name: 'Eka Wijaya (Freelancer)', role: 'freelancer' },
      order: { id: 'ORD-25463', totalAmount: 3200000 }
    }
  ];

  const displayGigs = pendingGigs.length > 0 ? pendingGigs : MOCK_PENDING_GIGS;
  const displayDisputes = disputes.length > 0 ? disputes : MOCK_DISPUTES;

  // Format IDR Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Logika Keluar Akun Admin
  const handleLogout = async () => {
    startTransition(async () => {
      await logoutUser();
      router.push('/login');
      router.refresh();
    });
  };

  // Memperbarui metrik panel secara otomatis dari database
  const refreshStats = async () => {
    setStats(prev => ({
      ...prev,
      totalUsers: usersList.length,
      totalGigs: prev.totalGigs,
      totalOrders: prev.totalOrders,
      totalDisputes: disputes.length,
      pendingGigsCount: pendingGigs.length,
      escrowBalance: prev.escrowBalance
    }));
  };

  // Logika Persetujuan Jasa Freelance
  const handleApproveGig = async (gigId: string, isMock: boolean) => {
    setAlertMsg(null);
    if (isMock) {
      setPendingGigs(pendingGigs.filter(g => g.id !== gigId));
      setStats(prev => ({
        ...prev,
        totalGigs: prev.totalGigs + 1,
        pendingGigsCount: Math.max(0, prev.pendingGigsCount - 1)
      }));
      setAlertMsg({ type: 'success', text: 'Jasa simulasi berhasil disetujui!' });
      return;
    }

    const res = await approveGig(gigId);
    if (res.success) {
      setPendingGigs(pendingGigs.filter(g => g.id !== gigId));
      setStats(prev => ({
        ...prev,
        totalGigs: prev.totalGigs + 1,
        pendingGigsCount: Math.max(0, prev.pendingGigsCount - 1)
      }));
      setAlertMsg({ type: 'success', text: 'Jasa berhasil disetujui!' });
    } else {
      setAlertMsg({ type: 'error', text: 'Gagal menyetujui jasa: ' + res.error });
    }
  };

  // Logika Penolakan Jasa Freelance
  const handleRejectGig = async (gigId: string, isMock: boolean) => {
    setAlertMsg(null);
    if (isMock) {
      setPendingGigs(pendingGigs.filter(g => g.id !== gigId));
      setStats(prev => ({
        ...prev,
        pendingGigsCount: Math.max(0, prev.pendingGigsCount - 1)
      }));
      setAlertMsg({ type: 'success', text: 'Jasa simulasi berhasil ditolak.' });
      return;
    }

    const res = await rejectGig(gigId);
    if (res.success) {
      setPendingGigs(pendingGigs.filter(g => g.id !== gigId));
      setStats(prev => ({
        ...prev,
        pendingGigsCount: Math.max(0, prev.pendingGigsCount - 1)
      }));
      setAlertMsg({ type: 'success', text: 'Jasa berhasil ditolak.' });
    } else {
      setAlertMsg({ type: 'error', text: 'Gagal menolak jasa: ' + res.error });
    }
  };

  // Logika Penyelesaian Sengketa
  const handleResolveDispute = (disputeId: string, actionType: 'refund' | 'release') => {
    setAlertMsg(null);
    setDisputes(disputes.filter(d => d.id !== disputeId));
    setStats(prev => ({
      ...prev,
      totalDisputes: Math.max(0, prev.totalDisputes - 1)
    }));

    const actionText = actionType === 'refund' 
      ? 'Dana sukses dikembalikan penuh ke saldo klien (Escrow Refund).' 
      : 'Dana transaksi sukses dicairkan langsung ke saldo freelancer.';
    
    setAlertMsg({ type: 'success', text: `Sengketa diselesaikan! ${actionText}` });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans selection:bg-[#A3E635] selection:text-[#1E40AF]">
      
      {/* ----------------------------------------------------
          SIDEBAR KONTROL PANEL (GRADASI PUSHAJA BRAND PALETTE #1E40AF)
         ---------------------------------------------------- */}
      <aside className="w-full md:w-80 bg-gradient-to-b from-[#1E40AF] via-blue-900 to-indigo-950 text-white flex flex-col justify-between p-6 shrink-0 border-r border-blue-950 shadow-2xl relative overflow-hidden">
        
        {/* Glow efek pendaran lime green halus di belakang sidebar */}
        <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-[#A3E635]/10 rounded-full blur-[70px] pointer-events-none"></div>

        {/* Bagian Atas Sidebar */}
        <div className="space-y-8 relative z-10">
          
          {/* Logo Brand */}
          <div className="flex flex-col gap-2">
            <span className="text-2.5xl font-black tracking-tight text-white text-left">
              push<span className="text-[#A3E635] drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)]">aja</span>
            </span>
            <span className="inline-flex self-start rounded-full bg-white/10 px-3.5 py-1 text-[9px] font-black text-[#A3E635] border border-white/10 uppercase tracking-widest">
              KONTROL PANEL ADMINISTRATOR
            </span>
          </div>

          {/* Menu Navigasi Baru dengan SVG LINE-ART ICONS (Bebas Emoticon) */}
          <nav className="flex flex-col gap-2.5">
            
            {/* 1. Dashboard Utama */}
            <button
              onClick={() => { setActiveTab('ringkasan'); setAlertMsg(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 text-left cursor-pointer group ${
                activeTab === 'ringkasan'
                  ? 'bg-white text-[#1E40AF] shadow-xl shadow-blue-950/20'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg className="h-5 w-5 stroke-current transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <title>Dashboard Utama</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
              Dashboard Utama
            </button>

            {/* 2. Kelola Moderator (Hanya Superadmin) */}
            {session.role === 'superadmin' && (
              <button
                onClick={() => { setActiveTab('moderator'); setAlertMsg(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 text-left cursor-pointer group ${
                  activeTab === 'moderator'
                    ? 'bg-white text-[#1E40AF] shadow-xl shadow-blue-950/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <svg className="h-5 w-5 stroke-current transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <title>Kelola Moderator</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11M3.07 9h17.86M12 11v6.5M12 4.5a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Kelola Moderator
              </button>
            )}

            {/* 3. Verifikasi Freelancer */}
            <button
              onClick={() => { setActiveTab('gigs'); setAlertMsg(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 text-left cursor-pointer group ${
                activeTab === 'gigs'
                  ? 'bg-white text-[#1E40AF] shadow-xl shadow-blue-950/20'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg className="h-5 w-5 stroke-current transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <title>Verifikasi Freelancer</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verifikasi Freelancer
              {unverifiedList.length > 0 && (
                <span className="ml-auto bg-[#A3E635] text-slate-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shrink-0">
                  {unverifiedList.length}
                </span>
              )}
            </button>

            {/* 4. Dropdown Pengaturan Layanan */}
            <div className="space-y-1">
              <button
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 text-left cursor-pointer ${
                  activeTab === 'categories'
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <title>Pengaturan Layanan</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Pengaturan Layanan
                </span>
                <span className={`text-[9px] transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* Submenus dengan Indentasi */}
              {isServicesDropdownOpen && (
                <div className="pl-4 flex flex-col gap-1 transition-all duration-300 animate-in slide-in-from-top-2 text-left">
                  <button
                    onClick={() => { setActiveTab('categories'); setAlertMsg(null); }}
                    className={`w-full px-4 py-2.5 rounded-xl text-[11px] font-bold text-left cursor-pointer transition-colors ${
                      activeTab === 'categories'
                        ? 'text-[#A3E635] bg-white/10'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    • Kelola Klasifikasi & Layanan
                  </button>
                </div>
              )}
            </div>

            {/* 5. Kelola Pengguna */}
            <button
              onClick={() => { setActiveTab('users'); setAlertMsg(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 text-left cursor-pointer group ${
                activeTab === 'users'
                  ? 'bg-white text-[#1E40AF] shadow-xl shadow-blue-950/20'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg className="h-5 w-5 stroke-current transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <title>Manajemen Pengguna</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Manajemen Pengguna
            </button>

            {/* 6. Kelola Sengketa Transaksi */}
            <button
              onClick={() => { setActiveTab('sengketa'); setAlertMsg(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 text-left cursor-pointer group ${
                activeTab === 'sengketa'
                  ? 'bg-white text-[#1E40AF] shadow-xl shadow-blue-950/20'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg className="h-5 w-5 stroke-current transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <title>Sengketa Transaksi</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9m3 1l3-1m9 4l-3-1m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9m3 1l3 1M12 12V3m0 18v-9" />
              </svg>
              Sengketa Transaksi
              {stats.totalDisputes > 0 && (
                <span className="ml-auto bg-rose-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shrink-0">
                  {stats.totalDisputes}
                </span>
              )}
            </button>

          </nav>
        </div>

        {/* Bagian Bawah Sidebar (Info Admin & Keluar) */}
        <div className="mt-12 pt-6 border-t border-white/15 space-y-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A3E635] text-slate-900 font-black text-sm">
              {session.name.charAt(0)}
            </div>
            <div className="overflow-hidden text-left">
              <h4 className="text-xs font-black text-white leading-none truncate">{session.name}</h4>
              <span className="text-[9px] font-bold text-white/50 block mt-1.5 uppercase tracking-widest">{session.role}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-rose-600 hover:text-white border border-white/10 py-3 text-xs font-black text-white transition-all active:scale-[0.98] cursor-pointer animate-in fade-in"
          >
            <svg className="h-4.5 w-4.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <title>Keluar Sistem</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isPending ? 'Keluar Akun...' : 'Keluar Sistem'}
          </button>
        </div>

      </aside>

      {/* ----------------------------------------------------
          KONTEN UTAMA (LIGHT BACKGROUND WITH WHITE CARD TILES)
         ---------------------------------------------------- */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Header Content Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="text-left">
            <h1 className="text-2xl font-black text-slate-900 capitalize flex items-center gap-2.5">
              {activeTab === 'ringkasan' && 'Ringkasan Dashboard Utama'}
              {activeTab === 'moderator' && 'Manajemen Akun Moderator'}
              {activeTab === 'gigs' && 'Verifikasi Pengaju Freelancer'}
              {activeTab === 'categories' && 'Pengaturan Kategori Jasa'}
              {activeTab === 'users' && 'Daftar Manajemen Pengguna'}
              {activeTab === 'sengketa' && 'Pusat Mediasi Sengketa'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-semibold">
              {activeTab === 'ringkasan' && 'Selamat datang, Anda memegang kendali ekosistem digital pushaja.'}
              {activeTab === 'moderator' && 'Tambahkan, ubah, dan kelola akun moderator terpercaya.'}
              {activeTab === 'gigs' && 'Tinjau berkas pendaftaran spesialis freelancer pushaja.'}
              {activeTab === 'categories' && 'Atur taksonomi dan jenis kategori pencarian beranda.'}
              {activeTab === 'users' && 'Pantau pertumbuhan akun client dan freelancer di sistem.'}
              {activeTab === 'sengketa' && 'Selesaikan perselisihan transaksi escrow dengan adil.'}
            </p>
          </div>
          <div className="text-xs font-black text-slate-400 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl self-start shrink-0">
            📅 HARI INI: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Notifikasi Sistem Alert */}
        {alertMsg && (
          <div className={`p-4 rounded-3xl border flex gap-2.5 items-center text-xs font-bold animate-in slide-in-from-top-3 ${
            alertMsg.type === 'success' 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-600' 
              : 'bg-rose-50/70 border-rose-200 text-rose-600'
          }`}>
            <span className="shrink-0">
              {alertMsg.type === 'success' ? (
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <title>Sukses</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <title>Peringatan</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </span>
            <span>{alertMsg.text}</span>
            <button onClick={() => setAlertMsg(null)} className="ml-auto text-slate-400 hover:text-slate-650 cursor-pointer focus:outline-none">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <title>Tutup</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB SWITCHER - MENYALAKAN KOMPONEN TAB MODULER
           ---------------------------------------------------- */}
        
        {/* Tab 1: Dashboard Utama */}
        {activeTab === 'ringkasan' && (
          <OverviewTab 
            stats={stats} 
            sessionName={session.name} 
            onNavigateToGigs={() => setActiveTab('gigs')} 
          />
        )}

        {/* Tab 2: CRUD Moderator (Hanya Superadmin) */}
        {activeTab === 'moderator' && (
          <ModeratorTab 
            moderators={moderators} 
            userRole={session.role} 
            onRefresh={(updated) => setModerators(updated)}
          />
        )}

        {/* Tab 3: Verifikasi Freelancer (KYC Approvals) */}
        {activeTab === 'gigs' && (
          <VerificationTab 
            unverifiedList={unverifiedList} 
            onRefresh={(updated) => setUnverifiedList(updated)}
            onUpdateStats={refreshStats}
          />
        )}

        {/* Tab 4: Pengaturan Kategori Jasa (CRUD Categories & Groups) */}
        {activeTab === 'categories' && (
          <CategoryTab 
            categories={categories} 
            categoryGroups={categoryGroups}
            onRefresh={(updated) => setCategories(updated)}
            onRefreshGroups={(updated) => setCategoryGroups(updated)}
            onUpdateStats={refreshStats}
          />
        )}

        {/* Tab 5: Manajemen Pengguna */}
        {activeTab === 'users' && (
          <UserTab usersList={usersList} />
        )}

        {/* Tab 6: Kelola Sengketa Transaksi (Mediasi Rekber) */}
        {activeTab === 'sengketa' && (
          <div className="space-y-6 text-left animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-black text-slate-900">Kelola Sengketa & Klaim Pengembalian (Dispute center)</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Pusat Mediasi Sengketa</p>
            </div>

            {displayDisputes.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-slate-200/60 p-12 text-center shadow-sm flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <title>Sengketa Selesai</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-sm font-extrabold text-slate-800">Semua Sengketa Tuntas</h4>
                <p className="text-xs text-slate-400 mt-1">Tidak ada laporan sengketa transaksi yang perlu ditangani saat ini.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {displayDisputes.map((dispute) => (
                  <div 
                    key={dispute.id} 
                    className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                      <div className="text-left">
                        <span className="text-xs font-bold text-slate-400">ID Pesanan:</span>
                        <strong className="text-xs font-extrabold text-slate-800 ml-1.5">{dispute.order?.id}</strong>
                      </div>
                      <div className="flex items-center gap-2 self-start">
                        <span className="rounded-full bg-rose-500/10 px-3 py-1 text-[9px] font-black text-rose-500 border border-rose-500/20 uppercase tracking-wider flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <title>Palu Keadilan</title>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9m3 1l3-1m9 4l-3-1m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9m3 1l3 1M12 12V3m0 18v-9" />
                          </svg>
                          STATUS COMPLAINT: {dispute.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          Diajukan oleh: <strong className="text-[#1E40AF]">{dispute.complainant?.name}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center">
                      <div className="text-left max-w-3xl space-y-2">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Alasan Pengaduan (Dispute Brief):</h5>
                        <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-medium italic">
                          "{dispute.reason}"
                        </p>
                      </div>

                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 shrink-0 w-full lg:w-auto border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] text-slate-400 font-black block uppercase tracking-widest">Jumlah Transaksi</span>
                          <span className="text-base font-black text-rose-600">
                            {formatRupiah(dispute.order?.totalAmount)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolveDispute(dispute.id, 'refund')}
                            className="rounded-xl border border-rose-200 bg-rose-50 text-rose-600 px-4 py-2.5 text-xs font-black hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                          >
                            Kembalikan ke Klien
                          </button>
                          <button
                            onClick={() => handleResolveDispute(dispute.id, 'release')}
                            className="rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-xs font-black hover:bg-emerald-700 shadow-sm active:scale-95 transition-all cursor-pointer"
                          >
                            Cairkan ke Freelancer
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
}
