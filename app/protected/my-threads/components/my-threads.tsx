import { createClient } from '@/lib/supabase/server'
import MyThreadsClient from './my-thread-client';
import { getThreads } from '../actions';


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

const MyThreadFeed = async ({ searchParams }: { searchParams: Promise<{ searchQuery?: string }> }) => {
    const [categories] = await Promise.all([
        getCategories()
    ])

    const params = await searchParams
    const searchData = params?.searchQuery ? params.searchQuery : null
    const { data: myThreads, nextCursor } = await getThreads(null, searchData)

    return <MyThreadsClient key={searchData} threads={myThreads} categories={categories} nextCursor={nextCursor} />
}

export default MyThreadFeed