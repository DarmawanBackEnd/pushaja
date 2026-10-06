'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentSession } from './auth.action';
import { broadcastMessage } from '@/lib/chatBus';

export interface ChatParticipant {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'freelancer' | 'admin';
  profilePicture?: string | null;
}

export interface ConversationSummary {
  id: string;
  otherUser: ChatParticipant;
  lastMessage?: string | null;
  lastMessageAt: string;
  unreadCount: number;
  orderId?: string | null;
  gigId?: string | null;
  gigTitle?: string | null;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  isRead: boolean;
  createdAt: string;
}

/**
 * Mendapatkan seluruh daftar percakapan aktif untuk pengguna yang sedang login.
 */
export async function getUserConversations(): Promise<{
  success: boolean;
  conversations: ConversationSummary[];
  currentUser: ChatParticipant;
}> {
  try {
    const session = await getCurrentSession();
    let currentUserId = session?.id;

    // Jika pengguna belum login (misal saat testing cepat), gunakan partisipan dari percakapan yang ada
    let currentUser: ChatParticipant;
    if (!currentUserId) {
      const existingConv = await prisma.conversation.findFirst({
        include: { userOne: true, userTwo: true },
        orderBy: { lastMessageAt: 'desc' },
      });

      if (existingConv) {
        currentUserId = existingConv.userOne.id;
        currentUser = {
          id: existingConv.userOne.id,
          name: existingConv.userOne.name,
          email: existingConv.userOne.email,
          role: existingConv.userOne.role as 'client' | 'freelancer',
          profilePicture: existingConv.userOne.profilePicture,
        };
      } else {
        const defaultUser = await prisma.user.findFirst();
        if (!defaultUser) {
          return {
            success: false,
            conversations: [],
            currentUser: { id: '', name: 'Pengguna', email: '', role: 'client' },
          };
        }
        currentUserId = defaultUser.id;
        currentUser = {
          id: defaultUser.id,
          name: defaultUser.name,
          email: defaultUser.email,
          role: defaultUser.role as 'client' | 'freelancer',
          profilePicture: defaultUser.profilePicture,
        };
      }
    } else {
      const dbUser = await prisma.user.findUnique({ where: { id: currentUserId } });
      currentUser = {
        id: dbUser?.id || currentUserId,
        name: dbUser?.name || session.name || 'Pengguna',
        email: dbUser?.email || session.email || '',
        role: (dbUser?.role || session.role || 'client') as 'client' | 'freelancer',
        profilePicture: dbUser?.profilePicture,
      };
    }

    // Ambil percakapan di mana pengguna adalah userOne atau userTwo
    let rawConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userOneId: currentUserId },
          { userTwoId: currentUserId },
        ],
      },
      include: {
        userOne: {
          select: { id: true, name: true, email: true, role: true, profilePicture: true },
        },
        userTwo: {
          select: { id: true, name: true, email: true, role: true, profilePicture: true },
        },
        gig: {
          select: { id: true, title: true },
        },
        order: {
          select: { id: true, status: true },
        },
        messages: {
          where: {
            receiverId: currentUserId,
            isRead: false,
          },
          select: { id: true },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    // Jika pengguna ini belum memiliki percakapan sama sekali, buatkan satu percakapan sambutan otomatis
    if (rawConversations.length === 0) {
      const partnerUser = await prisma.user.findFirst({
        where: { id: { not: currentUserId } },
      });

      if (partnerUser) {
        const newConv = await prisma.conversation.create({
          data: {
            userOneId: currentUserId,
            userTwoId: partnerUser.id,
            lastMessage: 'Halo! Selamat datang di Kotak Pesan PushAja. Ada yang bisa kami bantu seputar jasa dan proyek Anda?',
            lastMessageAt: new Date(),
          },
        });

        await prisma.message.create({
          data: {
            conversationId: newConv.id,
            senderId: partnerUser.id,
            receiverId: currentUserId,
            text: 'Halo! Selamat datang di Kotak Pesan PushAja. Ada yang bisa kami bantu seputar jasa dan proyek Anda?',
            isRead: false,
          },
        });

        // Ambil kembali percakapan yang baru dibuat
        rawConversations = await prisma.conversation.findMany({
          where: { id: newConv.id },
          include: {
            userOne: { select: { id: true, name: true, email: true, role: true, profilePicture: true } },
            userTwo: { select: { id: true, name: true, email: true, role: true, profilePicture: true } },
            gig: { select: { id: true, title: true } },
            order: { select: { id: true, status: true } },
            messages: { where: { receiverId: currentUserId, isRead: false }, select: { id: true } },
          },
        });
      }
    }

    const conversations: ConversationSummary[] = rawConversations.map((c) => {
      const isUserOne = c.userOneId === currentUserId;
      const other = isUserOne ? c.userTwo : c.userOne;

      return {
        id: c.id,
        otherUser: {
          id: other.id,
          name: other.name,
          email: other.email,
          role: other.role as 'client' | 'freelancer',
          profilePicture: other.profilePicture,
        },
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt.toISOString(),
        unreadCount: c.messages.length,
        orderId: c.orderId,
        gigId: c.gigId,
        gigTitle: c.gig?.title,
      };
    });

    return {
      success: true,
      conversations,
      currentUser,
    };
  } catch (error) {
    console.error('Gagal mengambil daftar percakapan:', error);
    return {
      success: false,
      conversations: [],
      currentUser: { id: '', name: 'Pengguna', email: '', role: 'client' },
    };
  }
}

