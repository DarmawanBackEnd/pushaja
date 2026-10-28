import React from 'react';
import { getCurrentSession } from '@/actions/auth.action';
import { getUserOrders } from '@/actions/order.action';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import OrdersListClient from './OrdersListClient';

export const metadata = {
  title: 'Pesanan Saya | PushAja',
  description: 'Kelola dan pantau seluruh transaksi pesanan jasa freelance Anda di PushAja.',
};

export default async function ClientOrdersPage() {
  const session = await getCurrentSession();

  if (!session || !session.id) {
    redirect('/login?redirect=/orders');
  }

  const res = await getUserOrders('client');
  const orders = res.success ? (res.orders || []) : [];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      <Navbar />
      <OrdersListClient orders={orders as any} />
    </div>
  );
}
