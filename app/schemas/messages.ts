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

export const messageSchema = z.object({
    id: z.number(),
    sent_at: z.string(),
    content: z.string(),
    recipient_id: z.uuidv4(),
    sender_id: z.uuidv4(),
    conversation_id: z.number(),
    viewed: z.boolean().nullable()
})

export const sendMessageSchema = z.object({
    content: z.string(),
    recipient_id: z.uuidv4(),
    sender_id: z.uuidv4(),
    conversation_id: z.number(),
})

export type MessageType = z.infer<typeof messageSchema>;
export type SendMessageType = z.infer<typeof sendMessageSchema>;

export type GetConversationsType = z.infer<typeof getConversationsSchema>;
