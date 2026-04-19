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

export const updateProfile = async (formData: FormData) => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user || !user.id) {
        redirect('/auth/login')
    }

    const input = JSON.parse(formData.get("input") as string) as UpdateProfileInput;
    const newAvatar = formData.get("avatar") as File | null;
    const filePath = formData.get("filePath") as string | null;

    const validated = updateProfileSchema.safeParse(input)

    if (!validated.success) {
        return {
            success: false,
            error: 'Invalid profile data'
        }
    }

    if (newAvatar && filePath) {
        const { error: uploadError } = await client.storage
            .from('avatar_image')
            .upload(filePath, newAvatar, { upsert: true });

        if (uploadError) {
            console.log(uploadError)
            return { success: false, error: 'Could not upload avatar' };
        }

        const { data: urlData } = client.storage
            .from('avatar_image')
            .getPublicUrl(filePath);

        validated.data.avatar_url = urlData.publicUrl;
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
