"use client"

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { getMessagesForConversations } from '../messages_actions'

interface MessageScreenProps {
    conversationId: number
}

const MessageScreen = ({ conversationId }: MessageScreenProps) => {
    const supabase = createClient();


    // Want cursor based pagination to avoid loading duplicate messages fetched
    const [messages, setMessages] = useState([] as any);
    const [cursor, setCursor] = useState<number | null>(null);


    // Fetching messages on mount
    useEffect(() => {
        const fetchMessage = async () => {
            const { messages: convoMessages, nextCursor } = await getMessagesForConversations(conversationId, null);
            setMessages(convoMessages)
            setCursor(nextCursor)
        }
        fetchMessage();
    }, [conversationId])

    // Establishing connection to conversation websocket
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
                    setMessages((prev: any) => [...prev, payload.new])
                }
            )
        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId])

    return (
        <div>MessageScreen</div>
    )
}

export default MessageScreen