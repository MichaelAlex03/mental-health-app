import { createClient } from '@/lib/supabase/server'
import React from 'react'
import MyThreadsClient from './my-thread-client';
import { getThreads } from '../actions';

interface Props {
  searchParams: Promise<{ category?: string }>
}

const getCategories = async () => {
    const client = await createClient();

    const { data, error } = await client
        .from('categories')
        .select('*')

    if (error) {
        throw error
    }

    return data
}

const MyThreadFeed = async ({ searchParams }: Props) => {
    const [categories] = await Promise.all([
        getCategories()
    ])

    const params = await searchParams
    const categoryId = params?.category ? String(params.category) : undefined
    const { data: myThreads, nextCursor } = await getThreads(null)

    return <MyThreadsClient threads={myThreads} categories={categories} nextCursor={nextCursor}/>
}

export default MyThreadFeed