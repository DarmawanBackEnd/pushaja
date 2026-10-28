'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentSession } from './auth.action';
import { revalidatePath } from 'next/cache';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { broadcastMessage } from '@/lib/chatBus';

// Helper untuk menyimpan file hasil pengerjaan (Deliverables)
async function saveDeliverableFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'deliverables');
  await fs.mkdir(uploadDir, { recursive: true });
  
  const originalExt = path.extname(file.name) || '.zip';
  const safeFilename = `deliverable_${crypto.randomUUID()}${originalExt}`;
  const filepath = path.join(uploadDir, safeFilename);
  
  await fs.writeFile(filepath, buffer);
  return `/uploads/deliverables/${safeFilename}`;
}

/**
 * 1. CHECKOUT & BUAT PESANAN BARU (CLIENT)
 * Dana langsung diamankan di Rekber Escrow PushAja.
 */
export async function createCheckoutOrder(formData: FormData) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.id) {
      return { success: false, error: 'Silakan masuk ke akun Anda terlebih dahulu untuk memesan jasa.' };
    }

    const gigId = formData.get('gigId') as string;
    const notes = (formData.get('notes') as string || '').trim();
    const paymentMethod = (formData.get('paymentMethod') as string || 'bca_va').trim();

    if (!gigId) {
      return { success: false, error: 'ID Jasa wajib disertakan.' };
    }

    // Ambil detail Gig dari database
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      include: {
        freelancer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!gig) {
      return { success: false, error: 'Jasa freelance tidak ditemukan atau sudah tidak aktif.' };
    }

    if (gig.freelancerId === session.id) {
      return { success: false, error: 'Anda tidak dapat memesan jasa yang Anda buat sendiri.' };
    }

    // Hitung estimasi tanggal selesai berdasarkan deliveryDays
    const deliveryDays = gig.deliveryDays || 3;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + deliveryDays);

    // 1. Buat record Order di database dengan status on_progress (Escrow Terlindungi)
    const order = await prisma.order.create({
      data: {
        gigId: gig.id,
        clientId: session.id,
        freelancerId: gig.freelancerId,
        totalAmount: gig.price,
        status: 'on_progress',
        dueDate,
        notes: notes || null,
      } as any,
    });

    // 2. Buat record Payment dengan status success (Dana tersimpan di Escrow PushAja)
    const transactionId = `TXN-PA-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
    await prisma.payment.create({
      data: {
        orderId: order.id,
        paymentMethod,
        amount: gig.price,
        status: 'success',
        transactionId,
      },
    });

    // 3. Buat atau hubungkan percakapan chat realtime untuk pesanan ini
    let conv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { userOneId: session.id, userTwoId: gig.freelancerId },
          { userOneId: gig.freelancerId, userTwoId: session.id },
        ],
      },
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          userOneId: session.id,
          userTwoId: gig.freelancerId,
          gigId: gig.id,
          orderId: order.id,
          lastMessage: `Pesanan baru #${order.id.substring(0, 8)} telah dibuat.`,
          lastMessageAt: new Date(),
        },
      });
    } else {
      await prisma.conversation.update({
        where: { id: conv.id },
        data: {
          orderId: order.id,
          lastMessage: `Pesanan baru #${order.id.substring(0, 8)} telah dibuat.`,
          lastMessageAt: new Date(),
        },
      });
    }

    // Kirim pesan sistem otomatis di ruang obrolan
    const sysMsg = await prisma.message.create({
      data: {
        conversationId: conv.id,
        senderId: session.id,
        receiverId: gig.freelancerId,
        text: `Halo! Saya telah memesan jasa "${gig.title}" dengan nomor pesanan #${order.id.substring(0, 8)}. Dana telah diamankan di Rekber Escrow PushAja. Catatan pesanan: ${notes || '-'}.`,
        isRead: false,
      },
    });

    broadcastMessage({
      conversationId: conv.id,
      message: {
        id: sysMsg.id,
        conversationId: sysMsg.conversationId,
        senderId: sysMsg.senderId,
        receiverId: sysMsg.receiverId,
        text: sysMsg.text,
        isRead: false,
        createdAt: sysMsg.createdAt.toISOString(),
      },
    });

    revalidatePath('/orders');
    revalidatePath(`/orders/${order.id}`);
    revalidatePath('/freelancer/dashboard');
    revalidatePath('/chat');

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error('Gagal membuat pesanan checkout:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan sistem saat memproses checkout.' };
  }
}

