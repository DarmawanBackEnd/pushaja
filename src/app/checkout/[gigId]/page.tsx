import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/actions/auth.action';
import { redirect, notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Checkout & Pembayaran Rekber | PushAja',
  description: 'Selesaikan pemesanan jasa freelance secara aman dengan proteksi Rekber Escrow PushAja.',
};

export default async function CheckoutPage({ params }: { params: Promise<{ gigId: string }> }) {
  const resolvedParams = await params;
  const session = await getCurrentSession();

  if (!session || !session.id) {
    redirect(`/login?redirect=/checkout/${resolvedParams.gigId}`);
  }

  const gig = await prisma.gig.findUnique({
    where: { id: resolvedParams.gigId },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      freelancer: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePicture: true,
          isVerified: true,
        },
      },
    },
  });

  if (!gig) {
    notFound();
  }

  if (gig.freelancerId === session.id) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-3xl p-8">
            <h1 className="text-xl font-black mb-2">Tidak Dapat Memesan Jasa Sendiri</h1>
            <p className="text-sm text-slate-600 mb-6">
              Anda adalah pemilik jasa ini. Anda tidak dapat membuat pesanan ke akun Anda sendiri.
            </p>
            <a
              href={`/gigs/${gig.id}`}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#1E40AF] text-white text-sm font-bold hover:bg-blue-800 transition-colors"
            >
              Kembali ke Jasa
            </a>
          </div>
        </div>
      </div>
    );
  }

  const serializedGig = {
    ...gig,
    price: Number(gig.price),
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      <Navbar />
      <CheckoutClient gig={serializedGig} currentUser={session} />
    </div>
  );
}
