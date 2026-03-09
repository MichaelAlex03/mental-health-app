import { ServerThreadTopic } from '@/app/schemas/post';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react'

const ThreadCard = ({
    thread,
}: {
    thread: ServerThreadTopic;

}) => {
    return (
        <Card className="hover:border-primary transition-colors cursor-pointer mt-4">
            <CardContent className="flex flex-col gap-2.5 p-5">
                {/* Header */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[0.65rem] font-semibold text-muted-foreground">
                        A
                    </div>
                    <span>Anonymous</span>
                </div>

                {/* Title + body */}
                <h3 className="text-base font-semibold text-card-foreground leading-snug">
                    {thread.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {thread.content}
                </p>


            </CardContent>
        </Card>
    );
}

export default ThreadCard
