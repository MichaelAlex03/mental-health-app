"use server"

import { MessageType, sendMessageSchema, SendMessageType } from "@/app/schemas/messages";
import { createClient } from "@/lib/supabase/server"

export const getMessagesForConversations = async (conversationId: number, cursor: number | null) => {
    const client = await createClient();
    const limit = 20;

    let query = client
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('id', { ascending: false })
        .limit(limit + 1)

    if (cursor) {
        query = query.gt('id', cursor)
    }

    const { data, error } = await query;

    if (error) {
        throw new Error('Unable to fetch messages')
    }

    const hasMore = data.length > limit
    const messages = hasMore ? data.slice(0, -1) : data

    return {
        messages,
        nextCursor: hasMore ? messages[messages.length - 1].id : null
    }

}

export const sendMessage = async (createMessage: SendMessageType) => {
    const client = await createClient();

    const validMessage = sendMessageSchema.safeParse(createMessage);

    if (!validMessage.success) {
        return {
            success: false,
            data: null,
            error: 'Invalid Message'
        }
    }

    const { data: message, error } = await client
        .from('messages')
        .insert(createMessage)
        .select()
        .single()

    if (error) {
        return {
            success: false,
            data: null,
            error: 'Could not send message'
        }
    }


    return {
        success: true,
        data: message,
        error: 'No error'
    }
}

export const markMessagesAsRead = async (message: MessageType) => {
    const client = await createClient()

    const { error } = await client
        .from('messages')
        .update({ viewed: true })
        .eq("conversation_id", message.conversation_id)
        .eq("recipient_id", message.recipient_id)
        .eq("viewed", false)
    
    if (error){
        return {
            success: false,
            error: 'Unable to mark messages as read'
        }
    }

    return {
        success: true,
        error: ''
    }
}