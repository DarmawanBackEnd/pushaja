import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default async function ChatBlueprintPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="h-screen bg-white flex flex-col selection:bg-[#A3E635] selection:text-[#1E40AF] overflow-hidden">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto flex h-[calc(100vh-80px)] border-t border-slate-100">
        
        {/* Left Sidebar - Chat List */}
        <div className="w-[30%] min-w-[300px] max-w-[400px] bg-white border-r border-slate-200 flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-[72px] bg-white px-6 flex items-center justify-between shrink-0 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
                <img src="https://ui-avatars.com/api/?name=Anda&background=1E40AF&color=fff" alt="Anda" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-slate-800 text-sm hidden sm:block">Kotak Pesan</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <button className="p-2 rounded-xl hover:bg-slate-50 hover:text-[#1E40AF] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 bg-white border-b border-slate-100 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-2.5 gap-3 focus-within:border-[#1E40AF] focus-within:ring-1 focus-within:ring-[#1E40AF] transition-all">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Cari percakapan..." className="bg-transparent border-none focus:outline-none text-sm w-full font-medium text-slate-700 placeholder-slate-400" />
            </div>
          </div>

          {/* Chat List Items */}
          <div className="flex-1 overflow-y-auto bg-white">
            
            {/* Active Chat Item */}
            <div className="flex items-center gap-4 px-6 py-4 cursor-pointer bg-blue-50/50 border-l-4 border-[#1E40AF] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 overflow-hidden shadow-sm">
                 <img src="https://ui-avatars.com/api/?name=Syafira+Putri&background=A3E635&color=1E40AF" alt="Syafira" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-extrabold text-slate-900 text-sm truncate">Syafira Putri</h4>
                  <span className="text-xs text-[#1E40AF] font-bold shrink-0">10:45</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500 font-medium truncate pr-2">Halo Kak! Tentu bisa, untuk 10 ha...</p>
                  <div className="w-5 h-5 bg-[#1E40AF] rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0 shadow-sm">1</div>
                </div>
              </div>
            </div>

            {/* Other Chat Item 1 */}
            <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors border-l-4 border-transparent group border-b border-slate-50">
              <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                 <img src="https://ui-avatars.com/api/?name=Budi+Santoso&background=F59E0B&color=fff" alt="Budi" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-slate-800 text-sm truncate">Budi Santoso</h4>
                  <span className="text-xs text-slate-400 font-medium shrink-0">Kemarin</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500 font-medium truncate pr-2">
                    <svg className="w-4 h-4 inline text-[#A3E635] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Terima kasih atas orderannya!
                  </p>
                </div>
              </div>
            </div>

            {/* Other Chat Item 2 */}
            <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors border-l-4 border-transparent group border-b border-slate-50">
              <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                 <img src="https://ui-avatars.com/api/?name=Tim+Pushaja&background=1E40AF&color=fff" alt="Pushaja" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-slate-800 text-sm truncate">Tim Pushaja</h4>
                  <span className="text-xs text-slate-400 font-medium shrink-0">12 Mei</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500 font-medium truncate pr-2">Selamat datang di pushaja! Mulai...</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Main Area - Active Chat */}
        <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
          {/* Chat Header */}
          <div className="h-[72px] bg-white px-8 flex items-center justify-between shrink-0 border-b border-slate-100 relative z-10 shadow-sm shadow-slate-100/50">
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
                <img src="https://ui-avatars.com/api/?name=Syafira+Putri&background=A3E635&color=1E40AF" alt="Syafira" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">Syafira Putri</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#A3E635] font-bold mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse"></span>
                  Online
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="bg-slate-50 text-[#1E40AF] px-4 py-2 rounded-full text-xs font-black border border-slate-200 hover:bg-slate-100 hover:border-[#1E40AF]/30 transition-all flex items-center gap-2">
                Order #{resolvedParams.orderId.substring(0, 8).toUpperCase()}
              </button>
              <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#1E40AF] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-4 relative z-10 flex flex-col">
            
            {/* Date Separator */}
            <div className="flex justify-center my-4">
              <span className="bg-white border border-slate-100 text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-sm">
                HARI INI
              </span>
            </div>

            {/* Bubble Out (You) */}
            <div className="flex flex-col items-end gap-1 self-end max-w-[85%] md:max-w-[70%]">
              <div className="bg-[#1E40AF] text-white px-5 py-3.5 rounded-[1.25rem] rounded-tr-sm shadow-md shadow-blue-900/10 relative text-[14.5px]">
                <p className="leading-relaxed font-medium pr-10">Halo Syafira, saya tertarik dengan jasa desain UI/UX ini. Apakah bisa selesai dalam 4 hari untuk aplikasi e-commerce 10 halaman?</p>
                <span className="text-[10px] text-blue-200 font-medium absolute bottom-2 right-3 flex items-center gap-1.5">
                  10:42
                  <svg className="w-3.5 h-3.5 text-[#A3E635]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </span>
              </div>
            </div>

            {/* Bubble In (Them) */}
            <div className="flex flex-col items-start gap-1 self-start max-w-[85%] md:max-w-[70%]">
              <div className="bg-white border border-slate-100 text-slate-800 px-5 py-3.5 rounded-[1.25rem] rounded-tl-sm shadow-sm relative text-[14.5px]">
                <p className="leading-relaxed font-medium pr-12">Halo Kak! Tentu bisa, untuk 10 halaman e-commerce standar estimasi 4 hari sangat memungkinkan. Apakah kakak sudah memiliki wireframe atau contoh referensi desain yang diinginkan?</p>
                <span className="text-[10px] text-slate-400 font-medium absolute bottom-2 right-4">
                  10:45
                </span>
              </div>
            </div>

          </div>

          {/* Chat Input Area */}
          <div className="bg-white px-6 py-4 flex items-center gap-4 shrink-0 relative z-10 border-t border-slate-100 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.05)]">
            <button className="p-2.5 rounded-full bg-slate-50 text-slate-400 hover:text-[#1E40AF] hover:bg-blue-50 transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            </button>
            
            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-[#1E40AF] focus-within:ring-2 focus-within:ring-[#1E40AF]/20 transition-all overflow-hidden flex items-center px-2">
              <textarea 
                rows={1}
                placeholder="Tulis pesan Anda..." 
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-3 py-3.5 text-sm font-medium text-slate-700 resize-none max-h-32"
              ></textarea>
              <button className="p-2 text-slate-400 hover:text-amber-500 transition-colors shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>

            <button className="bg-[#1E40AF] text-white w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-blue-800 hover:scale-105 active:scale-95 transition-all shadow-md shadow-blue-900/20 shrink-0">
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
