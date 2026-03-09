'use server'

import { createClient } from "@/lib/supabase/server";

export const getThreads = async (cursor: number | null) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();
    const limit = 10

    if (!user || !user.id) {
        throw new Error('User does not exist')
    }

    let query =  client
        .from('topic_threads')
        .select('*')
        .eq('created_by', user.id)
        .limit(limit + 1)

    if (cursor){
        query = query.gt('id', cursor)
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