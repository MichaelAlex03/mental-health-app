import { ServerThreadTopic } from '@/app/schemas/thread';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const ThreadCard = ({
    thread,
}: {
    thread: ServerThreadTopic;
}) => {
    return (
        <Link href={`/protected/thread/${thread.id}`}>
            <Card className="hover:border-primary transition-colors cursor-pointer mt-4">
                <CardContent className="flex flex-col gap-2.5 p-5">
                    {/* Title + body */}
                    <h3 className="text-base font-semibold text-card-foreground leading-snug">
                        {thread.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {thread.content}
                    </p>

                    {/* Footer: member count */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                        <Users size={14} />
                        <span>{thread.member_count}/{thread.member_max}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default ThreadCard
