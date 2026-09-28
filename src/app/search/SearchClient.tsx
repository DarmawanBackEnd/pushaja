'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Clock, 
  Star, 
  CheckCircle2, 
  SlidersHorizontal, 
  ArrowUpDown, 
  SearchX, 
  Sparkles,
  Home,
  ChevronRight
} from 'lucide-react';

interface SearchClientProps {
  initialGigs: any[];
  categories: { id: string; name: string; slug: string }[];
  initialQuery: string;
  initialCategory: string;
  initialSort: string;
  isDemo?: boolean;
}

export default function SearchClient({
  initialGigs,
  categories,
  initialQuery,
  initialCategory,
  initialSort,
  isDemo
}: SearchClientProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(initialQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchInput.trim() });
  };

  const updateFilters = (changes: { q?: string; category?: string; sort?: string }) => {
    const newQuery = changes.q !== undefined ? changes.q : initialQuery;
    const newCategory = changes.category !== undefined ? changes.category : initialCategory;
    const newSort = changes.sort !== undefined ? changes.sort : initialSort;

    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newCategory) params.set('category', newCategory);
    if (newSort && newSort !== 'popular') params.set('sort', newSort);

    router.push(`/search?${params.toString()}`);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      
      {/* ----------------------------------------------------
          BREADCRUMB & SEARCH HEADER
         ---------------------------------------------------- */}
      <div>
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#1E40AF] transition-colors flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <Link href="/search" className="hover:text-[#1E40AF] transition-colors">
            Pencarian Jasa
          </Link>
          {initialQuery && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="text-slate-900 font-extrabold truncate max-w-[200px]">
                &quot;{initialQuery}&quot;
              </span>
            </>
          )}
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {initialQuery ? (
                <>Hasil Pencarian: &quot;<span className="text-[#1E40AF]">{initialQuery}</span>&quot;</>
              ) : (
                <>Jelajahi Seluruh Layanan Freelance</>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {initialGigs.length > 0 
                ? `Menampilkan ${initialGigs.length} jasa freelance terverifikasi di PushAja`
                : 'Tidak ada hasil yang cocok dengan kriteria pencarian Anda'}
            </p>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          BAR PENCARIAN REFINEMENT & FILTER
         ---------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        
        {/* Form input pencarian */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Ketik kata kunci jasa (misal: 'Landing Page Figma', 'SaaS Next.js')..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E40AF] focus:ring-4 focus:ring-[#1E40AF]/10 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#1E40AF] hover:bg-[#1e40af]/90 text-white text-xs font-black shadow-md hover:shadow-lg transition-all shrink-0 active:scale-95"
          >
            Cari Jasa
          </button>
        </form>

        {/* Bar Filter Kategori & Sorting */}
        <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100">
          
          {/* Scrollable Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs">
            <button
              type="button"
              onClick={() => updateFilters({ category: '' })}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                !initialCategory
                  ? 'bg-[#1E40AF] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Kategori
            </button>

            {categories.map((cat) => {
              const isActive = initialCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateFilters({ category: cat.slug })}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#1E40AF] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Sort Selector Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Urutkan:
            </span>
            <select
              value={initialSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1E40AF] transition-all cursor-pointer"
            >
              <option value="popular">Terpopuler</option>
              <option value="latest">Terbaru</option>
              <option value="price_low">Harga: Terendah</option>
              <option value="price_high">Harga: Tertinggi</option>
            </select>
          </div>

        </div>

      </div>

      {/* ----------------------------------------------------
          HASIL GIGS / EMPTY STATE
         ---------------------------------------------------- */}
      {initialGigs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
          {initialGigs.map((gig, idx) => {
            const gigPrice = typeof gig.price === 'number' ? gig.price : parseFloat(gig.price);
            return (
              <Link
                key={gig.id}
                href={`/gigs/${gig.id}`}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-[#1E40AF]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
              >
                {/* Area Gambar Cover & Badge */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  {gig.imageUrl ? (
                    <img
                      src={gig.imageUrl}
                      alt={gig.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E40AF] to-slate-900 flex items-center justify-center p-6 text-center">
                      <span className="text-white font-black text-sm opacity-40">PushAja Service</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

                  {/* Kategori Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-black tracking-wider text-[#A3E635] uppercase border border-white/15">
                      {gig.category?.name || 'Jasa Digital'}
                    </span>
                  </div>

                  {/* Rating Pill */}
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-black text-white border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-[#A3E635] text-[#A3E635]" />
                    <span>{gig.rating ? Number(gig.rating).toFixed(1) : '5.0'}</span>
                    <span className="text-white/60 font-semibold">({gig.reviewsCount || 12 + (idx * 3)})</span>
                  </div>
                </div>

                {/* Konten Kartu */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    {/* Profil Freelancer */}
                    <div className="flex items-center gap-2.5">
                      {gig.freelancer?.profilePicture ? (
                        <img
                          src={gig.freelancer.profilePicture}
                          alt={gig.freelancer.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#1E40AF] text-white text-[11px] font-black flex items-center justify-center">
                          {gig.freelancer?.name ? gig.freelancer.name.substring(0, 1).toUpperCase() : 'P'}
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-700 truncate">
                        {gig.freelancer?.name || 'Freelancer Terverifikasi'}
                      </span>
                      {gig.freelancer?.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      )}
                    </div>

                    {/* Judul Layanan */}
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#1E40AF] transition-colors duration-200 line-clamp-2 leading-snug">
                      {gig.title}
                    </h3>
                  </div>

                  {/* Footer Kartu: Durasi & Harga */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{gig.deliveryDays || 3} Hari</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 block">Mulai dari</span>
                      <span className="text-sm font-black text-[#1E40AF]">
                        {formatRupiah(gigPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* EMPTY STATE JIKA PENCARIAN NIHIL */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <SearchX className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-black text-slate-800">
              Tidak Ada Jasa yang Ditemukan
            </h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Kami tidak dapat menemukan jasa yang sesuai dengan kata kunci &quot;{initialQuery}&quot;. Coba periksa ejaan Anda atau gunakan kata kunci yang lebih umum.
            </p>
          </div>

          {/* Saran Kata Kunci Populer */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-400 mb-2">Coba cari dengan kata kunci populer ini:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['SaaS Next.js', 'Desain Logo', 'UI/UX Mobile', 'Copywriting', 'Video Reels', 'Database SQL'].map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => {
                    setSearchInput(keyword);
                    updateFilters({ q: keyword, category: '' });
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#A3E635]/25 hover:text-[#1E40AF] text-xs font-bold text-slate-600 transition-all"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                updateFilters({ q: '', category: '', sort: 'popular' });
              }}
              className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold transition-all"
            >
              Reset Semua Filter
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
