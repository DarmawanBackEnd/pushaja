'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  FileCheck, 
  ArrowRight, 
  Search, 
  Calendar,
  BadgeCheck,
  ShieldCheck
} from 'lucide-react';

interface OrderItem {
  id: string;
  totalAmount: number;
  status: string;
  dueDate: string | Date | null;
  createdAt: string | Date;
  gig: {
    id: string;
    title: string;
    imageUrl?: string | null;
    deliveryDays?: number;
  };
  freelancer: {
    name: string;
    profilePicture?: string | null;
    isVerified?: boolean;
  };
  deliverables?: Array<any>;
}

export default function OrdersListClient({ orders }: { orders: OrderItem[] }) {
  const [activeTab, setActiveTab] = useState<'all' | 'on_progress' | 'in_review' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'on_progress'
        ? order.status === 'on_progress'
        : activeTab === 'in_review'
        ? order.status === 'in_review'
        : order.status === 'completed';

    const matchesSearch =
      order.gig?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.freelancer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1E40AF]/10 px-3 py-1 text-xs font-black text-[#1E40AF] uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-[#1E40AF]" />
            Aktivitas Transaksi
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pesanan Saya</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pantau tahapan pengerjaan, tinjau berkas deliverable, dan selesaikan pesanan Anda.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pesanan atau freelancer..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium"
          />
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-slate-200/80">
        {[
          { id: 'all', label: 'Semua Pesanan', count: orders.length },
          {
            id: 'on_progress',
            label: 'Dalam Pengerjaan',
            count: orders.filter((o) => o.status === 'on_progress').length,
          },
          {
            id: 'in_review',
            label: 'Dalam Evaluasi',
            count: orders.filter((o) => o.status === 'in_review').length,
          },
          {
            id: 'completed',
            label: 'Selesai',
            count: orders.filter((o) => o.status === 'completed').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#1E40AF] text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* List Pesanan */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-200 p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Tidak ada pesanan ditemukan</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Tidak ada pesanan yang sesuai dengan kata kunci pencarian Anda.'
              : 'Anda belum memiliki transaksi pesanan pada kategori status ini.'}
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#1E40AF] text-white text-xs font-black hover:bg-blue-800 transition-colors"
            >
              Jelajahi Jasa Freelance
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const formattedTotal = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(order.totalAmount);

            const formattedDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-[#1E40AF]/40 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                {/* Info Utama */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {order.gig?.imageUrl ? (
                      <Image src={order.gig.imageUrl} alt={order.gig.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1E40AF]/10 flex items-center justify-center text-[#1E40AF] font-bold text-xs">
                        PUSHAJA
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        #{order.id.substring(0, 8)}
                      </span>
                      <span>•</span>
                      <span className="text-[11px] text-slate-400 font-medium">{formattedDate}</span>

                      {/* Status Badges */}
                      {order.status === 'on_progress' && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] border border-blue-200">
                          Dalam Pengerjaan
                        </span>
                      )}
                      {order.status === 'in_review' && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Perlu Evaluasi
                        </span>
                      )}
                      {order.status === 'completed' && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Selesai
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1E40AF] transition-colors line-clamp-1">
                      {order.gig?.title}
                    </h3>

                    {/* Freelancer Info */}
                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                      <span>Freelancer:</span>
                      <div className="flex items-center gap-1 font-bold text-slate-700">
                        <span>{order.freelancer?.name}</span>
                        {order.freelancer?.isVerified && (
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Harga & Tombol Aksi */}
                <div className="flex sm:items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="md:text-right">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                      Total Biaya
                    </span>
                    <span className="text-base font-black text-slate-900">{formattedTotal}</span>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E40AF] text-white text-xs font-black hover:bg-blue-800 shadow-sm transition-all group-hover:scale-105"
                  >
                    <span>Detail Pesanan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
