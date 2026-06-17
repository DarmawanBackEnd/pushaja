import React from 'react';
import { getFreelancerStats } from '@/actions/freelancer.gig.action';

export default async function FreelancerEarningsPage() {
  const statsRes = await getFreelancerStats();

  if (!statsRes.success) {
    return (
      <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-100">
        <h3 className="font-bold text-lg">Akses Ditolak</h3>
        <p className="mt-1">{statsRes.error}</p>
      </div>
    );
  }

  const { totalEarnings } = statsRes.data!;

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Penghasilan & Keuangan</h2>
        <p className="text-slate-500 mt-2 font-medium">Pantau saldo yang siap dicairkan dari transaksi yang telah selesai.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-12 shadow-sm text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Saldo Bersih Tersedia</p>
        <h1 className="text-5xl md:text-6xl font-black text-[#1E40AF] mb-8">{formatIDR(totalEarnings)}</h1>

        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Tarik Saldo (Withdraw)
        </button>
        <p className="text-xs text-slate-400 mt-4 font-semibold">Penarikan akan ditransfer ke rekening bank yang Anda daftarkan saat pendaftaran.</p>
      </div>
    </div>
  );
}
