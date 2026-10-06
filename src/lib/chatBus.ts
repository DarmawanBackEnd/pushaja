import { EventEmitter } from 'events';

// Global EventEmitter singleton untuk broadcast realtime antar request di Next.js Node.js runtime
declare global {
  // eslint-disable-next-line no-var
  var __chatBus: EventEmitter | undefined;
}

if (!globalThis.__chatBus) {
  globalThis.__chatBus = new EventEmitter();
  // Set listener limit tinggi agar banyak tab/klien bisa mendengarkan secara bersamaan
  globalThis.__chatBus.setMaxListeners(200);
}

export const chatBus = globalThis.__chatBus;

export interface RealtimeMessagePayload {
  conversationId: string;
  message: {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    text: string;
    attachmentUrl?: string | null;
    attachmentType?: string | null;
    isRead: boolean;
    createdAt: string;
  };
}

export interface RealtimeTypingPayload {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface RealtimeReadPayload {
  conversationId: string;
  readerId: string;
}

export function broadcastMessage(payload: RealtimeMessagePayload) {
  chatBus.emit(`message:${payload.conversationId}`, payload);
  chatBus.emit(`inbox:${payload.message.receiverId}`, payload);
}

export function broadcastTyping(payload: RealtimeTypingPayload) {
  chatBus.emit(`typing:${payload.conversationId}`, payload);
}

export function broadcastRead(payload: RealtimeReadPayload) {
  chatBus.emit(`read:${payload.conversationId}`, payload);
}
