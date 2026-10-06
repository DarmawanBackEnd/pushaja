import React from 'react';
import { getUserConversations } from '@/actions/chat.action';
import ChatClient from '../ChatClient';

export const metadata = {
  title: 'Kotak Pesan | PushAja',
  description: 'Percakapan realtime PushAja dengan proteksi Escrow.',
};

export default async function ChatOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = await params;
  const data = await getUserConversations();

  // Cari apakah orderId cocok dengan ID percakapan atau referensi orderId di percakapan
  const matchedConversation = data.conversations.find(
    (c) => c.id === resolvedParams.orderId || c.orderId === resolvedParams.orderId
  );

  const activeId = matchedConversation ? matchedConversation.id : (data.conversations.length > 0 ? data.conversations[0].id : null);

  return (
    <ChatClient
      initialConversations={data.conversations}
      currentUser={data.currentUser}
      initialConversationId={activeId}
    />
  );
}
