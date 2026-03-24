import { GetConversationsType } from '@/app/schemas/messages'
import Image from 'next/image'
import React from 'react'

interface ConversationProps {
    conversation: GetConversationsType
    setActiveConversation: (val: number) => void

}

// Add a viewed field to the messages table so that when we get the last message from our queue we can check if you are the recipient and if it has been viewed
const ConversationCard = ({ conversation, setActiveConversation }: ConversationProps) => {
    const initial = conversation.recipient_display_name.substring(0, 1).toUpperCase()
    const isUnread = conversation.last_message_sender_id === conversation.recipient_user_id

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
                    <p className={`text-sm truncate ${isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>
                        {conversation.recipient_display_name.length >= 15 ? `${conversation.recipient_display_name.substring(0, 15)}...` : conversation.recipient_display_name}
                    </p>
                    {conversation.last_message_content && (
                        <p className={`text-xs truncate mt-0.5 ${isUnread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                            {conversation.last_message_content}
                        </p>
                    )}

                </div>
                <div>
                    {conversation.last_message_sent_at && (
                        <span className='text-xs text-muted-foreground shrink-0'>
                            {new Date(conversation.last_message_sent_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    )}
                </div>
            </div>
        </button>
    )
}

export default ConversationCard