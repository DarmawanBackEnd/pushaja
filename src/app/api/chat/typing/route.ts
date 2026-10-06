import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/actions/auth.action';
import { broadcastTyping } from '@/lib/chatBus';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const { conversationId, isTyping } = body;

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    const userId = session?.id || 'guest';

    broadcastTyping({
      conversationId,
      userId,
      isTyping: Boolean(isTyping),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
