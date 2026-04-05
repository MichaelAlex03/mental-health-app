'use client'

import { ServerThreadTopicWithCategory } from '@/app/schemas/thread'
import { ThreadReply } from '@/app/schemas/thread-replies'
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, MessageCircle, Users } from 'lucide-react'
import Link from 'next/link'
import ReplyItem from './reply-item'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getReplies } from '../actions'

export interface ThreadMember {
    avatar_url: string | null
    display_name: string
}

interface ThreadClientProps {
    thread: ServerThreadTopicWithCategory
    members: ThreadMember[] | null
    replies: ThreadReply[]
}

const ThreadClient = ({ thread, members, replies }: ThreadClientProps) => {

    const [threadReplies, setThreadReplies] = useState<ThreadReply[]>(replies);

    const [cursor, setCursor] = useState<number | null>(null);
    const isFetchingRef = useRef(false);
    const sentinalRef = useRef<HTMLDivElement>(null)
    const [errors, setErrors] = useState<string>('');

    const handleReply = async () => {

    }


    const loadMore = useCallback(async () => {
        if (isFetchingRef.current || cursor === null) return;

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
                    <Textarea placeholder="Share your thoughts..." className="mb-3" />
                    <div className="flex justify-end">
                        <Button size="sm">Reply</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Replies */}
            {replies.length > 0 && (
                <div className="space-y-1">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1 mb-3">
                        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                    </h2>
                    {replies.map((reply) => (
                        <ReplyItem key={reply.id} reply={reply} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ThreadClient
