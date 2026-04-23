import { FeedClient } from "./feed-client";
import { createClient } from "@/lib/supabase/server";
import { Category } from "@/app/schemas/categories";
import { getThreads } from "../actions";



async function fetchCategories(): Promise<Category[]> {
  const client = await createClient();
  const { data, error } = await client
    .from('categories')
    .select('*')

  if (error) {
    throw error
  }

  return data

}

interface Props {
  searchParams: Promise<{ category?: string, cursor?: string, searchQuery?: string }>
}


export async function ThreadFeed({ searchParams }: Props) {

  const params = await searchParams
  const categoryId = params?.category ? Number(params.category) : undefined
  const searchData = params?.searchQuery ? params.searchQuery : null
  const { data: initialPosts, nextCursor } = await getThreads(null, searchData, categoryId)


  const [ categories] = await Promise.all([
    fetchCategories(),
  ]);

  return <FeedClient key={categoryId} threads={initialPosts} categories={categories} nextCursor={nextCursor} />;
}
