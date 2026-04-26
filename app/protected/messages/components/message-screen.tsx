"use client"

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getMessagesForConversations, markMessagesAsRead, sendMessage } from '../messages_actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Send } from 'lucide-react'
import { MessageType, SendMessageType } from '@/app/schemas/messages'
import Image from 'next/image'

interface MessageScreenProps {
    conversationId: number
    recipientName: string
    recipientAvatarUrl: string | null
    currentUserId: string
    recipientUserId: string
    onBack?: () => void
}

const supabase = createClient();

const MessageScreen = ({
    conversationId,
    recipientName,
    recipientAvatarUrl,
    currentUserId,
    recipientUserId,
    onBack,
}: MessageScreenProps) => {


    const [messages, setMessages] = useState<MessageType[]>([]);
    const [cursor, setCursor] = useState<number | null>(null);
    const isFetchingRef = useRef(false);
    const sentinalRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [errors, setErrors] = useState<string>('')
    const [messageInput, setMessageInput] = useState('')

    const initial = recipientName.substring(0, 1).toUpperCase()

    const loadMore = useCallback(async () => {
        if (isFetchingRef.current || cursor === null) return;

        isFetchingRef.current = true

        try {
            const { messages: convoMessages, nextCursor } = await getMessagesForConversations(conversationId, cursor);
            setCursor(nextCursor)
            setMessages((prev: MessageType[]) => [...prev, ...convoMessages])
        } catch (error) {
            setErrors(error as string)
        } finally {
            isFetchingRef.current = false
        }

    }, [cursor, conversationId])

    useEffect(() => {
        if (!sentinalRef.current) return
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore() },
            { threshold: 0.1 }
        )
        observer.observe(sentinalRef.current);
        return () => observer.disconnect()
    }, [loadMore])

    useEffect(() => {
        const fetchMessage = async () => {
            const { messages: convoMessages, nextCursor } = await getMessagesForConversations(conversationId, null);
            setMessages(convoMessages)
            setCursor(nextCursor)
        }
        fetchMessage();
    }, [conversationId])

    // Payload.new is the row that was just inserted into the messages table
    useEffect(() => {
        const channel = supabase
            .channel(`conversation-${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    setMessages((prev: MessageType[]) => [payload.new as MessageType, ...prev])
                }
            )
            .on(
                'postgres_changes',
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    const message = payload.new as MessageType
                    setMessages(prev => prev.map((m) => (
                        m.id === message.id ? { ...m, viewed: true, viewed_at: message.viewed_at } : m
                    )))
                }
            )
            .subscribe()
        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId])


    // UseEffect for marking messages as read
    useEffect(() => {
        const markReadMessages = async () => {
            const unreadMessage = messages.find(m => m.viewed === false);
            if (unreadMessage) {
                const result = await markMessagesAsRead(unreadMessage);
                if (!result.success) {
                    setErrors(result.error)
                }
            }
        }
        markReadMessages();

    }, [messages])

    const handleSend = async () => {
        if (!messageInput.trim()) return
        const body: SendMessageType = {
            content: messageInput,
            recipient_id: recipientUserId,
            sender_id: currentUserId,
            conversation_id: conversationId,
        }

        const sendMessageResult = await sendMessage(body);

        if (!sendMessageResult.success) {
            setErrors(sendMessageResult.error);
            return
        }

        setMessageInput('')
        setErrors('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
        })
    }

    return (
        <div className="flex-1 flex flex-col min-w-0">
            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                {onBack && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        onClick={onBack}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                )}
                <div className="relative size-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {recipientAvatarUrl ? (
                        <Image
                            src={recipientAvatarUrl}
                            alt={`${recipientName}'s avatar`}
                            className="object-cover"
                            fill
                        />
                    ) : (
                        <span className="text-sm font-semibold text-primary">
                            {initial}
                        </span>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{recipientName}</p>
                </div>
            </div>

            {/* ── Messages area ── */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto px-4 py-4 flex flex-col-reverse gap-1"
            >
                {(() => {
                    const lastOwnIndex = messages.findIndex(m => m.sender_id === currentUserId);
                    return messages.map((msg: MessageType, i) => {
                        const isOwn = msg.sender_id === currentUserId

                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${isOwn
                                        ? 'bg-primary text-primary-foreground rounded-br-md'
                                        : 'bg-muted text-foreground rounded-bl-md'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                    {msg.sent_at && (
                                        <p
                                            className={`text-[10px] mt-1 ${isOwn
                                                ? 'text-primary-foreground/60'
                                                : 'text-muted-foreground'
                                                }`}
                                        >
                                            {formatTime(msg.sent_at)}
                                        </p>
                                    )}
                                </div>
                                {i === lastOwnIndex && msg.viewed === true && (
                                    <p className="text-[10px] text-muted-foreground mt-0.5 px-1">
                                        Seen {formatTime(msg.viewed_at ?? '')}
                                    </p>
                                )}
                            </div>
                        )
                    })
                })()}

                {/* Sentinel for infinite scroll (loads older messages) */}
                <div ref={sentinalRef} className="h-px shrink-0" />
            </div>

            {/* ── Input bar ── */}
            <div className="flex items-center gap-2 p-3 border-t border-border">
                <div className="flex-1">
                    <Input
                        placeholder="Type a message..."
                        className="h-10 rounded-xl bg-muted text-sm"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <Button
                    size="icon"
                    className="size-10 shrink-0 rounded-xl"
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                >
                    <Send className="size-4" />
                </Button>
            </div>
            {errors && (
                <p className="px-3 pb-2 text-xs text-destructive">{errors}</p>
            )}
        </div>
    )
}

export default MessageScreen
