'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  ConversationSummary, 
  MessageItem, 
  ChatParticipant, 
  getConversationDetails, 
  sendMessage 
} from '@/actions/chat.action';
import { playSentSound, playReceivedSound } from '@/lib/chatSound';
import { 
  Search, 
  Send, 
  Check, 
  CheckCheck, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  MoreVertical, 
  ShieldCheck, 
  Clock, 
  User, 
  Paperclip,
  Smile,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface ChatClientProps {
  initialConversations: ConversationSummary[];
  currentUser: ChatParticipant;
  initialConversationId?: string | null;
}

export default function ChatClient({
  initialConversations,
  currentUser,
  initialConversationId,
}: ChatClientProps) {
  const [conversations, setConversations] = useState<ConversationSummary[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversationId || (initialConversations.length > 0 ? initialConversations[0].id : null)
  );

  const [activeOtherUser, setActiveOtherUser] = useState<ChatParticipant | null>(null);
  const [activeConvMeta, setActiveConvMeta] = useState<any>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Mobile responsive view: 'list' atau 'chat'
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingBroadcastRef = useRef<boolean>(false);

  // Auto-scroll ke pesan terbawah
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Muat detail pesan ketika percakapan aktif berubah
  useEffect(() => {
    if (!activeConversationId) return;

    let isMounted = true;
    setLoadingMessages(true);
    setIsOtherUserTyping(false);

    getConversationDetails(activeConversationId)
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          setMessages(res.messages);
          setActiveOtherUser(res.otherUser || null);
          setActiveConvMeta(res.conversation || null);

          // Reset unread counter di daftar percakapan
          setConversations((prev) =>
            prev.map((c) => (c.id === activeConversationId ? { ...c, unreadCount: 0 } : c))
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingMessages(false);
          setTimeout(() => scrollToBottom('auto'), 100);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeConversationId]);

  // Scroll otomatis ketika ada pesan baru
  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isOtherUserTyping]);

  // =========================================================================
  // REALTIME SYNCHRONIZATION VIA SERVER-SENT EVENTS (SSE)
  // =========================================================================
  useEffect(() => {
    if (!activeConversationId) return;

    const sseUrl = `/api/chat/stream?conversationId=${encodeURIComponent(
      activeConversationId
    )}&userId=${encodeURIComponent(currentUser.id)}`;

    const eventSource = new EventSource(sseUrl);

    // 1. Menerima Pesan Baru
    eventSource.addEventListener('message', (event) => {
      try {
        const payload = JSON.parse(event.data);
        const newMsg: MessageItem = payload.message;

        if (payload.conversationId === activeConversationId) {
          setMessages((prev) => {
            // Hindari duplikasi pesan jika sudah ada
            if (prev.some((m) => m.id === newMsg.id)) {
              return prev;
            }
            return [...prev, newMsg];
          });

          // Jika pesan dari lawan bicara
          if (newMsg.senderId !== currentUser.id) {
            setIsOtherUserTyping(false);
            if (isSoundEnabled) {
              playReceivedSound();
            }

            // Tandai langsung sebagai dibaca
            fetch('/api/chat/read', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ conversationId: activeConversationId }),
            }).catch(() => {});
          }
        }

        // Perbarui ringkasan di daftar percakapan kiri
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === payload.conversationId) {
              return {
                ...c,
                lastMessage: newMsg.text,
                lastMessageAt: newMsg.createdAt,
                unreadCount:
                  payload.conversationId === activeConversationId || newMsg.senderId === currentUser.id
                    ? 0
                    : c.unreadCount + 1,
              };
            }
            return c;
          })
        );
      } catch (err) {
        console.error('Error handling SSE message:', err);
      }
    });

    // 2. Menerima Status Mengetik (Typing Indicator)
    eventSource.addEventListener('typing', (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.conversationId === activeConversationId && payload.userId !== currentUser.id) {
          setIsOtherUserTyping(Boolean(payload.isTyping));
        }
      } catch (err) {
        // ignore
      }
    });

    // 3. Menerima Status Baca (Read Receipt / Centang Biru)
    eventSource.addEventListener('read', (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.conversationId === activeConversationId && payload.readerId !== currentUser.id) {
          // Lawan bicara telah membaca pesan kita -> update semua pesan kita menjadi isRead: true
          setMessages((prev) =>
            prev.map((m) => (m.senderId === currentUser.id ? { ...m, isRead: true } : m))
          );
        }
      } catch (err) {
        // ignore
      }
    });

    eventSource.onerror = () => {
      // EventSource otomatis mencoba menghubungkan kembali saat error
    };

    // Sinkronisasi berkala (fallback polling 4 detik) untuk memastikan konsistensi jika jaringan goyah
    const intervalPoll = setInterval(() => {
      getConversationDetails(activeConversationId).then((res) => {
        if (res.success && res.messages) {
          setMessages(res.messages);
        }
      });
    }, 4000);

    return () => {
      eventSource.close();
      clearInterval(intervalPoll);
    };
  }, [activeConversationId, currentUser.id, isSoundEnabled]);

  // =========================================================================
  // LOGIKA BROADCAST MENGETIK (TYPING INDICATOR)
  // =========================================================================
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);

    if (!activeConversationId) return;

    // Siarkan status mengetik aktif
    if (!isTypingBroadcastRef.current) {
      isTypingBroadcastRef.current = true;
      fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConversationId, isTyping: true }),
      }).catch(() => {});
    }

    // Debounce reset status mengetik setelah 1.5 detik tidak ada ketikan
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingBroadcastRef.current = false;
      fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConversationId, isTyping: false }),
      }).catch(() => {});
    }, 1500);
  };

  // =========================================================================
  // LOGIKA PENGIRIMAN PESAN
  // =========================================================================
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeConversationId || !inputText.trim() || sending) return;

    const textToSend = inputText.trim();
    setInputText('');

    // Reset status mengetik
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    isTypingBroadcastRef.current = false;
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: activeConversationId, isTyping: false }),
    }).catch(() => {});

    // Mainkan suara nada terkirim
    if (isSoundEnabled) {
      playSentSound();
    }

    // Pembaruan optimistik (Optimistic Update) di antarmuka
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: MessageItem = {
      id: tempId,
      conversationId: activeConversationId,
      senderId: currentUser.id,
      receiverId: activeOtherUser?.id || '',
      text: textToSend,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // Perbarui sidebar secara instan
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, lastMessage: textToSend, lastMessageAt: new Date().toISOString() }
          : c
      )
    );

    setSending(true);
    try {
      const res = await sendMessage(activeConversationId, textToSend);
      if (res.success && res.message) {
        // Ganti pesan optimistik dengan data resmi dari database
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? res.message! : m))
        );
      }
    } catch (err) {
      console.error('Gagal mengirim pesan:', err);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter percakapan di sidebar
  const filteredConversations = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.lastMessage && c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format jam / waktu pesan
  const formatMessageTime = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '';
    }
  };

  // Format tanggal kelompok pesan
  const formatGroupDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (d.toDateString() === today.toDateString()) {
        return 'HARI INI';
      }
      if (d.toDateString() === yesterday.toDateString()) {
        return 'KEMARIN';
      }
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return 'HARI INI';
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col selection:bg-[#A3E635] selection:text-[#1E40AF] overflow-hidden">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto flex h-[calc(100vh-80px)] border-t border-slate-200/80 bg-white shadow-xl overflow-hidden">
        
        {/* ==================================================================
            SIDEBAR KIRI: DAFTAR PERCAKAPAN (WHATSAPP INBOX LIST)
           ================================================================== */}
        <aside 
          className={`w-full md:w-[350px] lg:w-[420px] bg-white border-r border-slate-200 flex flex-col h-full shrink-0 ${
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header Sidebar */}
          <div className="h-[76px] bg-white px-5 flex items-center justify-between shrink-0 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-[#1E40AF]/10 border border-[#1E40AF]/20 flex items-center justify-center font-black text-[#1E40AF] overflow-hidden shadow-sm">
                  {currentUser.profilePicture ? (
                    <img src={currentUser.profilePicture} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentUser.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#A3E635] border-2 border-white rounded-full"></span>
              </div>
              
              <div>
                <h2 className="font-black text-slate-900 text-sm leading-tight flex items-center gap-2">
                  Kotak Pesan
                  <span className="text-[10px] bg-[#A3E635]/30 text-[#1E40AF] font-black px-2 py-0.5 rounded-full border border-[#A3E635]/40">
                    Realtime
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-semibold">{currentUser.name}</p>
              </div>
            </div>

            {/* Tombol Kontrol Suara Notifikasi */}
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              title={isSoundEnabled ? 'Suara Notifikasi Aktif' : 'Suara Notifikasi Dibisukan'}
              className={`p-2.5 rounded-xl border transition-all ${
                isSoundEnabled
                  ? 'bg-blue-50/70 border-blue-200 text-[#1E40AF] hover:bg-blue-100'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
            >
              {isSoundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Kolom Pencarian Percakapan */}
          <div className="p-3.5 bg-white border-b border-slate-100 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-3.5 py-2.5 gap-2.5 focus-within:border-[#1E40AF] focus-within:ring-2 focus-within:ring-[#1E40AF]/10 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pesan atau kontak..." 
                className="bg-transparent border-none focus:outline-none text-xs sm:text-sm w-full font-medium text-slate-800 placeholder-slate-400" 
              />
            </div>
          </div>

          {/* Daftar Percakapan */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-3 text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-semibold">Belum ada percakapan</p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isActive = c.id === activeConversationId;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveConversationId(c.id);
                      setMobileView('chat');
                    }}
                    className={`flex items-center gap-3.5 px-4 py-3.5 cursor-pointer transition-all border-l-4 group ${
                      isActive
                        ? 'bg-blue-50/70 border-[#1E40AF] shadow-sm'
                        : 'border-transparent hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Avatar Kontak */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-black text-slate-700 overflow-hidden shadow-sm">
                        {c.otherUser.profilePicture ? (
                          <img src={c.otherUser.profilePicture} alt={c.otherUser.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{c.otherUser.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#A3E635] border-2 border-white rounded-full"></span>
                    </div>

                    {/* Info Kontak & Pesan Terakhir */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-extrabold text-slate-900 text-sm truncate">
                          {c.otherUser.name}
                        </h4>
                        <span className={`text-[11px] font-semibold shrink-0 ${
                          isActive ? 'text-[#1E40AF] font-bold' : 'text-slate-400'
                        }`}>
                          {formatMessageTime(c.lastMessageAt)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <p className="text-xs text-slate-500 font-medium truncate">
                          {c.lastMessage || 'Mulai percakapan...'}
                        </p>
                        
                        {/* Badge Pesan Belum Terbaca */}
                        {c.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-[#1E40AF] text-[#A3E635] rounded-full flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm animate-pulse">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ==================================================================
            PANEL KANAN: JENDELA PERCAKAPAN AKTIF ALA WHATSAPP
           ================================================================== */}
        <section 
          className={`flex-1 flex flex-col bg-[#F8FAFC] relative h-full min-w-0 ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversationId && activeOtherUser ? (
            <>
              {/* Header Percakapan Aktif */}
              <div className="h-[76px] bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 border-b border-slate-200/80 shadow-sm relative z-20">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Tombol Kembali di Mobile */}
                  <button 
                    onClick={() => setMobileView('list')}
                    className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 md:hidden"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Avatar & Identitas */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1E40AF] to-indigo-900 text-white flex items-center justify-center font-black overflow-hidden shadow-sm">
                      {activeOtherUser.profilePicture ? (
                        <img src={activeOtherUser.profilePicture} alt={activeOtherUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{activeOtherUser.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#A3E635] border-2 border-white rounded-full"></span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight truncate">
                      {activeOtherUser.name}
                    </h3>
                    
                    {/* Status Online atau Indikator Mengetik */}
                    <div className="flex items-center gap-1.5 text-xs font-bold mt-0.5">
                      {isOtherUserTyping ? (
                        <span className="text-[#1E40AF] animate-pulse flex items-center gap-1 font-extrabold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF] animate-ping"></span>
                          sedang mengetik...
                        </span>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badge Perlindungan Escrow & Informasi Tambahan */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[#1E40AF] text-xs font-black shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1E40AF]" />
                    Rekber Escrow Terlindungi
                  </div>

                  {activeConvMeta?.gigTitle && (
                    <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#1E40AF] text-xs font-bold border border-blue-200 max-w-[200px] truncate">
                      <Sparkles className="w-3.5 h-3.5 text-[#A3E635] shrink-0" />
                      <span className="truncate">{activeConvMeta.gigTitle}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Area Pesan Chat (Scrollable Feed) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4 relative z-10 flex flex-col">
                
                {/* Pemisah Tanggal Hari Ini */}
                <div className="flex justify-center my-2">
                  <span className="bg-white/90 backdrop-blur-xs border border-slate-200/60 text-slate-400 px-4 py-1 rounded-full text-[10px] font-black tracking-widest shadow-xs">
                    HARI INI
                  </span>
                </div>

                {loadingMessages ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-[#1E40AF] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                    <MessageSquare className="w-12 h-12 text-slate-300 stroke-[1.5]" />
                    <p className="text-xs sm:text-sm font-semibold">Kirim pesan pertama Anda untuk memulai obrolan</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderId === currentUser.id;

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[70%] transition-all ${
                          isMe ? 'self-end items-end' : 'self-start items-start'
                        }`}
                      >
                        {/* Bubble Chat */}
                        <div
                          className={`relative px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
                            isMe
                              ? 'bg-[#1E40AF] text-white rounded-tr-xs shadow-blue-900/10'
                              : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/70 shadow-slate-200/50'
                          }`}
                        >
                          <p className="pr-12">{m.text}</p>

                          {/* Info Waktu & Centang Status (WhatsApp Style) */}
                          <div
                            className={`flex items-center gap-1 text-[10px] absolute bottom-1.5 right-2.5 font-semibold ${
                              isMe ? 'text-blue-200' : 'text-slate-400'
                            }`}
                          >
                            <span>{formatMessageTime(m.createdAt)}</span>

                            {/* Centang Status untuk Pesan Keluar */}
                            {isMe && (
                              <span title={m.isRead ? 'Sudah Dibaca' : 'Terkirim'}>
                                {m.isRead ? (
                                  // Centang Ganda Lime/Emerald: Dibaca (Blue tick ala WhatsApp)
                                  <CheckCheck className="w-3.5 h-3.5 text-[#A3E635]" />
                                ) : (
                                  // Centang Ganda Putih/Abu: Terkirim
                                  <CheckCheck className="w-3.5 h-3.5 text-blue-200/80" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Indikator Mengetik Bouncing Dots (Typing Bubble) */}
                {isOtherUserTyping && (
                  <div className="self-start flex items-center gap-1.5 bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-xs shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Area Input Chat (Bottom Bar) */}
              <div className="bg-white px-4 sm:px-6 py-3.5 flex items-center gap-2 sm:gap-3 shrink-0 relative z-20 border-t border-slate-200/80 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.06)]">
                
                {/* Tombol Lampiran */}
                <button
                  type="button"
                  title="Lampirkan file atau dokumen"
                  className="p-2.5 rounded-full text-slate-400 hover:text-[#1E40AF] hover:bg-blue-50 transition-colors shrink-0"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Input Textarea Auto-expand */}
                <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-[#1E40AF] focus-within:ring-2 focus-within:ring-[#1E40AF]/15 transition-all flex items-center px-3 py-1">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ketik pesan Anda... (Tekan Enter untuk kirim)"
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 resize-none max-h-32 py-2.5"
                  />
                  <button
                    type="button"
                    title="Sisipkan emoji"
                    className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors shrink-0"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                {/* Tombol Kirim */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || sending}
                  className="bg-[#1E40AF] text-white w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl hover:bg-blue-800 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-md shadow-blue-900/20 shrink-0 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </div>
            </>
          ) : (
            /* Tampilan jika belum ada percakapan yang dipilih */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 text-slate-400">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-[#1E40AF] border border-blue-100 shadow-sm">
                <MessageSquare className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="font-black text-slate-800 text-lg">Pilih Percakapan</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Pilih salah satu kontak di sisi kiri untuk mulai berkirim pesan secara realtime.
                </p>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
