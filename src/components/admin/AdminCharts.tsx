'use client';

import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Data Simulasi Keuangan Platform (2026)
const revenueData = [
  { name: 'Jan', revenue: 15000000 },
  { name: 'Feb', revenue: 22000000 },
  { name: 'Mar', revenue: 18000000 },
  { name: 'Apr', revenue: 34000000 },
  { name: 'Mei', revenue: 41000000 },
  { name: 'Jun', revenue: 58000000 },
];

// Data Simulasi Pertumbuhan Pengguna
const userGrowthData = [
  { name: 'Jan', freelancers: 45, clients: 120 },
  { name: 'Feb', freelancers: 52, clients: 140 },
  { name: 'Mar', freelancers: 80, clients: 200 },
  { name: 'Apr', freelancers: 110, clients: 310 },
  { name: 'Mei', freelancers: 145, clients: 450 },
  { name: 'Jun', freelancers: 190, clients: 580 },
];

const formatRupiah = (value: number) => {
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}Jt`;
  return `Rp ${value}`;
};

export default function AdminCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Grafik Pendapatan Platform */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-black text-slate-800">Volume Transaksi Platform</h3>
            <p className="text-xs text-slate-500 font-medium">Total dana escrow (Rp) per bulan</p>
          </div>
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            +32% Naik
          </span>
        </div>
        
        <div className="flex-1 w-full mt-4">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
              <YAxis tickFormatter={formatRupiah} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} width={60} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 900 }}
                formatter={(value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)}
              />
              <Area type="monotone" dataKey="revenue" name="Total Transaksi" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: '#10B981', stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grafik Pertumbuhan Pengguna */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-black text-slate-800">Pertumbuhan Pengguna Baru</h3>
            <p className="text-xs text-slate-500 font-medium">Akun Freelancer vs Klien per bulan</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#1E40AF]"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Klien</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#A3E635]"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Freelancer</span></div>
          </div>
        </div>
        
        <div className="flex-1 w-full mt-4">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} width={30} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="clients" name="Klien" fill="#1E40AF" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="freelancers" name="Freelancer" fill="#A3E635" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
