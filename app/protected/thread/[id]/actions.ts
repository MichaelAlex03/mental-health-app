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

export const handleFetchSubReplies = async (parent_comment_id: number, threadId: number) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        redirect('/auth/login')
    }

    const { data, error } = await client
        .from('thread_replies')
        .select('*')
        
}


export const getThread = async (threadId: string) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        throw new Error('User does not exist')
    }

    const id = Number(threadId)

    const { data, error } = await client.rpc('get_thread_details', {
        thread_id_input: id
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