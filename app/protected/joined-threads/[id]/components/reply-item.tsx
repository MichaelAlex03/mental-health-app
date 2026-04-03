'use client'

import { ThreadReply } from '@/app/schemas/thread-replies'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle } from 'lucide-react'
import React, { useState } from 'react'

interface ReplyItemProps {
    reply: ThreadReply
    depth?: number
}

const ReplyItem = ({ reply, depth = 0 }: ReplyItemProps) => {
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

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
                {!collapsed && (
                    <div className="w-0.5 flex-1 bg-border mt-1 rounded-full" />
                )}
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
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors ml-auto"
                    >
                        {collapsed ? 'Expand' : 'Collapse'}
                    </button>
                </div>

                {!collapsed && (
                    <>
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
                            <div className="mt-3 flex gap-2">
                                <Textarea
                                    placeholder="Write a reply..."
                                    className="text-sm min-h-12"
                                />
                                <Button size="sm" className="self-end shrink-0">
                                    Reply
                                </Button>
                            </div>
                        )}

                        {/* Nested replies would go here */}
                    </>
                )}
            </div>
        </div>
    )
}

export default ReplyItem
