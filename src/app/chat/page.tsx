import React from 'react';
import { getUserConversations } from '@/actions/chat.action';
import ChatClient from './ChatClient';

export const metadata = {
  title: 'Kotak Pesan | PushAja',
  description: 'Kotak pesan realtime PushAja untuk komunikasi aman antara klien dan freelancer.',
};

export default async function ChatPage() {
  const data = await getUserConversations();

  return (
    <ChatClient
      initialConversations={data.conversations}
      currentUser={data.currentUser}
      initialConversationId={data.conversations.length > 0 ? data.conversations[0].id : null}
    />
  );
}
