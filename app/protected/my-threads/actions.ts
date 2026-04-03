'use server'

import { createClient } from "@/lib/supabase/server";

export const getThreads = async (cursor: number | null) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();
    const limit = 10

    if (!user || !user.id) {
        throw new Error('User does not exist')
    }

    let query = client
        .from('topic_threads')
        .select('*')
        .eq('created_by', user.id)
        .order('id', { ascending: false })
        .limit(limit + 1)


    if (cursor) {
        query = query.lt('id', cursor)
    }

    const { data, error } = await query

    if (error) {
        throw error
    }

    const hasMore = data.length > limit

    return {
        data: hasMore ? data.slice(0, -1) : data,
        nextCursor: hasMore ? data[data.length - 1].id : null
    }
}

export const getThread = async (threadId: string) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        throw new Error('User does not exist')
    }

    const id = Number(threadId)

    const [threadResult, membersResult, repliesResult] = await Promise.all([
        client
            .from('topic_threads')
            .select('*, categories(category_name)')
            .eq('id', id)
            .single(),
        client
            .from('user_to_topics')
            .select('user_id')
            .eq('topic_id', id)

        ,
        client
            .from('thread_replies')
            .select('*')
            .eq('thread_id', id)
            .is('parent_comment_id', null)
            .order('created_at', { ascending: true })
            .limit(20)
    ])

    if (threadResult.error) {
        throw threadResult.error
    }

    if (membersResult.error) {
        throw membersResult.error
    }

    if (repliesResult.error) {
        throw repliesResult.error
    }

    const userIds = membersResult.data.map(m => m.user_id)
    const { data: profiles, error: profilesError } = await client
        .from('user_profile')
        .select('avatar_url, display_name')
        .in('id', userIds)

    return {
        thread: threadResult.data,
        members: profiles,
        replies: repliesResult.data
    }
}