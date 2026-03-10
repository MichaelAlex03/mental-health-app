// Load in the initial 20 conversations

import { getConversationsSchema } from "@/app/schemas/messages";
import { createClient } from "@/lib/supabase/server";

// Use page based pagination

// After getting initial convos return the new page number

// Initial page will always be one

// When we have no more convos to fetch for make page equal to null

// Make sure we validate return from db just so we can ensure no bad data is sent

export const getConversations = async (page: number) => {

    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();
    
    if (!user || !user.id){
        throw new Error('User does not exist')
    }

    const userId = user.id;

    const limit = 20;
    const offset = (page - 1) * 20 // How many rows we skip (Initally 0)

    const { data, error } = await client.rpc('get_user_conversation', {
        p_user_id: userId,
        skip: offset
    })

    if (error){
        throw error
    }

    const conversations = getConversationsSchema.array().safeParse(data)

    if (!conversations.success){
        throw new Error('Invalid data returned')
    }

    const hasMore = data.length > limit
    const nextPage = hasMore ? page + 1 : null
    const convos = hasMore ? conversations.data.slice(0, -1) : conversations.data

    return {
        validatedData: convos,
        nextPage
    }
}