import { GetConversationsType } from '@/app/schemas/messages'
import React from 'react'

interface ConversationProps {
    conversation: GetConversationsType
}

const ConversationCards = ({ conversation }: ConversationProps) => {
    return (
        <div>ConversationCards</div>
    )
}

export default ConversationCards