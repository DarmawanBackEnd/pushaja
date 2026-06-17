'use client';

import React, { useState, useTransition } from 'react';
import { approveFreelancer, rejectFreelancer } from '@/actions/admin.action';

interface VerificationTabProps {
  unverifiedList: any[];
  onRefresh: (newList: any[]) => void;
  onUpdateStats: () => void;
}

export default function VerificationTab({ unverifiedList, onRefresh, onUpdateStats }: VerificationTabProps) {
  const [isPending, startTransition] = useTransition();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const displayApplicants = unverifiedList;

  // Aksi Menyetujui Pengajuan Menjadi Freelancer
  const handleApprove = (id: string, isMock: boolean) => {
    setAlert(null);
    startTransition(async () => {
      if (isMock) {
        // Hapus dari state pendaftar
        onRefresh(unverifiedList.filter(u => u.id !== id));
        setAlert({ type: 'success', text: 'Simulasi Berhasil: Pendaftar disetujui menjadi Freelancer terverifikasi!' });
        onUpdateStats();
        return;
      }

      const res = await approveFreelancer(id);
      if (res.success) {
        onRefresh(unverifiedList.filter(u => u.id !== id));
        setAlert({ type: 'success', text: 'Pendaftar sukses disetujui menjadi Freelancer di basis data PostgreSQL!' });
        onUpdateStats();
      } else {
        setAlert({ type: 'error', text: 'Gagal menyetujui pendaftaran: ' + res.error });
      }
    });
  };

  // Aksi Menolak Pengajuan
  const handleReject = (id: string, isMock: boolean) => {
    setAlert(null);
    startTransition(async () => {
      if (isMock) {
        onRefresh(unverifiedList.filter(u => u.id !== id));
        setAlert({ type: 'success', text: 'Simulasi Berhasil: Pengajuan pendaftaran freelancer ditolak.' });
        return;
      }

      const res = await rejectFreelancer(id);
      if (res.success) {
        onRefresh(unverifiedList.filter(u => u.id !== id));
        setAlert({ type: 'success', text: 'Pengajuan pendaftaran freelancer berhasil ditolak.' });
      } else {
        setAlert({ type: 'error', text: 'Gagal menolak pengajuan: ' + res.error });
      }
    });
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-xl font-black text-slate-900">Verifikasi Pengajuan Talenta (Freelancer KYC)</h2>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Tinjau dan setujui pengguna yang ingin menawarkan keahlian digital</p>
      </div>

      {/* Notifikasi Alert */}
      {alert && (
        <div className={`p-4 rounded-3xl border flex gap-2.5 items-center text-xs font-bold animate-in slide-in-from-top-3 ${
          alert.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
        }`}>
          <span className="shrink-0">
            {alert.type === 'success' ? (
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
          <span>{alert.text}</span>
          <button onClick={() => setAlert(null)} className="ml-auto text-slate-400 hover:text-slate-650 cursor-pointer focus:outline-none">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <title>Tutup</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* List Applicants */}
      {displayApplicants.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-200/60 p-12 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
            <svg className="h-6 w-6 text-blue-550" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <title>KYC Bersih</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h4 className="text-sm font-extrabold text-slate-800">Antrean KYC Bersih</h4>
          <p className="text-xs text-slate-400 mt-1">Tidak ada pengajuan verifikasi menjadi freelancer saat ini.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {displayApplicants.map((app) => {
            return (
              <div 
                key={app.id} 
                className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Info Pengaju */}
                <div className="space-y-3 max-w-3xl text-left">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black text-blue-600 border border-blue-100 uppercase">
                      Pengaju Freelancer
                    </span>
                  </div>
                  
                  <h4 className="text-base font-extrabold text-slate-800 leading-snug">
                    {app.fullName} <span className="text-xs text-slate-400 font-bold ml-1">({app.email})</span>
                  </h4>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                    <div className="font-semibold text-slate-500">
                      Tautan Portofolio: {app.link ? <a href={app.link} target="_blank" rel="noreferrer" className="text-[#1E40AF] font-bold hover:underline">{app.link}</a> : '-'}
                    </div>
                    <div className="font-semibold text-slate-500">
                      File CV/Portofolio: {app.cvUrl ? <a href={app.cvUrl} target="_blank" rel="noreferrer" className="text-[#1E40AF] font-bold hover:underline">Unduh CV</a> : '-'}
                    </div>
                  </div>
                  
                  {/* Info Kontak */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-semibold">
                    <span>Telepon: <strong className="text-slate-600">{app.phone || 'Belum diisi'}</strong></span>
                    <span>•</span>
                    <span>Lahir di: <strong className="text-slate-600">{app.birthPlace || '-'}</strong></span>
                    <span>•</span>
                    <span>Terdaftar: <strong className="text-slate-500">{new Date(app.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                  </div>
                </div>

                {/* Tombol Aksi Verifikasi */}
                <div className="flex gap-2.5 shrink-0 justify-end border-t lg:border-t-0 border-slate-150 pt-4 lg:pt-0">
                  {/* Tolak */}
                  <button
                    onClick={() => handleReject(app.id, false)}
                    disabled={isPending}
                    className="rounded-xl border border-rose-200 bg-rose-50 text-rose-600 px-5 py-3 text-xs font-black hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                  >
                    Tolak Berkas
                  </button>

                  {/* Setujui */}
                  <button
                    onClick={() => handleApprove(app.id, false)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E40AF] text-white px-6 py-3 text-xs font-black hover:bg-blue-800 shadow-md shadow-blue-500/10 active:scale-95 transition-all cursor-pointer"
                  >
                    Terima & Beri Verifikasi
                    <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <title>Ceklis</title>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
