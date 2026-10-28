import React from 'react';
import { getOrderDetails } from '@/actions/order.action';
import { notFound, redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import OrderClient from './OrderClient';
import { getCurrentSession } from '@/actions/auth.action';

export const metadata = {
  title: 'Kelola Pesanan | PushAja',
  description: 'Pantau status pengerjaan, kirim deliverable hasil kerja, evaluasi dan selesaikan pesanan.',
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getCurrentSession();

  if (!session || !session.id) {
    redirect(`/login?redirect=/orders/${resolvedParams.id}`);
  }

  const res = await getOrderDetails(resolvedParams.id);

  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      <Navbar />
      <OrderClient order={res.data as any} />
    </div>
  );
}
