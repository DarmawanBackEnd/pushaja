import React from 'react';
import { getCategoryBrowseData } from '@/actions/category.action';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { 
  Home, 
  ChevronRight, 
  ArrowRight, 
  Star, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Briefcase, 
  Flame,
  PlusCircle,
  Search
} from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await getCategoryBrowseData(slug);

  if (!data) {
    notFound();
  }

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      {/* Navbar Global */}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* ----------------------------------------------------
            BREADCRUMB NAVIGASI
           ---------------------------------------------------- */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-[#1E40AF] transition-colors flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <Link href="/categories" className="hover:text-[#1E40AF] transition-colors">
            Kategori
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

          {data.type === 'category' ? (
            <>
              <Link href={`/categories/${data.groupSlug}`} className="hover:text-[#1E40AF] transition-colors">
                {data.groupName}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="text-slate-900 font-extrabold">{data.categoryName}</span>
            </>
          ) : (
            <span className="text-slate-900 font-extrabold">{data.groupName}</span>
          )}
        </nav>

        {/* ----------------------------------------------------
            TATA LETAK UTAMA: 2 KOLOM (SIDEBAR + KONTEN)
           ---------------------------------------------------- */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* KOLOM KIRI: SIDEBAR KELOMPOK KATEGORI */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <div className="w-8 h-8 rounded-xl bg-[#1E40AF]/10 text-[#1E40AF] flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  Kelompok Kategori
                </div>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {data.allGroups.length}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                {data.allGroups.map((group) => {
                  const isCurrentGroup = group.slug === data.groupSlug;
                  return (
                    <div key={group.id} className="space-y-1">
                      <Link
                        href={`/categories/${group.slug}`}
                        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                          isCurrentGroup
                            ? 'bg-[#1E40AF] text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-[#1E40AF]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {group.icon ? (
                            <div 
                              className={`w-4 h-4 flex items-center justify-center shrink-0 ${
                                isCurrentGroup ? 'text-white' : 'text-slate-400 group-hover:text-[#1E40AF]'
                              }`}
                              dangerouslySetInnerHTML={{ __html: group.icon }}
                            />
                          ) : (
                            <Briefcase className="w-4 h-4 shrink-0" />
                          )}
                          <span className="truncate">{group.name}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                          isCurrentGroup ? 'text-white rotate-90' : 'text-slate-300 group-hover:text-[#1E40AF] group-hover:translate-x-0.5'
                        }`} />
                      </Link>

                      {/* Sub-kategori khusus untuk grup yang sedang aktif */}
                      {isCurrentGroup && group.categories && group.categories.length > 0 && (
                        <div className="ml-4 pl-3 border-l-2 border-[#1E40AF]/20 py-1 space-y-1">
                          {group.categories.map((sub) => {
                            const isCurrentSub = data.type === 'category' && data.categorySlug === sub.slug;
                            return (
                              <Link
                                key={sub.id}
                                href={`/categories/${sub.slug}`}
                                className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                                  isCurrentSub
                                    ? 'bg-[#1E40AF]/10 text-[#1E40AF] font-extrabold'
                                    : 'text-slate-500 hover:text-[#1E40AF] hover:bg-slate-50'
                                }`}
                              >
                                <span className="truncate">{sub.name}</span>
                                {sub.gigsCount !== undefined && sub.gigsCount > 0 && (
                                  <span className="text-[10px] text-slate-400 ml-1 font-mono">
                                    {sub.gigsCount}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* KOLOM KANAN: KONTEN UTAMA */}
          <section className="flex-1 min-w-0 space-y-8">
            
            {/* HERO BANNER KATEGORI */}
            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-10 shadow-lg border border-slate-700/50">
              
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#1E40AF]/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#A3E635]/15 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#A3E635] text-xs font-extrabold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {data.type === 'category' ? `Subkategori: ${data.groupName}` : 'Kategori Utama'}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {data.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                  {data.description}
                </p>

                {/* Highlights jaminan PushAja */}
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
                    <span>Garansi Rekber PushAja</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#A3E635]" />
                    <span>Pengerjaan Tepat Waktu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-[#A3E635]" />
                    <span>Rating Rata-rata 4.9+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* JIKA BERADA DI KATEGORI UTAMA: TAMPILKAN GRID SUB-KATEGORI */}
            {data.subcategories && data.subcategories.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      Spesialisasi di {data.groupName}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Pilih jenis layanan spesifik sesuai kebutuhan proyek Anda
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.subcategories.map((sub) => {
                    const isSelected = data.type === 'category' && data.categorySlug === sub.slug;
                    return (
                      <Link
                        key={sub.id}
                        href={`/categories/${sub.slug}`}
                        className={`group relative h-28 rounded-2xl overflow-hidden bg-slate-900 p-4 flex flex-col justify-end text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${
                          isSelected ? 'ring-2 ring-[#A3E635]' : ''
                        }`}
                      >
                        {sub.imageUrl ? (
                          <>
                            <img
                              src={sub.imageUrl}
                              alt={sub.name}
                              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] to-indigo-900 opacity-80"></div>
                            <div className="absolute top-[-20%] right-[-20%] w-16 h-16 bg-white/10 rounded-full blur-md group-hover:scale-125 transition-transform duration-300"></div>
                          </>
                        )}

                        <span className="text-xs font-extrabold tracking-tight text-white leading-tight drop-shadow-md pr-4 z-10">
                          {sub.name}
                        </span>

                        <ArrowRight className="absolute bottom-3 right-3 h-3.5 w-3.5 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all z-10" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DAFTAR JASA / GIGS */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    Layanan Freelance Tersedia
                    <span className="text-xs font-bold text-[#1E40AF] bg-[#1E40AF]/10 px-2.5 py-0.5 rounded-full">
                      {data.gigs.length} Jasa
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Pesan langsung dengan proteksi pembayaran aman dan revisi transparan
                  </p>
                </div>
              </div>

              {/* GRID KARTU GIGS */}
              {data.gigs && data.gigs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.gigs.map((gig: any, idx: number) => {
                    const gigPrice = typeof gig.price === 'number' ? gig.price : parseFloat(gig.price);
                    return (
                      <Link
                        key={gig.id}
                        href={`/gigs/${gig.id}`}
                        className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-[#1E40AF]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
                      >
                        {/* Area Gambar Cover & Badge */}
                        <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                          {gig.imageUrl ? (
                            <img
                              src={gig.imageUrl}
                              alt={gig.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1E40AF] to-slate-900 flex items-center justify-center p-6 text-center">
                              <span className="text-white font-black text-base opacity-40">PushAja Service</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

                          {/* Kategori Badge */}
                          <div className="absolute top-3 left-3 z-10">
                            <span className="rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-black tracking-wider text-[#A3E635] uppercase border border-white/15">
                              {gig.category?.name || data.title}
                            </span>
                          </div>

                          {/* Rating Pill */}
                          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-black text-white border border-white/10">
                            <Star className="w-3.5 h-3.5 fill-[#A3E635] text-[#A3E635]" />
                            <span>{gig.rating ? Number(gig.rating).toFixed(1) : '5.0'}</span>
                            <span className="text-white/60 font-semibold">({gig.reviewsCount || 10 + (idx * 5)})</span>
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
                                {gig.freelancer?.name || 'Freelancer PushAja'}
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
                /* STATE KOSONG JIKA BELUM ADA GIG */
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1E40AF] mx-auto flex items-center justify-center">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="text-lg font-black text-slate-800">
                      Belum Ada Jasa di Kategori Ini
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      Belum ada freelancer yang mempublikasikan portofolio layanan pada kategori {data.title}. Jadilah freelancer pertama yang menawarkan layanan terbaik Anda!
                    </p>
                  </div>
                  <div className="pt-3">
                    <Link
                      href="/freelancer/apply"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E40AF] hover:bg-[#1e40af]/90 text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Mulai Jual Jasa Sekarang
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </section>

        </div>

      </main>

      {/* FOOTER PUSHAJA */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12 text-center text-xs font-semibold text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PushAja Platform Freelance Indonesia. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#1E40AF] transition-colors">Beranda</Link>
            <Link href="/categories" className="hover:text-[#1E40AF] transition-colors">Semua Kategori</Link>
            <Link href="/freelancer/apply" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E40AF] transition-colors">Daftar Freelancer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
