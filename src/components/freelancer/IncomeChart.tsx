'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Data Dummy Pendapatan Bulanan (Tahun 2026)
const dummyData = [
  { name: 'Jan', income: 1500000 },
  { name: 'Feb', income: 3200000 },
  { name: 'Mar', income: 2800000 },
  { name: 'Apr', income: 5400000 },
  { name: 'Mei', income: 4100000 },
  { name: 'Jun', income: 6800000 },
  { name: 'Jul', income: 5900000 },
  { name: 'Ags', income: 8500000 },
  { name: 'Sep', income: 7200000 },
  { name: 'Okt', income: 9400000 },
  { name: 'Nov', income: 8800000 },
  { name: 'Des', income: 12500000 },
];

// Helper untuk format Rupiah di Y-Axis & Tooltip
const formatRupiah = (value: number) => {
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)}Jt`;
  } else if (value >= 1000) {
    return `Rp ${(value / 1000).toFixed(0)}Rb`;
  }
  return `Rp ${value}`;
};

// Komponen Custom Tooltip agar desainnya senada dengan tema pushaja
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-xl">
        <p className="text-xs font-bold text-slate-500 mb-1">{`Bulan: ${label}`}</p>
        <p className="text-lg font-black text-[#1E40AF]">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function IncomeChart() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Chart */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Grafik Pendapatan</h2>
          <p className="text-sm text-slate-500 font-medium">Laporan total penghasilan bersih Anda tahun ini</p>
        </div>
        
        {/* Total Setahun (Ringkasan Cepat) */}
        <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1E40AF]/10 flex items-center justify-center text-[#1E40AF]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total 2026</span>
            <span className="text-base font-black text-emerald-600">Rp 76.100.000</span>
          </div>
        </div>
      </div>

      {/* Area Chart Container */}
      <div className="w-full h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dummyData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              tickFormatter={formatRupiah} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#1E40AF" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
              activeDot={{ r: 6, fill: '#1E40AF', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
