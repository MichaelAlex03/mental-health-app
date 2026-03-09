import React from 'react'
import { getConversations } from '../actions'
import MessagesClient from './messages-client'

const MessageServerComponent = async () => {
    const { data: conversations } = await getConversations(1)

    return (
        <MessagesClient />
    )
}

export default MessageServerComponent