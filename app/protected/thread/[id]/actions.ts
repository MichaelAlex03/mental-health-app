'use server'

import { createClient } from "@/lib/supabase/server";
import type { CreateReplyInput } from "@/app/schemas/thread-replies";
import { insertThreadReplySchema } from "@/app/schemas/thread-replies";
import { redirect } from "next/navigation";
import { threadDetailsSchema } from "@/app/schemas/thread";

// Used for getting parent replies via cursor pagination not sub replies
export const getReplies = async (threadId: number, cursor: number) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();
    const limit = 20

    if (!user || !user.id) {
        redirect('/auth/login')
    }


    const { data, error } = await client.rpc('get_thread_replies', {
        p_thread_id: threadId,
        p_cursor: cursor,
        p_limit: limit
    })


    if (error) {
        throw error
    }

    const hasMore = data.length > limit

    return {
        data: hasMore ? data.slice(0, -1) : data,
        nextCursor: hasMore ? data[data.length - 2].id : -1
    }
}

//This function is for top level replies
export const createReply = async (reply: CreateReplyInput) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        redirect('/auth/login')
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


    if (error) {
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

// This function is used for any sub replies (depth 1-3)
export const createSubReply = async (reply: CreateReplyInput) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        redirect('/auth/login')
    }

    const newReply = { ...reply, user_id: user.id }
    const parsed = insertThreadReplySchema.safeParse(newReply)

    if (!parsed.success) {
        return {
            success: false as const,
            data: null,
            error: 'Invalid reply data'
        }
    }

    const { data: subReply, error } = await client
        .from('thread_replies')
        .insert(parsed.data)
        .select('*')
        .single()



    if (error) {
        return {
            success: false as const,
            data: null,
            error: 'Cannot create reply'
        }
    }

    const { data: userData, error: userError } = await client
        .from('user_profile')
        .select('display_name, avatar_url')
        .eq('user_id', subReply.user_id)
        .single()

    if (userError) {
        return {
            success: false as const,
            data: null,
            error: 'Cannot create reply'
        }
    }

    return {
        success: true as const,
        data: { ...subReply, ...userData },
        error: ''
    }
}

export const handleFetchSubReplies = async (parent_comment_id: number, threadId: number, cursor: number) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    const limit = 5
    if (!user || !user.id) {
        redirect('/auth/login')
    }

    const { data, error } = await client.rpc('get_thread_sub_replies', {
        p_thread_id: threadId,
        p_cursor: cursor,
        p_limit: limit,
        p_parent_comment_id: parent_comment_id
    })

    if (error) {
        return {
            success: false,
            data: null,
            error: 'Could not fetch replies',
            nextCursor: cursor
        }
    }

    const hasMore = data.length > limit

    return {
        success: true,
        data: hasMore ? data.slice(0, -1) : data,
        nextCursor: hasMore ? data[data.length - 2].id : -1,
        error: ''
    }

}


export const getThread = async (threadId: number) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        throw new Error('User does not exist')
    }


    const { data, error } = await client.rpc('get_thread_details', {
        thread_id_input: threadId
    })

    if (error) {
        throw error
    }

    const parsed = threadDetailsSchema.safeParse(data)

    if (!parsed.success) {
        throw new Error('Invalid thread data')
    }

    return parsed.data
}