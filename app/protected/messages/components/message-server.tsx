import MessagesClient from './messages-client'
import { getConversations } from '../conversation_actions'
import { createClient } from '@/lib/supabase/server'

const MessageServerComponent = async () => {
    const client = await createClient()
    const { data: { user } } = await client.auth.getUser()

    if (!user || !user.id) {
        throw new Error('User does not exist')
    }

    const { validatedData: conversations } = await getConversations()

    return (
        <MessagesClient key={conversations.length} conversations={conversations} currentUserId={user.id}/>
    )
}

export default MessageServerComponent