'use client';

import React, { useState, useTransition, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  Upload,
  FileCheck,
  AlertCircle,
  ExternalLink,
  Download,
  Star,
  RefreshCw,
  BadgeCheck,
  Calendar,
  Lock,
  ArrowRight,
  Info,
  Sparkles,
  FileText
} from 'lucide-react';
import { deliverWork, approveOrderAndReview, requestRevision } from '@/actions/order.action';

interface OrderClientProps {
  order: {
    id: string;
    totalAmount: number;
    status: string;
    dueDate: string | Date | null;
    createdAt: string | Date;
    notes?: string | null;
    isClient: boolean;
    isFreelancer: boolean;
    isAdmin: boolean;
    conversationId?: string | null;
    currentUserId: string;
    gig: {
      id: string;
      title: string;
      imageUrl?: string | null;
      deliveryDays?: number;
      category?: { id: string; name: string; slug: string } | null;
    };
    client: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      profilePicture?: string | null;
    };
    freelancer: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      profilePicture?: string | null;
      isVerified?: boolean;
    };
    payment?: {
      id: string;
      status: string;
      paymentMethod: string;
      transactionId: string;
      amount: any;
    } | null;
    deliverables: Array<{
      id: string;
      filePath: string;
      message?: string | null;
      submittedAt: string | Date;
    }>;
    reviews?: Array<{
      id: string;
      rating: number;
      comment?: string | null;
    }>;
  };
}

