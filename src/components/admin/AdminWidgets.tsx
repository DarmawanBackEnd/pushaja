import React from 'react';

export default function AdminWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Kolom 1: Tugas Prioritas (To-Do List) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-rose-50/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <h3 className="font-black text-slate-800 text-sm">Tugas Prioritas</h3>
          </div>
          <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full">3 Menunggu</span>
        </div>
        <div className="p-2 flex-1">
          {/* List Item 1 */}
          <div className="p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Verifikasi KTP - Eko Prasetyo</p>
              <p className="text-[10px] text-slate-500 mt-1">Dokumen diunggah 2 jam yang lalu</p>
            </div>
          </div>
          {/* List Item 2 */}
          <div className="p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Sengketa Pesanan #ORD-992</p>
              <p className="text-[10px] text-slate-500 mt-1">Klien meminta pengembalian dana</p>
            </div>
          </div>
          {/* List Item 3 */}
          <div className="p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Review Laporan Jasa Palsu</p>
              <p className="text-[10px] text-slate-500 mt-1">1 Jasa dilaporkan oleh 5 pengguna</p>
            </div>
          </div>
        </div>
        <button className="w-full p-3 text-xs font-bold text-[#1E40AF] bg-slate-50 hover:bg-slate-100 transition-colors border-t border-slate-100">
          Lihat Semua Tugas &rarr;
        </button>
      </div>

      {/* Kolom 2: Leaderboard (Top Performers) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-amber-50/30">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <h3 className="font-black text-slate-800 text-sm">Top Freelancers</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Bulan Ini</span>
        </div>
        <div className="p-4 flex-1 space-y-4">
          
          <div className="flex items-center gap-3">
            <div className="w-6 font-black text-slate-300 text-sm text-center">1</div>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
              <img src="https://i.pravatar.cc/150?u=darmawan" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800">Darmawan Putra</p>
              <p className="text-[10px] text-slate-500">Web Programming</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-[#1E40AF]">Rp 45Jt</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 font-black text-slate-300 text-sm text-center">2</div>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
              <img src="https://i.pravatar.cc/150?u=syafira" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800">Syafira Putri</p>
              <p className="text-[10px] text-slate-500">UI/UX Design</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-[#1E40AF]">Rp 28Jt</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 font-black text-slate-300 text-sm text-center">3</div>
            <div className="w-8 h-8 rounded-full bg-[#1E40AF]/10 text-[#1E40AF] flex items-center justify-center font-bold text-xs shrink-0">
              R
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800">Riana Lestari</p>
              <p className="text-[10px] text-slate-500">Copywriting</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-[#1E40AF]">Rp 15Jt</p>
            </div>
          </div>

        </div>
      </div>

      {/* Kolom 3: Live Activity Feed */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:col-span-2 lg:col-span-1">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-emerald-50/30">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <h3 className="font-black text-slate-800 text-sm">Live Activity</h3>
          </div>
        </div>
        <div className="p-5 flex-1 relative">
          {/* Garis vertikal timeline */}
          <div className="absolute left-[31px] top-6 bottom-6 w-px bg-slate-100"></div>
          
          <div className="space-y-5 relative">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <div>
                <p className="text-xs text-slate-600"><span className="font-bold text-slate-800">Order Baru #1042</span> senilai Rp 2.400.000 masuk ke sistem Escrow.</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Baru saja</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <p className="text-xs text-slate-600"><span className="font-bold text-slate-800">Budi Santoso</span> baru saja mendaftar sebagai Freelancer.</p>
                <p className="text-[10px] text-slate-400 mt-0.5">5 menit yang lalu</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-amber-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
              <div>
                <p className="text-xs text-slate-600"><span className="font-bold text-slate-800">Pencairan Dana</span> sebesar Rp 7.500.000 berhasil ditransfer ke Darmawan.</p>
                <p className="text-[10px] text-slate-400 mt-0.5">12 menit yang lalu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
