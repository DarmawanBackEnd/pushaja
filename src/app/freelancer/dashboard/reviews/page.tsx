import React from 'react';
import { getFreelancerReviews } from '@/actions/freelancer.gig.action';
import Image from 'next/image';

export default async function FreelancerReviewsPage() {
  const reviewsRes = await getFreelancerReviews();

  if (!reviewsRes.success) {
    return (
      <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-100">
        <h3 className="font-bold text-lg">Akses Ditolak</h3>
        <p className="mt-1">{reviewsRes.error}</p>
      </div>
    );
  }

  const reviews = reviewsRes.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Ulasan & Reputasi</h2>
        <p className="text-slate-500 mt-2 font-medium">Lihat apa kata klien tentang hasil kerja Anda.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </div>
          <h3 className="text-lg font-black text-slate-800">Belum Ada Ulasan</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Selesaikan pesanan dari klien untuk mulai mendapatkan ulasan dan membangun reputasi Anda!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review: any) => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200 shrink-0">
                    {review.client.profilePicture ? (
                      <Image src={review.client.profilePicture} alt={review.client.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold bg-slate-200">
                        {review.client.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{review.client.name}</h4>
                    <p className="text-xs text-slate-400 font-semibold line-clamp-1">{review.order?.gig?.title}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic bg-slate-50 p-4 rounded-2xl">
                "{review.comment || 'Tidak ada komentar tertulis.'}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
