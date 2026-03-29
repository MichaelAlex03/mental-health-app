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

    if (error){
        throw error
    }

    const hasMore = data.length > limit
    const joinedThreads = hasMore ? data.slice(0, -1) : data

    return {
        joinedThreads,
        nextPage: hasMore ? page + 1 : null
    }






}