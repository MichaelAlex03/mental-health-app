import { GetConversationsType } from '@/app/schemas/messages'
import Image from 'next/image'
import React from 'react'

interface ConversationProps {
    conversation: GetConversationsType
}

const ConversationCard = ({ conversation }: ConversationProps) => {
    return (
        <div className='flex flex-row'>
            <div className='rounded-full'>
                {/* <Image
                    src={conversation.recipient_avatar_url}
                    alt='avatar_url'
                    fill
                /> */}
            </div>
            <div className='flex flex-col'>
                <p className='text-xl text-white'>{conversation.recipient_display_name}</p>
                <p className={conversation.last_message_sender_id === conversation.recipient_user_id ? "text-bold text-base text-white" : 'text-base text-white'}>
                    {conversation.last_message_content}
                </p>
            </div>
        </div>
    )
}

export default ConversationCard