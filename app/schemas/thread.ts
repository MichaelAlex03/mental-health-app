import { z } from "zod";
import { threadReplySchema } from "./thread-replies";

// Schema for client creating posts
export const createTopicThreadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or fewer."),
  content: z
    .string()
    .trim()
    .min(1, "Content is required.")
    .max(5000, "Content must be 5000 characters or fewer."),
  category_id: z
    .number({ error: "Category is required." })
    .int()
    .positive("Category is required."),
  member_max: z
    .number({ error: "Max members is required." })
    .int()
    .min(1, "Max members must be at least 1.")
    .max(20, "Max members cannot exceed 20."),
});

// Schema for server schema for posts
export const serverTopicThreadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or fewer."),
  content: z
    .string()
    .trim()
    .min(1, "Content is required.")
    .max(5000, "Content must be 5000 characters or fewer."),
  category_id: z
    .number({ error: "Category is required." })
    .int()
    .positive("Category is required."),
  member_max: z
    .number({ error: "Max members is required." })
    .int()
    .min(1, "Max members must be at least 1.")
    .max(20, "Max members cannot exceed 20."),
  is_full: z.boolean(),
  member_count: z.number(),
  created_by: z.uuidv4(),
  id: z.number(),
  created_at: z.iso.datetime({ offset: true })
})

export const threadMemberSchema = z.object({
  avatar_url: z.string().nullable(),
  display_name: z.string(),
});

export const threadDetailsSchema = z.object({
  thread: serverTopicThreadSchema.extend({
    category_name: z.string(),
  }),
  members: z.array(threadMemberSchema),
  replies: z.array(threadReplySchema),
});

export type CreateThreadTopicInput = z.infer<typeof createTopicThreadSchema>;
export type ServerThreadTopic = z.infer<typeof serverTopicThreadSchema>
export type ServerThreadTopicWithCategory = ServerThreadTopic & {
  category_name: string
}
export type ThreadMember = z.infer<typeof threadMemberSchema>;
export type ThreadDetails = z.infer<typeof threadDetailsSchema>;
