"use client"

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getMessagesForConversations } from '../messages_actions'

interface MessageScreenProps {
    conversationId: number
}

const MessageScreen = ({ conversationId }: MessageScreenProps) => {
    const supabase = createClient();


    // Want cursor based pagination to avoid loading duplicate messages fetched
    const [messages, setMessages] = useState([] as any);
    const [cursor, setCursor] = useState<number | null>(null);
    const isFetchingRef = useRef(false);
    const sentinalRef = useRef<HTMLDivElement>(null)
    const [errors, setErrors] = useState<string>()

    /**  We add convoId to dependency because even when
     *   convoId is changed in parent this function wont
     *   rerender because it only depends on cursor state
     *   we could add a key property to the message screen
     *   component to make the entire component fully reset
     *   which includes the function
     * */
    const loadMore = useCallback(async () => {
        if (isFetchingRef.current || cursor === null) return;

        isFetchingRef.current = true

        try {
            const { messages: convoMessages, nextCursor } = await getMessagesForConversations(conversationId, cursor);
            setCursor(nextCursor)
            setMessages((prev: any) => [...prev, ...convoMessages])
        } catch (error) {
            setErrors(error as string)
        } finally {
            isFetchingRef.current = false
        }

    }, [cursor, conversationId])

    // Cleanup observer so observer is not observing unmounted component
    useEffect(() => {
        if (!sentinalRef.current) return
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore() },
            { threshold: 0.1 }
        )
        observer.observe(sentinalRef.current);
        return () => observer.disconnect()
    }, [loadMore])


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
                    console.log("message", payload)
                    setMessages((prev: any) => [...prev, payload.new])
                }
            )
        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId])

    return (
        <div>MessageScreen

            <div ref={sentinalRef} style={{ height: 1 }} />
        </div>

    )
}

export default MessageScreen