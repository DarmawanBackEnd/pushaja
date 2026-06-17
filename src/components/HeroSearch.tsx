'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * KOMPONEN: HeroSearch
 * 
 * APA komponen ini?
 * Komponen pencarian interaktif yang dipasang di tengah Hero Section. Komponen ini 
 * bertindak sebagai React Client Component untuk menangani status interaksi dinamis.
 * 
 * MENGAPA ditulis seperti ini?
 * 1. Dropdown Riwayat & Populer: Saat input diklik (fokus), sebuah dropdown card berisi 
 *    "Riwayat Pencarian" dan "Pencarian Populer" akan muncul.
 * 2. Integrasi LocalStorage: Riwayat pencarian disimpan dan diambil secara dinamis dari 
 *    `localStorage` browser pengguna, sehingga benar-benar berfungsi secara riil!
 * 3. Trik onMouseDown & preventDefault: Untuk mencegah dropdown langsung menutup ketika 
 *    pengguna mengeklik item di dalamnya, kita menggunakan event `onMouseDown` dengan 
 *    `e.preventDefault()`. Ini menunda penutupan input dan memicu aksi klik secara mulus.
 * 4. Desain Visual Premium: Meniru persis estetika pencarian AI milik Fastwork dengan border 
 *    gradien melingkar yang menawan, ikon kilau bintang (sparkle), dan tata letak yang bersih.
 */
export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Daftar Pencarian Populer ala Fastwork
  const POPULAR_SEARCHES = [
    'Logo minimalis untuk restoran',
    'Aplikasi mobile React Native',
    'Landing page Figma premium',
    'Artikel SEO Bahasa Indonesia',
    'Video editor TikTok & Reels'
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
    
    // Simulasi aksi pencarian (bisa diarahkan ke router.push('/search?q=' + query) di masa depan)
    alert(`Mencari Jasa untuk: "${trimmedQuery}"`);
  };

  // Menghapus satu item dari riwayat pencarian
  const handleDeleteHistory = (itemToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah input kehilangan fokus
    const updatedHistory = history.filter((item) => item !== itemToDelete);
    saveHistory(updatedHistory);
  };

  // Menangani klik pada salah satu tag di dropdown (mengisi input pencarian)
  const handleItemSelect = (selectedText: string) => {
    setQuery(selectedText);
    
    // Tambahkan otomatis ke riwayat
    const updatedHistory = [
      selectedText,
      ...history.filter((item) => item !== selectedText)
    ].slice(0, 5);
    
    saveHistory(updatedHistory);
    setIsFocused(false);
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
            ? 'border-[#1E40AF] ring-4 ring-[#1E40AF]/10 scale-[1.01]' 
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Ikon Sparkles AI di bagian kiri (Fastwork-style) */}
        <div className="flex items-center pl-3 shrink-0 text-slate-400">
          <svg className="h-5 w-5 text-violet-500 fill-current animate-pulse" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        {/* Input Text Utama */}
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Logo minimalis untuk restoran" 
          className="w-full bg-transparent px-2 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
        />

        {/* Info & Tombol AI Search kanan (Ala Fastwork referensi Anda) */}
        <div className="flex items-center gap-3 shrink-0 pr-1">
          <button 
            type="submit"
            className="rounded-full bg-gradient-to-r from-[#1E40AF] to-blue-700 p-3 text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* ----------------------------------------------------
          DROPDOWN CONTAINER (RIWAYAT & PENCARIAN POPULER)
         ---------------------------------------------------- */}
      {isFocused && (
        <div className="absolute left-0 mt-3 w-full rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          
          {/* Bagian A: Riwayat Pencarian */}
          <div className="mb-6">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span>🕒</span> Riwayat Pencarian
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
                      <span className="text-slate-300">#</span>
                      {item}
                    </span>
                    {/* Tombol hapus riwayat individual */}
                    <button 
                      onMouseDown={(e) => e.stopPropagation()} // Cegah trigger item klik
                      onClick={(e) => handleDeleteHistory(item, e)}
                      className="rounded-full p-1 text-slate-300 hover:bg-slate-200 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100"
                      title="Hapus riwayat"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
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
              <span>✨</span> Pencarian Populer
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
