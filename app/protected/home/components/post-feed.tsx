import { ServerThreadTopic, serverTopicThreadSchema } from "@/app/schemas/post";
import { FeedClient } from "./feed-client";
import { createClient } from "@/lib/supabase/server";
import { Category } from "@/app/schemas/categories";




async function fetchPosts(): Promise<ServerThreadTopic[]> {

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


export async function PostFeed() {
  const [posts, categories] = await Promise.all([
    fetchPosts(),
    fetchCategories(),
  ]);
  return <FeedClient posts={posts} categories={categories} />;
}
