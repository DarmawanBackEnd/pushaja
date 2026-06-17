import React from 'react';
import { getCurrentSession } from '@/actions/auth.action';
import { 
  getDashboardStats, 
  getPendingGigs, 
  getActiveDisputes, 
  getModerators, 
  getUnverifiedFreelancers, 
  getCategoriesList, 
  getCategoryGroups,
  getUsersList 
} from '@/actions/admin.action';
import DashboardClient from './DashboardClient';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  // 1. Verifikasi Sesi Aktif Superadmin/Moderator (Secure Backend Check)
  const session = await getCurrentSession();
  const isAuthorized = session && (session.role === 'superadmin' || session.role === 'moderator');

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#A3E635] selection:text-[#1E40AF]">
        {/* Ornamen Pendar Cahaya */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-20%] w-[450px] h-[450px] rounded-full bg-rose-500/10 blur-[130px]"></div>
          <div className="absolute bottom-[-15%] left-[-15%] w-[400px] h-[400px] rounded-full bg-[#1E40AF]/10 blur-[120px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-md bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-10 rounded-[2.5rem] shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
            <svg className="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <title>Dilarang Masuk</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Akses Ditolak</h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
            Halaman ini dilindungi sistem keamanan pushaja. Anda harus masuk menggunakan akun **Superadmin** untuk mengakses metrik kontrol panel ini.
          </p>
          <div className="pt-2">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E40AF] to-indigo-700 px-8 py-3.5 text-xs font-black text-white hover:brightness-110 shadow-lg active:scale-95 transition-all text-center"
            >
              Masuk Akun Admin 
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <title>Panah</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Jika diotorisasi, ambil data real dari database PostgreSQL
  const stats = await getDashboardStats();
  const pendingGigs = await getPendingGigs();
  const activeDisputes = await getActiveDisputes();
  const unverifiedFreelancers = await getUnverifiedFreelancers();
  const categoriesList = await getCategoriesList();
  const categoryGroupsList = await getCategoryGroups();
  const usersList = await getUsersList();

  // Hanya Superadmin yang boleh mengambil data Moderator
  let moderators: any[] = [];
  if (session.role === 'superadmin') {
    moderators = await getModerators();
  }

  return (
    <DashboardClient 
      session={session} 
      initialStats={stats} 
      initialPendingGigs={pendingGigs} 
      initialDisputes={activeDisputes}
      initialModerators={moderators}
      initialUnverified={unverifiedFreelancers}
      initialCategories={categoriesList}
      initialCategoryGroups={categoryGroupsList}
      initialUsers={usersList}
    />
  );
}
