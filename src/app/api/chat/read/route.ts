import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/actions/auth.action';
import { prisma } from '@/lib/prisma';
import { broadcastRead } from '@/lib/chatBus';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    const currentUserId = session?.id;

    if (currentUserId) {
      // Tandai semua pesan yang diterima pengguna saat ini di percakapan ini sebagai sudah dibaca
      await prisma.message.updateMany({
        where: {
          conversationId,
          receiverId: currentUserId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      broadcastRead({
        conversationId,
        readerId: currentUserId,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
