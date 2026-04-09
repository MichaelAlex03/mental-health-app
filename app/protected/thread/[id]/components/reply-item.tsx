'use client'

import { CreateReplyInput, ThreadReply } from '@/app/schemas/thread-replies'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle } from 'lucide-react'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { useState } from 'react'
import { createSubReply } from '../actions'

interface ReplyItemProps {
    reply: ThreadReply
    depth?: number
}

const ReplyItem = ({ reply, depth = 0 }: ReplyItemProps) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState<string>("");
    const [subReplies, setSubReplies] = useState<ThreadReply[]>([])
    const [collapsed, setCollapsed] = useState(false);
    const [errors, setErrors] = useState<string>("");

    const handleSubreply = async (parent_comment_id: number, depth: number) => {
        let subReply: CreateReplyInput = {
            thread_id: reply.thread_id,
            content: replyContent,
            parent_comment_id,
            depth
        }

        try {

            const createSubReplyResponse = await createSubReply(subReply);
             if (!createSubReplyResponse.success) {
                setErrors(createSubReplyResponse.error)
                return
            }

        } catch (error) {
            if (isRedirectError(error)) {
                throw error
            }
            setErrors("Unhandled Error")
        }

    }

    if (reply.is_deleted) {
        return (
            <div className="flex gap-3 py-3">
                <div className="flex flex-col items-center">
                    <Avatar size="sm">
                        <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground italic">
                        [deleted]
                    </p>
                    <p className="text-sm text-muted-foreground italic mt-1">
                        [This comment has been removed]
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex gap-3 py-3">
            {/* Avatar + thread line */}
            <div className="flex flex-col items-center">
                <Avatar size="sm">
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="w-0.5 flex-1 bg-border mt-1 rounded-full" />

            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-card-foreground">
                        Anonymous
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {new Date(reply.created_at).toLocaleDateString()}
                    </span>
                </div>


                <div>
                    <p className="text-sm text-card-foreground leading-relaxed mt-1 whitespace-pre-wrap">
                        {reply.content}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5">
                        <button
                            onClick={() => setShowReplyBox(!showReplyBox)}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            <MessageCircle size={14} />
                            Reply
                        </button>
                    </div>

                    {/* Inline reply box */}
                    {showReplyBox && (
                        <div className="mt-3 flex gap-2 flex-col">
                            <Textarea
                                placeholder="Write a reply..."
                                className="text-sm min-h-12"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                            />
                            <div className='flex items-center gap-2'>
                                <Button size="sm" className="self-end shrink-0" onClick={() => handleSubreply(reply.id, reply.depth)}>
                                    Reply
                                </Button>
                                <Button size="sm" className="self-end shrink-0" onClick={() => setShowReplyBox(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Nested replies would go here */}
                    {reply.reply_count > 0 && subReplies.length < reply.reply_count && (
                        <div className='mt-2'>
                            <Button size={'sm'}>
                                View more replies
                            </Button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default ReplyItem
