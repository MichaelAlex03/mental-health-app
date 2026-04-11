import { z } from "zod";

export const threadReplySchema = z.object({
  id: z.number(),
  created_at: z.string(),
  thread_id: z.number(),
  user_id: z.uuidv4().nullable(),
  parent_comment_id: z.number().nullable(),
  content: z.string().nullable(),
  is_deleted: z.boolean(),
  depth: z.number(),
  reply_count: z.number(),
  display_name: z.string(),
  avatar_url: z.string()
});

export type ThreadReply = z.infer<typeof threadReplySchema>;

export const insertThreadReplySchema = z.object({
  thread_id: z.number(),
  user_id: z.uuidv4(),
  parent_comment_id: z.number().nullable(),
  content: z.string().min(1).max(2000),
  depth: z.number(),
});

export type InsertThreadReply = z.infer<typeof insertThreadReplySchema>;

export const createReplyInputSchema = z.object({
  thread_id: z.number(),
  content: z.string().min(1).max(2000),
  parent_comment_id: z.number().nullable(),
  depth: z.number()
});

export type CreateReplyInput = z.infer<typeof createReplyInputSchema>;

