'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  Clock, 
  ArrowRight, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BadgeCheck, 
  FileText,
  Building2,
  QrCode,
  Wallet,
  Info
} from 'lucide-react';
import { createCheckoutOrder } from '@/actions/order.action';

interface CheckoutClientProps {
  gig: {
    id: string;
    title: string;
    description: string;
    price: number;
    deliveryDays: number;
    imageUrl?: string | null;
    category?: { id: string; name: string; slug: string } | null;
    freelancer: {
      id: string;
      name: string;
      email: string;
      profilePicture?: string | null;
      isVerified?: boolean;
    };
  };
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const PAYMENT_METHODS = [
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    desc: 'Verifikasi instan otomatis 24/7',
    icon: Building2,
    badge: 'Populer',
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account',
    desc: 'Verifikasi instan via Livin\' by Mandiri',
    icon: Building2,
    badge: null,
  },
  {
    id: 'qris',
    name: 'QRIS (Gopay / OVO / Dana / BCA)',
    desc: 'Pindai barcode QRIS langsung dari aplikasi e-wallet Anda',
    icon: QrCode,
    badge: 'Instan',
  },
  {
    id: 'gopay',
    name: 'GoPay / GoPay Later',
    desc: 'Koneksikan langsung akun GoPay Anda',
    icon: Wallet,
    badge: null,
  },
  {
    id: 'pushaja_balance',
    name: 'Saldo Rekber PushAja',
    desc: 'Potong langsung dari saldo akun PushAja Anda',
    icon: CreditCard,
    badge: 'Bebas Admin',
  },
];

export default function CheckoutClient({ gig, currentUser }: CheckoutClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bca_va');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Perhitungan Biaya
  const basePrice = gig.price;
  const platformFee = 5000;
  const discountFee = 5000; // Promo Launching Bebas Biaya Layanan
  const totalAmount = basePrice + platformFee - discountFee;

  const formattedBase = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(basePrice);

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(totalAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('gigId', gig.id);
    formData.append('notes', notes);
    formData.append('paymentMethod', paymentMethod);

    startTransition(async () => {
      const res = await createCheckoutOrder(formData);
      if (res.success && res.orderId) {
        router.push(`/orders/${res.orderId}`);
      } else {
        setErrorMessage(res.error || 'Gagal membuat pesanan. Silakan coba kembali.');
      }
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Breadcrumb minimalis */}
      <nav className="mb-8 text-xs font-bold text-slate-400 flex items-center gap-2">
        <Link href="/" className="hover:text-[#1E40AF] transition-colors">Beranda</Link>
        <span>/</span>
        <Link href={`/gigs/${gig.id}`} className="hover:text-[#1E40AF] transition-colors">Detail Jasa</Link>
        <span>/</span>
        <span className="text-slate-700">Checkout & Rekber</span>
      </nav>

      {/* Header Halaman */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#1E40AF]/10 px-3.5 py-1 text-xs font-black text-[#1E40AF] uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4 text-[#1E40AF]" />
          Transaksi Aman Terlindungi Escrow
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Checkout & Konfirmasi Pemesanan
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Dana Anda akan disimpan aman di Rekening Bersama (Escrow) PushAja dan baru dicairkan ke freelancer setelah Anda puas dengan hasil pekerjaannya.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-8 rounded-2xl bg-rose-50 border border-rose-200 p-4 flex items-center gap-3 text-rose-800 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Kolom Kiri: Form Detail Pemesanan (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Card 1: Jasa yang Dipesan */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#1E40AF]" />
              Detail Jasa yang Dipesan
            </h2>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="relative w-full sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                {gig.imageUrl ? (
                  <Image src={gig.imageUrl} alt={gig.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1E40AF] to-indigo-900 flex items-center justify-center text-white/30 font-black text-xl">
                    PUSHAJA
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {gig.category && (
                    <span className="inline-block text-[11px] font-black uppercase tracking-wider text-[#1E40AF] bg-blue-50 px-2.5 py-1 rounded-md mb-2">
                      {gig.category.name}
                    </span>
                  )}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 leading-snug">
                    {gig.title}
                  </h3>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  {/* Freelancer Mini Info */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 relative shrink-0">
                      {gig.freelancer.profilePicture ? (
                        <Image src={gig.freelancer.profilePicture} alt={gig.freelancer.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#1E40AF]/10 text-[#1E40AF] font-bold text-xs">
                          {gig.freelancer.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-800">{gig.freelancer.name}</span>
                        {gig.freelancer.isVerified && (
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">Freelancer PushAja</span>
                    </div>
                  </div>

                  {/* Delivery Days Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pengerjaan {gig.deliveryDays} Hari Kerja</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Instruksi / Brief Klien */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#1E40AF]" />
                Brief & Kebutuhan Proyek
              </h2>
              <span className="text-xs font-semibold text-slate-400">Opsional / Sangat Dianjurkan</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Berikan gambaran singkat mengenai kebutuhan proyek Anda, referensi desain, link Google Drive/Figma, atau target luaran yang diharapkan agar freelancer dapat langsung bekerja maksimal.
            </p>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Saya membutuhkan desain logo bertema modern minimalis untuk brand kopi lokal 'Kopi Senja'. Preferensi warna earthy tone (coklat & krem). Link moodboard: https://..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-800 placeholder-slate-400 focus:border-[#1E40AF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          {/* Card 3: Pilihan Metode Pembayaran Rekber */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#1E40AF]" />
              Metode Pembayaran Rekber Escrow
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Pilih metode pembayaran aman. Transaksi diverifikasi secara otomatis oleh sistem PushAja.
            </p>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const IconComponent = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`cursor-pointer flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-[#1E40AF] bg-blue-50/40 shadow-sm ring-2 ring-[#1E40AF]/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-[#1E40AF] text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{method.name}</span>
                          {method.badge && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#A3E635]/30 text-emerald-900">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{method.desc}</p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-[#1E40AF] bg-[#1E40AF]' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Ringkasan Biaya Sticky (4 cols) */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
            
            <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">
              Ringkasan Pembayaran
            </h3>

            {/* List Rincian Biaya */}
            <div className="space-y-3.5 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold">Harga Jasa</span>
                <span className="font-bold text-slate-900">{formattedBase}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">Biaya Layanan Rekber</span>
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="text-right">
                  <span className="text-xs line-through text-slate-400 mr-2">Rp 5.000</span>
                  <span className="font-bold text-emerald-600">Rp 0 (Promo)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold">Estimasi Selesai</span>
                <span className="font-bold text-[#1E40AF]">{gig.deliveryDays} Hari Kerja</span>
              </div>
            </div>

            {/* Total Akhir */}
            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Total Ditagihkan</span>
                <span className="text-2xl font-black text-[#1E40AF]">{formattedTotal}</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">
                Escrow Aman
              </span>
            </div>

            {/* Tombol Konfirmasi & Bayar */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-2xl bg-[#1E40AF] px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mengamankan Pesanan...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#A3E635]" />
                  <span>Bayar & Mulai Pesanan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Kotak Jaminan Rekber PushAja */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Jaminan Perlindungan Klien PushAja</span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1.5 font-medium leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dana Anda baru diserahkan kepada freelancer setelah Anda menerima dan puas dengan hasil pekerjaan.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Garansi revisi jika hasil kerja tidak sesuai dengan brief awal.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dukungan mediasi langsung oleh tim PushAja bila terjadi perselisihan.</span>
                </li>
              </ul>
            </div>

            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Dengan mengklik tombol di atas, Anda menyetujui Ketentuan Rekber PushAja
            </p>

          </div>
        </div>
      </form>
    </div>
  );
}
