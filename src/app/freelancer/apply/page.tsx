import React, { Suspense } from 'react';
import FreelancerApplyClient from './FreelancerApplyClient';

export const metadata = {
  title: 'Daftar Menjadi Freelancer | PushAja',
  description: 'Bergabunglah menjadi mitra freelancer PushAja. Publikasikan keahlian Anda, dapatkan klien terpercaya, dan nikmati sistem pembayaran aman via Escrow.',
};

export default function ApplyFreelancerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#1E40AF] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">Memuat Pendaftaran...</p>
          </div>
        </div>
      }
    >
      <FreelancerApplyClient />
    </Suspense>
  );
}
