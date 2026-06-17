import React from 'react';
import { getGigById } from '@/actions/gig.action';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default async function GigDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const res = await getGigById(resolvedParams.id);

  if (!res.success || !res.data) {
    notFound();
  }

  const gig = res.data;
  
  // Format harga
  const rawPrice = typeof gig.price === 'number' ? gig.price : parseFloat(gig.price.toString());
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(rawPrice);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Breadcrumb minimalis */}
        <nav className="mb-8 text-xs font-bold text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-[#1E40AF] transition-colors">Beranda</Link>
          <span>/</span>
          <span className="hover:text-[#1E40AF] transition-colors cursor-pointer">{gig.category.name}</span>
          <span>/</span>
          <span className="text-slate-600 truncate max-w-[200px]">{gig.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Kolom Kiri: Konten Utama */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header: Judul & Kategori */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E40AF]/5 px-3 py-1 text-[10px] font-black tracking-widest text-[#1E40AF] uppercase border border-[#1E40AF]/10 mb-4">
                {gig.category.name}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {gig.title}
              </h1>
            </div>

            {/* Profil Freelancer Mini */}
            <div className="flex items-center gap-4 py-4 border-y border-slate-200/60">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200 shrink-0 relative">
                {gig.freelancer.profilePicture ? (
                  <Image src={gig.freelancer.profilePicture} alt={gig.freelancer.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1E40AF]/10 text-[#1E40AF] font-bold">
                    {gig.freelancer.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-slate-800 text-sm">{gig.freelancer.name}</h3>
                  {gig.freelancer.isVerified && (
                    <svg className="h-4 w-4 text-blue-600 fill-current" viewBox="0 0 20 20">
                      <title>Terverifikasi</title>
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                  <span className="flex items-center gap-1"><span className="text-[#A3E635]">★</span> 5.0 (24 Ulasan)</span>
                  <span>•</span>
                  <span>{gig.orders?._count || 0} Pesanan Selesai</span>
                </div>
              </div>
            </div>

            {/* Banner Jasa */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
              {gig.imageUrl ? (
                <Image src={gig.imageUrl} alt={gig.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] to-indigo-900 flex items-center justify-center">
                  <span className="text-white/20 font-black text-4xl uppercase tracking-widest">PUSHAJA</span>
                </div>
              )}
            </div>

            {/* Deskripsi */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">Deskripsi Jasa ini</h2>
              <div className="prose prose-sm prose-slate max-w-none prose-headings:font-black prose-a:text-[#1E40AF] leading-loose whitespace-pre-wrap">
                {gig.description}
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Sticky Sidebar (Harga & Order) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-8 flex flex-col">
              
              {/* Box Harga */}
              <div className="mb-8">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Total Biaya Jasa</span>
                <div className="text-3xl font-black text-[#1E40AF] tracking-tight">{formattedPrice}</div>
              </div>

              {/* Fitur / Benefit List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm font-semibold text-slate-600">Revisi sesuai kesepakatan</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-sm font-semibold text-slate-600">Pengerjaan maksimal {gig.deliveryDays} Hari</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <span className="text-sm font-semibold text-slate-600">Garansi uang kembali (Aman via pushaja)</span>
                </div>
              </div>

              {/* Tombol Order (Dummy Blueprint) */}
              <Link href={`/chat/order-dummy-123`} className="w-full rounded-2xl bg-[#1E40AF] px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 group">
                Pesan & Mulai Chat
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <p className="text-center text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-widest">
                Anda belum akan dikenakan biaya saat klik pesan
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
