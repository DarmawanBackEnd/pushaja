'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { applyFreelancer } from '@/actions/freelancer.action';

export default function FreelancerApplyFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    // Validasi file
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
        setError(res.error || 'Terjadi kesalahan sistem.');
      }
    } catch (err: any) {
      setError('Gagal mengirim dokumen.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Dokumen Terkirim!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Terima kasih! Tim pushaja akan segera meninjau dokumen pendaftaran Anda. Kami akan menghubungi Anda melalui email untuk informasi selanjutnya.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-[#1E40AF] text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1E40AF] transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-200/60 p-8 sm:p-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Formulir Pendaftaran</h1>
            <p className="text-slate-500 mt-2">Lengkapi data diri Anda dengan benar dan valid</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nama Lengkap Sesuai Identitas</label>
                <input 
                  type="text" 
                  name="fullName" 
                  required
                  placeholder="Cth: Budi Santoso"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Nomor HP */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nomor Handphone / WA</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required
                  placeholder="Cth: 081234567890"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Tempat Lahir */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tempat Lahir</label>
                <input 
                  type="text" 
                  name="birthPlace" 
                  required
                  placeholder="Cth: Jakarta"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tanggal Lahir</label>
                <input 
                  type="date" 
                  name="birthDate" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                />
              </div>
            </div>

            {/* Email (Sudah readonly atau required input) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Aktif</label>
              <input 
                type="email" 
                name="email" 
                required
                placeholder="Cth: budi@contoh.com"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Link Portofolio / Medsos */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tautan Portofolio / LinkedIn <span className="text-slate-400 font-normal">(Isi jika tidak unggah CV)</span></label>
              <input 
                type="url" 
                name="link" 
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Nomor Rekening */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nomor Rekening & Bank</label>
              <input 
                type="text" 
                name="bankAccount" 
                required
                placeholder="Cth: BCA 1234567890 a/n Budi Santoso"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Upload File */}
            <div className="space-y-2 pt-4">
              <label className="text-sm font-bold text-slate-700 block mb-2">Unggah CV atau Portofolio <span className="text-slate-400 font-normal">(Opsional jika link diisi)</span></label>
              <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-8 text-center hover:bg-slate-100 hover:border-[#1E40AF] transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  name="cvFile" 
                  accept=".pdf,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-[#1E40AF]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-slate-700 font-medium">Klik atau seret file ke sini</p>
                  <p className="text-slate-400 text-xs mt-1">Format: PDF, DOCX (Maks. 5MB)</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#1E40AF] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : 'Kirim Pengajuan'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
