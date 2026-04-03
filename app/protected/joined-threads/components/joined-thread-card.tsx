import { JoinedThread } from '@/app/schemas/joined-threads';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users } from 'lucide-react';
import Link from 'next/link';

const JoinedThreadCard = ({
    joinedThread,
}: {
    joinedThread: JoinedThread;
}) => {
    const joinedDate = new Date(joinedThread.joined_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

    return (
        <Link href={`/protected/my-threads/${joinedThread.id}`}>
            <Card className="hover:border-primary transition-colors cursor-pointer mt-4">
                <CardContent className="flex flex-col gap-2.5 p-5">
                    <h3 className="text-base font-semibold text-card-foreground leading-snug">
                        {joinedThread.topic_threads.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {joinedThread.topic_threads.content}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            <span>{joinedThread.topic_threads.member_count}/{joinedThread.topic_threads.member_max}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>Joined {joinedDate}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default JoinedThreadCard
