import React from 'react';
import Link from 'next/link';

export default function ApplyFreelancerPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/60">
          
          {/* Header Banner */}
          <div className="bg-[#1E40AF] px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 rounded-full bg-indigo-500/30 blur-[80px]"></div>
            <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 rounded-full bg-[#A3E635]/30 blur-[80px]"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
                <svg className="w-10 h-10 text-[#A3E635]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-4">
                Bergabung Menjadi Freelancer
              </h1>
              <p className="text-indigo-100 text-lg max-w-xl mx-auto">
                Raih penghasilan tambahan dan kembangkan karir Anda dengan memberikan layanan terbaik di pushaja.
              </p>
            </div>
          </div>

          {/* Tata Cara Content */}
          <div className="p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Tata Cara Menjadi Freelancer</h2>
            
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#A3E635]/20 text-[#1E40AF] flex items-center justify-center font-black text-xl border border-[#A3E635]/30">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Lengkapi Profil & Dokumen</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Siapkan dokumen pendukung yang meliputi data diri, nomor kontak, tempat tanggal lahir, tautan portofolio/sosial media, CV terbaru, dan nomor rekening aktif untuk pencairan dana.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#A3E635]/20 text-[#1E40AF] flex items-center justify-center font-black text-xl border border-[#A3E635]/30">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Proses Verifikasi</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Tim pushaja akan meninjau dokumen dan portofolio Anda dalam waktu 1-3 hari kerja untuk memastikan kualitas dan keamanan layanan.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#A3E635]/20 text-[#1E40AF] flex items-center justify-center font-black text-xl border border-[#A3E635]/30">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Mulai Menerima Pesanan</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Setelah disetujui, Anda dapat mulai membuat penawaran jasa (gigs) sesuai dengan keahlian Anda dan menerima pesanan dari klien.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-6 rounded-2xl">
              <div>
                <p className="text-sm text-slate-500 font-medium">Sudah membaca dan memahami?</p>
                <p className="text-slate-800 font-bold">Lanjutkan ke pengisian dokumen</p>
              </div>
              <Link 
                href="/freelancer/apply/form" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E40AF] px-8 py-4 text-sm font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
              >
                Lanjutkan
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
