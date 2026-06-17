'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentSession, logoutUser } from './auth.action';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

// Helper Enkripsi Kata Sandi
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper Upload File (Foto Profil)
async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
  await fs.mkdir(uploadDir, { recursive: true });
  
  const extension = path.extname(file.name) || '.jpg';
  const filename = `avatar_${crypto.randomUUID()}${extension}`;
  const filepath = path.join(uploadDir, filename);
  
  await fs.writeFile(filepath, buffer);
  
  return `/uploads/avatars/${filename}`;
}

export async function getUserProfile() {
  const session = await getCurrentSession();
  if (!session) return null;

  try {
    if (session.role === 'superadmin' || session.role === 'moderator') {
      const admin = await prisma.admin.findUnique({
        where: { id: session.id },
        select: { id: true, name: true, email: true, profilePicture: true, roleLevel: true }
      });
      return admin;
    } else {
      const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: { id: true, name: true, email: true, phone: true, profilePicture: true, role: true }
      });
      return user;
    }
  } catch (error) {
    console.error("Gagal mengambil profil:", error);
    return null;
  }
}

export async function updateProfile(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) return { success: false, error: 'Sesi tidak valid.' };

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const file = formData.get('profilePicture') as File | null;

  if (!name || !email) {
    return { success: false, error: 'Nama dan Email wajib diisi.' };
  }

  try {
    let profilePictureUrl: string | undefined;
    if (file && file.size > 0) {
      if (file.size > 2 * 1024 * 1024) {
        return { success: false, error: 'Ukuran foto maksimal 2MB.' };
      }
      profilePictureUrl = await saveUploadedFile(file);
    }

    if (session.role === 'superadmin' || session.role === 'moderator') {
      const existing = await prisma.admin.findUnique({ where: { email } });
      if (existing && existing.id !== session.id) return { success: false, error: 'Email sudah terdaftar oleh pengguna lain.' };

      await prisma.admin.update({
        where: { id: session.id },
        data: {
          name,
          email,
          ...(profilePictureUrl && { profilePicture: profilePictureUrl })
        }
      });
    } else {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== session.id) return { success: false, error: 'Email sudah terdaftar oleh pengguna lain.' };

      await prisma.user.update({
        where: { id: session.id },
        data: {
          name,
          email,
          phone: phone || null,
          ...(profilePictureUrl && { profilePicture: profilePictureUrl })
        }
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePassword(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) return { success: false, error: 'Sesi tidak valid.' };

  const oldPassword = formData.get('oldPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!oldPassword || !newPassword) {
    return { success: false, error: 'Sandi lama dan baru wajib diisi.' };
  }

  const hashedOld = hashPassword(oldPassword);
  const hashedNew = hashPassword(newPassword);

  try {
    if (session.role === 'superadmin' || session.role === 'moderator') {
      const admin = await prisma.admin.findUnique({ where: { id: session.id } });
      if (!admin || admin.password !== hashedOld) {
        return { success: false, error: 'Kata sandi lama salah.' };
      }
      await prisma.admin.update({
        where: { id: session.id },
        data: { password: hashedNew }
      });
    } else {
      const user = await prisma.user.findUnique({ where: { id: session.id } });
      if (!user || user.password !== hashedOld) {
        return { success: false, error: 'Kata sandi lama salah.' };
      }
      await prisma.user.update({
        where: { id: session.id },
        data: { password: hashedNew }
      });
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAccount() {
  const session = await getCurrentSession();
  if (!session) return { success: false, error: 'Sesi tidak valid.' };

  try {
    if (session.role === 'superadmin' || session.role === 'moderator') {
      await prisma.admin.delete({ where: { id: session.id } });
    } else {
      await prisma.user.delete({ where: { id: session.id } });
    }
    
    await logoutUser();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Gagal menghapus akun. Pastikan tidak ada transaksi yang menghalangi.' };
  }
}
