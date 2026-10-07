'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Award, 
  FileText, 
  UserCheck,
  Building2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface TrackingData {
  id: string;
  type: 'pelatihan' | 'projek';
  title: string;
  holderName: string;
  institution: string;
  date: string;
  currentStep: number;
  steps: { label: string; date: string; completed: boolean }[];
  statusText: string;
  notes: string;
}

const SAMPLE_TRACKING_DATA: Record<string, TrackingData> = {
  'TRK-BIMTEK-2026': {
    id: 'TRK-BIMTEK-2026',
    type: 'pelatihan',
    title: 'Bimtek Pemasaran Digital & E-Commerce UMKM Kota Serang (Gelombang II)',
    holderName: 'Tubagus Maulana',
    institution: 'DinkopUKM Perindag Kota Serang',
    date: '12 Oktober 2026',
    currentStep: 3,
    steps: [
      { label: 'Pendaftaran & Verifikasi NIK', date: '01 Okt 2026', completed: true },
      { label: 'Konfirmasi Kelulusan Berkas', date: '04 Okt 2026', completed: true },
      { label: 'Sesi Pelatihan & Mentoring', date: '12 - 15 Okt 2026', completed: true },
      { label: 'Uji Kompetensi & Sertifikat', date: '18 Okt 2026', completed: false }
    ],
    statusText: 'Pelatihan Sedang Berjalan',
    notes: 'Sesi tatap muka di Aula DinkopUKM Perindag Kota Serang, Pukul 09.00 WIB. Harap membawa laptop/smartphone.'
  },
  'ORD-PUSHAJA-01': {
    id: 'ORD-PUSHAJA-01',
    type: 'projek',
    title: 'Pembuatan Web App SaaS Fullstack Next.js 15 & Prisma PostgreSQL',
    holderName: 'Aditya Nugroho (CEO NuansaTech)',
    institution: 'Freelancer: Darmawan Putra',
    date: '05 Oktober 2026',
    currentStep: 3,
    steps: [
      { label: 'Pesanan Dibuat & Escrow Diamankan', date: '05 Okt 2026', completed: true },
      { label: 'Penyelarasan Brief & Desain Arsitektur', date: '06 Okt 2026', completed: true },
      { label: 'Pengembangan & Integrasi Backend', date: '08 - 14 Okt 2026', completed: true },
      { label: 'Review Klien & Rilis Dana Escrow', date: '19 Okt 2026', completed: false }
    ],
    statusText: 'Tahap Pengembangan Sistem',
    notes: 'Dana aman di Rekening Bersama Escrow. Estimasi selesai tepat waktu dalam 14 hari kerja.'
  },
  'TRK-HALAL-77': {
    id: 'TRK-HALAL-77',
    type: 'pelatihan',
    title: 'Pendampingan Sertifikasi Halal Self-Declare & PIRT Binaan Pemkot',
    holderName: 'Siti Rahmawati (UMKM Olahan Gipang Serang)',
    institution: 'PLUT-KUMKM Kota Serang & BPJPH',
    date: '28 September 2026',
    currentStep: 4,
    steps: [
      { label: 'Pengajuan Berkas Bahan Baku', date: '28 Sep 2026', completed: true },
      { label: 'Verifikasi Auditor Halal Banten', date: '02 Okt 2026', completed: true },
      { label: 'Sidang Fatwa Halal', date: '05 Okt 2026', completed: true },
      { label: 'Sertifikat Halal Terbit Resmi', date: '07 Okt 2026', completed: true }
    ],
    statusText: 'Selesai — Sertifikat Siap Diambil',
    notes: 'Sertifikat Halal resmi BPJPH telah terbit. Silakan unduh e-sertifikat atau ambil berkas fisik di loket dinas.'
  }
};

