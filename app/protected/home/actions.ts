'use server'

import { CreateThreadTopicInput, createTopicThreadSchema } from "@/app/schemas/post";
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

    revalidatePath('/protected/home')
    revalidatePath('/protected/my-threads')
    return {
        success: true,
    }


}

export const getThreads = async (cursor: number | null, categoryId?: number) => {

    const client = createClient()
    const limit = 10;

    let query = (await client).from('topic_threads').select('*').order('id', {ascending: true}).limit(limit + 1)

    if (cursor){
        query = query.gt('id', cursor)
    }

    if(categoryId){
        query = query.eq('category_id', categoryId)
    }

    const { data, error  } = await query

    if(error){
        throw error
    }

    const hasMore = data.length > limit
    const nextCursor = hasMore ? data[data.length - 1].id : null

    return {
        data: hasMore ? data.slice(0, -1) : data,
        nextCursor: nextCursor
    }
        
}