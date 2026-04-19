import { z } from "zod";

export const updateProfileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .max(50, "First name must be 50 characters or fewer.")
    .nullable(),
  last_name: z
    .string()
    .trim()
    .max(50, "Last name must be 50 characters or fewer.")
    .nullable(),
  display_name: z
    .string()
    .trim()
    .min(1, "Display name is required.")
    .max(100, "Display name must be 100 characters or fewer."),
  bio: z
    .string()
    .trim()
    .max(500, "Bio must be 500 characters or fewer.")
    .nullable(),
  birthday_date: z.string().nullable(),
  is_profile_public: z.boolean(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type UserProfile = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string;
  bio: string | null;
  birthday_date: string | null;
  avatar_url: string | null;
  is_profile_public: boolean;
};
