import React from 'react';
import { getFreelancerGigs } from '@/actions/freelancer.gig.action';
import { getCategoriesList } from '@/actions/admin.action';
import GigsClient from './GigsClient';

export default async function FreelancerGigsPage() {
  const gigsRes = await getFreelancerGigs();
  const categories = await getCategoriesList();

  if (!gigsRes.success) {
    return (
      <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-100">
        <h3 className="font-bold text-lg">Akses Ditolak</h3>
        <p className="mt-1">{gigsRes.error}</p>
      </div>
    );
  }

  const gigs = gigsRes.data!.map(gig => ({
    ...gig,
    price: Number(gig.price)
  }));

  return (
    <div className="animate-in fade-in duration-300">
      <GigsClient initialGigs={gigs} categories={categories} />
    </div>
  );
}