/**
 * 2. MENGAMBIL DETAIL PESANAN LENGKAP
 */
export async function getOrderDetails(orderId: string) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.id) {
      return { success: false, error: 'Silakan masuk terlebih dahulu.' };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        gig: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
        client: {
          select: { id: true, name: true, email: true, phone: true, profilePicture: true },
        },
        freelancer: {
          select: { id: true, name: true, email: true, phone: true, profilePicture: true, isVerified: true },
        },
        payment: true,
        deliverables: {
          orderBy: { submittedAt: 'desc' },
        },
        reviews: true,
      },
    });

    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }

    // Otorisasi: hanya klien pemesan, freelancer penerima, atau admin/moderator yang boleh melihat
    const isClient = order.clientId === session.id;
    const isFreelancer = order.freelancerId === session.id;
    const isAdmin = session.role === 'superadmin' || session.role === 'moderator';

    if (!isClient && !isFreelancer && !isAdmin) {
      return { success: false, error: 'Anda tidak memiliki hak akses untuk melihat pesanan ini.' };
    }

    // Cari percakapan terkait pesanan ini
    const conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { orderId: order.id },
          {
            AND: [
              { userOneId: order.clientId, userTwoId: order.freelancerId },
            ],
          },
          {
            AND: [
              { userOneId: order.freelancerId, userTwoId: order.clientId },
            ],
          },
        ],
      },
      select: { id: true },
    });

    return {
      success: true,
      data: {
        ...order,
        createdAt: (order as any).createdAt || order.dueDate || new Date(),
        totalAmount: Number(order.totalAmount),
        isClient,
        isFreelancer,
        isAdmin,
        conversationId: conversation?.id || null,
        currentUserId: session.id,
      },
    };
  } catch (error: any) {
    console.error('Gagal mengambil detail pesanan:', error);
    return { success: false, error: 'Gagal memuat detail pesanan.' };
  }
}

/**
 * 3. FREELANCER MENGIRIM HASIL PEKERJAAN (DELIVERABLE SUBMISSION)
 * Mengubah status Order menjadi 'in_review'.
 */
export async function deliverWork(formData: FormData) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.id) {
      return { success: false, error: 'Silakan masuk ke akun Anda.' };
    }

    const orderId = formData.get('orderId') as string;
    const message = (formData.get('message') as string || '').trim();
    const externalLink = (formData.get('externalLink') as string || '').trim();
    const file = formData.get('file') as File | null;

    if (!orderId) {
      return { success: false, error: 'ID Pesanan wajib disertakan.' };
    }

    if (!message) {
      return { success: false, error: 'Mohon sertakan pesan penjelasan hasil kerja untuk klien.' };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { client: true, freelancer: true },
    });

    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }

    if (order.freelancerId !== session.id) {
      return { success: false, error: 'Hanya freelancer yang ditunjuk yang dapat mengirim hasil pekerjaan.' };
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
      return { success: false, error: `Pesanan sudah berstatus ${order.status} dan tidak dapat diubah lagi.` };
    }

    // Proses upload berkas atau link eksternal
    let filePath = externalLink;
    if (file && typeof file === 'object' && file.size > 0) {
      filePath = await saveDeliverableFile(file);
    }

    if (!filePath) {
      return { success: false, error: 'Mohon unggah file hasil kerja atau cantumkan tautan link hasil proyek.' };
    }

    // 1. Buat record Deliverable
    const deliverable = await prisma.deliverable.create({
      data: {
        orderId: order.id,
        filePath,
        message,
        submittedAt: new Date(),
      },
    });

    // 2. Perbarui status Order menjadi in_review
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'in_review',
      },
    });

    // 3. Kirim notifikasi chat ke Klien
    const conv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { orderId: order.id },
          { userOneId: order.clientId, userTwoId: order.freelancerId },
          { userOneId: order.freelancerId, userTwoId: order.clientId },
        ],
      },
    });

    if (conv) {
      const chatMsg = await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderId: session.id,
          receiverId: order.clientId,
          text: `Halo ${order.client.name}! Saya telah mengirimkan hasil akhir pekerjaan untuk pesanan #${order.id.substring(0, 8)}. Silakan tinjau dan evaluasi hasilnya di halaman pesanan. Catatan: "${message}".`,
          attachmentUrl: filePath.startsWith('/uploads/') ? filePath : null,
          attachmentType: 'deliverable',
          isRead: false,
        },
      });

      broadcastMessage({
        conversationId: conv.id,
        message: {
          id: chatMsg.id,
          conversationId: chatMsg.conversationId,
          senderId: chatMsg.senderId,
          receiverId: chatMsg.receiverId,
          text: chatMsg.text,
          attachmentUrl: chatMsg.attachmentUrl,
          attachmentType: 'deliverable',
          isRead: false,
          createdAt: chatMsg.createdAt.toISOString(),
        },
      });
    }

    revalidatePath(`/orders/${order.id}`);
    revalidatePath('/orders');
    revalidatePath('/freelancer/dashboard');

    return { success: true, deliverable };
  } catch (error: any) {
    console.error('Gagal mengirim hasil kerja:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan sistem saat mengirimkan hasil kerja.' };
  }
}

