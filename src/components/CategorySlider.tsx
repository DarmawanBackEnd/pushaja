'use client';

import React, { useRef, useState, useEffect } from 'react';

interface CategoryGroupWithCategories {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  categories: {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
  }[];
}

interface CategorySliderProps {
  initialGroups?: CategoryGroupWithCategories[];
}

// Fallback jika database benar-benar kosong
const STATIC_FALLBACK_GROUPS: CategoryGroupWithCategories[] = [
  {
    id: 'pemrograman',
    name: 'Web & Pemrograman',
    slug: 'pemrograman',
    icon: `<svg class="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>`,
    categories: [
      { id: '1', name: 'Pembuatan Web SaaS', slug: 'pembuatan-web-saas', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60' },
      { id: '2', name: 'Aplikasi Android & iOS', slug: 'aplikasi-android-ios', imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=60' },
      { id: '3', name: 'Tuning Query PostgreSQL', slug: 'tuning-query-postgresql', imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500&auto=format&fit=crop&q=60' },
      { id: '4', name: 'Integrasi API Payment', slug: 'integrasi-api-payment', imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=500&auto=format&fit=crop&q=60' }
    ]
  },
  {
    id: 'desain',
    name: 'Desain Grafis & UI/UX',
    slug: 'desain',
    icon: `<svg class="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>`,
    categories: [
      { id: '5', name: 'Desain Landing Page', slug: 'desain-landing-page', imageUrl: 'https://images.unsplash.com/photo-1581291518655-9523c932dedf?w=500&auto=format&fit=crop&q=60' },
      { id: '6', name: 'Desain Logo Brand', slug: 'desain-logo-brand', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&auto=format&fit=crop&q=60' },
      { id: '7', name: 'Ilustrasi Digital', slug: 'ilustrasi-digital', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60' }
    ]
  },
  {
    id: 'penulisan',
    name: 'Penulisan & Artikel',
    slug: 'penulisan',
    icon: `<svg class="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
    categories: [
      { id: '8', name: 'Artikel Blog SEO', slug: 'artikel-blog-seo', imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&auto=format&fit=crop&q=60' },
      { id: '9', name: 'Copywriting Landing Page', slug: 'copywriting-landing-page', imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=60' }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Gaya Hidup & Hobi',
    slug: 'lifestyle',
    icon: `<svg class="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>`,
    categories: [
      { id: '10', name: 'Pijat Tradisional', slug: 'pijat-tradisional', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=60' },
      { id: '11', name: 'Cleaning Service', slug: 'cleaning-service', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60' }
    ]
  }
];

export default function CategorySlider({ initialGroups }: CategorySliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Ambil data kelompok dari props atau fallback
  const groupsToDisplay = (initialGroups && initialGroups.length > 0) ? initialGroups : STATIC_FALLBACK_GROUPS;

  const [activeSlug, setActiveSlug] = useState('');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Set kategori aktif pertama kali
  useEffect(() => {
    if (groupsToDisplay.length > 0) {
      setActiveSlug(groupsToDisplay[0].slug);
    }
  }, [groupsToDisplay]);

  // Memantau pergeseran horizontal slider
  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  // Menggeser kontainer horizontal ke kiri/kanan
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll(); // Trigger cek awal
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const activeGroup = groupsToDisplay.find(g => g.slug === activeSlug) || groupsToDisplay[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 mb-16 relative">
      
      {/* ----------------------------------------------------
          CONTAINER UTAMA PUTIH (ALA REFERENSI FASTWORK KEDUA)
          Membungkus slider kategori dan sub-kategori dalam satu box terpadu.
         ---------------------------------------------------- */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-md">
        
        {/* ROW 1: SLIDER KATEGORI KAPSUL (DENGAN TOMBOL PANAH BERSIH TANPA OVERLAY GREY) */}
        <div className="relative">
          
          {/* Tombol Geser Kiri Melayang Bersih */}
          {showLeftArrow && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md hover:bg-slate-50 hover:text-[#1E40AF] hover:scale-105 active:scale-95 transition-all focus:outline-none"
              title="Geser Kiri"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Tombol Geser Kanan Melayang Bersih */}
          {showRightArrow && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md hover:bg-slate-50 hover:text-[#1E40AF] hover:scale-105 active:scale-95 transition-all focus:outline-none"
              title="Geser Kanan"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Slider Kapsul Kategori */}
          <div 
            ref={sliderRef}
            className="flex items-center gap-3 overflow-x-auto px-1 py-1.5 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {groupsToDisplay.map((cat) => {
              const isActive = activeSlug === cat.slug;
              return (
                <div key={cat.slug} className="flex-none snap-start">
                  <button 
                    onClick={() => setActiveSlug(cat.slug)}
                    className={`group flex items-center gap-3 py-3 px-5 rounded-full border hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] shadow-sm' 
                        : 'border-slate-200 text-slate-600 bg-white hover:border-[#1E40AF]'
                    }`}
                  >
                    {/* Circle Pod Icon */}
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      isActive 
                        ? 'bg-[#1E40AF] text-white border-[#1E40AF]' 
                        : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-[#1E40AF]/10 group-hover:text-[#1E40AF] group-hover:border-blue-100'
                    }`}>
                      {cat.icon ? (
                        <div 
                          className="h-5 w-5 flex items-center justify-center" 
                          dangerouslySetInnerHTML={{ __html: cat.icon }}
                        />
                      ) : (
                        <svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>

                    {/* Label Teks */}
                    <span className={`text-xs font-extrabold tracking-tight whitespace-nowrap transition-colors duration-300 ${
                      isActive ? 'text-[#1E40AF]' : 'text-slate-700 group-hover:text-[#1E40AF]'
                    }`}>
                      {cat.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

        </div>

        {/* PEMBATAS HORIZONTAL TIPIS */}
        <div className="h-[1px] bg-slate-100 my-6"></div>

        {/* ROW 2: CONTAINER GRID SUB-KATEGORI (DENGAN TAMPILAN GAMBAR PREMIUM DARI DATABASE) */}
        <div>
          {activeGroup && activeGroup.categories && activeGroup.categories.length > 0 ? (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 animate-in fade-in duration-300">
              {activeGroup.categories.map((sub) => (
                <div 
                  key={sub.id}
                  className="relative h-28 rounded-2xl overflow-hidden bg-slate-900 p-5 flex flex-col justify-end text-white shadow-sm hover:shadow-lg hover:scale-[1.03] hover:brightness-105 active:scale-95 transition-all duration-300 cursor-pointer group"
                >
                  {/* Gambar visual premium Unsplash */}
                  {sub.imageUrl ? (
                    <>
                      <img 
                        src={sub.imageUrl} 
                        alt={sub.name} 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] to-indigo-900 opacity-80"></div>
                      <div className="absolute top-[-20%] right-[-20%] w-16 h-16 bg-white/10 rounded-full blur-md group-hover:scale-125 transition-transform duration-300"></div>
                    </>
                  )}
                  
                  {/* Teks Nama Jasa Spesifik (Tebal & Centered) */}
                  <span className="text-sm font-extrabold tracking-tight text-white leading-tight drop-shadow-md pr-4 z-10">
                    {sub.name}
                  </span>

                  {/* Ikon panah kecil di pojok kanan bawah melambangkan navigasi */}
                  <span className="absolute bottom-4 right-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all text-xs font-bold z-10">
                    ➔
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <svg className="h-8 w-8 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <title>Kategori Kosong</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" />
              </svg>
              <h4 className="text-xs font-extrabold text-slate-600">Belum Ada Jenis Layanan</h4>
              <p className="text-[10px] text-slate-400 mt-1">Grup kategori ini belum memiliki klasifikasi jenis layanan di database.</p>
            </div>
          )}

          {/* LINK SELANJUTNYA (DI KANAN BAWAH ALA FIVERR/FASTWORK) */}
          <div className="mt-6 flex justify-end">
            <a 
              href={`#kategori-${activeSlug}`} 
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1E40AF] hover:text-[#1e40af]/80 hover:underline transition-all"
            >
              Lihat Jasa Lainnya di Kategori Ini
              <span className="text-sm">➔</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