/**
 * Mendapatkan detail percakapan beserta seluruh riwayat pesannya.
 */
export async function getConversationDetails(conversationId: string): Promise<{
  success: boolean;
  conversation?: any;
  messages: MessageItem[];
  otherUser?: ChatParticipant;
  currentUser?: ChatParticipant;
  error?: string;
}> {
  try {
    const session = await getCurrentSession();
    let currentUserId = session?.id;

    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        userOne: { select: { id: true, name: true, email: true, role: true, profilePicture: true } },
        userTwo: { select: { id: true, name: true, email: true, role: true, profilePicture: true } },
        gig: { select: { id: true, title: true, price: true } },
        order: { select: { id: true, status: true, totalAmount: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conv) {
      return { success: false, messages: [], error: 'Percakapan tidak ditemukan.' };
    }

    if (!currentUserId) {
      currentUserId = conv.userOneId;
    }

    const isUserOne = conv.userOneId === currentUserId;
    const other = isUserOne ? conv.userTwo : conv.userOne;
    const me = isUserOne ? conv.userOne : conv.userTwo;

    // Tandai pesan belum terbaca dari lawan bicara sebagai terbaca
    if (currentUserId) {
      await prisma.message.updateMany({
        where: {
          conversationId: conv.id,
          receiverId: currentUserId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
    }

    const formattedMessages: MessageItem[] = conv.messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      receiverId: m.receiverId,
      text: m.text,
      attachmentUrl: m.attachmentUrl,
      attachmentType: m.attachmentType,
      isRead: m.isRead,
      createdAt: m.createdAt.toISOString(),
    }));

    return {
      success: true,
      conversation: {
        id: conv.id,
        orderId: conv.orderId,
        gigId: conv.gigId,
        gigTitle: conv.gig?.title,
      },
      messages: formattedMessages,
      otherUser: {
        id: other.id,
        name: other.name,
        email: other.email,
        role: other.role as 'client' | 'freelancer',
        profilePicture: other.profilePicture,
      },
      currentUser: {
        id: me.id,
        name: me.name,
        email: me.email,
        role: me.role as 'client' | 'freelancer',
        profilePicture: me.profilePicture,
      },
    };
  } catch (error) {
    console.error('Gagal mengambil detail percakapan:', error);
    return { success: false, messages: [], error: 'Gagal memuat percakapan.' };
  }
}

/**
 * Mengirim pesan baru ke percakapan dan mem-broadcast secara realtime.
 */
export async function sendMessage(
  conversationId: string,
  text: string,
  attachmentUrl?: string | null,
  attachmentType?: string | null
): Promise<{ success: boolean; message?: MessageItem; error?: string }> {
  try {
    if (!text && !attachmentUrl) {
      return { success: false, error: 'Pesan tidak boleh kosong.' };
    }

    const session = await getCurrentSession();
    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        userOne: true,
        userTwo: true,
      },
    });

    if (!conv) {
      return { success: false, error: 'Percakapan tidak ditemukan.' };
    }

    let senderId = session?.id;
    if (!senderId) {
      // Fallback jika tidak ada sesi login, gunakan userOne
      senderId = conv.userOneId;
    }

    const receiverId = senderId === conv.userOneId ? conv.userTwoId : conv.userOneId;

    // 1. Simpan pesan baru ke database PostgreSQL
    const createdMessage = await prisma.message.create({
      data: {
        conversationId: conv.id,
        senderId,
        receiverId,
        text: text.trim(),
        attachmentUrl: attachmentUrl || null,
        attachmentType: attachmentType || null,
        isRead: false,
      },
    });

    // 2. Perbarui lastMessage pada tabel Conversation
    await prisma.conversation.update({
      where: { id: conv.id },
      data: {
        lastMessage: text.trim() || 'Mengirim lampiran',
        lastMessageAt: createdMessage.createdAt,
      },
    });

    const messageItem: MessageItem = {
      id: createdMessage.id,
      conversationId: createdMessage.conversationId,
      senderId: createdMessage.senderId,
      receiverId: createdMessage.receiverId,
      text: createdMessage.text,
      attachmentUrl: createdMessage.attachmentUrl,
      attachmentType: createdMessage.attachmentType,
      isRead: createdMessage.isRead,
      createdAt: createdMessage.createdAt.toISOString(),
    };

    // 3. Broadcast pesan secara realtime melalui event bus
    broadcastMessage({
      conversationId: conv.id,
      message: messageItem,
    });

    return {
      success: true,
      message: messageItem,
    };
  } catch (error) {
    console.error('Gagal mengirim pesan:', error);
    return { success: false, error: 'Terjadi kesalahan sistem saat mengirim pesan.' };
  }
}

