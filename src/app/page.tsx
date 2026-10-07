import { getGigsWithFreelancer } from '@/actions/gig.action';
import { getCategoryGroups } from '@/actions/admin.action';
import Navbar from '@/components/Navbar';
import HeroSearch from '@/components/HeroSearch';
import CategorySlider from '@/components/CategorySlider';
import TypingHeroTitle from '@/components/TypingHeroTitle';
import GigSlider from '@/components/GigSlider';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Zap, 
  Scale, 
  MessageSquareQuote, 
  Star, 
  Sprout, 
  Landmark, 
  Award, 
  Building2, 
  Store, 
  Users, 
  FileCheck, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Coins, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2,
  FileText
} from 'lucide-react';

// ============================================================================
// DATA LAYANAN & PRODUK UNGGULAN KOTA SERANG (DINKOPUKM PERINDAG)
// ============================================================================
const SERANG_GIGS = [
  {
    id: 'serang-1',
    title: 'Pembuatan Website Katalog & Toko Online UMKM Binaan Kota Serang',
    description: 'Bantu produk UMKM Anda merambah pasar nasional dengan website katalog modern, integrasi WhatsApp order, dan optimasi SEO lokal Kota Serang.',
    price: 1500000.00,
    deliveryDays: 5,
    rating: 5.0,
    reviewsCount: 38,
    status: 'active',
    category: { name: 'Digitalisasi UMKM' },
    freelancer: {
      name: 'Tubagus Maulana',
      isVerified: true,
    }
  },
  {
    id: 'serang-2',
    title: 'Desain Kemasan (Packaging) & Label Produk Kuliner Khas Banten',
    description: 'Desain label dan kotak kemasan food-grade berstandar ritel modern untuk produk olahan kuliner lokal seperti Sate Bandeng, Rabeg, dan Keripik.',
    price: 750000.00,
    deliveryDays: 3,
    rating: 4.9,
    reviewsCount: 52,
    status: 'active',
    category: { name: 'Desain Kemasan' },
    freelancer: {
      name: 'Siti Nurhaliza',
      isVerified: true,
    }
  },
  {
    id: 'serang-3',
    title: 'Pendampingan Digitalisasi Laporan Keuangan & RAT Koperasi Modern',
    description: 'Setup sistem akuntansi digital berbasis cloud untuk koperasi simpan pinjam dan koperasi konsumen agar pembukuan transparan dan siap audit tahunan.',
    price: 2500000.00,
    deliveryDays: 7,
    rating: 5.0,
    reviewsCount: 19,
    status: 'active',
    category: { name: 'Tata Kelola Koperasi' },
    freelancer: {
      name: 'Ahmad Fauzi, S.E.',
      isVerified: true,
    }
  },
  {
    id: 'serang-4',
    title: 'Produksi Video Promosi Reels & TikTok Produk Wisata & Kuliner Serang',
    description: 'Jasa pembuatan video cinematic pendek untuk mempromosikan gerai UMKM, sentra kerajinan, dan kuliner khas Kota Serang dengan engagement tinggi.',
    price: 1200000.00,
    deliveryDays: 4,
    rating: 4.9,
    reviewsCount: 44,
    status: 'active',
    category: { name: 'Kreator Konten' },
    freelancer: {
      name: 'Rian Pratama',
      isVerified: true,
    }
  },
  {
    id: 'serang-5',
    title: 'Fasilitasi Kelengkapan Berkas NIB, P-IRT & Sertifikasi Halal Gratis',
    description: 'Pendampingan konsultasi pemberkasan izin berusaha satu pintu bagi pelaku usaha mikro dan ultra mikro Kota Serang hingga sertifikat terbit resmi.',
    price: 350000.00,
    deliveryDays: 3,
    rating: 5.0,
    reviewsCount: 63,
    status: 'active',
    category: { name: 'Legalitas Usaha' },
    freelancer: {
      name: 'Pendamping PLUT Serang',
      isVerified: true,
    }
  },
  {
    id: 'serang-6',
    title: 'Desain Motif Batik Kaibon & Modifikasi Fashion Khas Kesultanan Banten',
    description: 'Karya desain motif batik eksklusif terinspirasi peninggalan Keraton Kaibon untuk busana seragam instansi, komunitas, maupun cinderamata resmi.',
    price: 1800000.00,
    deliveryDays: 6,
    rating: 4.8,
    reviewsCount: 27,
    status: 'active',
    category: { name: 'Kriya & Batik Kaibon' },
    freelancer: {
      name: 'Sanggar Kaibon Art',
      isVerified: true,
    }
  }
];