const PROGRAMS = [
  {
    id: 'prog-1',
    category: 'DIGITALISASI TALENTA',
    title: 'Bimtek Fullstack Web & UI/UX untuk Talenta Digital Muda',
    desc: 'Pelatihan intensif pembuatan aplikasi web modern Next.js & perancangan Figma yang langsung terhubung ke proyek freelance rill.',
    quota: '30 Peserta',
    batch: 'Batch 4 (Oktober)',
    type: 'Gratis Binaan Pemkot',
    sampleId: 'TRK-BIMTEK-2026'
  },
  {
    id: 'prog-2',
    category: 'LEGALITAS BISNIS',
    title: 'Pendampingan Sertifikasi Halal Gratis & NIB Berbasis Risiko',
    desc: 'Bimbingan teknis legalitas usaha satu pintu bagi 500 pelaku usaha mikro di 6 kecamatan Kota Serang.',
    quota: '100 Pelaku Usaha',
    batch: 'Setiap Hari Kerja',
    type: 'Fasilitasi DinkopUKM',
    sampleId: 'TRK-HALAL-77'
  },
  {
    id: 'prog-3',
    category: 'TATA KELOLA KOPERASI',
    title: 'Workshop Modernisasi Tata Kelola & Akuntansi Digital Koperasi',
    desc: 'Pendampingan pengurus koperasi dalam digitalisasi pembukuan, laporan RAT online, dan akses permodalan LPDB.',
    quota: '45 Koperasi',
    batch: 'Batch 2 (November)',
    type: 'Program Dinas',
    sampleId: 'ORD-PUSHAJA-01'
  }
];

