import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import TrainingTracker from '@/components/TrainingTracker';
import Image from 'next/image';
import Link from 'next/link';
import { 
  GraduationCap, 
  Search, 
  HelpCircle, 
  CheckCircle2, 
  Landmark, 
  Building2, 
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pelatihan Binaan & Pelacakan Status | KopDigital Kota Serang',
  description: 'Portal resmi program Bimbingan Teknis (Bimtek) UMKM, pelatihan talenta digital, dan sistem pelacakan status pendaftaran serta proyek dari DinkopUKM Perindag Kota Serang.',
};

export default function PelatihanPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#EAB308] selection:text-[#15803D]">
      
      {/* ----------------------------------------------------
          NAVBAR RESMI
         ---------------------------------------------------- */}
      <Navbar />

      {/* ----------------------------------------------------
          HERO BANNER HALAMAN PELATIHAN & TRACKING
         ---------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/90 via-emerald-50/20 to-slate-50 py-16 text-center border-b border-emerald-100/60">
        
        {/* Hiasan Latar Belakang */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[450px] h-[450px] rounded-full bg-emerald-200/30 blur-[100px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#EAB308]/15 blur-[90px]"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center">
          
          {/* Breadcrumb Navigasi */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4">
            <Link href="/" className="hover:text-[#15803D] transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-[#15803D]">Pelatihan & Tracking</span>
          </div>

          {/* Badge Instansi Resmi */}
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-black text-[#15803D] border border-emerald-200 mb-4 shadow-sm">
            <Landmark className="h-3.5 w-3.5 text-[#15803D]" />
            DINKOPUKM PERINDAG KOTA SERANG • KOTA SERANG MADANI
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Pusat Pelatihan Talenta & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#15803D] to-emerald-700 bg-clip-text text-transparent">
              Sistem Pelacakan Status Real-Time
            </span>
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Tingkatkan keahlian digital, dapatkan legalitas usaha gratis, dan pantau progres bimbingan teknis maupun pesanan proyek Anda secara transparan dalam satu pintu.
          </p>

          {/* 3 Keunggulan Singkat */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span>Bimtek 100% Gratis</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span>Sertifikat Resmi Terverifikasi</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span>Live Tracking 24/7</span>
            </div>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          KOMPONEN UTAMA: TRAINING & LIVE TRACKER
         ---------------------------------------------------- */}
      <TrainingTracker />

      {/* ----------------------------------------------------
          SEKSI FAQ: PERTANYAAN UMUM SEPUTAR PELATIHAN & TRACKING
         ---------------------------------------------------- */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="max-w-2xl mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#15803D] uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4 text-[#EAB308]" />
              INFORMASI & PANDUAN
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
              Panduan lengkap seputar kepesertaan pelatihan, cara melacak berkas, dan manfaat sertifikasi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* FAQ 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900">
                Bagaimana cara mendaftar program Bimtek gratis?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Pilih program pelatihan di tab "Program Pelatihan & Bimtek", lalu klik tombol "Daftar Peserta". Anda akan diarahkan untuk melengkapi formulir data diri atau data usaha binaan dengan NIK Kota Serang yang valid.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900">
                Dari mana saya mendapatkan nomor ID Pelacakan?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Nomor ID Pelacakan (contoh: <code>TRK-BIMTEK-2026</code> atau <code>ORD-PUSHAJA-01</code>) diterbitkan secara otomatis setelah pendaftaran diverifikasi oleh sistem, dan dikirimkan via notifikasi akun serta email Anda.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900">
                Apakah peserta mendapatkan sertifikat resmi?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Ya. Peserta yang menyelesaikan seluruh modul pelatihan dan lulus uji kompetensi akan memperoleh e-Sertifikat resmi bertanda tangan digital Kepala DinkopUKM Perindag Kota Serang.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900">
                Apakah pelacakan pesanan jasa juga bisa dilakukan di sini?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Tentu. Sistem live tracking kami terintegrasi ganda: Anda dapat melacak progres bimbingan teknis dinas maupun status pesanan proyek jasa freelance yang sedang dikerjakan via sistem escrow PushAja.
              </p>
            </div>

          </div>

          {/* Banner Bantuan Kontak Dinas */}
          <div className="mt-12 p-8 rounded-3xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#15803D] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Butuh Bantuan Pendaftaran atau Mediasi?</h4>
                <p className="text-xs text-slate-500 font-medium">Tim PLUT-KUMKM DinkopUKM Kota Serang siap mendampingi Anda di hari kerja.</p>
              </div>
            </div>
            <Link
              href="/#tentang-pushaja"
              className="rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs px-5 py-3 transition-all shrink-0 flex items-center gap-2"
            >
              Hubungi Layanan Konsultasi
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          FOOTER RESMI
         ---------------------------------------------------- */}
      <footer className="bg-white border-t border-slate-200 py-16 text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left">
          
          <div className="col-span-2 md:col-span-1">
            <div className="relative w-48 sm:w-56 h-12 sm:h-14 mb-4" suppressHydrationWarning>
              <Image 
                key="footer-logo"
                src="/logo-dinkop-kota-serang-new.png" 
                alt="Logo DinkopUKM Perindag Kota Serang"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              Portal Resmi Pelatihan, Pembinaan Koperasi & UMKM, dan Ekosistem Talenta Digital Pemerintah Kota Serang.
            </p>
            <div className="mt-4 space-y-1 text-xs text-slate-500">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Gedung DinkopUKM, Kota Serang, Banten</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#15803D]" />
                <span>(0254) 200-SERANG</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Navigasi Utama</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-[#15803D] transition-colors">Beranda Utama</Link></li>
              <li><Link href="/#layanan-jasa" className="hover:text-[#15803D] transition-colors">Jobboard Jasa</Link></li>
              <li><Link href="/pelatihan" className="hover:text-[#15803D] transition-colors">Program Bimtek</Link></li>
              <li><Link href="/pelatihan" className="hover:text-[#15803D] transition-colors">Live Tracking</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Layanan Binaan</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/freelancer/apply" className="hover:text-[#15803D] transition-colors">Daftar sebagai Mitra</Link></li>
              <li><Link href="/pelatihan" className="hover:text-[#15803D] transition-colors">Fasilitasi NIB Gratis</Link></li>
              <li><Link href="/pelatihan" className="hover:text-[#15803D] transition-colors">Sertifikasi Halal Gratis</Link></li>
              <li><Link href="/pelatihan" className="hover:text-[#15803D] transition-colors">Klinik Konsultasi Bisnis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Bantuan & Regulasi</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/#tentang-pushaja" className="hover:text-[#15803D] transition-colors">Jaminan Rekening Escrow</Link></li>
              <li><Link href="/#tentang-pushaja" className="hover:text-[#15803D] transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/#tentang-pushaja" className="hover:text-[#15803D] transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/#tentang-pushaja" className="hover:text-[#15803D] transition-colors">Panduan Mediasi Sengketa</Link></li>
            </ul>
          </div>

        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-slate-100 pt-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} pushaja x DinkopUKM Perindag Kota Serang. Seluruh hak cipta dilindungi undang-undang.</p>
        </div>
      </footer>

    </div>
  );
}