export default function OrderClient({ order }: OrderClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State Freelancer Deliver Work
  const [deliverMode, setDeliverMode] = useState<'file' | 'link'>('file');
  const [deliverMessage, setDeliverMessage] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Modal Client Approval & Rating
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  // State Modal Client Revision
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');

  // Status Alerts
  const [alertError, setAlertError] = useState<string | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // Formatting
  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(order.totalAmount);

  const formattedDueDate = order.dueDate
    ? new Date(order.dueDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-';

  const formattedCreatedAt = new Date(order.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Logika Stepper
  const getStepStatus = () => {
    switch (order.status) {
      case 'unpaid':
        return 1;
      case 'on_progress':
        return 2;
      case 'in_review':
        return 3;
      case 'completed':
        return 4;
      default:
        return 2;
    }
  };

  const currentStep = getStepStatus();

  // Handle Pengiriman Hasil Kerja (Freelancer)
  const handleDeliverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertError(null);
    setAlertSuccess(null);

    if (deliverMode === 'file' && !selectedFile) {
      setAlertError('Silakan pilih berkas hasil kerja untuk diunggah.');
      return;
    }

    if (deliverMode === 'link' && !externalLink.trim()) {
      setAlertError('Silakan masukkan tautan eksternal (Google Drive / Figma / dll).');
      return;
    }

    if (!deliverMessage.trim()) {
      setAlertError('Mohon tuliskan pesan penjelasan hasil kerja untuk klien.');
      return;
    }

    const formData = new FormData();
    formData.append('orderId', order.id);
    formData.append('message', deliverMessage);

    if (deliverMode === 'file' && selectedFile) {
      formData.append('file', selectedFile);
    } else {
      formData.append('externalLink', externalLink.trim());
    }

    startTransition(async () => {
      const res = await deliverWork(formData);
      if (res.success) {
        setAlertSuccess('Hasil pekerjaan berhasil dikirim ke klien! Status pesanan kini Dalam Evaluasi.');
        setSelectedFile(null);
        setDeliverMessage('');
        setExternalLink('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        router.refresh();
      } else {
        setAlertError(res.error || 'Gagal mengirim hasil kerja.');
      }
    });
  };

  // Handle Persetujuan & Ulasan Bintang (Client)
  const handleApproveOrder = async () => {
    setAlertError(null);
    setAlertSuccess(null);

    startTransition(async () => {
      const res = await approveOrderAndReview(order.id, rating, reviewComment);
      if (res.success) {
        setIsApproveModalOpen(false);
        setAlertSuccess('Pesanan berhasil diselesaikan! Dana transaksi telah dicairkan ke freelancer.');
        router.refresh();
      } else {
        setAlertError(res.error || 'Gagal menyelesaikan pesanan.');
      }
    });
  };

  // Handle Pengajuan Revisi (Client)
  const handleRevisionSubmit = async () => {
    if (!revisionNotes.trim()) {
      setAlertError('Mohon masukkan rincian catatan revisi yang diinginkan.');
      return;
    }

    setAlertError(null);
    setAlertSuccess(null);

    startTransition(async () => {
      const res = await requestRevision(order.id, revisionNotes);
      if (res.success) {
        setIsRevisionModalOpen(false);
        setAlertSuccess('Permintaan revisi telah dikirimkan ke freelancer.');
        setRevisionNotes('');
        router.refresh();
      } else {
        setAlertError(res.error || 'Gagal mengajukan revisi.');
      }
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs font-bold text-slate-400 flex items-center gap-2">
        <Link href="/" className="hover:text-[#1E40AF] transition-colors">Beranda</Link>
        <span>/</span>
        <Link href="/orders" className="hover:text-[#1E40AF] transition-colors">Pesanan Saya</Link>
        <span>/</span>
        <span className="text-slate-700 font-mono">#{order.id.substring(0, 8)}</span>
      </nav>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="font-mono text-xs font-black bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
              #{order.id.substring(0, 12)}
            </span>

            {order.status === 'on_progress' && (
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-[#1E40AF] border border-blue-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Dalam Pengerjaan
              </span>
            )}
            {order.status === 'in_review' && (
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-amber-600" /> Dalam Evaluasi Klien
              </span>
            )}
            {order.status === 'completed' && (
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pesanan Selesai
              </span>
            )}
            {order.status === 'cancelled' && (
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                Dibatalkan
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {order.gig.title}
          </h1>

          <p className="text-xs font-semibold text-slate-500 mt-2 flex items-center gap-4">
            <span>Dipesan: {formattedCreatedAt}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#1E40AF]">
              <Calendar className="w-3.5 h-3.5" />
              Tenggat Selesai: {formattedDueDate}
            </span>
          </p>
        </div>

        {/* Tombol Chat Realtime */}
        <div className="shrink-0">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1E40AF]/10 text-[#1E40AF] text-sm font-black hover:bg-[#1E40AF] hover:text-white transition-all shadow-sm group"
          >
            <MessageSquare className="w-4 h-4 text-[#1E40AF] group-hover:text-white transition-colors" />
            <span>Buka Ruang Obrolan</span>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {alertError && (
        <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 flex items-center gap-3 text-rose-800 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{alertError}</span>
        </div>
      )}

      {alertSuccess && (
        <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{alertSuccess}</span>
        </div>
      )}

      {/* Stepper Status Pesanan (Visual Progress Bar) */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 mb-8 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-6">
          Tahapan Progres Pesanan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {[
            { step: 1, title: 'Dana Rekber Aman', desc: 'Escrow PushAja aktif' },
            { step: 2, title: 'Pengerjaan', desc: 'Freelancer mengerjakan' },
            { step: 3, title: 'Evaluasi Hasil', desc: 'Klien meninjau berkas' },
            { step: 4, title: 'Selesai & Ulasan', desc: 'Dana dicairkan' },
          ].map((item, idx) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <div
                key={item.step}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-[#1E40AF] bg-blue-50/50 shadow-sm ring-2 ring-[#1E40AF]/10'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-100 bg-slate-50/50 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-[#1E40AF] text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                  </div>
                  <span className={`text-sm font-black ${isCurrent ? 'text-[#1E40AF]' : 'text-slate-800'}`}>
                    {item.title}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium ml-10">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Riwayat Deliverables & Aksi (8 cols) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Banner Aksi Klien jika status in_review */}
          {order.isClient && order.status === 'in_review' && (
            <div className="rounded-[2rem] bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-300 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-amber-900">
                    Hasil Pekerjaan Siap Ditinjau!
                  </h3>
                  <p className="text-xs text-amber-800/90 font-medium mt-1 leading-relaxed">
                    Freelancer telah mengirimkan file atau tautan hasil kerja. Silakan periksa hasil kerja di bawah. Jika sudah sesuai, setujui pesanan untuk mencairkan dana ke freelancer. Jika masih perlu perbaikan, Anda dapat mengajukan revisi.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-5">
                    <button
                      onClick={() => setIsApproveModalOpen(true)}
                      className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Setujui & Selesaikan Pesanan
                    </button>

                    <button
                      onClick={() => setIsRevisionModalOpen(true)}
                      className="px-5 py-3 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100/50 transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4 text-amber-700" />
                      Minta Revisi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Banner Pesanan Selesai */}
          {order.status === 'completed' && (
            <div className="rounded-[2rem] bg-emerald-50 border border-emerald-200 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-emerald-900">Pesanan Telah Selesai</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Transaksi telah selesai. Dana telah berhasil dicairkan ke saldo dompet freelancer.
                  </p>
                  {order.reviews && order.reviews.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-emerald-200/60">
                      <div className="flex items-center gap-1.5 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= order.reviews![0].rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-black text-emerald-900 ml-2">
                          Rating {order.reviews[0].rating}/5
                        </span>
                      </div>
                      {order.reviews[0].comment && (
                        <p className="text-xs italic text-emerald-800">
                          &ldquo;{order.reviews[0].comment}&rdquo;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Pengiriman Hasil Kerja (Khusus Freelancer) */}
          {order.isFreelancer && (order.status === 'on_progress' || order.status === 'in_review') && (
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#1E40AF]" />
                    Kirimkan Hasil Pekerjaan (Deliverable)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Unggah berkas master/proyek atau sertakan tautan penyimpanan eksternal untuk dievaluasi oleh klien.
                  </p>
                </div>
              </div>

              <form onSubmit={handleDeliverSubmit} className="space-y-5 mt-4">
                {/* Tab Pilihan Mode: Berkas atau Tautan */}
                <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
                  <button
                    type="button"
                    onClick={() => setDeliverMode('file')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      deliverMode === 'file'
                        ? 'bg-white text-[#1E40AF] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Unggah Berkas File (.zip, .pdf, .jpg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliverMode('link')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      deliverMode === 'link'
                        ? 'bg-white text-[#1E40AF] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tautan Eksternal (Drive, Figma, GitHub)
                  </button>
                </div>

                {deliverMode === 'file' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Pilih Berkas Proyek
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#1E40AF] transition-colors bg-slate-50/50">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="deliverableFileInput"
                      />
                      <label htmlFor="deliverableFileInput" className="cursor-pointer block">
                        <Upload className="w-8 h-8 text-[#1E40AF] mx-auto mb-2" />
                        <span className="text-sm font-bold text-slate-800 block">
                          {selectedFile ? selectedFile.name : 'Klik untuk memilih berkas dari komputer'}
                        </span>
                        <span className="text-xs text-slate-400 mt-1 block">
                          Maksimal 50MB (Format zip, rar, pdf, png, jpg, psd, ai)
                        </span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Tautan URL Proyek
                    </label>
                    <input
                      type="url"
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      placeholder="https://www.figma.com/file/... atau https://drive.google.com/..."
                      className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-800 focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Catatan & Penjelasan untuk Klien
                  </label>
                  <textarea
                    rows={3}
                    value={deliverMessage}
                    onChange={(e) => setDeliverMessage(e.target.value)}
                    placeholder="Jelaskan apa saja yang telah diselesaikan, cara membuka aset, atau catatan penting lainnya..."
                    className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-800 focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-3.5 rounded-xl bg-[#1E40AF] text-white text-xs font-black hover:bg-blue-800 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Mengirimkan Hasil Kerja...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-[#A3E635]" />
                      <span>Kirimkan Hasil Kerja ke Klien</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Daftar Riwayat Hasil Kerja (Deliverables List) */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#1E40AF]" />
              Riwayat Pengiriman Hasil Kerja ({order.deliverables.length})
            </h2>

            {order.deliverables.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold">Belum ada pengiriman hasil kerja</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Freelancer sedang mengerjakan pesanan ini. Anda akan menerima notifikasi begitu hasil kerja diunggah.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {order.deliverables.map((deliv, idx) => {
                  const isExternal = deliv.filePath.startsWith('http');
                  const submittedFormatted = new Date(deliv.submittedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={deliv.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-[#1E40AF]">
                            Pengiriman #{order.deliverables.length - idx}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{submittedFormatted}</span>
                        </div>

                        <p className="text-xs font-semibold text-slate-700 mt-2 bg-white p-3 rounded-xl border border-slate-100">
                          {deliv.message || 'Tidak ada pesan khusus.'}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {isExternal ? (
                          <a
                            href={deliv.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-[#1E40AF]" />
                            <span>Buka Tautan</span>
                          </a>
                        ) : (
                          <a
                            href={deliv.filePath}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E40AF] text-white text-xs font-bold hover:bg-blue-800 transition-colors shadow-sm"
                          >
                            <Download className="w-4 h-4 text-[#A3E635]" />
                            <span>Unduh Berkas</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Catatan Brief dari Klien */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#1E40AF]" />
              Brief & Catatan Awal Pesanan
            </h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
              {order.notes || 'Tidak ada catatan brief khusus yang disertakan pada saat checkout.'}
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Rincian Escrow & Kontak (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Kartu Profil Partner Transaksi */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
              {order.isClient ? 'Freelancer yang Ditunjuk' : 'Informasi Klien Pemesan'}
            </h3>

            {order.isClient ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 relative shrink-0">
                  {order.freelancer.profilePicture ? (
                    <Image src={order.freelancer.profilePicture} alt={order.freelancer.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1E40AF]/10 text-[#1E40AF] font-bold">
                      {order.freelancer.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-sm text-slate-900">{order.freelancer.name}</span>
                    {order.freelancer.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{order.freelancer.email}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 relative shrink-0">
                  {order.client.profilePicture ? (
                    <Image src={order.client.profilePicture} alt={order.client.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1E40AF]/10 text-[#1E40AF] font-bold">
                      {order.client.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">{order.client.name}</span>
                  <span className="text-xs text-slate-400 font-medium">{order.client.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Kartu Status Escrow Pembayaran */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Escrow & Transaksi
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Terproteksi
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Nilai Transaksi</span>
                <span className="font-bold text-slate-900">{formattedTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Metode Bayar</span>
                <span className="font-bold text-slate-900 uppercase">
                  {order.payment?.paymentMethod?.replace('_', ' ') || 'Escrow PushAja'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Status Dana</span>
                <span className="font-bold text-emerald-600">
                  {order.status === 'completed' ? 'Telah Dicairkan' : 'Tersimpan di Rekber'}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-3 text-[11px] text-slate-500 font-medium flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Dana aman terlindungi di sistem Rekening Bersama PushAja hingga pekerjaan selesai disetujui.
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Modal Rating & Approval (Client) */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Setujui & Selesaikan Pesanan
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Dengan menyetujui pesanan ini, dana transaksi sebesar <strong className="text-slate-800">{formattedTotal}</strong> akan langsung dicairkan ke saldo akun freelancer. Berikan juga ulasan kepuasan Anda!
            </p>

            {/* Bintang Rating Interaktif */}
            <div className="mb-6 text-center">
              <label className="block text-xs font-bold text-slate-700 mb-3">
                Rating Kepuasan Anda
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-600 mt-2 block">
                {rating === 5 ? 'Sangat Memuaskan! (5/5)' : `${rating} dari 5 Bintang`}
              </span>
            </div>

            {/* Testimonial / Ulasan */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Ulasan / Komentar Anda
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Bagikan pengalaman bekerja sama dengan freelancer ini..."
                className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-800 focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleApproveOrder}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2"
              >
                {isPending ? 'Memproses...' : 'Konfirmasi & Selesaikan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Minta Revisi (Client) */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Permintaan Revisi Hasil Kerja
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Jelaskan dengan spesifik bagian mana yang perlu diperbaiki atau disesuaikan agar freelancer dapat menindaklanjuti dengan tepat.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Rincian Perbaikan (Revisi)
              </label>
              <textarea
                rows={4}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Contoh: Mohon ganti warna tombol menjadi biru tua dan perbaiki ukuran font pada headline..."
                className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-800 focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleRevisionSubmit}
                className="px-6 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-black hover:bg-amber-700 transition-all shadow-md flex items-center gap-2"
              >
                {isPending ? 'Mengirim...' : 'Kirim Catatan Revisi'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
