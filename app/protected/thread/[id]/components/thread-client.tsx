'use client'

import { ServerThreadTopicWithCategory } from '@/app/schemas/thread'
import { CreateReplyInput, ThreadReplies, ThreadReply } from '@/app/schemas/thread-replies'
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, ArrowLeft, MessageCircle, Users } from 'lucide-react'
import Link from 'next/link'
import ReplyItem from './reply-item'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createReply, getReplies } from '../actions'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { createClient } from '@/lib/supabase/client'
import { useRealtimePublish } from './thread-realtime-context'

export interface ThreadMember {
    avatar_url: string | null
    display_name: string
}

interface ThreadClientProps {
    thread: ServerThreadTopicWithCategory
    members: ThreadMember[] | null
    replies: ThreadReply[]
    nextCursor: number
}

const supabase = createClient();

const ThreadClient = ({ thread, members, replies, nextCursor }: ThreadClientProps) => {

    const publish = useRealtimePublish()

    const [threadReplies, setThreadReplies] = useState<ThreadReply[]>(replies);
    const [activeReplyBox, setActiveReplyBox] = useState<number>(0)
    const [replyContent, setReplyContent] = useState<string>("");
    const [cursor, setCursor] = useState<number>(nextCursor);
    const isFetchingRef = useRef(false);
    const sentinalRef = useRef<HTMLDivElement>(null)
    const [errors, setErrors] = useState<string>('');

    const handleToggleReplyBox = (replyId: number) => {
        setActiveReplyBox(replyId)
    }

    // Used for top level replies
    const handleReply = async () => {
        const reply: CreateReplyInput = {
            thread_id: thread.id,
            content: replyContent,
            parent_comment_id: null,
            depth: 0
        }

        try {
            const createReplyResponse = await createReply(reply)
            if (!createReplyResponse.success) {
                setErrors(createReplyResponse.error)
                return
            }

            setReplyContent("")


        } catch (error) {
            if (isRedirectError(error)) {
                throw error
            }

            setErrors("Unhandled Error")
        }
    }


    const loadMore = useCallback(async () => {
        if (isFetchingRef.current || cursor === -1) return;

        isFetchingRef.current = true

        try {
            const { data, nextCursor } = await getReplies(thread.id, cursor)
            setCursor(nextCursor)
            setThreadReplies(prev => [...prev, ...data])
        } catch (error) {
            setErrors(error as string)
        } finally {
            isFetchingRef.current = false
        }

    }, [cursor, thread.id])

    useEffect(() => {
        if (!sentinalRef.current) return
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore() },
            { threshold: 0.1 }
        )
        observer.observe(sentinalRef.current);
        return () => observer.disconnect()
    }, [loadMore])

    useEffect(() => {
        const channel = supabase
            .channel(`thread-${thread.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'thread_replies',
                    filter: `thread_id=eq.${thread.id}`
                },
                async (payload) => {
                    const reply = payload.new as ThreadReplies


                    const { data, error } = await supabase.rpc('get_user_profile', {
                        p_user_id: reply.user_id
                    })

                    if (error) {
                        setErrors('Could not recieve message')
                        return;
                    }

                    const threadReply: ThreadReply = {
                        ...reply as ThreadReplies,
                        avatar_url: data.avatar_url as string | null,
                        display_name: data.display_name as string
                    }

                    // This websocket connection only handles top level replies
                    if (reply.parent_comment_id === null) {
                        setThreadReplies((prev: ThreadReply[]) => [threadReply, ...prev])
                    }

                   

                }
            )
            .on(
                'postgres_changes',
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "thread_replies",
                    filter: `thread_id=eq.${thread.id}`
                },
                (payload) => {
                    const reply = payload.new as ThreadReplies

                    // Update reply count for top level replies
                    if (reply.parent_comment_id === null) {
                        setThreadReplies(prev => prev.map((r) => (
                            r.id === reply.id ? { ...r, reply_count: reply.reply_count } : r
                        )))
                    } else {
                        publish({ type: 'UPDATE', reply })
                    }

                }
            )
            .subscribe()
        return () => {
            supabase.removeChannel(channel)
        }
    }, [])



    return (
        <div className="mx-auto space-y-4 px-4 py-6">
            {/* Back link */}
            <Link
                href="/protected/my-threads"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft size={16} />
                Back to My Threads
            </Link>

            {/* Thread card */}
            <Card>
                <CardContent className="flex flex-col gap-3 p-6">
                    <Badge variant="secondary" className="w-fit text-xs uppercase tracking-wide">
                        {thread.category_name}
                    </Badge>

                    <h1 className="text-xl font-bold leading-tight text-card-foreground">
                        {thread.title}
                    </h1>

                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {thread.content}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t pt-4 mt-1">
                        <div className="flex items-center gap-2">
                            {members && members.length > 0 && (
                                <AvatarGroup>
                                    {members.slice(0, 5).map((member, i) => (
                                        <Avatar size="sm" key={i}>
                                            {member.avatar_url && <AvatarImage src={member.avatar_url} />}
                                            <AvatarFallback>
                                                {member.display_name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                </AvatarGroup>
                            )}
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users size={14} />
                                {thread.member_count}/{thread.member_max}
                            </span>
                        </div>

                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MessageCircle size={14} />
                            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Comment input */}
            <Card>
                <CardContent className="p-4">
                    <Textarea
                        value={replyContent}
                        onChange={(e) => {
                            setReplyContent(e.target.value)
                            if (errors) setErrors("")
                        }}
                        placeholder="Share your thoughts..."
                        className="mb-3"
                    />
                    {errors && (
                        <div className="flex items-center gap-1.5 text-destructive text-xs mb-3">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{errors}</span>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <Button onClick={handleReply} size="sm">Reply</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Replies */}
            {threadReplies.length > 0 && (
                <div className="space-y-1">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1 mb-3">
                        {threadReplies.length} {threadReplies.length === 1 ? 'Reply' : 'Replies'}
                    </h2>
                    {threadReplies.map((reply) => (
                        <ReplyItem key={reply.id} reply={reply} showActiveReplyBox={activeReplyBox} toggleReplyBox={handleToggleReplyBox}/>
                    ))}
                </div>
            )}

            <div ref={sentinalRef} style={{ height: 1 }} />
        </div>
    )
}

export default ThreadClient