/**
 * Mencari atau membuat percakapan baru dengan pengguna tertentu (misal dari tombol 'Chat Freelancer' di halaman Gig).
 */
export async function startConversationWithUser(
  targetUserId: string,
  gigId?: string,
  orderId?: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  try {
    const session = await getCurrentSession();
    let currentUserId = session?.id;

    if (!currentUserId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) return { success: false, error: 'Pengguna tidak ditemukan.' };
      currentUserId = defaultUser.id;
    }

    if (currentUserId === targetUserId) {
      return { success: false, error: 'Tidak dapat memulai percakapan dengan akun Anda sendiri.' };
    }

    // Cek apakah percakapan antara kedua pengguna sudah pernah dibuat
    let conv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { userOneId: currentUserId, userTwoId: targetUserId },
          { userOneId: targetUserId, userTwoId: currentUserId },
        ],
      },
    });

    if (!conv) {
      // Buat percakapan baru
      conv = await prisma.conversation.create({
        data: {
          userOneId: currentUserId,
          userTwoId: targetUserId,
          gigId: gigId || null,
          orderId: orderId || null,
          lastMessage: 'Percakapan baru dimulai',
          lastMessageAt: new Date(),
        },
      });
    }

    return {
      success: true,
      conversationId: conv.id,
    };
  } catch (error) {
    console.error('Gagal membuat percakapan:', error);
    return { success: false, error: 'Gagal membuka percakapan.' };
  }
}
