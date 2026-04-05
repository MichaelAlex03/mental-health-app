'use server'

import { createClient } from "@/lib/supabase/server";
import type { CreateReplyInput } from "@/app/schemas/thread-replies";
import { insertThreadReplySchema } from "@/app/schemas/thread-replies";

// Used for getting parent replies not sub replies
export const getReplies = async (threadId: number, cursor: number) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();
    const limit = 20

    if (!user || !user.id) {
        throw new Error('User does not exist')
    }

    const { data, error } = await client
        .from('thread_replies')
        .select('*')
        .eq('thread_id', threadId)
        .is('parent_comment_id', null)
        .lt('id', cursor)
        .order('id', { ascending: false })
        .limit(limit + 1)


    if (error) {
        throw error
    }

    const hasMore = data.length > limit

    return {
        data: hasMore ? data.slice(0, -1) : data,
        nextCursor: hasMore ? data[data.length - 1].id : null
    }
}

export const createReply = async (reply: CreateReplyInput) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        throw new Error('User does not exist')
    }

    const newReply = { ...reply, user_id: user.id }
    const parsed = insertThreadReplySchema.safeParse(newReply)

    if (!parsed.success) {
        return {
            success: false,
            error: 'Invalid reply data'
        }
    }

    const { error } = await client
        .from('thread_replies')
        .insert(parsed.data)

    if (error){
        return {
            success: false,
            error: 'Cannot create reply'
        }
    }

    return {
        success: true,
        error: ''
    }
}