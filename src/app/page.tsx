import { getGigsWithFreelancer } from '@/actions/gig.action';
import { getCategoryGroups } from '@/actions/admin.action';
import Navbar from '@/components/Navbar';
import HeroSearch from '@/components/HeroSearch';
import CategorySlider from '@/components/CategorySlider';
import TypingHeroTitle from '@/components/TypingHeroTitle';
import GigSlider from '@/components/GigSlider';
import TrainingTracker from '@/components/TrainingTracker';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Zap, 
  Scale, 
  MessageSquareQuote, 
  Star, 
  Sprout, 
  Landmark, 
  Sparkles,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

// ============================================================================
// DATA FREELANCE EKSKLUSIF ASLI PUSHAJA (DIPERTAHANKAN SESUAI PERMINTAAN)
// ============================================================================
const PUSHAJA_GIGS = [
  {
    id: 'pushaja-1',
    title: 'Pembuatan Web App SaaS Fullstack Next.js 15 & Prisma PostgreSQL',
    description: 'Kami bantu wujudkan produk digital SaaS Anda dengan arsitektur modern Next.js App Router, database PostgreSQL yang andal, dan desain responsif super cepat yang dijamin ramah SEO.',
    price: 7500000.00,
    deliveryDays: 14,
    rating: 5.0,
    reviewsCount: 24,
    status: 'active',
    category: { name: 'Web Programming' },
    freelancer: {
      name: 'Darmawan Putra',
      isVerified: true,
    }
  },
  {
    id: 'pushaja-2',
    title: 'Desain Antarmuka Aplikasi Mobile (iOS & Android) Premium di Figma',
    description: 'Desain UI/UX modern yang berfokus pada kenyamanan pengguna. Hasil akhir berupa file Figma terstruktur lengkap dengan design system, komponen reusable, dan prototipe interaktif.',
    price: 2400000.00,
    deliveryDays: 5,
    rating: 4.9,
    reviewsCount: 42,
    status: 'active',
    category: { name: 'UI/UX & Desain Grafis' },
    freelancer: {
      name: 'Syafira Putri',
      isVerified: true,
    }
  },
  {
    id: 'pushaja-3',
    title: 'Optimasi Performa Database PostgreSQL & Database Tuning SQL',
    description: 'Aplikasi backend Anda lambat? Saya akan mengaudit skema database Anda, mengoptimalkan kueri query lambat, membuat indeks relasional yang tepat, dan setup koneksi pooling via Prisma.',
    price: 3500000.00,
    deliveryDays: 7,
    rating: 4.8,
    reviewsCount: 16,
    status: 'active',
    category: { name: 'Database & DevOps' },
    freelancer: {
      name: 'Eko Prasetyo',
      isVerified: false,
    }
  },
  {
    id: 'pushaja-4',
    title: 'Jasa Copywriting Landing Page Bisnis & SEO Artikel Indonesia',
    description: 'Copywriting hipnotik yang dirancang khusus untuk meningkatkan konversi penjualan produk Anda. Riset audiens mendalam, ramah kata kunci SEO Google, dan 100% bebas dari plagiarisme.',
    price: 800000.00,
    deliveryDays: 3,
    rating: 5.0,
    reviewsCount: 58,
    status: 'active',
    category: { name: 'Writing & Translation' },
    freelancer: {
      name: 'Riana Lestari',
      isVerified: true,
    }
  },
  {
    id: 'pushaja-5',
    title: 'Video Iklan Promosi Produk Kreatif TikTok, Instagram & YouTube Reels',
    description: 'Produksi video promosi produk dengan efek transisi sinematik modern, copywriting naskah persuasif, dan dubbing suara profesional yang siap membuat produk Anda viral di media sosial.',
    price: 1950000.00,
    deliveryDays: 4,
    rating: 4.9,
    reviewsCount: 31,
    status: 'active',
    category: { name: 'Video & Animation' },
    freelancer: {
      name: 'Budi Santoso',
      isVerified: true,
    }
  },
  {
    id: 'pushaja-6',
    title: 'Audit Keamanan Website & Penetrasi Cyber Security Profesional',
    description: 'Lindungi bisnis Anda dari ancaman peretas. Kami melakukan audit celah keamanan (Vulnerability Assessment) komprehensif pada sistem web Anda dan memberikan laporan rekomendasi perbaikan resmi.',
    price: 5000000.00,
    deliveryDays: 10,
    rating: 5.0,
    reviewsCount: 12,
    status: 'active',
    category: { name: 'Security & Network' },
    freelancer: {
      name: 'Kevin Wijaya',
      isVerified: false,
    }
  }
];

