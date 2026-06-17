'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentSession } from './auth.action';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Memastikan folder public/uploads terbuat
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  
  // Mengenerate nama file unik menggunakan UUID
  const extension = path.extname(file.name) || '.pdf';
  const filename = `${crypto.randomUUID()}${extension}`;
  const filepath = path.join(uploadDir, filename);
  
  // Menulis berkas secara asinkron
  await fs.writeFile(filepath, buffer);
  
  // Mengembalikan URL publik Next.js
  return `/uploads/${filename}`;
}

export async function applyFreelancer(formData: FormData) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'client') {
    return { success: false, error: 'Hanya pengguna client yang bisa mendaftar sebagai freelancer.' };
  }

  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const birthPlace = formData.get('birthPlace') as string;
  const birthDateStr = formData.get('birthDate') as string;
  const link = formData.get('link') as string;
  const bankAccount = formData.get('bankAccount') as string;
  const file = formData.get('cvFile') as File | null;

  if (!fullName || !phone || !email || !birthPlace || !birthDateStr || !bankAccount) {
    return { success: false, error: 'Harap lengkapi semua data diri wajib.' };
  }

  const hasFile = file && file.size > 0;
  if (!hasFile && !link) {
    return { success: false, error: 'Anda harus menyertakan Link Portofolio ATAU mengunggah file CV.' };
  }

  try {
    // Periksa apakah user sudah mengajukan verifikasi sebelumnya
    const existing = await prisma.freelancerVerification.findUnique({
      where: { userId: session.id }
    });

    if (existing) {
      if (existing.status === 'pending') {
         return { success: false, error: 'Pengajuan Anda sedang dalam tahap review.' };
      } else if (existing.status === 'approved') {
         return { success: false, error: 'Akun Anda sudah menjadi freelancer.' };
      } else if (existing.status === 'rejected') {
         // Biarkan mereka mengajukan ulang
      }
    }

    let cvUrl = '';
    if (hasFile) {
      cvUrl = await saveUploadedFile(file as File);
    }

    const birthDate = new Date(birthDateStr);

    if (existing && existing.status === 'rejected') {
      // Update pengajuan sebelumnya
      await prisma.freelancerVerification.update({
        where: { id: existing.id },
        data: {
          fullName,
          phone,
          email,
          birthPlace,
          birthDate,
          link: link || null,
          cvUrl,
          bankAccount,
          status: 'pending'
        }
      });
    } else {
      // Buat pengajuan baru
      await prisma.freelancerVerification.create({
        data: {
          userId: session.id,
          fullName,
          phone,
          email,
          birthPlace,
          birthDate,
          link: link || null,
          cvUrl,
          bankAccount,
          status: 'pending'
        }
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Gagal mengajukan freelancer:', err);
    return { success: false, error: 'Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.' };
  }
}
