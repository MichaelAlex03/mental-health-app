'use client'

import { GetConversationsType } from '@/app/schemas/messages'
import Image from 'next/image'
import { useState, useEffect } from 'react'

function getRelativeTime(dateString: string): string {
    const now = Date.now()
    const then = new Date(dateString).getTime()
    const seconds = Math.floor((now - then) / 1000)

    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks}w ago`
    return ''
}

interface ConversationProps {
    conversation: GetConversationsType
    setActiveConversation: (val: number) => void

}

const ConversationCard = ({ conversation, setActiveConversation }: ConversationProps) => {
    const initial = conversation.recipient_display_name.substring(0, 1).toUpperCase()
    const isUnread = (conversation.last_message_sender_id === conversation.recipient_user_id) && (conversation.last_message_viewed === false);

    const [relativeTime, setRelativeTime] = useState(() =>
        conversation.last_message_sent_at ? getRelativeTime(conversation.last_message_sent_at) : ''
    )

    useEffect(() => {
        if (!conversation.last_message_sent_at) return
        setRelativeTime(getRelativeTime(conversation.last_message_sent_at))
        const interval = setInterval(() => {
            setRelativeTime(getRelativeTime(conversation.last_message_sent_at!))
        }, 60_000)
        return () => clearInterval(interval)
    }, [conversation.last_message_sent_at])

    return (
        <button type='button' onClick={() => setActiveConversation(conversation.conversation_id)} className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border last:border-b-0'>
            <div className='relative size-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden'>
                {conversation.recipient_avatar_url ? (
                    <Image
                        src={conversation.recipient_avatar_url}
                        alt={`${conversation.recipient_display_name}'s avatar`}
                        fill
                        className='object-cover'
                    />
                ) : (
                    <span className='text-sm font-semibold text-primary'>
                        {initial}
                    </span>
                )}
            </div>
            <div className='flex-1 flex flex-row min-w-0 justify-between'>
                <div className='flex flex-col items-start justify-between'>
                    <p className={`text-sm truncate font-medium text-foreground`}>
                        {conversation.recipient_display_name.length >= 15 ? `${conversation.recipient_display_name.substring(0, 15)}...` : conversation.recipient_display_name}
                    </p>
                    {conversation.last_message_content && (
                        <p className={`text-xs truncate mt-0.5 ${isUnread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                            {conversation.last_message_content}
                        </p>
                    )}

                </div>
                <div className='flex flex-col items-end'>
                    {conversation.last_message_sent_at && (
                        <>
                            <span className='text-xs text-muted-foreground shrink-0'>
                                {new Date(conversation.last_message_sent_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            {relativeTime && (
                                <span className='text-[10px] text-muted-foreground/70'>
                                    {relativeTime}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </button>
    )
}

export default ConversationCard