/**
 * 4. KLIEN MENYETUJUI HASIL & MEMBERIKAN ULASAN BINTANG (ORDER APPROVAL)
 * Mengubah status Order menjadi 'completed', mencairkan dana ke saldo freelancer, dan menyimpan ulasan.
 */
export async function approveOrderAndReview(orderId: string, rating: number, comment: string) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.id) {
      return { success: false, error: 'Silakan masuk ke akun Anda.' };
    }

    if (!rating || rating < 1 || rating > 5) {
      return { success: false, error: 'Rating ulasan harus antara 1 sampai 5 bintang.' };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { client: true, freelancer: true, gig: true },
    });

    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }

    if (order.clientId !== session.id) {
      return { success: false, error: 'Hanya klien pemesan yang berhak menyetujui penyelesaian pesanan.' };
    }

    if (order.status === 'completed') {
      return { success: false, error: 'Pesanan ini sudah pernah disetujui sebelumnya.' };
    }

    // 1. Update status pesanan menjadi completed
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'completed',
      },
    });

    // 2. Cairkan dana dari Escrow ke saldo dompet Freelancer
    await prisma.user.update({
      where: { id: order.freelancerId },
      data: {
        balance: {
          increment: order.totalAmount,
        },
      },
    });

    // 3. Simpan ulasan dan rating
    const review = await prisma.review.create({
      data: {
        orderId: order.id,
        clientId: order.clientId,
        freelancerId: order.freelancerId,
        rating: Math.round(rating),
        comment: comment?.trim() || null,
      },
    });

    // 4. Kirim notifikasi chat ke Freelancer
    const conv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { orderId: order.id },
          { userOneId: order.clientId, userTwoId: order.freelancerId },
          { userOneId: order.freelancerId, userTwoId: order.clientId },
        ],
      },
    });

    if (conv) {
      const chatMsg = await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderId: session.id,
          receiverId: order.freelancerId,
          text: `Selamat! Klien telah MENYETUJUI hasil pekerjaan pesanan #${order.id.substring(0, 8)}. Dana transaksi sebesar Rp ${Number(order.totalAmount).toLocaleString('id-ID')} telah berhasil dicairkan ke saldo akun Anda. Klien memberikan rating ${rating} bintang!`,
          isRead: false,
        },
      });

      broadcastMessage({
        conversationId: conv.id,
        message: {
          id: chatMsg.id,
          conversationId: chatMsg.conversationId,
          senderId: chatMsg.senderId,
          receiverId: chatMsg.receiverId,
          text: chatMsg.text,
          isRead: false,
          createdAt: chatMsg.createdAt.toISOString(),
        },
      });
    }

    revalidatePath(`/orders/${order.id}`);
    revalidatePath('/orders');
    revalidatePath('/freelancer/dashboard');
    revalidatePath('/freelancer/dashboard/earnings');
    revalidatePath('/freelancer/dashboard/reviews');

    return { success: true, review };
  } catch (error: any) {
    console.error('Gagal menyetujui pesanan:', error);
    return { success: false, error: error.message || 'Gagal menyelesaikan pesanan.' };
  }
}

