"use client"

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface MessageScreenProps {
    conversationId: number
}

const MessageScreen = ({ conversationId }: MessageScreenProps) => {
    const supabase = createClient();


    // Want cursor based pagination to avoid loading duplicate messages
    const [messages, SetMessages] = useState([] as any);
    const [cursor, setCursor] = useState<number | null>(null);

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
                    SetMessages((prev: any) => [...prev, payload.new])
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