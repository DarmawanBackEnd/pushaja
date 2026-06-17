const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Memulai seeding data database pushaja...');

  const hashedPassword = hashPassword('pushaja123');

  // 1. Cek & buat akun Superadmin kustom (Kata sandi otomatis terenkripsi)
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'pushaja@gmail.com' }
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        name: 'Super Admin pushaja',
        email: 'pushaja@gmail.com',
        password: hashedPassword,
        roleLevel: 'superadmin'
      }
    });
    console.log('Akun Superadmin terenkripsi berhasil dibuat: pushaja@gmail.com');
  } else {
    await prisma.admin.update({
      where: { email: 'pushaja@gmail.com' },
      data: { password: hashedPassword, roleLevel: 'superadmin' }
    });
    console.log('Akun Superadmin diperbarui.');
  }

  // 2. Seeding Kategori Grup (Klasifikasi Utama) dengan Ikon SVG
  console.log('Menghapus data kategori lama untuk menghindari konflik relasi...');
  // Hapus gigs lama yang mungkin bentrok dengan relasi kategori jika ada
  // Namun untuk database development baru, kita bersihkan kategori
  try {
    await prisma.category.deleteMany({});
    await prisma.categoryGroup.deleteMany({});
  } catch (e) {
    console.log('Gagal membersihkan database, mungkin ada data terkait. Melanjutkan...');
  }

  const categoryGroupsData = [
    {
      name: 'Web & Pemrograman',
      slug: 'pemrograman',
      icon: `<svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>`
    },
    {
      name: 'Desain Grafis & UI/UX',
      slug: 'desain',
      icon: `<svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>`
    },
    {
      name: 'Penulisan & Artikel',
      slug: 'penulisan',
      icon: `<svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
    },
    {
      name: 'Visual, Video & Audio',
      slug: 'visual',
      icon: `<svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`
    },
    {
      name: 'Pemasaran & Iklan',
      slug: 'marketing',
      icon: `<svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`
    },
    {
      name: 'Konsultasi & Manajemen',
      slug: 'konsultasi',
      icon: `<svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
    },
    {
      name: 'Gaya Hidup & Hobi',
      slug: 'lifestyle',
      icon: `<svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>`
    }
  ];

  const createdGroups = {};
  for (const group of categoryGroupsData) {
    const res = await prisma.categoryGroup.create({
      data: group
    });
    createdGroups[group.slug] = res.id;
    console.log(`Kategori Grup "${group.name}" berhasil dibuat.`);
  }

  // 3. Seeding Kategori / Jenis Layanan dengan gambar
  const categoriesData = [
    // Web & Pemrograman
    {
      name: 'Pembuatan Web SaaS',
      slug: 'pembuatan-web-saas',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['pemrograman']
    },
    {
      name: 'Aplikasi Android & iOS',
      slug: 'aplikasi-android-ios',
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['pemrograman']
    },
    {
      name: 'Tuning Query PostgreSQL',
      slug: 'tuning-query-postgresql',
      imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['pemrograman']
    },
    {
      name: 'Integrasi API Payment',
      slug: 'integrasi-api-payment',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['pemrograman']
    },

    // Desain Grafis & UI/UX
    {
      name: 'Desain Landing Page',
      slug: 'desain-landing-page',
      imageUrl: 'https://images.unsplash.com/photo-1581291518655-9523c932dedf?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['desain']
    },
    {
      name: 'Desain Logo Brand',
      slug: 'desain-logo-brand',
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['desain']
    },
    {
      name: 'Ilustrasi Digital',
      slug: 'ilustrasi-digital',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['desain']
    },

    // Penulisan & Artikel
    {
      name: 'Artikel Blog SEO',
      slug: 'artikel-blog-seo',
      imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['penulisan']
    },
    {
      name: 'Copywriting Landing Page',
      slug: 'copywriting-landing-page',
      imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['penulisan']
    },

    // Visual, Video & Audio
    {
      name: 'Editing Video TikTok',
      slug: 'editing-video-tiktok',
      imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['visual']
    },
    {
      name: 'Animasi Motion Graphic',
      slug: 'animasi-motion-graphic',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['visual']
    },

    // Pemasaran & Iklan
    {
      name: 'Iklan TikTok & Meta Ads',
      slug: 'iklan-tiktok-meta-ads',
      imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['marketing']
    },

    // Gaya Hidup & Hobi
    {
      name: 'Pijat Tradisional',
      slug: 'pijat-tradisional',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['lifestyle']
    },
    {
      name: 'Cleaning Service',
      slug: 'cleaning-service',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60',
      categoryGroupId: createdGroups['lifestyle']
    }
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({
      data: cat
    });
    console.log(`Jenis Layanan "${cat.name}" berhasil disemai.`);
  }

  console.log('Seeding selesai dengan sukses!');
}

main()
  .catch((e) => {
    console.error('Gagal melakukan seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
