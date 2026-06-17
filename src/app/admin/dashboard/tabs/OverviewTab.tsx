'use client';

import React from 'react';

import AdminCharts from '@/components/admin/AdminCharts';
import AdminWidgets from '@/components/admin/AdminWidgets';

interface OverviewTabProps {
  stats: {
    totalUsers: number;
    totalGigs: number;
    totalOrders: number;
    totalDisputes: number;
    pendingGigsCount: number;
    escrowBalance: number;
  };
  sessionName: string;
  onNavigateToGigs: () => void;
}

export default function OverviewTab({ stats, sessionName, onNavigateToGigs }: OverviewTabProps) {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Asumsi komisi platform 10% dari total escrow
  const platformFee = stats.escrowBalance * 0.1;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Grid Kartu Metrik Utama */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* Total Pengguna */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-shadow text-left">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Total Pengguna</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalUsers}</span>
            <span className="text-[10px] font-bold text-slate-400">akun</span>
          </div>
        </div>

        {/* Total Katalog Jasa */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-shadow text-left">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Katalog Jasa</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-black text-[#1E40AF] tracking-tight">{stats.totalGigs}</span>
            <span className="text-[10px] font-bold text-slate-400">layanan</span>
          </div>
        </div>

        {/* Total Pesanan */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-shadow text-left">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Total Order</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalOrders}</span>
            <span className="text-[10px] font-bold text-slate-400">transaksi</span>
          </div>
        </div>

        {/* Dana Escrow */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-shadow text-left">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Dana Escrow Rekber</span>
          <div className="mt-4">
            <span className="text-lg sm:text-xl font-black text-slate-800 tracking-tight block">
              {formatRupiah(stats.escrowBalance)}
            </span>
          </div>
        </div>

        {/* Komisi Platform */}
        <div className="bg-gradient-to-br from-[#1E40AF] to-indigo-900 p-6 rounded-[2rem] shadow-md flex flex-col justify-between h-36 hover:shadow-lg transition-shadow text-left relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-16 h-16 bg-[#A3E635]/20 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-blue-200 text-[10px] font-black uppercase tracking-wider block relative z-10">Keuntungan Platform</span>
          <div className="mt-4 relative z-10">
            <span className="text-xl sm:text-2xl font-black text-[#A3E635] tracking-tight block drop-shadow-md">
              {formatRupiah(platformFee)}
            </span>
            <span className="text-[10px] font-bold text-white/70 block mt-1 uppercase tracking-widest">Est. Komisi 10%</span>
          </div>
        </div>

      </div>

      {/* Bagian Charts (Volume & Growth) */}
      <AdminCharts />

      {/* Bagian Widgets (Priority, Leaderboard, Live Feed) */}
      <AdminWidgets />

    </div>
  );
}
