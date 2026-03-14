import MessagesClient from './messages-client'
import { getConversations } from '../conversation_actions'

const MessageServerComponent = async () => {
    const { validatedData: conversations, nextPage } = await getConversations(1)

    return (
        <MessagesClient conversations={conversations} nextPage={nextPage}/>
    )
}

export default MessageServerComponent