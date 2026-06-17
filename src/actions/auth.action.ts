'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export interface LoginResponse {
  success: boolean;
  role?: 'superadmin' | 'moderator' | 'client' | 'freelancer';
  name?: string;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  error?: string;
}

/**
 * Mengenkripsi password dengan algoritma SHA-256 demi keamanan database.
 */
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * SERVER ACTION: loginUser
 * 
 * Melakukan verifikasi login baik untuk Admin (Superadmin/Moderator) maupun User (Client/Freelancer).
 * Kata sandi otomatis dienkripsi untuk dicocokkan dengan database.
 */
export async function loginUser(formData: FormData): Promise<LoginResponse> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { success: false, error: 'Email dan password wajib diisi.' };
    }

    // Enkripsi kata sandi input untuk verifikasi aman
    const hashedPassword = hashPassword(password);

    // 1. Cari di tabel Admin terlebih dahulu
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (admin) {
      // Verifikasi password admin terenkripsi
      if (admin.password === hashedPassword) {
        // Simpan sesi login admin di Cookie (sangat aman & didukung Next.js)
        const cookieStore = await cookies();
        cookieStore.set('pushaja_session', JSON.stringify({
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.roleLevel, // 'superadmin' atau 'moderator'
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 1 hari sesi aktif
          path: '/',
        });

        return {
          success: true,
          role: admin.roleLevel as 'superadmin' | 'moderator',
          name: admin.name,
        };
      }
    }

    // 2. Jika tidak ada di tabel Admin, cari di tabel User (Client/Freelancer)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Verifikasi password user terenkripsi
      if (user.password === hashedPassword) {
        const cookieStore = await cookies();
        cookieStore.set('pushaja_session', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // 'client' atau 'freelancer'
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24,
          path: '/',
        });

        return {
          success: true,
          role: user.role as 'client' | 'freelancer',
          name: user.name,
        };
      }
    }

    return {
      success: false,
      error: 'Kredensial salah. Silakan periksa kembali email atau password Anda.',
    };
  } catch (error) {
    console.error('Kesalahan fatal saat memproses login:', error);
    return {
      success: false,
      error: 'Terjadi kegagalan sistem. Silakan coba kembali nanti.',
    };
  }
}

/**
 * SERVER ACTION: registerUser
 * 
 * Mendaftarkan klien (client) atau pekerja mandiri (freelancer) baru.
 * Kata sandi otomatis terenkripsi penuh sebelum disimpan ke database pushaja.
 */
export async function registerUser(formData: FormData): Promise<RegisterResponse> {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string;
    const role = formData.get('role') as 'client' | 'freelancer';

    if (!name || !email || !password || !role) {
      return { success: false, error: 'Kolom Nama, Email, Kata Sandi, dan Peran wajib diisi.' };
    }

    // 1. Cek duplikasi email di database (admins & users)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });

    if (existingUser || existingAdmin) {
      return { success: false, error: 'Alamat email ini sudah terdaftar dalam sistem pushaja.' };
    }

    // 2. Enkripsi kata sandi untuk keamanan maksimal
    const hashedPassword = hashPassword(password);

    // 3. Simpan data pengguna baru terenkripsi ke database PostgreSQL
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Terenkripsi aman
        phone: phone || null,
        role,
        balance: 0.00,
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Kesalahan fatal pendaftaran pengguna baru:', error);
    return {
      success: false,
      error: 'Sistem gagal menyimpan pendaftaran Anda. Silakan coba beberapa saat lagi.',
    };
  }
}

/**
 * SERVER ACTION: logoutUser
 * 
 * Menghapus cookie sesi login.
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('pushaja_session');
  return { success: true };
}

/**
 * SERVER ACTION: getCurrentSession
 * 
 * Mendapatkan sesi pengguna saat ini jika cookie aktif.
 */
export async function getCurrentSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('pushaja_session');

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}
