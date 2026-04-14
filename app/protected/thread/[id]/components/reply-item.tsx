'use client'

import { CreateReplyInput, ThreadReply } from '@/app/schemas/thread-replies'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, MessageCircle } from 'lucide-react'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { useCallback, useState } from 'react'
import { createSubReply, handleFetchSubReplies } from '../actions'
import { useRealtimeSubscription } from './thread-realtime-context'

interface ReplyItemProps {
    reply: ThreadReply
    depth?: number
    showActiveReplyBox: number
    toggleReplyBox: (val: number) => void
}


const ReplyItem = ({ reply, depth = 0, showActiveReplyBox, toggleReplyBox }: ReplyItemProps) => {

    const [replyContent, setReplyContent] = useState<string>("");
    const [subReplies, setSubReplies] = useState<ThreadReply[]>([])
    const [errors, setErrors] = useState<string>("");
    const [cursor, setCursor] = useState<number>(-1);
    const [isFetchingSubreplies, setIsFetchingSubReplies] = useState<boolean>(false);

    useRealtimeSubscription(useCallback((event) => {

        if (event.type === 'UPDATE') {
            // Update reply_count for any of my loaded sub-replies
            setSubReplies(prev => prev.map(r =>
                r.id === event.reply.id ? { ...r, reply_count: event.reply.reply_count } : r
            ))
        }
    }, [reply.id]))


    const handleSubreply = async (parent_comment_id: number) => {
        const subReply: CreateReplyInput = {
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

            if (createSubReplyResponse.data) {
                setSubReplies(prev => [createSubReplyResponse.data, ...prev])
            }
            setReplyContent("")
            toggleReplyBox(0)


        } catch (error) {
            if (isRedirectError(error)) {
                throw error
            }
            setErrors("Unhandled Error")
        }

    }

    const getSubReplies = async () => {
        setIsFetchingSubReplies(true)
        try {
            const fetchSubRepliesResponse = await handleFetchSubReplies(reply.id, reply.thread_id, cursor)
            if (!fetchSubRepliesResponse.success) {
                setErrors(fetchSubRepliesResponse.error)
                return
            }

            if (fetchSubRepliesResponse.data) {
                setSubReplies((prev) => {
                    const existingIds = new Set(prev.map(r => r.id))
                    return [...prev, ...fetchSubRepliesResponse.data.filter(r => !existingIds.has(r.id))]
                })
                setCursor(fetchSubRepliesResponse.nextCursor)
            }
        } catch (error) {
            if (isRedirectError(error)) {
                throw error
            }
            setErrors("Unhandled Error")
        } finally {
            setIsFetchingSubReplies(false)
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
                        {reply.display_name}
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
                            onClick={() => toggleReplyBox(reply.id)}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            <MessageCircle size={14} />
                            Reply
                        </button>
                    </div>

                    {/* Inline reply box */}
                    {showActiveReplyBox === reply.id && (
                        <div className="mt-3 flex gap-2 flex-col">
                            <Textarea
                                placeholder="Write a reply..."
                                className="text-sm min-h-12"
                                value={replyContent}
                                onChange={(e) => {
                                    setReplyContent(e.target.value)
                                    if (errors) setErrors("")
                                }}
                            />
                            {errors && (
                                <div className="flex items-center gap-1.5 text-destructive text-xs">
                                    <AlertCircle size={14} className="shrink-0" />
                                    <span>{errors}</span>
                                </div>
                            )}
                            <div className='flex items-center gap-2'>
                                <Button size="sm" className="self-end shrink-0" onClick={() => handleSubreply(reply.id)}>
                                    Reply
                                </Button>
                                <Button size="sm" className="self-end shrink-0" onClick={() => toggleReplyBox(0)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Show error when reply box is closed (e.g. from fetching sub-replies) */}
                    {errors && !showActiveReplyBox && (
                        <div className="flex items-center gap-1.5 text-destructive text-xs mt-2">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{errors}</span>
                        </div>
                    )}


                    {subReplies.length > 0 && subReplies.map((reply) => (
                        <ReplyItem key={reply.id} reply={reply} depth={reply.depth} showActiveReplyBox={showActiveReplyBox} toggleReplyBox={toggleReplyBox}/>
                    ))}

                    {/* Nested replies would go here */}
                    {reply.reply_count > 0 && subReplies.length < reply.reply_count && (
                        <div className='mt-2'>
                            <Button size={'sm'} onClick={getSubReplies} disabled={isFetchingSubreplies}>
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
