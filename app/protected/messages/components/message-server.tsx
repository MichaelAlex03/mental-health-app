import MessagesClient from './messages-client'
import { getConversations } from '../conversation_actions'
import { createClient } from '@/lib/supabase/server'

const MessageServerComponent = async () => {
    const client = await createClient()
    const { data: { user } } = await client.auth.getUser()

    if (!user || !user.id) {
        throw new Error('User does not exist')
    }

    const { validatedData: conversations, nextPage } = await getConversations(1)

    return (
        <MessagesClient conversations={conversations} nextPage={nextPage} currentUserId={user.id}/>
    )
}

export default MessageServerComponent