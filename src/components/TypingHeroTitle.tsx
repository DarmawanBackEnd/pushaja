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
    // Pengaman jika index di luar batas
    if (index >= words.length) return;

    // APA blok logika di bawah ini?
    // JIKA satu kata telah selesai diketik secara lengkap,
    // MENGAPA ditulis seperti ini?
    // Kita menahan teks utuh tersebut selama 2000ms (2 detik) di layar 
    // agar pembeli sempat membacanya dengan santai, sebelum mulai dihapus.
    if (subIndex === words[index].length && !isDeleting) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    // APA blok logika di bawah ini?
    // JIKA kalimat telah selesai dihapus secara total (panjang teks = 0),
    // MENGAPA ditulis seperti ini?
    // Kita memberikan jeda transisi transparan selama 800ms (hanya kursor kedip yang tampil).
    // Ini memberikan ritme natural sebelum memulai pengetikan kata baru selanjutnya.
    if (subIndex === 0 && isDeleting) {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % words.length); // Pindah ke kata berikutnya secara rotasi
      }, 800);
      return () => clearTimeout(timeout);
    }

    // APA variabel tempo di bawah ini?
    // Menentukan kecepatan pergeseran huruf.
    // MENGAPA ditulis seperti ini?
    // - Saat mengetik (isDeleting = false): Kecepatan 110ms terasa mantap, teratur, dan natural.
    // - Saat menghapus (isDeleting = true): Kecepatan 55ms terasa dinamis, tangkas, namun tidak terburu-buru.
    const speed = isDeleting ? 55 : 110;

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index]);

  return (
    <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-800 mt-2 mb-4 leading-tight min-h-[50px] sm:min-h-[75px] flex items-center justify-center">
      <span className="bg-gradient-to-r from-[#1E40AF] to-blue-900 bg-clip-text text-transparent">
        {words[index].substring(0, subIndex)}
      </span>
      {/* Kursor Ketik dengan Transisi Opacity Lembut */}
      <span className={`text-[#1E40AF] font-light ml-1 transition-opacity duration-75 ${blink ? 'opacity-100' : 'opacity-0'}`}>
        |
      </span>
    </h1>
  );
}
