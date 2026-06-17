'use client';

import React, { useState } from 'react';

interface UserTabProps {
  usersList: any[];
}

export default function UserTab({ usersList }: UserTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'semua' | 'client' | 'freelancer'>('semua');

  // Metrik Peran
  const clientsCount = usersList.filter(u => u.role === 'client').length;
  const freelancersCount = usersList.filter(u => u.role === 'freelancer').length;

  // Filter & Pencarian Pengguna
  const filteredUsers = usersList.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      roleFilter === 'semua' || 
      user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-xl font-black text-slate-900">Daftar Pengguna Terdaftar (Overview & List)</h2>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Tinjau metrik pertumbuhan akun client dan freelancer pushaja</p>
      </div>

      {/* Grid Sub-Metrik Peran */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Box Client */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Total Akun Klien (Client)</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight block">{clientsCount}</span>
          </div>
          <div className="h-12 w-12 rounded-full bg-[#1E40AF]/5 border border-blue-50 flex items-center justify-center text-[#1E40AF]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <title>Klien</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Box Freelancer */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Total Akun Pekerja Mandiri</span>
            <span className="text-3xl font-black text-[#1E40AF] tracking-tight block">{freelancersCount}</span>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-105 flex items-center justify-center text-[#1E40AF]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <title>Pekerja Mandiri</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter & Kontrol Pencarian */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 select-none">
            <svg className="h-4.5 w-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <title>Cari</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari pengguna berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E40AF] transition-all font-semibold"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setRoleFilter('semua')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'semua'
                ? 'bg-[#1E40AF] text-white shadow-sm'
                : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setRoleFilter('client')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'client'
                ? 'bg-[#1E40AF] text-white shadow-sm'
                : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Klien (Client)
          </button>
          <button
            onClick={() => setRoleFilter('freelancer')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'freelancer'
                ? 'bg-[#1E40AF] text-white shadow-sm'
                : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Freelancer
          </button>
        </div>

      </div>

      {/* Tabel Pengguna */}
      <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[2rem] shadow-sm space-y-6">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 text-slate-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <title>Pengguna Tidak Ditemukan</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 4h.01m-2.28 3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-slate-400 font-semibold">Tidak ditemukan pengguna yang cocok dengan filter pencarian.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-150">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">Alamat Email</th>
                  <th className="p-4">No. Telepon</th>
                  <th className="p-4">Peran Perangkat</th>
                  <th className="p-4">Status Verifikasi</th>
                  <th className="p-4 text-right">Tanggal Bergabung</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-xs font-semibold text-slate-700">
                    <td className="p-4 font-bold text-slate-800">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 text-slate-400">{user.phone || '—'}</td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase border ${
                        user.role === 'freelancer'
                          ? 'bg-[#1E40AF]/5 border-[#1E40AF]/20 text-[#1E40AF]'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      }`}>
                        {user.role === 'freelancer' ? 'FREELANCER' : 'CLIENT'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase border ${
                        user.isVerified
                          ? 'bg-blue-50 border-blue-200 text-blue-600'
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        {user.isVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
