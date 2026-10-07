'use client';

import React, { useState, useEffect } from 'react';

/**
 * KOMPONEN: TypingHeroTitle
 * 
 * APA komponen ini?
 * Komponen Client Component yang merender teks tajuk utama Hero dengan efek 
 * mesin ketik (typewriter typing animation) interaktif yang bergerak dinamis.
 * 
 * MENGAPA ditulis seperti ini?
 * 1. Peningkatan Kestabilan (Smooth State Machine): Kami merancang ulang logika pengetikan 
 *    menggunakan state indeks (`subIndex`) dan status arah pengetikan (`isDeleting`). 
 *    Pola ini jauh lebih stabil dibandingkan timer manual yang sering melompat tiba-tiba.
 * 2. Jeda Kalimat Terbaca (2 Detik): Ketika kalimat selesai diketik utuh, teks akan berhenti 
 *    berjalan selama 2 detik agar pembeli memiliki waktu yang cukup untuk membaca penawaran jasa.
 * 3. Jeda Transisi Kosong (800 Milidetik): Setelah teks terhapus habis secara teratur, 
 *    kursor berkedip akan tertahan kosong selama 800ms sebelum mulai mengetik kata baru. 
 *    Ini memecahkan masalah transisi melompat cepat yang sebelumnya Anda keluhkan.
 * 4. Animasi Kursor Lembut: Kursor kedip `|` dikendalikan secara independen demi menjamin 
 *    kedipan tetap stabil dan tidak terdistorsi saat teks bergerak.
 */
export default function TypingHeroTitle() {
  const words = [
    'Gaya Hidup',
    'Desain UI/UX & Figma',
    'Konsultasi & Manajemen',
    'Pemasaran & Iklan',
    'Penulisan & Artikel',
    'Edukasi & Pelatihan'
  ];

  const [index, setIndex] = useState(0); // Indeks kata aktif di dalam array
  const [subIndex, setSubIndex] = useState(0); // Panjang huruf yang ditampilkan dari kata aktif
  const [isDeleting, setIsDeleting] = useState(false); // Status apakah sedang menghapus
  const [blink, setBlink] = useState(true); // Status kedipan kursor

  // ----------------------------------------------------
  // EFEK 1: KEDIP KURSOR MANDIRI
  // ----------------------------------------------------
  useEffect(() => {
    const blinkTimeout = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 530); // Kecepatan kedip kursor standar
    return () => clearTimeout(blinkTimeout);
  }, [blink]);

  // ----------------------------------------------------
  // EFEK 2: LOGIKA PENGETIKAN TYPEWRITER (SMOOTH TEMPO)
  // ----------------------------------------------------
  useEffect(() => {
    if (index >= words.length) return;

    if (subIndex === words[index].length && !isDeleting) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
      }, 800);
      return () => clearTimeout(timeout);
    }

    const speed = isDeleting ? 55 : 110;

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index]);

  return (
    <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-slate-900 mt-2 mb-4 leading-tight min-h-[50px] sm:min-h-[75px] flex items-center justify-center">
      <span className="bg-gradient-to-r from-[#15803D] via-emerald-800 to-slate-900 bg-clip-text text-transparent">
        {words[index].substring(0, subIndex)}
      </span>
      {/* Kursor Ketik dengan Transisi Opacity Lembut */}
      <span className={`text-[#15803D] font-light ml-1 transition-opacity duration-75 ${blink ? 'opacity-100' : 'opacity-0'}`}>
        |
      </span>
    </h1>
  );
}
