import React from 'react';
import { getFreelancerStats } from '@/actions/freelancer.gig.action';
import Link from 'next/link';
import IncomeChart from '@/components/freelancer/IncomeChart';

export default async function FreelancerDashboardOverview() {
  const statsRes = await getFreelancerStats();
  
  if (!statsRes.success) {
    return (
      <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-100">
        <h3 className="font-bold text-lg">Akses Ditolak</h3>
        <p className="mt-1">{statsRes.error}</p>
      </div>
    );
  }

  const { activeGigs, totalEarnings, totalReviews } = statsRes.data!;

  // Format IDR
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Ringkasan Kinerja</h1>
        <p className="text-slate-500 mt-2 font-medium">Pantau terus perkembangan jasa dan penghasilan Anda di pushaja.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Penghasilan */}
        <div className="bg-gradient-to-br from-[#1E40AF] to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-blue-100 font-bold text-sm mb-1 uppercase tracking-wider">Total Penghasilan</p>
            <h3 className="text-3xl font-black">{formatIDR(totalEarnings)}</h3>
            <div className="mt-4 inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Saldo Siap Cair
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>

        {/* Card Jasa Aktif */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <p className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Jasa Aktif (Gigs)</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-black text-slate-800">{activeGigs}</h3>
            <span className="text-sm font-semibold text-slate-500 mb-1">Layanan</span>
          </div>
          <div className="mt-6">
            <Link href="/freelancer/dashboard/gigs" className="text-[#1E40AF] text-sm font-bold hover:underline inline-flex items-center gap-1">
              Kelola Jasa
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="absolute top-6 right-6 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        {/* Card Ulasan */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <p className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Total Ulasan</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-black text-slate-800">{totalReviews}</h3>
            <span className="text-sm font-semibold text-slate-500 mb-1">Ulasan Masuk</span>
          </div>
          <div className="mt-6">
            <Link href="/freelancer/dashboard/reviews" className="text-[#1E40AF] text-sm font-bold hover:underline inline-flex items-center gap-1">
              Lihat Ulasan
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="absolute top-6 right-6 w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Grafik Chart Pendapatan */}
      <IncomeChart />

    </div>
  );
}
