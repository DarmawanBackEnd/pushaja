import React from 'react';
import { getCurrentSession } from '@/actions/auth.action';
import { getUserOrders } from '@/actions/order.action';
import { redirect } from 'next/navigation';
import FreelancerOrdersClient from './FreelancerOrdersClient';

export const metadata = {
  title: 'Pesanan Masuk | Dashboard Freelancer PushAja',
  description: 'Kelola pesanan dari klien, kirimkan hasil pengerjaan proyek, dan pantau penyelesaian pekerjaan.',
};

export default async function FreelancerOrdersPage() {
  const session = await getCurrentSession();

  if (!session || !session.id) {
    redirect('/login?redirect=/freelancer/dashboard/orders');
  }

  const res = await getUserOrders('freelancer');
  const orders = res.success ? (res.orders || []) : [];

  return <FreelancerOrdersClient orders={orders as any} />;
}
