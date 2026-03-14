"use server"

import { createClient } from "@/lib/supabase/server"

export const getMessagesForConversations = async (conversationId: number, cursor: number | null) => {
    const client = await createClient();
    const limit = 20;

    let query = client
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .limit(limit + 1)

    if (cursor) {
        query = query.gt('id', cursor)
    }

    const { data, error } = await query;

    if (error) {
        throw error
    }

    const hasMore = data.length > limit
    const messages = hasMore ? data.slice(0, -1) : data

    return {
        messages,
        nextCursor: hasMore ? messages[messages.length - 1].id : null
    }

}

export const createMessage = async (createMessage: any) => {
    
}