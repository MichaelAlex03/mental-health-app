import { z } from "zod";

export const memberSchema = z.object({
  id: z.number(),
  topic_id: z.number(),
  user_id: z.uuidv4(),
  joined_at: z.string(),
});

export type Member = z.infer<typeof memberSchema>;
