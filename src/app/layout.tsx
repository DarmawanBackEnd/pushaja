import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KopDigital Kota Serang | Portal Resmi Koperasi, UMKM & Talenta Digital Kota Serang Madani",
  description: "Platform resmi Dinas Koperasi, Usaha Kecil Menengah, Perindustrian dan Perdagangan (DinkopUKM Perindag) Kota Serang untuk pemberdayaan koperasi modern, produk UMKM unggulan, dan talenta digital lokal Kota Serang Madani.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
