'use server'

import { CreateThreadTopicInput, createTopicThreadSchema } from "@/app/schemas/thread";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
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

    const body = {
        ...validatedThread.data,
        created_by: userId,
        is_full: false,
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


    revalidatePath('/protected/home')
    revalidatePath('/protected/my-threads')
    return {
        success: true,
    }


}

export const getThreads = async (cursor: number | null, categoryId?: number) => {

    const client = await createClient()
    const limit = 10;

    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        redirect('/auth/login')
    }

    const userId = user.id

    const { data: joined, error: joinedError } = await client
        .from('user_to_topics')
        .select('topic_id')
        .eq('user_id', userId)
    
    if (joinedError){
        throw joinedError
    }

    const joinedIds = (joined ?? []).map(r => r.topic_id)

    let query = client
        .from('topic_threads')
        .select('*')
        .neq("created_by", userId)
        .eq('is_full', false)
        .order('id', { ascending: false })
        .limit(limit + 1)

    if (cursor) {
        query = query.lt('id', cursor)
    }

    if (categoryId) {
        query = query.eq('category_id', categoryId)
    }

    if (joinedIds.length > 0){
        query = query.not('id', 'in', `(${joinedIds.join(',')})`)
    }


    const { data, error } = await query

    if (error) {
        throw error
    }

    const hasMore = data.length > limit
    const nextCursor = hasMore ? data[data.length - 1].id : null

    return {
        data: hasMore ? data.slice(0, -1) : data,
        nextCursor: nextCursor
    }

}

export const joinThreadTopic = async (threadId: number) => {
    if (!threadId) {
        return {
            success: false,
            error: "No threadId given"
        }
    }

    const client = await createClient();

    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        redirect('/auth/login')
    }

    const userId = user.id

    // Add a check to double check thread is full because data is not strongly consistent so it can appear as not full when it is

    const { error } = await client
        .from('user_to_topics')
        .insert({
            topic_id: threadId,
            user_id: userId
        })

    if (error) {
        return {
            success: false,
            error: "Could not join group"
        }
    }

    revalidatePath('/protected/home')
    revalidatePath('/protected/joined-threads')
    
    return {
        success: true,
        error: ""
    }
}