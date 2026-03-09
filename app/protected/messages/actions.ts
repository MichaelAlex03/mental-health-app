import { getConversationsSchema } from "@/app/schemas/messages";
import { createClient } from "@/lib/supabase/server"
import { skip } from "node:test";


export const getConversations = async (page: number) => {

    const client = await createClient();
    const { data: { user }} = await client.auth.getUser()

    if (!user || !user.id){
        throw new Error('User does not exist')
    }

    const userId = user.id

    const limit = 20
    const offset = (page - 1) * limit;

    const { data, error } = await client.rpc('get_user_conversation', {
        p_user_id: userId,
        skip: offset
    })

    if (error){
        throw error
    }

    const validatedConversations = getConversationsSchema.safeParse(data)

    if (!validatedConversations.success){
        throw new Error('Invalid data returned')
    }

    return validatedConversations.data
}