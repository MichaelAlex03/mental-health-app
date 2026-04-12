"use server"

import { getConversationsSchema } from "@/app/schemas/messages";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** For this server action we throw since we are calling from a server component
 *  so if it cant fetch the conversations we want the error page to show up
 *  */
export const getConversations = async () => {

    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        throw new Error('User does not exist')
    }

    const userId = user.id;


    const { data, error } = await client.rpc('get_conversations_for_user', {
        p_user_id: userId,
    })

    if (error) {
        throw error
    }

    const conversations = getConversationsSchema.array().safeParse(data)

    if (!conversations.success) {
        throw new Error('Invalid data returned')
    }

    return {
        validatedData: conversations.data,

    }
}

/**
 * We are returning errors in this server action because the main content can still be 
 * loaded and we can handle the error on the client gracefully
 * NOTE *** For redirects in nextjs they throw an error so we need to catch it 
 * on the frontend and throw it again so the redirect can happen
 */
export const createConversastion = async (recipientDisplayName: string) => {

    const client = await createClient();
    const { data: { user } } = await client.auth.getUser()

    if (!user || !user.id) {
        redirect('/auth/sign-in')
    }

    const userId = user.id;

    //Cannot make a conversatuion with yourself
    const { data: userData, error: userError } = await client
        .from('user_profile')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (userError){
        return {
            success: false,
            error: 'could not fetch current user data'
        }
    }

    if (userData.display_name === recipientDisplayName){
        return {
            success: false,
            error: "cannot create a conversation with yourself"
        }
    }

    // Get recipients user_id by display_name
    const { data: recipientData, error: recipientError } = await client
        .from('user_profile')
        .select('user_id')
        .eq('display_name', recipientDisplayName)

    if (!recipientData || recipientData.length === 0) {
        return {
            success: false,
            error: 'Could not find display name'
        }
    }

    if (recipientError) {
        return {
            success: false,
            error: 'Could not fetch recipients data'
        }
    }

    // Create the conversation row
    const { data: conversationData, error: conversationError } = await client
        .from('conversations')
        .insert({})
        .select()
        .single()

    if (conversationError) {
        return {
            success: false,
            error: 'Could not create conversation'
        }
    }


    // Create the conversation_members_row
    const { error: membersError } = await client
        .from('conversation_members')
        .insert([{ user_id: userId, conversation_id: conversationData.id },
        { user_id: recipientData[0].user_id, conversation_id: conversationData.id }
    ])

    if (membersError){
        return {
            success: false,
            error: 'Could not add members to conversation'
        }
    }

    return {
        success: true,
        error: ''
    }

}