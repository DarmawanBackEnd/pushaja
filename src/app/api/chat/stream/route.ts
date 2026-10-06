import { NextRequest } from 'next/server';
import { chatBus, RealtimeMessagePayload, RealtimeTypingPayload, RealtimeReadPayload } from '@/lib/chatBus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId');
  const userId = searchParams.get('userId');

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Kirim event ping awal konfirmasi koneksi SSE berhasil
      controller.enqueue(encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: 'connected', timestamp: Date.now() })}\n\n`));

      // 1. Listener Pesan Baru
      const messageListener = (payload: RealtimeMessagePayload) => {
        try {
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(payload)}\n\n`));
        } catch {
          // Stream mungkin sudah ditutup klien
        }
      };

      // 2. Listener Indikator Mengetik (Typing)
      const typingListener = (payload: RealtimeTypingPayload) => {
        try {
          controller.enqueue(encoder.encode(`event: typing\ndata: ${JSON.stringify(payload)}\n\n`));
        } catch {
          // ignore
        }
      };

      // 3. Listener Status Baca (Read Receipt / Centang Biru)
      const readListener = (payload: RealtimeReadPayload) => {
        try {
          controller.enqueue(encoder.encode(`event: read\ndata: ${JSON.stringify(payload)}\n\n`));
        } catch {
          // ignore
        }
      };

      // Daftarkan listener ke channel yang relevan
      if (conversationId) {
        chatBus.on(`message:${conversationId}`, messageListener);
        chatBus.on(`typing:${conversationId}`, typingListener);
        chatBus.on(`read:${conversationId}`, readListener);
      }

      if (userId) {
        chatBus.on(`inbox:${userId}`, messageListener);
      }

      // Keep-alive heartbeat setiap 15 detik agar koneksi HTTP tidak terputus timeout proxy
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(heartbeatInterval);
        }
      }, 15000);

      // Bersihkan listener saat klien memutus koneksi
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        if (conversationId) {
          chatBus.off(`message:${conversationId}`, messageListener);
          chatBus.off(`typing:${conversationId}`, typingListener);
          chatBus.off(`read:${conversationId}`, readListener);
        }
        if (userId) {
          chatBus.off(`inbox:${userId}`, messageListener);
        }
        try {
          controller.close();
        } catch {
          // Stream already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Menghindari buffering pada Nginx jika dideploy
    },
  });
}
