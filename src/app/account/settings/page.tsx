import React from 'react';
import { getUserProfile } from '@/actions/account.action';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export default async function AccountSettingsPage() {
  const profile = await getUserProfile();
  
  if (!profile) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pengaturan Akun</h1>
          <p className="text-slate-500 mt-2">Kelola profil, keamanan, dan preferensi akun Anda di sini.</p>
        </div>
        
        <SettingsClient initialProfile={profile} />
      </div>
    </div>
  );
}
