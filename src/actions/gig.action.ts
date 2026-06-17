'use server';

// Impor Prisma Client Singleton
import { prisma } from '@/lib/prisma';

export interface FetchGigsResponse {
  success: boolean;
  data?: any[];
  error?: string;
}

/**
 * SERVER ACTION: getGigsWithFreelancer
 * 
 * APA fungsi ini?
 * Fungsi ini bertugas mengambil daftar "Gig" (jasa freelance) dari PostgreSQL. 
 * Kita telah MEMPERBARUI fungsi ini agar melakukan **penghitungan popularitas otomatis**.
 * 
 * MENGAPA ditulis seperti ini untuk memenuhi kebutuhan "sistem otomatis"?
 * 1. Agregasi Relasi (_count): Untuk menghitung mana layanan yang "paling banyak" dipesan secara otomatis,
 *    kita menggunakan fitur `_count` bawaan Prisma. Di tingkat SQL, ini diterjemahkan menjadi 
 *    perintah `LEFT JOIN` dan `COUNT(orders.id)` yang dikelompokkan dengan `GROUP BY gig.id`.
 * 2. Pengurutan Popularitas (orderBy _count): Dengan menuliskan:
 *    `orderBy: { orders: { _count: 'desc' } }`, PostgreSQL akan secara otomatis menempatkan 
 *    jasa yang paling laku (paling banyak jumlah ordernya) di urutan paling atas.
 * 3. Keamanan & Efisiensi: Kueri dilakukan langsung di sisi database PostgreSQL yang sangat cepat
 *    dan diindeks secara otomatis, menghemat bandwidth jaringan dibandingkan jika kita memilahnya di frontend.
 */
export async function getGigsWithFreelancer(): Promise<FetchGigsResponse> {
  try {
    // Mengeksekusi query database untuk mencari Jasa Terpopuler secara otomatis
    const gigs = await prisma.gig.findMany({
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            isVerified: true,
            profilePicture: true,
            createdAt: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        // APA baris _count di bawah ini?
        // Melakukan penghitungan otomatis (sub-query count) jumlah order untuk setiap Gig.
        _count: {
          select: {
            orders: true, // Menghitung berapa kali jasa ini dipesan pembeli
          },
        },
      },
      // MENGAPA ditulis orderBy _count desc?
      // Agar database secara cerdas menyusun urutan dari jasa dengan pemesanan terbanyak
      // ke pemesanan terendah secara otomatis.
      orderBy: {
        orders: {
          _count: 'desc', // Mengurutkan dari jumlah order terbanyak
        },
      },
      // Kita membatasi pengambilan (take) maksimal 6 data teratas untuk slider horizontal
      take: 6,
    });

    return {
      success: true,
      data: gigs,
    };
  } catch (error) {
    console.error('Terjadi kegagalan pengambilan data Gigs terpopuler:', error);

    return {
      success: false,
      error: 'Sistem gagal memuat daftar jasa freelance populer. Silakan periksa koneksi database Anda.',
    };
  }
}

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
      profilePicture: null
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
      profilePicture: null
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
      profilePicture: null
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
      profilePicture: null
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
      profilePicture: null
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
      profilePicture: null
    }
  }
];

/**
 * SERVER ACTION: getGigById
 * Mengambil detail layanan spesifik berdasarkan ID untuk halaman detail jasa.
 */
export async function getGigById(id: string) {
  try {
    // Tangani data dummy "pushaja-"
    if (id.startsWith('pushaja-')) {
      const dummyGig = PUSHAJA_GIGS.find(g => g.id === id);
      if (dummyGig) {
        return { success: true, data: { ...dummyGig, orders: { _count: dummyGig.reviewsCount } } };
      }
    }

    const gig = await prisma.gig.findUnique({
      where: { id },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            isVerified: true,
            profilePicture: true,
            createdAt: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!gig) {
      return { success: false, error: 'Jasa tidak ditemukan.' };
    }

    return { success: true, data: gig };
  } catch (error) {
    console.error('Terjadi kegagalan mengambil detail gig:', error);
    return { success: false, error: 'Gagal memuat detail jasa.' };
  }
}
