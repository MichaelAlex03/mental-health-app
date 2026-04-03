import { createClient } from "@/lib/supabase/server"

export const getJoinedThreads = async (page: number) => {

    const client = await createClient();
    const { data: { user } } = await client.auth.getUser()

    if (!user || !user.id) {
        throw new Error('User does not exist')
    }

    const userId = user.id

    const limit = 20;
    const offset = (page * limit)

    const { data, error } = await client
        .from('user_to_topics')
        .select('*, topic_threads!inner(*)')
        .eq('user_id', userId)
        .range(offset, offset + limit + 1)

    if (error) {
        throw error
    }

    const hasMore = data.length > limit
    const joinedThreads = hasMore ? data.slice(0, -1) : data

    return {
        joinedThreads,
        nextPage: hasMore ? page + 1 : null
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