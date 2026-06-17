'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FreelancerDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Ringkasan',
      href: '/freelancer/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Kelola Jasa (Gigs)',
      href: '/freelancer/dashboard/gigs',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: 'Penghasilan',
      href: '/freelancer/dashboard/earnings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Ulasan Klien',
      href: '/freelancer/dashboard/reviews',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Mobile */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex space-x-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                pathname === item.href 
                  ? 'bg-[#1E40AF] text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 min-h-[calc(100vh-80px)]">
        <div className="p-6">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Ruang Kerja</h2>
          <p className="text-sm font-semibold text-slate-400 mt-1">Dashboard Freelancer</p>
        </div>
        <div className="px-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                pathname === item.href 
                  ? 'bg-gradient-to-r from-[#1E40AF] to-blue-700 text-white shadow-md shadow-blue-500/20 translate-x-1' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#1E40AF]'
              }`}
            >
              <div className={pathname === item.href ? 'text-white' : 'text-slate-400'}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 md:p-10 lg:p-12 h-full">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
