import { ServerThreadTopic } from "@/app/schemas/post";
import { FeedClient } from "./feed-client";
import { createClient } from "@/lib/supabase/server";
import { Category } from "@/app/schemas/categories";




async function fetchThreads(): Promise<ServerThreadTopic[]> {

  const client = await createClient()

  const { data, error } = await client
    .from('topic_threads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error){
    throw error
  }

  return data
}

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


export async function ThreadFeed() {
  const [threads, categories] = await Promise.all([
    fetchThreads(),
    fetchCategories(),
  ]);

  return <FeedClient threads={threads} categories={categories} />;
}
