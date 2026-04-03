import { z } from "zod";
import { serverTopicThreadSchema } from "./thread";

export const joinedThreadSchema = z.object({
  id: z.number(),
  joined_at: z.string(),
  topic_id: z.number(),
  user_id: z.uuidv4(),
  topic_threads: serverTopicThreadSchema,
});

export const getJoinedThreadsSchema = z.object({
  joinedThreads: z.array(joinedThreadSchema),
  nextPage: z.number().nullable(),
});

export type JoinedThread = z.infer<typeof joinedThreadSchema>;
export type GetJoinedThreadsResponse = z.infer<typeof getJoinedThreadsSchema>;
