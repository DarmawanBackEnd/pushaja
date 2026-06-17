import { PrismaClient } from '@prisma/client';

/**
 * Mengapa kita membutuhkan inisialisasi singleton seperti ini?
 * 
 * Di Next.js (terutama saat development mode), setiap kali kita mengubah file kode sumber,
 * Next.js akan melakukan hot-reloading (memuat ulang modul). Jika kita hanya menulis:
 * `export const prisma = new PrismaClient()` secara langsung, maka setiap kali file dimuat ulang,
 * instance PrismaClient baru akan dibuat dan membuka koneksi baru ke database PostgreSQL.
 * 
 * Hal ini akan menyebabkan kebocoran koneksi (connection leak) secara cepat, hingga database
 * PostgreSQL menolak koneksi baru karena melebihi kapasitas maksimum koneksi.
 * 
 * Untuk mengatasinya:
 * 1. Kita menyimpan instance PrismaClient di objek global (`globalThis`) yang tidak terpengaruh hot-reloading.
 * 2. Pada lingkungan produksi (production), Next.js tidak melakukan hot-reloading,
 *    sehingga aman untuk langsung membuat instance baru setiap saat.
 */

// Mendeklarasikan tipe global tambahan agar TypeScript mengenali properti `prisma` di globalThis
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Gunakan instance global jika sudah ada, atau buat baru jika belum ada
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Jika bukan di lingkungan produksi, simpan instance ke objek global
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
