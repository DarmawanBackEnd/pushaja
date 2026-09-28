'use server';

import { prisma } from '@/lib/prisma';

export interface CategoryGroupItem {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  categories: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    gigsCount?: number;
  }[];
  categoriesCount?: number;
}

export interface CategoryBrowseResult {
  type: 'group' | 'category';
  title: string;
  description: string;
  currentSlug: string;
  groupSlug: string;
  groupName: string;
  categorySlug?: string;
  categoryName?: string;
  imageUrl?: string | null;
  icon?: string | null;
  allGroups: CategoryGroupItem[];
  subcategories: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    gigsCount: number;
  }[];
  gigs: any[];
  isDemo?: boolean;
}

const STATIC_FALLBACK_GROUPS: CategoryGroupItem[] = [
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

const PUSHAJA_DEMO_GIGS = [
  {
    id: 'pushaja-1',
    title: 'Pembuatan Web App SaaS Fullstack Next.js 15 & Prisma PostgreSQL',
    description: 'Kami bantu wujudkan produk digital SaaS Anda dengan arsitektur modern Next.js App Router, database PostgreSQL yang andal, dan desain responsif super cepat yang dijamin ramah SEO.',
    price: 7500000,
    deliveryDays: 14,
    rating: 5.0,
    reviewsCount: 24,
    status: 'active',
    categoryGroupSlug: 'pemrograman',
    categorySlug: 'pembuatan-web-saas',
    category: { name: 'Pembuatan Web SaaS', slug: 'pembuatan-web-saas' },
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
    price: 2400000,
    deliveryDays: 5,
    rating: 4.9,
    reviewsCount: 42,
    status: 'active',
    categoryGroupSlug: 'desain',
    categorySlug: 'desain-landing-page',
    category: { name: 'Desain Landing Page', slug: 'desain-landing-page' },
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
    price: 3500000,
    deliveryDays: 7,
    rating: 4.8,
    reviewsCount: 16,
    status: 'active',
    categoryGroupSlug: 'pemrograman',
    categorySlug: 'tuning-query-postgresql',
    category: { name: 'Tuning Query PostgreSQL', slug: 'tuning-query-postgresql' },
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
    price: 800000,
    deliveryDays: 3,
    rating: 5.0,
    reviewsCount: 58,
    status: 'active',
    categoryGroupSlug: 'penulisan',
    categorySlug: 'copywriting-landing-page',
    category: { name: 'Copywriting Landing Page', slug: 'copywriting-landing-page' },
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
    price: 1950000,
    deliveryDays: 4,
    rating: 4.9,
    reviewsCount: 31,
    status: 'active',
    categoryGroupSlug: 'visual',
    categorySlug: 'editing-video-tiktok',
    category: { name: 'Editing Video TikTok', slug: 'editing-video-tiktok' },
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
    price: 5000000,
    deliveryDays: 10,
    rating: 5.0,
    reviewsCount: 12,
    status: 'active',
    categoryGroupSlug: 'pemrograman',
    categorySlug: 'pembuatan-web-saas',
    category: { name: 'Pembuatan Web SaaS', slug: 'pembuatan-web-saas' },
    freelancer: {
      name: 'Kevin Wijaya',
      isVerified: false,
      profilePicture: null
    }
  }
];

export async function getCategoryBrowseData(slug: string): Promise<CategoryBrowseResult | null> {
  try {
    // 1. Ambil seluruh kelompok kategori untuk sidebar navigasi
    let dbGroups: any[] = [];
    try {
      dbGroups = await prisma.categoryGroup.findMany({
        orderBy: { name: 'asc' },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
              imageUrl: true,
              _count: {
                select: { gigs: true }
              }
            }
          }
        }
      });
    } catch (e) {
      console.error('Error fetching dbGroups, will use static fallback:', e);
    }

    const allGroups: CategoryGroupItem[] = dbGroups.length > 0
      ? dbGroups.map((g) => ({
          id: g.id,
          name: g.name,
          slug: g.slug,
          icon: g.icon,
          categoriesCount: g.categories.length,
          categories: g.categories.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            imageUrl: c.imageUrl,
            gigsCount: c._count?.gigs || 0
          }))
        }))
      : STATIC_FALLBACK_GROUPS;

    // 2. Cek apakah slug adalah Kategori Grup di Database (misal: "pemrograman", "desain")
    let matchedGroup: any = null;
    try {
      matchedGroup = await prisma.categoryGroup.findUnique({
        where: { slug },
        include: {
          categories: {
            include: {
              _count: {
                select: { gigs: true }
              }
            }
          }
        }
      });
    } catch (e) {
      console.error('Error finding categoryGroup in db:', e);
    }

    if (matchedGroup) {
      const categoryIds = matchedGroup.categories.map((c: any) => c.id);

      const dbGigs = await prisma.gig.findMany({
        where: {
          categoryId: { in: categoryIds },
          status: 'active'
        },
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              email: true,
              isVerified: true,
              profilePicture: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: { orders: true }
          }
        },
        orderBy: {
          orders: { _count: 'desc' }
        }
      });

      const subcategories = matchedGroup.categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        imageUrl: c.imageUrl,
        gigsCount: c._count?.gigs || 0
      }));

      let finalGigs: any[] = dbGigs.map((g) => ({
        ...g,
        price: Number(g.price),
        rating: 5.0,
        reviewsCount: g._count?.orders || 0
      }));

      let isDemo = false;
      if (finalGigs.length === 0) {
        const matchingDemo = PUSHAJA_DEMO_GIGS.filter((d) => d.categoryGroupSlug === slug);
        if (matchingDemo.length > 0) {
          finalGigs = matchingDemo;
          isDemo = true;
        }
      }

      return {
        type: 'group',
        title: matchedGroup.name,
        description: `Temukan dan sewa freelancer terbaik di bidang ${matchedGroup.name}. Berbagai jasa profesional siap membantu kebutuhan proyek Anda dengan cepat dan terpercaya.`,
        currentSlug: slug,
        groupSlug: matchedGroup.slug,
        groupName: matchedGroup.name,
        icon: matchedGroup.icon,
        allGroups,
        subcategories,
        gigs: finalGigs,
        isDemo
      };
    }

    // 3. Cek apakah slug adalah Kategori / Subkategori spesifik (misal: "pembuatan-web-saas")
    let matchedCategory: any = null;
    try {
      matchedCategory = await prisma.category.findUnique({
        where: { slug },
        include: {
          categoryGroup: {
            include: {
              categories: {
                include: {
                  _count: {
                    select: { gigs: true }
                  }
                }
              }
            }
          },
          _count: {
            select: { gigs: true }
          }
        }
      });
    } catch (e) {
      console.error('Error finding category in db:', e);
    }

    if (matchedCategory) {
      const dbGigs = await prisma.gig.findMany({
        where: {
          categoryId: matchedCategory.id,
          status: 'active'
        },
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              email: true,
              isVerified: true,
              profilePicture: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: { orders: true }
          }
        },
        orderBy: {
          orders: { _count: 'desc' }
        }
      });

      const subcategories = matchedCategory.categoryGroup
        ? matchedCategory.categoryGroup.categories.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            imageUrl: c.imageUrl,
            gigsCount: c._count?.gigs || 0
          }))
        : [];

      let finalGigs: any[] = dbGigs.map((g) => ({
        ...g,
        price: Number(g.price),
        rating: 5.0,
        reviewsCount: g._count?.orders || 0
      }));

      let isDemo = false;
      if (finalGigs.length === 0) {
        const matchingDemo = PUSHAJA_DEMO_GIGS.filter((d) => d.categorySlug === slug);
        if (matchingDemo.length > 0) {
          finalGigs = matchingDemo;
          isDemo = true;
        }
      }

      return {
        type: 'category',
        title: matchedCategory.name,
        description: `Layanan profesional ${matchedCategory.name} dengan jaminan kualitas tinggi, pengerjaan cepat, dan harga transparan dari freelancer terverifikasi PushAja.`,
        currentSlug: slug,
        groupSlug: matchedCategory.categoryGroup?.slug || slug,
        groupName: matchedCategory.categoryGroup?.name || 'Kategori Utama',
        categorySlug: matchedCategory.slug,
        categoryName: matchedCategory.name,
        imageUrl: matchedCategory.imageUrl,
        icon: matchedCategory.categoryGroup?.icon,
        allGroups,
        subcategories,
        gigs: finalGigs,
        isDemo
      };
    }

    // 4. Fallback ke STATIC_FALLBACK_GROUPS jika DB tidak memiliki record ini
    const fallbackGroup = STATIC_FALLBACK_GROUPS.find((g) => g.slug === slug);
    if (fallbackGroup) {
      const matchingDemo = PUSHAJA_DEMO_GIGS.filter((d) => d.categoryGroupSlug === slug);
      return {
        type: 'group',
        title: fallbackGroup.name,
        description: `Temukan dan sewa freelancer terbaik di bidang ${fallbackGroup.name}. Berbagai jasa profesional siap membantu kebutuhan proyek Anda.`,
        currentSlug: slug,
        groupSlug: fallbackGroup.slug,
        groupName: fallbackGroup.name,
        icon: fallbackGroup.icon,
        allGroups,
        subcategories: fallbackGroup.categories.map(c => ({ ...c, gigsCount: 0 })),
        gigs: matchingDemo,
        isDemo: true
      };
    }

    // Cek jika slug adalah subcategory di STATIC_FALLBACK_GROUPS
    for (const grp of STATIC_FALLBACK_GROUPS) {
      const sub = grp.categories.find(c => c.slug === slug);
      if (sub) {
        const matchingDemo = PUSHAJA_DEMO_GIGS.filter((d) => d.categorySlug === slug);
        return {
          type: 'category',
          title: sub.name,
          description: `Layanan profesional ${sub.name} dengan jaminan kualitas tinggi dari freelancer PushAja.`,
          currentSlug: slug,
          groupSlug: grp.slug,
          groupName: grp.name,
          categorySlug: sub.slug,
          categoryName: sub.name,
          imageUrl: sub.imageUrl,
          icon: grp.icon,
          allGroups,
          subcategories: grp.categories.map(c => ({ ...c, gigsCount: 0 })),
          gigs: matchingDemo,
          isDemo: true
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error saat fetch getCategoryBrowseData:', error);
    return null;
  }
}

export async function getAllCategoriesList() {
  try {
    const groups = await prisma.categoryGroup.findMany({
      orderBy: { name: 'asc' },
      include: {
        categories: {
          include: {
            _count: {
              select: { gigs: true }
            }
          }
        }
      }
    });
    return groups;
  } catch (e) {
    console.error('Error fetching all categories list:', e);
    return [];
  }
}
