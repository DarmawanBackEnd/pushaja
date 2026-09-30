'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { applyFreelancer } from '@/actions/freelancer.action';
import { 
  BookOpen, 
  FileCheck2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Briefcase, 
  ArrowRight, 
  UploadCloud, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Home, 
  FileText,
  Wallet,
  Lock,
  X
} from 'lucide-react';

export default function FreelancerApplyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Membaca tab dari query param (?tab=form atau ?tab=guide), default: guide
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'guide' | 'form'>(tabParam === 'form' ? 'form' : 'guide');

  // Form states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (tabParam === 'form') {
      setActiveTab('form');
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'guide' | 'form') => {
    setActiveTab(tab);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal adalah 5MB.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    // Validasi file manual jika ada
    const file = formData.get('cvFile') as File;
    if (file && file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal adalah 5MB.');
      setLoading(false);
      return;
    }

    try {
      const res = await applyFreelancer(formData);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || 'Terjadi kesalahan saat memproses pendaftaran.');
      }
    } catch (err: any) {
      setError('Gagal mengirimkan dokumen pendaftaran. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Breadcrumb Navigasi */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#1E40AF] transition-colors flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-extrabold">Pendaftaran Freelancer</span>
        </nav>

        {/* ----------------------------------------------------
            SISTEM TAB HEADER INTERAKTIF
           ---------------------------------------------------- */}
        <div className="flex p-1.5 bg-slate-200/70 rounded-2xl max-w-md mx-auto mb-8 border border-slate-300/60 shadow-inner">
          <button
            type="button"
            onClick={() => handleTabChange('guide')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
              activeTab === 'guide'
                ? 'bg-white text-[#1E40AF] shadow-md border border-slate-100 scale-[1.02]'
                : 'text-slate-600 hover:text-[#1E40AF] hover:bg-white/40'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            Tata Cara & Syarat
          </button>
          
          <button
            type="button"
            onClick={() => handleTabChange('form')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
              activeTab === 'form'
                ? 'bg-[#1E40AF] text-white shadow-md scale-[1.02]'
                : 'text-slate-600 hover:text-[#1E40AF] hover:bg-white/40'
            }`}
          >
            <FileCheck2 className="w-4 h-4 shrink-0" />
            Formulir Pendaftaran
          </button>
        </div>

        {/* ----------------------------------------------------
            TAB 1: TATA CARA & PANDUAN PENDAFTARAN
           ---------------------------------------------------- */}
        {activeTab === 'guide' && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/70 animate-in fade-in duration-200">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-[#1E40AF] via-blue-900 to-indigo-950 px-8 py-12 text-center relative overflow-hidden text-white">
              <div className="absolute top-[-30%] right-[-10%] w-72 h-72 rounded-full bg-[#A3E635]/20 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-[-30%] left-[-10%] w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#A3E635] text-xs font-extrabold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Program Mitra Freelancer PushAja
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  Bergabung Menjadi Freelancer Profesional
                </h1>
                <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
                  Raih penghasilan tambahan dan kembangkan bisnis freelance Anda bersama ribuan klien profesional di seluruh Indonesia.
                </p>
              </div>
            </div>

            {/* Konten Tata Cara */}
            <div className="p-8 sm:p-12 space-y-12">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  3 Langkah Mudah Menjadi Freelancer
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Ikuti alur pendaftaran resmi PushAja untuk mulai menerima pesanan
                </p>
              </div>

              {/* Langkah 1, 2, 3 */}
              <div className="space-y-6">
                
                {/* Langkah 1 */}
                <div className="flex gap-5 items-start p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
                  <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[#1E40AF] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    1
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Lengkapi Data Diri & Portofolio
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      Siapkan informasi identitas resmi, nomor WhatsApp aktif, tautan portofolio (seperti LinkedIn, GitHub, Behance, atau website pribadi), CV terbaru, serta nomor rekening bank untuk pencairan hasil penjualan jasa.
                    </p>
                  </div>
                </div>

                {/* Langkah 2 */}
                <div className="flex gap-5 items-start p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
                  <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[#1E40AF] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    2
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Tinjauan & Verifikasi Kualitas
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      Tim kurasi PushAja akan meninjau keaslian data dan portofolio Anda dalam waktu 1-3 hari kerja guna menjaga standar kualitas tinggi dan rasa aman bagi seluruh klien di platform kami.
                    </p>
                  </div>
                </div>

                {/* Langkah 3 */}
                <div className="flex gap-5 items-start p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
                  <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[#A3E635] text-[#1E40AF] flex items-center justify-center font-black text-lg shadow-sm">
                    3
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Publikasikan Jasa & Mulai Menghasilkan
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      Setelah akun disetujui, Anda langsung dapat membuat penawaran jasa (Gigs), menentukan paket harga, menerima pesanan, dan menikmati sistem proteksi pembayaran Rekber Escrow yang aman.
                    </p>
                  </div>
                </div>

              </div>

              {/* Keuntungan Ekosistem */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-4">
                  Keuntungan Bermitra di PushAja
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <ShieldCheck className="w-5 h-5 text-[#1E40AF]" />
                    <h4 className="text-xs font-extrabold text-slate-900">Garansi Rekber Escrow</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Klien membayar di awal ke sistem rekening bersama. Anda dijamin dibayar setelah pekerjaan selesai.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <Wallet className="w-5 h-5 text-[#1E40AF]" />
                    <h4 className="text-xs font-extrabold text-slate-900">100% Gratis Mendaftar</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Tidak ada biaya pendaftaran atau biaya keanggotaan tersembunyi. Skema komisi transparan dan adil.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <Lock className="w-5 h-5 text-[#1E40AF]" />
                    <h4 className="text-xs font-extrabold text-slate-900">Privasi & Data Aman</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Informasi identitas dan rekening perbankan Anda dienkripsi serta diproteksi secara ketat.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Box Beralih ke Form */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-blue-50/50 border-blue-100/60 p-6 rounded-2xl">
                <div>
                  <p className="text-xs text-[#1E40AF] font-bold">Sudah memahami tata cara pendaftaran?</p>
                  <p className="text-sm text-slate-900 font-extrabold">Lanjutkan ke pengisian formulir pendaftaran</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleTabChange('form')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E40AF] hover:bg-blue-800 px-7 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  Isi Formulir Sekarang
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 2: FORMULIR PENDAFTARAN FREELANCER
           ---------------------------------------------------- */}
        {activeTab === 'form' && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/70 p-8 sm:p-12 animate-in fade-in duration-200">
            
            {success ? (
              /* SCREEN SUKSES SETELAH KIRIM FORMULIR */
              <div className="py-12 text-center max-w-md mx-auto space-y-5 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900">Dokumen Berhasil Terkirim!</h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Terima kasih telah mendaftar. Tim kurasi PushAja akan meninjau berkas pendaftaran Anda dalam 1-3 hari kerja. Kami akan memberitahukan status verifikasi melalui email terdaftar Anda.
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-3">
                  <Link
                    href="/"
                    className="w-full bg-[#1E40AF] hover:bg-blue-800 text-white font-extrabold py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition-all text-center"
                  >
                    Kembali ke Beranda
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setActiveTab('guide');
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all"
                  >
                    Lihat Kembali Panduan
                  </button>
                </div>
              </div>
            ) : (
              /* FORMULIR UTAMA */
              <div className="space-y-8">
                
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E40AF]/10 text-[#1E40AF] text-xs font-extrabold mb-3">
                    <FileText className="w-3.5 h-3.5" />
                    Formulir Resmi
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Formulir Pendaftaran Freelancer
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Pastikan informasi yang Anda masukkan valid dan sesuai dengan dokumen identitas asli
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-start gap-3 text-xs sm:text-sm font-semibold animate-in shake duration-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Baris 1: Nama Lengkap & No WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-extrabold text-slate-800">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="fullName" 
                        required
                        placeholder="Sesuai KTP / Paspor"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-extrabold text-slate-800">
                        Nomor Handphone / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required
                        placeholder="Contoh: 081234567890"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Baris 2: Tempat & Tanggal Lahir */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-extrabold text-slate-800">
                        Tempat Lahir <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="birthPlace" 
                        required
                        placeholder="Contoh: Jakarta"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-extrabold text-slate-800">
                        Tanggal Lahir <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="date" 
                        name="birthDate" 
                        required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                      />
                    </div>
                  </div>

                  {/* Baris 3: Email Aktif */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-extrabold text-slate-800">
                      Email Aktif <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      required
                      placeholder="Contoh: nama@domain.com"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
                    />
                    <p className="text-[11px] text-slate-400 font-medium">
                      Pemberitahuan persetujuan akun akan dikirimkan ke email ini.
                    </p>
                  </div>

                  {/* Baris 4: Tautan Portofolio */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-extrabold text-slate-800">
                      Tautan Portofolio / LinkedIn / Website
                    </label>
                    <input 
                      type="url" 
                      name="link" 
                      placeholder="https://linkedin.com/in/... atau https://github.com/..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
                    />
                    <p className="text-[11px] text-slate-400 font-medium">
                      Opsional jika Anda mengunggah file CV/dokumen di bawah ini.
                    </p>
                  </div>

                  {/* Baris 5: Nomor Rekening & Nama Bank */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-extrabold text-slate-800">
                      Rekening Bank untuk Pencairan Saldo <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="bankAccount" 
                      required
                      placeholder="Contoh: BCA 1234567890 a/n Budi Santoso"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
                    />
                    <p className="text-[11px] text-slate-400 font-medium">
                      Nama pemilik rekening harus sesuai atau berelasi dengan nama pendaftar.
                    </p>
                  </div>

                  {/* Baris 6: Upload File CV / Portofolio */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs sm:text-sm font-extrabold text-slate-800 block">
                      Unggah File CV atau Portofolio (Maks. 5MB)
                    </label>
                    
                    <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-6 text-center hover:bg-slate-100 hover:border-[#1E40AF] transition-all cursor-pointer relative group">
                      <input 
                        type="file" 
                        name="cvFile" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      
                      {selectedFile ? (
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                          <div className="flex items-center gap-3 truncate">
                            <FileText className="w-5 h-5 text-[#1E40AF] shrink-0" />
                            <div className="text-left truncate">
                              <p className="text-xs font-extrabold text-slate-800 truncate">{selectedFile.name}</p>
                              <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-[#1E40AF] shrink-0">Ganti File</span>
                        </div>
                      ) : (
                        <div className="pointer-events-none space-y-2">
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto text-[#1E40AF] group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <p className="text-xs font-bold text-slate-700">
                            Klik atau seret file CV/Portofolio ke sini
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Format yang didukung: PDF, DOCX (Maksimal 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tombol Kirim Form */}
                  <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#1E40AF] hover:bg-blue-800 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sedang Memproses Dokumen...
                        </>
                      ) : (
                        <>
                          Kirim Pengajuan Pendaftaran
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12 text-center text-xs font-semibold text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PushAja Platform Freelance Indonesia. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#1E40AF] transition-colors">Beranda</Link>
            <Link href="/categories" className="hover:text-[#1E40AF] transition-colors">Semua Kategori</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
