import { z } from "zod";

export const threadReplySchema = z.object({
  id: z.number(),
  created_at: z.string(),
  thread_id: z.number(),
  user_id: z.uuidv4().nullable(),
  parent_comment_id: z.number().nullable(),
  content: z.string().nullable(),
  is_deleted: z.boolean(),
});

export type ThreadReply = z.infer<typeof threadReplySchema>;
