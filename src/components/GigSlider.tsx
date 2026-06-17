'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

interface GigSliderProps {
  gigs: any[];
}

export default function GigSlider({ gigs }: GigSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Batasi hanya menampilkan 3 jasa terpopuler
  const popularGigs = gigs.slice(0, 3);

  // Format Mata Uang Rupiah IDR
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Cek apakah kontainer dapat di-scroll
  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  // Menggeser kontainer secara halus
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      // Panggil sekali untuk inisialisasi state tombol panah
      handleScroll();
      
      // Setup ResizeObserver untuk memperbarui tombol panah ketika ukuran layar berubah
      const resizeObserver = new ResizeObserver(() => {
        handleScroll();
      });
      resizeObserver.observe(el);
      
      return () => {
        el.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, [popularGigs]);

  if (popularGigs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <p className="text-slate-400 text-sm font-semibold">Tidak ada jasa populer yang tersedia saat ini.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full group/slider">
      {/* Tombol Navigasi Kiri (Clean, tanpa background abu-abu/gradient tebal) */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-lg hover:bg-slate-50 hover:text-[#1E40AF] hover:scale-110 active:scale-90 transition-all duration-300 focus:outline-none cursor-pointer"
          aria-label="Geser Kiri"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <title>Geser Kiri</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Tombol Navigasi Kanan (Clean, tanpa background abu-abu/gradient tebal) */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-lg hover:bg-slate-50 hover:text-[#1E40AF] hover:scale-110 active:scale-90 transition-all duration-300 focus:outline-none cursor-pointer"
          aria-label="Geser Kanan"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <title>Geser Kanan</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Kontainer Scroll Horizontal */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {popularGigs.map((gig, idx) => {
          // Buat variasi gradient background premium untuk visual header kartu
          const gradients = [
            'from-[#1E40AF] via-blue-800 to-indigo-950',
            'from-indigo-950 via-purple-900 to-[#1E40AF]',
            'from-blue-900 via-indigo-900 to-[#1E40AF]'
          ];
          const coverGradient = gradients[idx % gradients.length];

          // Ambil harga (konversi jika Prisma Decimal)
          const rawPrice = typeof gig.price === 'number' ? gig.price : parseFloat(gig.price.toString());

          return (
            <Link href={`/gigs/${gig.id}`} key={gig.id || idx}>
            <article
              className="flex-none w-[290px] sm:w-[340px] md:w-[370px] snap-start flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-sm hover:shadow-2xl hover:border-[#1E40AF]/40 transition-all duration-500 hover:-translate-y-2 group"
            >
              {/* Visual Cover / Header Kartu */}
              <div className={`relative h-60 w-full ${!gig.imageUrl ? 'bg-gradient-to-br ' + coverGradient : 'bg-slate-100'} p-6 flex flex-col justify-between text-white overflow-hidden shrink-0`}>
                
                {gig.imageUrl ? (
                  <img src={gig.imageUrl} alt={gig.title} className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <>
                    {/* Efek Pendar Cahaya Neon Ornamen */}
                    <div className="absolute top-[-20%] right-[-20%] w-36 h-36 bg-[#A3E635]/10 rounded-full blur-2xl group-hover:bg-[#A3E635]/20 group-hover:scale-125 transition-all duration-500 z-0"></div>
                    <div className="absolute bottom-[-30%] left-[-10%] w-28 h-28 bg-[#1E40AF]/30 rounded-full blur-xl group-hover:bg-[#A3E635]/5 transition-all duration-500 z-0"></div>
                  </>
                )}
                
                {/* Overlay gradient tipis agar text tetap terbaca jika pakai gambar */}
                {gig.imageUrl && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-slate-900/40 z-0"></div>
                )}

                <div className="flex justify-between items-start z-10">
                  {/* Tag Kategori Jasa */}
                  <span className="rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-[10px] font-black tracking-wider text-[#A3E635] uppercase border border-white/15">
                    {gig.category?.name || 'Jasa Digital'}
                  </span>
                  
                  {/* Badge Popularitas Otomatis */}
                  <span className="flex items-center gap-1 rounded-full bg-[#A3E635]/20 backdrop-blur-md px-3 py-1 text-[9px] font-black text-[#A3E635] border border-[#A3E635]/30">
                    🔥 TERPOPULER #{idx + 1}
                  </span>
                </div>

                {/* Info Rating & Jumlah Ulasan */}
                <div className="flex items-center gap-1.5 self-start bg-slate-950/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black border border-white/5 z-10">
                  <span className="text-[#A3E635]">★</span>
                  <span>{gig.rating ? Number(gig.rating).toFixed(1) : '5.0'}</span>
                  <span className="text-white/60 font-semibold">({gig.reviewsCount || 25 + (idx * 7)})</span>
                </div>
              </div>

              {/* Konten Kartu */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                <div>
                  {/* Judul Layanan */}
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 leading-snug group-hover:text-[#1E40AF] transition-colors duration-300 line-clamp-2">
                    {gig.title}
                  </h3>

                  {/* Deskripsi Singkat */}
                  <p className="mt-2.5 text-xs text-slate-400 leading-relaxed line-clamp-3 font-medium">
                    {gig.description}
                  </p>
                </div>

                {/* Profil Freelancer */}
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar Bulat */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E40AF]/10 text-xs font-black text-[#1E40AF] border border-[#1E40AF]/15 transition-all duration-300 group-hover:border-[#1E40AF] overflow-hidden relative shrink-0">
                      {gig.freelancer?.profilePicture ? (
                        <img src={gig.freelancer.profilePicture} alt={gig.freelancer.name || 'Freelancer'} className="w-full h-full object-cover" />
                      ) : (
                        gig.freelancer?.name ? gig.freelancer.name.charAt(0) : 'F'
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-700 leading-none">{gig.freelancer?.name || 'Freelancer'}</span>
                        {(gig.freelancer?.isVerified ?? true) && (
                          <svg className="h-3.5 w-3.5 text-blue-600 fill-current shrink-0" viewBox="0 0 20 20">
                            <title>Freelancer Terverifikasi</title>
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 block mt-0.5 font-bold uppercase tracking-wider">Verifikator pushaja</span>
                    </div>
                  </div>

                  {/* Estimasi Waktu Pengiriman */}
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold shrink-0">
                    <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <title>Durasi Pengerjaan</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{gig.deliveryDays || 3} hari</span>
                  </div>
                </div>
              </div>

              {/* Bagian Bawah Kartu (Harga & CTA) */}
              <div className="border-t border-slate-100 px-6 py-5 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-black">Mulai Dari</span>
                  <span className="text-base font-black text-[#1E40AF] tracking-tight">
                    {formatRupiah(rawPrice)}
                  </span>
                </div>
                <button className="rounded-2xl bg-white border border-slate-200 px-4.5 py-2.5 text-xs font-black text-slate-700 shadow-sm hover:shadow hover:bg-[#1E40AF] hover:text-white hover:border-[#1E40AF] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                  Lihat Jasa
                </button>
              </div>
            </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
