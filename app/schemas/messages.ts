import { z } from "zod";

export const getConversationsSchema = z.object({
    conversation_id: z.number(),
    recipient_user_id: z.uuidv4(),
    recipient_display_name: z.string(),
    recipient_avatar_url: z.string().nullable(),
    last_message_content: z.string().nullable(),
    last_message_sent_at: z.string().nullable(),
    last_message_sender_id: z.uuidv4().nullable()
})

export type GetConversationsType = z.infer<typeof getConversationsSchema>;