export default function TrainingTracker() {
  const [activeTab, setActiveTab] = useState<'katalog' | 'tracking'>('tracking');
  const [searchQuery, setSearchQuery] = useState('TRK-BIMTEK-2026');
  const [trackingResult, setTrackingResult] = useState<TrackingData | null>(SAMPLE_TRACKING_DATA['TRK-BIMTEK-2026']);
  const [searchedId, setSearchedId] = useState('TRK-BIMTEK-2026');
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuery = searchQuery.trim().toUpperCase();
    setSearchedId(cleanQuery);
    setHasSearched(true);
    if (SAMPLE_TRACKING_DATA[cleanQuery]) {
      setTrackingResult(SAMPLE_TRACKING_DATA[cleanQuery]);
    } else {
      setTrackingResult(null);
    }
  };

  const handleSelectQuick = (id: string) => {
    setSearchQuery(id);
    setSearchedId(id);
    setHasSearched(true);
    setTrackingResult(SAMPLE_TRACKING_DATA[id]);
    setActiveTab('tracking');
  };

  return (
    <section id="pelatihan-tracking" className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-12 text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-[11px] font-black text-[#15803D] uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4 text-[#15803D]" />
            PROGRAM PELATIHAN & SISTEM TRACKING TERPADU
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Pelatihan Binaan & Pelacakan Status Real-Time
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            Sebagai bagian dari integrasi platform bersama <strong>DinkopUKM Perindag Kota Serang</strong>, Anda kini dapat mengikuti program peningkatan kapasitas keahlian serta melacak progres pelatihan maupun pesanan jasa Anda secara transparan.
          </p>
        </div>

        {/* Tab Navigasi */}
        <div className="flex gap-3 mb-8 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'tracking'
                ? 'bg-[#15803D] text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Lacak Status (Live Tracking)
          </button>
          <button
            onClick={() => setActiveTab('katalog')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'katalog'
                ? 'bg-[#15803D] text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Program Pelatihan & Bimtek ({PROGRAMS.length})
          </button>
        </div>

        {/* ====================================================
            TAB 1: LIVE TRACKING SYSTEM
           ==================================================== */}
        {activeTab === 'tracking' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Box Pencarian Tracking */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukkan Nomor Registrasi Pelatihan / ID Pesanan (Cth: TRK-BIMTEK-2026)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#15803D] focus:ring-2 focus:ring-emerald-100 transition-all uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-[#15803D] px-7 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-[#166534] transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Lacak Progres
                </button>
              </form>

              {/* Rekomendasi Contoh Cepat (Quick Try) */}
              <div className="mt-4 flex items-center gap-2 flex-wrap text-xs font-medium text-slate-500">
                <span className="font-bold text-slate-700">Contoh ID untuk Cek Demo:</span>
                <button
                  type="button"
                  onClick={() => handleSelectQuick('TRK-BIMTEK-2026')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#15803D] font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  TRK-BIMTEK-2026 (Bimtek UMKM)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectQuick('ORD-PUSHAJA-01')}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  ORD-PUSHAJA-01 (Projek Web SaaS)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectQuick('TRK-HALAL-77')}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  TRK-HALAL-77 (Sertifikasi Halal)
                </button>
              </div>
            </div>

            {/* Hasil Pelacakan (Tracking Card) */}
            {hasSearched && trackingResult ? (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden text-left animate-in fade-in slide-in-from-top-4 duration-300">
                
                {/* Header Kartu Tracking */}
                <div className="bg-gradient-to-r from-[#15803D] via-emerald-800 to-slate-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#EAB308]">
                        {trackingResult.type === 'pelatihan' ? 'Program Pelatihan & Bimtek' : 'Pesanan Proyek Jasa'}
                      </span>
                      <span className="text-xs font-mono font-bold text-white/80">#{trackingResult.id}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                      {trackingResult.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/80 font-medium">
                      Pendaftar / Pemesan: <strong>{trackingResult.holderName}</strong> • {trackingResult.institution}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5">
                    <Clock className="w-4 h-4 text-[#EAB308]" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-white/70 block font-bold">Status Terkini</span>
                      <span className="text-xs font-black text-white">{trackingResult.statusText}</span>
                    </div>
                  </div>
                </div>

                {/* Body: Timeline 4 Tahap Progres Interaktif */}
                <div className="p-6 sm:p-10">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                    Tahapan Pelacakan Progres
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                    {trackingResult.steps.map((step, idx) => {
                      const isPast = idx < trackingResult.currentStep - 1;
                      const isCurrent = idx === trackingResult.currentStep - 1;
                      return (
                        <div key={idx} className="relative flex flex-col">
                          {/* Indicator Dot */}
                          <div className="flex items-center gap-3 sm:flex-col sm:items-start mb-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                              isPast 
                                ? 'bg-[#15803D] text-white shadow-sm' 
                                : isCurrent 
                                  ? 'bg-[#EAB308] text-slate-900 ring-4 ring-amber-100 font-extrabold animate-pulse'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                              {step.date}
                            </span>
                          </div>

                          <h5 className={`text-xs font-extrabold leading-snug ${
                            isCurrent ? 'text-[#15803D]' : isPast ? 'text-slate-800' : 'text-slate-400'
                          }`}>
                            {step.label}
                          </h5>
                        </div>
                      );
                    })}
                  </div>

                  {/* Catatan / Instruksi Lanjutan */}
                  <div className="mt-8 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-150 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-extrabold text-[#15803D]">Catatan Resmi Dinas & Verifikator</h5>
                      <p className="mt-0.5 text-xs text-slate-600 leading-relaxed font-medium">
                        {trackingResult.notes}
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            ) : hasSearched ? (
              <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-extrabold text-slate-700">Data Pelacakan Tidak Ditemukan</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Nomor ID <strong>"{searchedId}"</strong> belum terdaftar di sistem. Pastikan format nomor registrasi atau ID transaksi sudah sesuai.
                </p>
              </div>
            ) : null}

          </div>
        )}

        {/* ====================================================
            TAB 2: KATALOG PROGRAM PELATIHAN DINKOPUKM
           ==================================================== */}
        {activeTab === 'katalog' && (
          <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-300 text-left">
            {PROGRAMS.map((prog) => (
              <div 
                key={prog.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black text-[#15803D] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {prog.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{prog.batch}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-[#15803D] transition-colors mb-2">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {prog.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <UserCheck className="w-3.5 h-3.5 text-[#15803D]" />
                      Kuota: {prog.quota}
                    </span>
                    <span className="font-extrabold text-[#15803D]">{prog.type}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectQuick(prog.sampleId)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-[#15803D] text-slate-700 text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      Lacak Progres
                    </button>
                    <a
                      href="/freelancer/apply"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition-all text-center shadow-sm"
                    >
                      Daftar Peserta
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
