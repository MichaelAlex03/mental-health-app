"use server"

import { sendMessageSchema, SendMessageType } from "@/app/schemas/messages";
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

    if(!validMessage.success){
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

    if (error){
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