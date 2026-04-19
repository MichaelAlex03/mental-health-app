'use server'

import { UpdateProfileInput, updateProfileSchema } from "@/app/schemas/profile";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getProfile = async () => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        redirect('/auth/login')
    }

    const { data, error } = await client
        .from('user_profile')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error) {
        throw error
    }

    return data
}

export const updateProfile = async (input: UpdateProfileInput) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        redirect('/auth/login')
    }

    const validated = updateProfileSchema.safeParse(input)

    if (!validated.success) {
        return {
            success: false,
            error: 'Invalid profile data'
        }
    }

    const { error } = await client
        .from('user_profile')
        .update(validated.data)
        .eq('user_id', user.id)

    if (error) {
        return {
            success: false,
            error: 'Could not update profile'
        }
    }

    revalidatePath('/protected/profile')
    return { success: true }
}