export default async function Home() {
  // Mengambil data real dari database PostgreSQL jika ada
  const dbResponse = await getGigsWithFreelancer();
  const hasDbData = dbResponse.success && dbResponse.data && dbResponse.data.length > 0;
  
  // Ambil data kategori grup dinamis langsung dari database
  const categoryGroups = await getCategoryGroups();
  
  // Tampilkan data rill atau data kustom eksklusif PushAja
  const gigsToDisplay = hasDbData 
    ? dbResponse.data!.map(gig => ({ ...gig, price: Number(gig.price) })) 
    : PUSHAJA_GIGS;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#EAB308] selection:text-[#15803D]">
      
      {/* ----------------------------------------------------
          NAVBAR RESMI PUSHAJA (DINKOPUKM PERINDAG KOTA SERANG)
         ---------------------------------------------------- */}
      <Navbar />

      {/* ----------------------------------------------------
          HERO SECTION ASLI PUSHAJA (DENGAN IDENTITAS LOGO DINKOPUKM)
         ---------------------------------------------------- */}
      <section className="relative z-30 overflow-visible bg-gradient-to-b from-emerald-50/80 via-emerald-50/20 to-slate-50 py-20 text-center">
        
        {/* Hiasan Latar Belakang Bulatan Berpendar Hijau & Emas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[380px] h-[380px] rounded-full bg-emerald-200/30 blur-[90px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[320px] h-[320px] rounded-full bg-[#EAB308]/15 blur-[80px]"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center">
          
          {/* Label Kampanye Asli pushaja x DinkopUKM Kota Serang */}
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-black text-[#15803D] border border-emerald-200 mb-6 shadow-sm">
            <Landmark className="h-3.5 w-3.5 text-[#15803D]" />
            PUSHAJA INDONESIA — DORONG BISNIS ANDA LEBIH CEPAT • DINKOPUKM KOTA SERANG
          </span>

          {/* Sub-judul Copywriting Asli pushaja */}
          <h2 className="text-xs sm:text-sm font-black text-[#15803D] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
            Temukan freelancer dengan keahlian terbaik..
          </h2>

          {/* Tajuk Utama dengan Animasi Mengetik Asli pushaja */}
          <TypingHeroTitle />

          {/* Paragraf Utama Asli pushaja */}
          <p className="max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Kerja praktis tanpa ribet bersama ribuan talenta digital independen terbaik tanah air. <br className="hidden sm:inline" />
            Pekerjaan Beres, Bisnis Melesat. <strong className="text-[#15803D]">#TinggalPushAja</strong>
          </p>

          {/* Bilah Pencarian AI Interaktif (Client Component) */}
          <HeroSearch />

        </div>
      </section>

      {/* ----------------------------------------------------
          SLIDER KATEGORI BENTUK KAPSUL HORIZONTAL KUSTOM
         ---------------------------------------------------- */}
      <CategorySlider initialGroups={categoryGroups} />

      {/* ----------------------------------------------------
          NEW FEATURE: PELATIHAN & SISTEM LIVE TRACKING PROGRES
          (Koleksi Bimtek DinkopUKM & Pelacakan Status Pesanan/Pelatihan)
         ---------------------------------------------------- */}
      <TrainingTracker />

      {/* ----------------------------------------------------
          SECTION: CARA MEMPEKERJAKAN FREELANCER (STEPS & YOUTUBE)
         ---------------------------------------------------- */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-12 items-center">
          
          {/* Kolom Kiri: Langkah-langkah Rekrutmen */}
          <div className="md:col-span-6 text-left">
            <span className="text-[#15803D] text-xs font-black uppercase tracking-wider block mb-3">
              PANDUAN TRANSAKSI PUSHAJA
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Cara Mudah Mempekerjakan <br />
              Freelancer di pushaja
            </h2>
            <p className="mt-4 text-slate-500 text-sm leading-relaxed font-medium">
              Ikuti 4 langkah sederhana berikut untuk menemukan mitra keahlian digital terbaik dan melesatkan proyek Anda dengan aman.
            </p>

            {/* List Langkah */}
            <div className="mt-8 space-y-6">
              
              {/* Langkah 1 */}
              <div className="flex gap-4 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#15803D] text-xs font-black text-white">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Cari & Pilih Jasa Terbaik</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Gunakan kolom pencarian pintar untuk menjelajahi etalase jasa. Tinjau ulasan, portofolio, dan rating freelancer secara transparan.
                  </p>
                </div>
              </div>

              {/* Langkah 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#15803D] text-xs font-black text-white">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Diskusikan Brief Detail</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Hubungi freelancer pilihan Anda untuk menyelaraskan detail kustom pekerjaan, kesepakatan tenggat waktu, dan deliverables yang Anda butuhkan.
                  </p>
                </div>
              </div>

              {/* Langkah 3 */}
              <div className="flex gap-4 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#15803D] text-xs font-black text-white">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Lakukan Pembayaran Escrow</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Lakukan pembayaran aman melalui metode transfer. Dana Anda akan tertahan dengan aman di rekening bersama pushaja selama freelancer bekerja.
                  </p>
                </div>
              </div>

              {/* Langkah 4 */}
              <div className="flex gap-4 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#15803D] text-xs font-black text-white">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Terima Hasil & Selesaikan</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Tinjau hasil kerja yang dikirimkan. Setelah hasil pekerjaan sesuai dengan brief Anda, setujui penyelesaian transaksi untuk mencairkan dana ke freelancer.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Kolom Kanan: Video Tutorial YouTube Asli */}
          <div className="md:col-span-6 flex justify-center">
            <div className="w-full max-w-lg aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 relative group">
              <iframe 
                className="absolute inset-0 w-full h-full" 
                src="https://www.youtube.com/embed/1SFtUsmyJX0?si=K1mQEPbvbaOfB2PP" 
                title="Panduan Mempekerjakan Freelancer di pushaja" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION: KENAPA MEMILIH PUSHAJA (LEFT ALIGNED)
         ---------------------------------------------------- */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="max-w-3xl mb-16">
            <span className="text-[#15803D] text-xs font-black uppercase tracking-wider block mb-3">
              KEMUDAHAN DAN KEAMANAN
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Kenapa Mempercayakan Projek di pushaja?
            </h2>
            <p className="mt-3 text-slate-500 text-sm leading-relaxed font-medium">
              Kami menjamin alur kolaborasi yang aman, cepat, dan transparan untuk melesatkan pertumbuhan bisnis Anda tanpa keraguan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Benefit 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-150 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100 transition-colors group-hover:bg-emerald-100 text-[#15803D]">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-3">Rekening Bersama pushaja</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Pembayaran Anda aman tertahan di escrow sistem pushaja. Dana baru akan diteruskan ke freelancer ketika Anda menyatakan puas dengan hasil pekerjaan yang dikirimkan.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-150 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100 transition-colors group-hover:bg-emerald-100 text-[#15803D]">
                <Zap size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-3">Dorong Kecepatan Pengiriman</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Setiap jasa disepakati dengan durasi pengerjaan yang ketat. Freelancer yang terlambat mengirim tugas akan mendapatkan penurunan reputasi dan potensi pembatalan dana instan.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-150 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100 transition-colors group-hover:bg-emerald-100 text-[#15803D]">
                <Scale size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-3">Mediasi Sengketa (Dispute) Adil</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Apabila hasil kerja melanggar kesepakatan awal, tim mediasi pushaja bersama DinkopUKM siap meninjau keluhan secara netral dan mengembalikan dana pembeli sepenuhnya secara objektif.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION: JASA POPULER TERLARIS (AUTOMATED POPULARITY SLIDER)
         ---------------------------------------------------- */}
      <section className="bg-slate-100/50 py-20 md:py-28 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Konten Jasa Terpopuler */}
          <div className="flex flex-col items-start text-left border-b border-slate-200 pb-10 mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-[10px] font-black tracking-widest text-[#15803D] uppercase border border-emerald-200 mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
              SISTEM POPULARITAS OTOMATIS
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
              Layanan Paling Banyak di Cari
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-500 font-medium leading-relaxed">
              Temukan jasa favorit yang paling banyak di order dan di rekomendasikan oleh pengguna lain
            </p>
          </div>

          {/* Slider Jasa Horizontal Menyamping (Jasa Asli PushAja) */}
          <GigSlider gigs={gigsToDisplay} />

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION: ULASAN PELANGGAN (CUSTOMER REVIEWS ASLI)
         ---------------------------------------------------- */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-3 py-1 text-[10px] font-black tracking-wider text-[#15803D] uppercase border border-emerald-200 mb-3">
              <MessageSquareQuote size={12} strokeWidth={2.5} /> TESTIMONI TERVERIFIKASI
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Apa Kata Klien Tentang pushaja?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Dengarkan langsung cerita sukses dari ribuan pelaku bisnis, startup, dan UMKM di Indonesia yang telah melesatkan proyek digital mereka dengan aman dan efisien bersama kami.
            </p>
          </div>

          {/* Grid Testimoni Asli */}
          <div className="grid gap-8 md:grid-cols-3">
            
            {/* Ulasan 1 */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-150 hover:shadow-xl hover:bg-white hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-[#EAB308] mb-5">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <blockquote className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium italic">
                  "Sistem escrow rekening bersama pushaja benar-benar memberikan rasa aman yang luar biasa. Freelancer menyelesaikan web SaaS kami tepat waktu, dan dana baru dicairkan setelah kami uji coba menyeluruh. Sangat direkomendasikan!"
                </blockquote>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#15803D] text-xs font-black text-white">
                  AN
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-none">Aditya Nugroho</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">CEO, NuansaTech Digital</span>
                </div>
              </div>
            </div>

            {/* Ulasan 2 */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-150 hover:shadow-xl hover:bg-white hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-[#EAB308] mb-5">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <blockquote className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium italic">
                  "Desain UI/UX aplikasi e-commerce kami yang dikerjakan via pushaja sangat memukau! Penjualan kami meningkat drastis berkat desain premium yang responsif. Kolaborasi naskah brief-nya sangat mulus."
                </blockquote>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-black text-white">
                  SR
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-none">Siti Rahmawati</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Owner, Rahma Fashion Brand</span>
                </div>
              </div>
            </div>

            {/* Ulasan 3 */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-150 hover:shadow-xl hover:bg-white hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-[#EAB308] mb-5">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <blockquote className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium italic">
                  "Video promosi Reels & TikTok untuk menu kuliner baru kami meledak di media sosial. Hasil pengerjaannya sangat cepat, komunikasi responsif, dan kualitas dubbing suara serta editing videonya benar-benar di atas rata-rata!"
                </blockquote>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-black text-white">
                  RP
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-none">Reza Pahlevi</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Marketing Director, KulinerKita Group</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION: TENTANG PUSHAJA (CARD JUMBO PREMIUM)
         ---------------------------------------------------- */}
      <section id="tentang-pushaja" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#15803D] via-emerald-900 to-slate-950 text-white shadow-2xl p-8 md:p-16 border border-emerald-950">
            
            {/* Glowing background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#EAB308]/15 blur-[120px]"></div>
              <div className="absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-[#15803D]/40 blur-[100px]"></div>
            </div>

            <div className="relative z-10 grid md:grid-cols-12 gap-12 items-center">
              
              {/* Kolom Kiri: Ringkasan Platform */}
              <div className="md:col-span-7 text-left space-y-6">
                
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-[10px] font-black tracking-widest text-[#EAB308] uppercase border border-white/10">
                  <Sprout size={12} strokeWidth={2.5} /> TENTANG PUSHAJA
                </span>
                
                <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  Mendorong Potensi Digital <br />
                  Indonesia Lebih Cepat
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  <strong>pushaja</strong> lahir sebagai solusi dari lambatnya integrasi layanan digital di era modern. Kami menyadari bahwa UMKM, korporat, maupun startup membutuhkan eksekusi keahlian yang instan, aman, dan tanpa hambatan birokrasi. 
                </p>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Dengan dukungan resmi dari <strong>Dinas Koperasi, UKM, Perindustrian dan Perdagangan (DinkopUKM Perindag) Kota Serang</strong>, platform ini mempertemukan talenta digital terverifikasi dengan pelaku usaha lokal. Sistem escrow rekening bersama kami menjamin perlindungan investasi Anda, sehingga Anda bisa fokus penuh pada ekspansi bisnis Anda.
                </p>

                <div className="pt-4 flex gap-4 flex-wrap">
                  <span className="text-xs font-black text-[#EAB308]">#TinggalPushAja</span>
                  <span className="text-xs font-black text-slate-400">•</span>
                  <span className="text-xs font-black text-[#EAB308]">#KerjaTanpaRibet</span>
                  <span className="text-xs font-black text-slate-400">•</span>
                  <span className="text-xs font-black text-[#EAB308]">#KotaSerangMadani</span>
                </div>

              </div>

              {/* Kolom Kanan: Statistik / Nilai Utama */}
              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                
                {/* Stat 1 */}
                <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 text-center">
                  <span className="text-2xl md:text-3xl font-black text-[#EAB308] block mb-1">50K+</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Proyek Selesai</span>
                </div>

                {/* Stat 2 */}
                <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 text-center">
                  <span className="text-2xl md:text-3xl font-black text-[#EAB308] block mb-1">15K+</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Talenta Terpilih</span>
                </div>

                {/* Stat 3 */}
                <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 text-center">
                  <span className="text-2xl md:text-3xl font-black text-[#EAB308] block mb-1">99.4%</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Kepuasan Klien</span>
                </div>

                {/* Stat 4 */}
                <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 text-center">
                  <span className="text-2xl md:text-3xl font-black text-[#EAB308] block mb-1">Rp 0</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Risiko Transaksi</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          FOOTER COMPREHENSIVE
         ---------------------------------------------------- */}
      <footer className="bg-white border-t border-slate-200 py-16 text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left">
          
          {/* Col 1 */}
          <div className="col-span-2 md:col-span-1">
            <div className="relative w-48 sm:w-56 h-12 sm:h-14 mb-4">
              <Image 
                src="/logo-dinkop-kota-serang.png" 
                alt="Logo DinkopUKM Perindag Kota Serang"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              Platform marketplace jasa & talenta digital terpercaya, didukung resmi oleh Dinas Koperasi, Usaha Kecil Menengah, Perindustrian dan Perdagangan Pemerintah Kota Serang.
            </p>
            <div className="mt-4 space-y-1 text-xs text-slate-500">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Gedung DinkopUKM, Kota Serang, Banten</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#15803D]" />
                <span>(0254) 200-SERANG</span>
              </p>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Untuk Pembeli</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Cari Jasa Pemrograman Web</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Cari Jasa Desain Grafis & UI/UX</a></li>
              <li><a href="#pelatihan-tracking" className="hover:text-[#15803D] transition-colors">Lacak Status Pesanan (Live Tracking)</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Jaminan Rekening Bersama Escrow</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Kebijakan Pengembalian Dana</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Untuk Freelancer & Mitra</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/freelancer/apply" target="_blank" rel="noopener noreferrer" className="hover:text-[#15803D] transition-colors">Cara Mulai Jual Layanan</a></li>
              <li><a href="#pelatihan-tracking" className="hover:text-[#15803D] transition-colors">Bimtek & Pelatihan Gratis</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Skema Komisi Pembagian Hasil</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Pencairan Saldo (Withdraw)</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Tips Memperoleh Banyak Orderan</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Mediasi & Bantuan</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Hubungi Layanan CS Bantuan</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Syarat & Ketentuan Lisensi</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Kebijakan Privasi Data Pengguna</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Panduan Penyelesaian Sengketa</a></li>
            </ul>
          </div>

        </div>

        {/* Hak cipta bawah */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-slate-100 pt-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} pushaja x DinkopUKM Perindag Kota Serang. Seluruh hak cipta dilindungi undang-undang.</p>
        </div>
      </footer>

    </div>
  );
}
