'use server'

import { CreateThreadTopicInput, createTopicThreadSchema } from "@/app/schemas/post";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export const createTopicThread = async (thread: CreateThreadTopicInput) => {

    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        redirect('/auth/login')
    }

    const userId = user.id

    const validatedThread = createTopicThreadSchema.safeParse(thread)

    if (!validatedThread.success) {
        return {
            success: false,
            error: 'Invalid data input for thread creation'
        }
    }

    let body = {
        ...validatedThread.data,
        created_by: userId,
        is_full: false,
        member_count: 1
    }

    const { error } = await client
        .from('topic_threads')
        .insert(body)

    if (error) {
        return {
            success: false,
            error: 'Could not create new thread'
        }
    }

    return {
        success: true,
    }


}

export const getThreads = async (cursor: number | null, categoryId?: number) => {

    const client = await createClient()
    const limit = 10

    let query = client
        .from('topic_threads')
        .select('*')
        .order('id', { ascending: true })
        .limit(limit + 1)

    if (cursor) {
        query = query.gt('id', cursor)
    }

    if (categoryId) {
        query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query;
    if (error) {
        throw error
    }

    const hasMore = data.length > limit
    const trimmed = hasMore ? data.slice(0, -1) : data;

    return {
        data: trimmed,
        nextCursor: hasMore ? trimmed[trimmed.length - 1].id : null
    }

}