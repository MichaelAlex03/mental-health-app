'use server'

import { createClient } from "@/lib/supabase/server";
import { threadDetailsSchema } from "@/app/schemas/thread";

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