// Data 6 Kecamatan di Kota Serang
const KECAMATAN_SERANG = [
  {
    nama: 'Kecamatan Serang',
    fokus: 'Pusat Perdagangan & Jasa',
    deskripsi: 'Sentra bisnis utama kota, ekosistem startup, agensi digital, kuliner perkotaan, dan pusat perbelanjaan modern.',
    icon: Building2,
  },
  {
    nama: 'Kecamatan Kasemen',
    fokus: 'Sejarah, Bahari & Budaya',
    deskripsi: 'Kawasan Banten Lama, Pelabuhan Karangantu, kuliner olahan hasil laut, serta pengrajin cenderamata sejarah.',
    icon: Landmark,
  },
  {
    nama: 'Kecamatan Cipocok Jaya',
    fokus: 'Pusat Kreatif & Pendidikan',
    deskripsi: 'Pusat institusi pendidikan, inkubasi talenta muda kreatif, kerajinan tangan, dan sentra komoditas olahan pangan.',
    icon: Sparkles,
  },
  {
    nama: 'Kecamatan Taktakan',
    fokus: 'Agrowisata & Hasil Bumi',
    deskripsi: 'Kawasan perbukitan asri, perkebunan durian, kopi lokal, agrowisata alam, dan sentra produksi emping melinjo.',
    icon: Sprout,
  },
  {
    nama: 'Kecamatan Walantaka',
    fokus: 'Industri Rumahan & Kerajinan',
    deskripsi: 'Sentra industri olahan pangan tradisional seperti gipang, keripik pisang, serta pengrajin mebel dan anyaman.',
    icon: Store,
  },
  {
    nama: 'Kecamatan Curug',
    fokus: 'Kawasan Pemerintahan (KP3B)',
    deskripsi: 'Kawasan pusat perkantoran provinsi dan kota, koperasi aparatur sipil negara, serta layanan logistik strategis.',
    icon: Award,
  },
];