/**
 * 5. KLIEN MEMINTA REVISI HASIL PEKERJAAN
 * Mengembalikan status Order ke 'on_progress' dengan catatan revisi.
 */
export async function requestRevision(orderId: string, revisionNotes: string) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.id) {
      return { success: false, error: 'Silakan masuk ke akun Anda.' };
    }

    const cleanNotes = (revisionNotes || '').trim();
    if (!cleanNotes) {
      return { success: false, error: 'Mohon sertakan rincian perbaikan/revisi yang diinginkan.' };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { client: true, freelancer: true },
    });

    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }

    if (order.clientId !== session.id) {
      return { success: false, error: 'Hanya klien pemesan yang berhak mengajukan revisi.' };
    }

    if (order.status !== 'in_review') {
      return { success: false, error: 'Revisi hanya dapat diajukan saat freelancer telah mengirimkan hasil kerja (status: Dalam Evaluasi).' };
    }

    // Update status order kembali ke on_progress
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'on_progress',
      },
    });

    // Kirim notifikasi chat ke Freelancer
    const conv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { orderId: order.id },
          { userOneId: order.clientId, userTwoId: order.freelancerId },
          { userOneId: order.freelancerId, userTwoId: order.clientId },
        ],
      },
    });

    if (conv) {
      const chatMsg = await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderId: session.id,
          receiverId: order.freelancerId,
          text: `PERMINTAAN REVISI PESANAN #${order.id.substring(0, 8)}:\n"${cleanNotes}"\nStatus pesanan dikembalikan ke pengerjaan. Mohon perbaiki dan kirimkan kembali hasilnya jika sudah selesai.`,
          isRead: false,
        },
      });

      broadcastMessage({
        conversationId: conv.id,
        message: {
          id: chatMsg.id,
          conversationId: chatMsg.conversationId,
          senderId: chatMsg.senderId,
          receiverId: chatMsg.receiverId,
          text: chatMsg.text,
          isRead: false,
          createdAt: chatMsg.createdAt.toISOString(),
        },
      });
    }

    revalidatePath(`/orders/${order.id}`);
    revalidatePath('/orders');
    revalidatePath('/freelancer/dashboard');

    return { success: true };
  } catch (error: any) {
    console.error('Gagal mengajukan revisi:', error);
    return { success: false, error: error.message || 'Gagal mengajukan revisi.' };
  }
}

/**
 * 6. MENDAPATKAN DAFTAR PESANAN PENGGUNA (UNTUK HALAMAN /orders ATAU DASHBOARD FREELANCER)
 */
export async function getUserOrders(type: 'client' | 'freelancer' = 'client') {
  try {
    const session = await getCurrentSession();
    if (!session || !session.id) {
      return { success: false, error: 'Silakan masuk ke akun Anda.' };
    }

    const whereClause = type === 'freelancer' 
      ? { freelancerId: session.id } 
      : { clientId: session.id };

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        gig: {
          select: { id: true, title: true, imageUrl: true, deliveryDays: true },
        },
        client: {
          select: { id: true, name: true, profilePicture: true },
        },
        freelancer: {
          select: { id: true, name: true, profilePicture: true, isVerified: true },
        },
        payment: { select: { status: true, paymentMethod: true } },
        deliverables: { select: { id: true, submittedAt: true } },
        reviews: { select: { rating: true, comment: true } },
      },
      orderBy: { id: 'desc' } as any,
    });

    const formattedOrders = orders.map((o: any) => ({
      ...o,
      createdAt: o.createdAt || o.dueDate || new Date(),
      totalAmount: Number(o.totalAmount),
    }));

    return { success: true, orders: formattedOrders };
  } catch (error: any) {
    console.error('Gagal mengambil daftar pesanan:', error);
    return { success: false, orders: [] };
  }
}
