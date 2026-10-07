'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Sparkles, Search, X } from 'lucide-react';

/**
 * KOMPONEN: HeroSearch
 * 
 * Komponen pencarian interaktif yang dipasang di tengah Hero Section.
 * Mengintegrasikan pencarian riil ke halaman /search dengan query pencarian,
 * riwayat tersimpan di LocalStorage, dan kata kunci populer.
 */
export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Daftar Pencarian Populer khas Kota Serang & DinkopUKM Perindag
  const POPULAR_SEARCHES = [
    'Sate Bandeng & Kuliner Serang',
    'Batik Kaibon Khas Banten',
    'Website Profil UMKM Binaan',
    'Desain Logo & Kemasan P-IRT',
    'Pendampingan Koperasi Modern',
    'Fasilitasi Sertifikasi Halal'
  ];

  // Mengambil riwayat pencarian dari localStorage saat komponen pertama kali dimuat di client
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('pushaja_search_history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Gagal mengambil riwayat dari localStorage:', e);
    }
  }, []);

  // Menyimpan riwayat ke localStorage
  const saveHistory = (newHistory: string[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('pushaja_search_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Gagal menyimpan riwayat ke localStorage:', e);
    }
  };

  // Menangani aksi pengiriman form pencarian (Enter / klik tombol cari)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Tambahkan query saat ini ke daftar teratas riwayat, hapus duplikasi jika ada
    const updatedHistory = [
      trimmedQuery,
      ...history.filter((item) => item !== trimmedQuery)
    ].slice(0, 5); // Batasi riwayat maksimal 5 item terakhir

    saveHistory(updatedHistory);
    setIsFocused(false);
    
    // Arahkan ke rute hasil pencarian riil
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  // Menghapus satu item dari riwayat pencarian
  const handleDeleteHistory = (itemToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah input kehilangan fokus
    const updatedHistory = history.filter((item) => item !== itemToDelete);
    saveHistory(updatedHistory);
  };

  // Menangani klik pada salah satu tag di dropdown (mengisi input & langsung cari)
  const handleItemSelect = (selectedText: string) => {
    setQuery(selectedText);
    
    // Tambahkan otomatis ke riwayat
    const updatedHistory = [
      selectedText,
      ...history.filter((item) => item !== selectedText)
    ].slice(0, 5);
    
    saveHistory(updatedHistory);
    setIsFocused(false);

    // Langsung navigasi ke hasil pencarian
    router.push(`/search?q=${encodeURIComponent(selectedText)}`);
  };

  // Efek klik di luar kontainer untuk menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto mt-8 w-full max-w-2xl z-20">
      
      {/* ----------------------------------------------------
          BARIS INPUT PENCARIAN (DECORATED GRADIENT BORDER)
         ---------------------------------------------------- */}
      <form 
        onSubmit={handleSearchSubmit}
        className={`flex w-full items-center gap-2 rounded-full border bg-white p-2 shadow-xl transition-all duration-300 ${
          isFocused 
            ? 'border-[#15803D] ring-4 ring-[#15803D]/15 scale-[1.01]' 
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Ikon Sparkles di bagian kiri */}
        <div className="flex items-center pl-3 shrink-0 text-slate-400">
          <Sparkles className="h-5 w-5 text-[#EAB308] animate-pulse" />
        </div>

        {/* Input Text Utama */}
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Cari produk UMKM, jasa koperasi, atau talenta Kota Serang..." 
          className="w-full bg-transparent px-2 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
        />

        {/* Info & Tombol Cari kanan */}
        <div className="flex items-center gap-3 shrink-0 pr-1">
          <button 
            type="submit"
            aria-label="Cari Jasa & Produk"
            className="rounded-full bg-gradient-to-r from-[#15803D] to-emerald-700 p-3 text-white hover:opacity-95 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Search className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </form>

      {/* ----------------------------------------------------
          DROPDOWN CONTAINER (RIWAYAT & PENCARIAN POPULER)
         ---------------------------------------------------- */}
      {isFocused && (
        <div className="absolute left-0 mt-3 w-full rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 text-left">
          
          {/* Bagian A: Riwayat Pencarian */}
          <div className="mb-6">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock size={13} strokeWidth={2.5} /> Riwayat Pencarian
            </h4>
            
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 italic pl-1 py-1">Belum ada riwayat pencarian.</p>
            ) : (
              <ul className="space-y-1">
                {history.map((item) => (
                  <li 
                    key={item}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Menjaga input tetap fokus
                      handleItemSelect(item);
                    }}
                    className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1E40AF]" />
                      {item}
                    </span>
                    {/* Tombol hapus riwayat individual */}
                    <button 
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()} // Cegah trigger item klik
                      onClick={(e) => handleDeleteHistory(item, e)}
                      className="rounded-full p-1 text-slate-300 hover:bg-slate-200 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100"
                      title="Hapus riwayat"
                    >
                      <X className="h-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pembatas Horizontal tipis */}
          <div className="h-[1px] bg-slate-100 my-4"></div>

          {/* Bagian B: Pencarian Populer */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles size={13} strokeWidth={2.5} /> Pencarian Populer
            </h4>
            <div className="flex flex-wrap gap-2 pl-1">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Menjaga input tetap fokus
                    handleItemSelect(term);
                  }}
                  className="rounded-full bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-[#A3E635]/25 hover:text-[#1E40AF] transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