export default async function Home() {
  // Mengambil data real dari database jika ada
  const dbResponse = await getGigsWithFreelancer();
  const hasDbData = dbResponse.success && dbResponse.data && dbResponse.data.length > 0;
  
  // Ambil data kategori grup langsung dari database
  const categoryGroups = await getCategoryGroups();
  
  // Tampilkan data real atau data unggulan Kota Serang
  const gigsToDisplay = hasDbData 
    ? dbResponse.data!.map(gig => ({ ...gig, price: Number(gig.price) })) 
    : SERANG_GIGS;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#EAB308] selection:text-[#15803D]">
      
      {/* ----------------------------------------------------
          NAVBAR RESMI DINKOPUKM PERINDAG KOTA SERANG
         ---------------------------------------------------- */}
      <Navbar />

      {/* ----------------------------------------------------
          HERO SECTION RESMI PEMKOT SERANG & DINKOPUKM
         ---------------------------------------------------- */}
      <section className="relative z-30 overflow-visible bg-gradient-to-b from-emerald-50/90 via-emerald-50/20 to-slate-50 py-20 text-center border-b border-emerald-100/50">
        
        {/* Hiasan Latar Belakang Pendar Hijau Zamrud & Emas Madani */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[420px] h-[420px] rounded-full bg-emerald-300/20 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[380px] h-[380px] rounded-full bg-[#EAB308]/15 blur-[90px]"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center">
          
          {/* Label Kampanye Resmi Pemkot Serang */}
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-black text-[#15803D] border border-emerald-200 mb-6 shadow-sm">
            <Landmark className="h-4 w-4 text-[#15803D]" />
            PEMERINTAH KOTA SERANG • DINKOPUKM PERINDAG
          </span>

          {/* Sub-judul Kota Serang Madani */}
          <h2 className="text-xs sm:text-sm font-black text-[#15803D] uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#EAB308]" />
            Portal Resmi Koperasi, UMKM & Talenta Digital Kota Serang Madani
          </h2>

          {/* Tajuk Utama dengan Animasi Mengetik Interaktif */}
          <TypingHeroTitle />

          <p className="max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Sinergi resmi Dinas Koperasi, UKM, Perindustrian dan Perdagangan bersama Walikota Serang 
            untuk menggerakkan ekonomi kerakyatan, memodernisasi koperasi, dan memajukan produk unggulan warga Kota Serang.
          </p>

          {/* Bilah Pencarian Pintar (Client Component) */}
          <HeroSearch />

          {/* Indikator Pilar Utama Kota Serang */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              Koperasi Berbadan Hukum
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              UMKM Binaan Terverifikasi
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              Fasilitasi NIB & Halal Gratis
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              Rekening Bersama Aman (Escrow)
            </span>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SLIDER KATEGORI KAPSUL: TERMASUK KATEGORI KOTA SERANG
         ---------------------------------------------------- */}
      <CategorySlider initialGroups={categoryGroups} />

      {/* ----------------------------------------------------
          SECTION: PROFIL DINKOPUKM PERINDAG & AMANAT WALIKOTA
          (PENJELASAN KOTA SERANG & AKUISISI RESMI)
         ---------------------------------------------------- */}
      <section id="tentang-dinkop" className="py-20 bg-white border-y border-slate-150">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Kolom Kiri: Lambang & Sambutan Eksekutif */}
            <div className="lg:col-span-5 flex flex-col items-center text-center p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-b from-emerald-50 via-white to-slate-50 border border-emerald-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAB308]/10 rounded-full blur-2xl"></div>
              
              {/* Badge Logo DinkopUKM Kota Serang */}
              <div className="relative w-40 h-40 mb-6 drop-shadow-md">
                <Image 
                  src="/logo-dinkopukm-serang.png" 
                  alt="Lambang DinkopUKM Perindag Kota Serang"
                  fill
                  className="object-contain"
                />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#15803D] px-3.5 py-1 text-[11px] font-black text-white uppercase tracking-wider mb-2">
                <Building2 className="w-3.5 h-3.5" />
                Pemerintah Kota Serang
              </span>

              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Dinas Koperasi, UKM, Perindustrian dan Perdagangan
              </h3>
              
              <p className="mt-1 text-xs font-bold text-[#15803D]">
                Menuju Kota Serang Madani: Maju, Mandiri & Sejahtera
              </p>

              <div className="h-[1px] w-full bg-slate-200 my-6"></div>

              {/* Kutipan Amanat Walikota */}
              <blockquote className="text-xs text-slate-600 leading-relaxed font-medium italic text-left bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                "Ekonomi kerakyatan adalah urat nadi Kota Serang. Melalui integrasi portal KopDigital ini, kami memastikan setiap koperasi dan pelaku UMKM di 6 kecamatan memiliki akses pasar digital, pendampingan legalitas, permodalan yang terjangkau, serta kolaborasi dengan talenta muda Serang."
                <div className="mt-3 text-right">
                  <strong className="text-xs font-black text-slate-800 block not-italic">Walikota Serang</strong>
                  <span className="text-[10px] text-slate-400 not-italic">Pembina Utama Koperasi & UMKM Kota Serang</span>
                </div>
              </blockquote>

              <div className="mt-6 flex items-center gap-2 text-xs font-black text-[#15803D]">
                <MapPin className="w-4 h-4 text-[#EAB308]" />
                Ibukota Provinsi Banten — Gerbang Peradaban Sejarah
              </div>
            </div>

            {/* Kolom Kanan: 4 Pilar Transformasi Kota Serang Madani */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#15803D] uppercase tracking-wider mb-2">
                  <Award className="w-4 h-4 text-[#EAB308]" />
                  TRANSFORMASI RESMI & AKUISISI PLATFORM
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Menghubungkan Nilai Historis Gerbang Kaibon dengan Era Digital
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Kota Serang memiliki warisan sejarah kesultanan yang agung, ditandai oleh <strong>Gerbang Kaibon</strong> pada lambang resmi daerah. Platform ini telah diakuisisi dan dikembangkan secara resmi oleh <strong>DinkopUKM Perindag Kota Serang</strong> sebagai gerbang baru bagi pelaku ekonomi rakyat menuju kemandirian di era transformasi digital nasional.
                </p>
              </div>

              {/* 4 Pilar Grid */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                
                {/* Pilar 1 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#15803D]/10 flex items-center justify-center text-[#15803D] mb-3">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Modernisasi Koperasi</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Digitalisasi pelaporan RAT, tata kelola akuntansi transparan, dan penguatan permodalan KSP serta Koperasi Konsumen.
                  </p>
                </div>

                {/* Pilar 2 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#EAB308]/20 flex items-center justify-center text-[#B45309] mb-3">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">UMKM Naik Kelas & Legal</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Pendampingan gratis legalitas NIB (Nomor Induk Berusaha), sertifikasi Halal BPJPH, P-IRT, serta standarisasi kemasan ritel.
                  </p>
                </div>

                {/* Pilar 3 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Talenta Digital Lokal</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Mewadahi programmer, desainer, fotografer, dan pemasar digital asal Kota Serang untuk menjadi konsultan digitalisasi UMKM.
                  </p>
                </div>

                {/* Pilar 4 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Proteksi Escrow Bersama</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Setiap pembayaran pembeli diamankan oleh sistem rekening bersama dinas hingga pesanan barang/jasa diserahkan dengan baik.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION: PROGRAM UNGGULAN DINKOPUKM PERINDAG
          (BIMTEK, PELATIHAN, HALAL GRATIS & PERMODALAN LPDB)
         ---------------------------------------------------- */}
      <section id="bimtek-serang" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#15803D]/10 px-3.5 py-1 text-[11px] font-black text-[#15803D] uppercase tracking-wider mb-3">
              <GraduationCap className="w-4 h-4 text-[#15803D]" />
              LAYANAN FASILITASI & PELATIHAN RESMI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Program Unggulan DinkopUKM Perindag Kota Serang
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              Dinas Koperasi dan UMKM Kota Serang secara berkala menyelenggarakan pembinaan komprehensif, sertifikasi legalitas gratis, dan fasilitasi akses pembiayaan perbankan.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            
            {/* Program 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:shadow-xl hover:border-emerald-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#15803D] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-[#15803D] uppercase tracking-wider block mb-1">
                  Pelatihan Berkala
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">
                  Bimtek Pemasaran Digital & E-Commerce
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pelatihan gratis pembuatan konten promosi media sosial, foto produk katalog, dan optimasi toko online bagi UMKM di 6 kecamatan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#15803D]">
                <span>Kuota Terbatas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Program 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-[#B45309] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-[#B45309] uppercase tracking-wider block mb-1">
                  Legalitas 100% Gratis
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">
                  Fasilitasi Sertifikasi Halal & NIB
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pendampingan penerbitan NIB berbasis risiko dan pengajuan Sertifikat Halal self-declare bekerjasama dengan BPJPH Kemenag Banten.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#B45309]">
                <span>Layanan Satu Pintu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Program 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Coins className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider block mb-1">
                  Pembiayaan Bergulir
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">
                  Akses Permodalan LPDB & Bank Daerah
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Kemitraan pembiayaan murah bersama LPDB-KUMKM dan perbankan mitra (Bank BJB / Bank Banten) untuk likuiditas koperasi & usaha kecil.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                <span>Bunga Ringan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Program 4 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:shadow-xl hover:border-purple-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100/70 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider block mb-1">
                  Klinik Konsultasi Bisnis
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">
                  Layanan PLUT-KUMKM Kota Serang
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Konsultasi hukum bisnis, kurasi produk ekspor, pendampingan pembukuan akuntansi, dan fasilitasi pameran bagi wirausaha binaan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                <span>Konsultasi Bebas Biaya</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION: PEMETAAN POTENSI 6 KECAMATAN KOTA SERANG
         ---------------------------------------------------- */}
      <section className="py-20 bg-white border-b border-slate-150">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14 text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#15803D] uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-[#EAB308]" />
              POTENSI WILAYAH KOTA SERANG MADANI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Karakteristik & Sentra Unggulan di 6 Kecamatan
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              Setiap wilayah kecamatan di Kota Serang memiliki keunggulan komoditas spesifik yang saling melengkapi dalam ekosistem digital terpadu ini.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {KECAMATAN_SERANG.map((kec, idx) => {
              const IconComp = kec.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-[#15803D] bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                      Kecamatan #{idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#15803D] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#15803D] transition-colors">
                    {kec.nama}
                  </h3>
                  <span className="text-[11px] font-bold text-[#EAB308] block mt-0.5 mb-2">
                    {kec.fokus}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {kec.deskripsi}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION: PANDUAN TRANSAKSI AMAN (ESCROW KOTA SERANG)
         ---------------------------------------------------- */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-12 items-center">
          
          {/* Kolom Kiri: Langkah-langkah Transaksi */}
          <div className="md:col-span-6 text-left">
            <span className="text-[#15803D] text-xs font-black uppercase tracking-wider block mb-3">
              ALUR TRANSAKSI TERPERCAYA
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Cara Mudah Memesan Produk & <br />
              Jasa di KopDigital Kota Serang
            </h2>
            <p className="mt-4 text-slate-500 text-sm leading-relaxed font-medium">
              Ikuti 4 langkah sederhana berikut untuk mendukung produk UMKM lokal atau bermitra dengan talenta digital Kota Serang secara aman.
            </p>

            {/* List Langkah */}
            <div className="mt-8 space-y-6">
              
              <div className="flex gap-4 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#15803D] text-xs font-black text-white">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pilih Produk atau Layanan</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Jelajahi etalase kuliner khas, batik Kaibon, jasa digitalisasi UMKM, atau layanan koperasi binaan resmi DinkopUKM Kota Serang.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#15803D] text-xs font-black text-white">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Konsultasi Kebutuhan & Brief</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Gunakan fitur chat langsung untuk mendiskusikan jumlah pesanan, detail spesifikasi, atau tenggat waktu pengerjaan proyek.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#15803D] text-xs font-black text-white">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pembayaran Rekening Bersama Escrow</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Dana pembayaran Anda diamankan dalam rekening bersama sistem. Dana tidak langsung dicairkan ke penjual sampai pesanan terkonfirmasi.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#15803D] text-xs font-black text-white">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Terima Hasil & Dukung Usaha Lokal</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Setelah produk atau hasil pekerjaan diterima sesuai kesepakatan, konfirmasi penyelesaian transaksi dan berikan ulasan positif.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Kolom Kanan: Video Tutorial / Informasi Resmi */}
          <div className="md:col-span-6 flex justify-center">
            <div className="w-full max-w-lg aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 relative group bg-slate-900">
              <iframe 
                className="absolute inset-0 w-full h-full" 
                src="https://www.youtube.com/embed/1SFtUsmyJX0?si=K1mQEPbvbaOfB2PP" 
                title="Panduan Transaksi di Portal Resmi Kota Serang" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION: KENAPA MEMPERCAYAKAN PROJEK DI KOPDIGITAL?
         ---------------------------------------------------- */}
      <section className="py-20 bg-white border-y border-slate-150">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="max-w-3xl mb-16">
            <span className="text-[#15803D] text-xs font-black uppercase tracking-wider block mb-3">
              JAMINAN KEAMANAN & LEGALITAS
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Kenapa Memilih Mitra di KopDigital Kota Serang?
            </h2>
            <p className="mt-3 text-slate-500 text-sm leading-relaxed font-medium">
              Didukung langsung oleh Pemerintah Kota Serang untuk menjamin ekosistem transaksi yang aman, berdaya, dan adil.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-6 text-[#15803D] group-hover:scale-110 transition-transform">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-3">Rekening Bersama Escrow Resmi</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Setiap rupiah transaksi diamankan dalam rekening bersama. Dana baru diteruskan ke mitra setelah Anda menyetujui kualitas produk yang diterima.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-6 text-[#15803D] group-hover:scale-110 transition-transform">
                <FileCheck size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-3">Verifikasi Binaan Pemkot Serang</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Mitra koperasi dan UMKM telah terkurasi oleh DinkopUKM Perindag, memiliki Nomor Induk Berusaha (NIB) dan sertifikasi pendukung yang valid.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-6 text-[#15803D] group-hover:scale-110 transition-transform">
                <Scale size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-3">Pendampingan & Mediasi Netral</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Jika terjadi ketidaksesuaian pesanan, tim layanan PLUT DinkopUKM Kota Serang siap memfasilitasi mediasi dan memberikan solusi penyelesaian adil.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION: LAYANAN & PRODUK TERPOPULER (GIG SLIDER)
         ---------------------------------------------------- */}
      <section id="layanan-jasa" className="bg-slate-100/60 py-20 md:py-28 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-start text-left border-b border-slate-200 pb-10 mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-[10px] font-black tracking-widest text-[#15803D] uppercase border border-emerald-200 mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
              LAYANAN POPULER KOTA SERANG
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
              Layanan Paling Banyak Diminati
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-500 font-medium leading-relaxed">
              Jasa digitalisasi, desain kemasan, dan produk unggulan yang paling sering dipesan oleh pelaku usaha di Kota Serang.
            </p>
          </div>

          <GigSlider gigs={gigsToDisplay} />

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION: TESTIMONI PELAKU USAHA & KOPERASI BINAAN
         ---------------------------------------------------- */}
      <section className="py-20 bg-white border-b border-slate-150">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/60 px-3 py-1 text-[10px] font-black tracking-wider text-[#15803D] uppercase border border-emerald-200 mb-3">
              <MessageSquareQuote size={12} strokeWidth={2.5} /> TESTIMONI BINAAN RESMI
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Cerita Sukses dari Wirausaha Kota Serang
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Dengarkan langsung pengalaman para pengurus koperasi, pelaku UMKM kuliner, dan talenta digital yang merasakan kemudahan bertumbuh bersama.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            
            {/* Ulasan 1 */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200 hover:shadow-xl hover:bg-white hover:border-[#15803D]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-[#EAB308] mb-5">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <blockquote className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium italic">
                  "Melalui fasilitasi Bimtek dari DinkopUKM Kota Serang, Koperasi kami akhirnya memiliki pembukuan digital yang rapi dan terhubung ke perbankan. Anggota merasa jauh lebih percaya diri dalam RAT tahunan."
                </blockquote>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#15803D] text-xs font-black text-white">
                  HA
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-none">Hj. Aminah</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Ketua KSP Sejahtera Mandiri, Kasemen</span>
                </div>
              </div>
            </div>

            {/* Ulasan 2 */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200 hover:shadow-xl hover:bg-white hover:border-[#15803D]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-[#EAB308] mb-5">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <blockquote className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium italic">
                  "Desain kemasan baru sate bandeng kami yang dibuat oleh desainer muda lokal di portal ini membuat produk kami lolos seleksi masuk oleh-oleh ritel modern di Serang dan Tangerang. Omset naik pesat!"
                </blockquote>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-black text-white">
                  TR
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-none">Tubagus Rizki</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Owner, Sate Bandeng Kaibon Serang</span>
                </div>
              </div>
            </div>

            {/* Ulasan 3 */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200 hover:shadow-xl hover:bg-white hover:border-[#15803D]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-[#EAB308] mb-5">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <blockquote className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium italic">
                  "Sebagai pengembang web asal Cipocok Jaya, senang sekali bisa berkontribusi membantu puluhan UMKM lokal membuat website toko online. Sistem escrow-nya membuat saya tenang dalam bekerja."
                </blockquote>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-black text-white">
                  DF
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-none">Darmawan Fauzi</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Web Developer Mitra, Cipocok Jaya</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION: KARTU JUMBO TENTANG KOPDIGITAL KOTA SERANG
         ---------------------------------------------------- */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#15803D] via-emerald-900 to-slate-950 text-white shadow-2xl p-8 md:p-16 border border-emerald-900">
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#EAB308]/15 blur-[120px]"></div>
              <div className="absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-[#15803D]/40 blur-[100px]"></div>
            </div>

            <div className="relative z-10 grid md:grid-cols-12 gap-12 items-center">
              
              <div className="md:col-span-7 text-left space-y-6">
                
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-[10px] font-black tracking-widest text-[#EAB308] uppercase border border-white/10">
                  <Landmark size={12} strokeWidth={2.5} /> KOPDIGITAL KOTA SERANG
                </span>
                
                <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  Mewujudkan Kemandirian Ekonomi <br />
                  Kota Serang Madani
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Portal <strong>KopDigital Kota Serang</strong> hadir sebagai inisiatif strategis Pemerintah Kota Serang dan <strong>Dinas Koperasi, Usaha Kecil Menengah, Perindustrian dan Perdagangan (DinkopUKM Perindag)</strong> untuk mempercepat adopsi teknologi bagi sektor ekonomi riil.
                </p>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Kami mengintegrasikan pendampingan legalitas izin usaha, bimtek pemasaran, penyaluran akses pembiayaan koperasi, serta pasar digital lokal yang aman dalam satu platform terpadu.
                </p>

                <div className="pt-4 flex gap-4 flex-wrap text-xs font-black text-[#EAB308]">
                  <span>#KotaSerangMadani</span>
                  <span className="text-white/40">•</span>
                  <span>#DinkopUKMSerang</span>
                  <span className="text-white/40">•</span>
                  <span>#UMKMBerdaya</span>
                  <span className="text-white/40">•</span>
                  <span>#KoperasiModern</span>
                </div>

              </div>

              {/* Statistik Utama */}
              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                
                <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all text-center">
                  <span className="text-2xl md:text-3xl font-black text-[#EAB308] block mb-1">6</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Kecamatan Terjangkau</span>
                </div>

                <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all text-center">
                  <span className="text-2xl md:text-3xl font-black text-[#EAB308] block mb-1">10.000+</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Potensi UMKM Binaan</span>
                </div>

                <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all text-center">
                  <span className="text-2xl md:text-3xl font-black text-[#EAB308] block mb-1">100%</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Proteksi Escrow</span>
                </div>

                <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all text-center">
                  <span className="text-2xl md:text-3xl font-black text-[#EAB308] block mb-1">Rp 0</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Biaya NIB / Halal Self-Declare</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          FOOTER RESMI PEMKOT SERANG & DINKOPUKM PERINDAG
         ---------------------------------------------------- */}
      <footer className="bg-white border-t border-slate-200 py-16 text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left">
          
          {/* Kolom 1: Logo & Info Instansi */}
          <div className="col-span-2 md:col-span-1">
            <div className="relative w-48 h-14 mb-4">
              <Image 
                src="/logo-dinkopukm-serang.png" 
                alt="DinkopUKM Perindag Kota Serang"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              Portal Resmi Dinas Koperasi, Usaha Kecil Menengah, Perindustrian dan Perdagangan Pemerintah Kota Serang.
            </p>
            <div className="mt-4 space-y-1.5 text-xs text-slate-500">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Gedung DinkopUKM Perindag, Kota Serang, Banten</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Call Center: (0254) 200-SERANG</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>dinkopukm@serangkota.go.id</span>
              </p>
            </div>
          </div>

          {/* Kolom 2: Layanan UMKM & Koperasi */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Layanan Binaan</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#bimtek-serang" className="hover:text-[#15803D] transition-colors">Fasilitasi NIB Gratis</a></li>
              <li><a href="#bimtek-serang" className="hover:text-[#15803D] transition-colors">Sertifikasi Halal Gratis</a></li>
              <li><a href="#bimtek-serang" className="hover:text-[#15803D] transition-colors">Akses Modal LPDB & BJB</a></li>
              <li><a href="#tentang-dinkop" className="hover:text-[#15803D] transition-colors">Klinik Konsultasi PLUT</a></li>
              <li><a href="/freelancer/apply" target="_blank" rel="noopener noreferrer" className="hover:text-[#15803D] transition-colors">Pendaftaran UMKM Baru</a></li>
            </ul>
          </div>

          {/* Kolom 3: 6 Wilayah Kecamatan */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Sentra Wilayah</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#umkm-serang" className="hover:text-[#15803D] transition-colors">Kecamatan Serang (Bisnis)</a></li>
              <li><a href="#umkm-serang" className="hover:text-[#15803D] transition-colors">Kecamatan Kasemen (Bahari & Sejarah)</a></li>
              <li><a href="#umkm-serang" className="hover:text-[#15803D] transition-colors">Kecamatan Cipocok Jaya (Kreatif)</a></li>
              <li><a href="#umkm-serang" className="hover:text-[#15803D] transition-colors">Kecamatan Taktakan (Agrowisata)</a></li>
              <li><a href="#umkm-serang" className="hover:text-[#15803D] transition-colors">Kecamatan Walantaka (Kerajinan)</a></li>
              <li><a href="#umkm-serang" className="hover:text-[#15803D] transition-colors">Kecamatan Curug (Pemerintahan)</a></li>
            </ul>
          </div>

          {/* Kolom 4: Kebijakan & Perlindungan */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Keamanan & Bantuan</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#tentang-dinkop" className="hover:text-[#15803D] transition-colors">Jaminan Rekening Bersama</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Syarat & Ketentuan Lisensi</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Kebijakan Privasi Pengguna</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Panduan Mediasi Sengketa</a></li>
              <li><a href="#" className="hover:text-[#15803D] transition-colors">Portal Resmi Kota Serang</a></li>
            </ul>
          </div>

        </div>

        {/* Hak Cipta */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-slate-100 pt-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Dinas Koperasi, Usaha Kecil Menengah, Perindustrian dan Perdagangan (DinkopUKM Perindag) Kota Serang. Pemerintah Kota Serang Madani.</p>
        </div>
      </footer>

    </div>
  );
}
