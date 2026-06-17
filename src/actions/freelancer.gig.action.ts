'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentSession } from './auth.action';
import { GigStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gigs');
  await fs.mkdir(uploadDir, { recursive: true });
  
  const extension = path.extname(file.name) || '.jpg';
  const filename = `${crypto.randomUUID()}${extension}`;
  const filepath = path.join(uploadDir, filename);
  
  await fs.writeFile(filepath, buffer);
  return `/uploads/gigs/${filename}`;
}

// ==========================================
// MENGAMBIL STATISTIK FREELANCER (Ringkasan)
// ==========================================
export async function getFreelancerStats() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'freelancer') {
    return { success: false, error: 'Akses ditolak.' };
  }

  try {
    const activeGigsCount = await prisma.gig.count({
      where: { freelancerId: session.id, status: 'active' }
    });

    const completedOrders = await prisma.order.findMany({
      where: { freelancerId: session.id, status: 'completed' },
      select: { totalAmount: true }
    });
    
    // Total penghasilan dari pesanan yang selesai
    const totalEarnings = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    const totalReviews = await prisma.review.count({
      where: { freelancerId: session.id }
    });

    return { 
      success: true, 
      data: {
        activeGigs: activeGigsCount,
        totalEarnings,
        totalReviews
      }
    };
  } catch (error: any) {
    console.error('Gagal mengambil statistik:', error);
    return { success: false, error: 'Terjadi kesalahan sistem' };
  }
}

// ==========================================
// MENGAMBIL DAFTAR GIGS
// ==========================================
export async function getFreelancerGigs() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'freelancer') {
    return { success: false, error: 'Akses ditolak.' };
  }

  try {
    const gigs = await prisma.gig.findMany({
      where: { freelancerId: session.id },
      include: {
        category: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { id: 'desc' } // Mengurutkan yang terbaru, karena tidak ada createdAt kita sort by id aja
    });

    return { success: true, data: gigs };
  } catch (error: any) {
    return { success: false, error: 'Gagal mengambil data jasa' };
  }
}

// ==========================================
// MEMBUAT GIG BARU
// ==========================================
export async function createGig(formData: FormData) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'freelancer') {
    return { success: false, error: 'Akses ditolak.' };
  }

  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const deliveryDays = Number(formData.get('deliveryDays'));
    const categoryId = formData.get('categoryId') as string;
    const file = formData.get('imageFile') as File | null;

    let imageUrl = null;
    if (file && file.size > 0) {
      imageUrl = await saveUploadedFile(file);
    }

    const gig = await prisma.gig.create({
      data: {
        freelancerId: session.id,
        title,
        description,
        price,
        deliveryDays,
        categoryId,
        imageUrl,
        status: 'active'
      }
    });

    revalidatePath('/freelancer/dashboard/gigs');
    return { success: true, data: gig };
  } catch (error: any) {
    console.error('Gagal membuat jasa:', error);
    return { success: false, error: 'Gagal menambahkan jasa baru.' };
  }
}

// ==========================================
// MEMPERBARUI GIG
// ==========================================
export async function updateGig(formData: FormData) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'freelancer') {
    return { success: false, error: 'Akses ditolak.' };
  }

  try {
    const gigId = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const deliveryDays = Number(formData.get('deliveryDays'));
    const categoryId = formData.get('categoryId') as string;
    const imageUrlInput = formData.get('imageUrl') as string;
    const file = formData.get('imageFile') as File | null;

    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig || gig.freelancerId !== session.id) {
      return { success: false, error: 'Jasa tidak ditemukan atau bukan milik Anda.' };
    }

    let imageUrl = imageUrlInput || null;
    if (file && file.size > 0) {
      imageUrl = await saveUploadedFile(file);
    }

    if (!imageUrl && !imageUrlInput) {
      imageUrl = gig.imageUrl;
    }

    const updated = await prisma.gig.update({
      where: { id: gigId },
      data: {
        title,
        description,
        price,
        deliveryDays,
        categoryId,
        imageUrl
      }
    });

    revalidatePath('/freelancer/dashboard/gigs');
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: 'Gagal memperbarui jasa.' };
  }
}

// ==========================================
// MENGHAPUS GIG
// ==========================================
export async function deleteGig(gigId: string) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'freelancer') {
    return { success: false, error: 'Akses ditolak.' };
  }

  try {
    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig || gig.freelancerId !== session.id) {
      return { success: false, error: 'Jasa tidak ditemukan atau bukan milik Anda.' };
    }

    await prisma.gig.delete({
      where: { id: gigId }
    });

    revalidatePath('/freelancer/dashboard/gigs');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Gagal menghapus jasa. Pastikan jasa ini tidak memiliki pesanan yang sedang berjalan.' };
  }
}

// ==========================================
// MENGAMBIL ULASAN FREELANCER
// ==========================================
export async function getFreelancerReviews() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'freelancer') {
    return { success: false, error: 'Akses ditolak.' };
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { freelancerId: session.id },
      include: {
        client: { select: { name: true, profilePicture: true } },
        order: { select: { gig: { select: { title: true } } } }
      },
      orderBy: { id: 'desc' }
    });

    return { success: true, data: reviews };
  } catch (error: any) {
    return { success: false, error: 'Gagal mengambil daftar ulasan' };
  }
}
