'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PackageProps {
  basePrice: number | string;
  deliveryDays: number;
  packagesJson?: any;
}

type PackageTier = 'basic' | 'standard' | 'premium';

export default function GigPackageSelector({ basePrice, deliveryDays, packagesJson }: PackageProps) {
  const [activeTab, setActiveTab] = useState<PackageTier>('basic');

  const rawBasePrice = typeof basePrice === 'number' ? basePrice : parseFloat(basePrice.toString());

  // Logika paket (Asli dari DB atau Fallback Simulasi)
  let dbPackages = null;
  if (packagesJson) {
    try {
      dbPackages = typeof packagesJson === 'string' ? JSON.parse(packagesJson) : packagesJson;
    } catch(e) {}
  }

  const packages = {
    basic: {
      name: 'Basic',
      isAvailable: true,
      price: rawBasePrice,
      desc: dbPackages?.basic?.desc || 'Paket dasar dengan fitur esensial. Sangat cocok untuk kebutuhan sederhana dan uji coba layanan.',
      days: deliveryDays,
      revision: dbPackages?.basic?.revision !== false,
      features: dbPackages?.basic?.features 
        ? dbPackages.basic.features.split(',').map((f: string) => f.trim()) 
        : ['Revisi 1 kali', 'Pengerjaan standar', 'Dukungan via chat']
    },
    standard: {
      name: 'Standard',
      isAvailable: !!dbPackages?.standard?.price,
      price: dbPackages?.standard?.price ? Number(dbPackages.standard.price) : 0,
      desc: dbPackages?.standard?.desc || '',
      days: dbPackages?.standard?.days ? Number(dbPackages.standard.days) : 0,
      revision: dbPackages?.standard?.revision !== false,
      features: dbPackages?.standard?.features 
        ? dbPackages.standard.features.split(',').map((f: string) => f.trim()) 
        : []
    },
    premium: {
      name: 'Premium',
      isAvailable: !!dbPackages?.premium?.price,
      price: dbPackages?.premium?.price ? Number(dbPackages.premium.price) : 0,
      desc: dbPackages?.premium?.desc || '',
      days: dbPackages?.premium?.days ? Number(dbPackages.premium.days) : 0,
      revision: dbPackages?.premium?.revision !== false,
      features: dbPackages?.premium?.features 
        ? dbPackages.premium.features.split(',').map((f: string) => f.trim()) 
        : []
    }
  };

  const activePackage = packages[activeTab];

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(activePackage.price);

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 w-full mb-6 relative">
        {(['basic', 'standard', 'premium'] as PackageTier[]).map((tier) => (
          <button
            key={tier}
            onClick={() => setActiveTab(tier)}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tier 
                ? 'text-[#1E40AF] border-b-2 border-[#1E40AF]' 
                : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      {/* Package Details */}
      <div className="animate-in fade-in duration-300">
        {!activePackage.isAvailable ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Paket {activePackage.name} Belum Tersedia</h3>
            <p className="text-sm text-slate-500">Freelancer belum mengonfigurasi paket ini.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-start">
              <h3 className="font-bold text-slate-800 text-lg">{activePackage.name} Package</h3>
              <div className="text-2xl font-black text-[#1E40AF] tracking-tight">{formattedPrice}</div>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {activePackage.desc}
            </p>

            {/* Delivery & Revisions info */}
            <div className="flex items-center gap-6 mb-6 text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {activePackage.days} Hari Pengerjaan
              </div>
              {activePackage.revision && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Revisi Tersedia
                </div>
              )}
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              {activePackage.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-600">{feature}</span>
                </div>
              ))}
            </div>

            {/* Order Button */}
            <Link href={`/chat/order-dummy-123`} className="w-full rounded-2xl bg-[#1E40AF] px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 group">
              Pilih {activePackage.name}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <p className="text-center text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-widest">
              Anda belum akan dikenakan biaya
            </p>
          </>
        )}
      </div>
    </div>
  );
}
