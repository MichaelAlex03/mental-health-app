"use client"

import { JoinedThread } from '@/app/schemas/joined-threads'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import JoinedThreadCard from './joined-thread-card'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

interface JoinedThreadsProps {
    joinedThreads: JoinedThread[]
    nextPage: number | null
}

const JoinedThreadsClient = ({ joinedThreads }: JoinedThreadsProps) => {

    const [searchData, setSearchData] = useState<string>('');
    const [filteredThreads, setFilteredThreads] = useState<JoinedThread[]>(joinedThreads)

    console.log(searchData)

    useEffect(() => {
        if (!searchData) {
            setFilteredThreads(joinedThreads);
            return
        }

        const filtered = filteredThreads.filter((t) => t.topic_threads.title.toLowerCase().includes(searchData.toLowerCase()))
        setFilteredThreads(filtered)

    }, [searchData])


    return (
        <div>

            <Card>
                <CardContent className="flex items-center gap-3 p-4">
                    <Input
                        placeholder="What's on your mind? Share with the community..."
                        value={searchData}
                        onChange={(e) => setSearchData(e.target.value)}
                        className="bg-muted"
                    />
                </CardContent>
            </Card>

            {filteredThreads.length === 0 && searchData.length === 0 && (
                <Card className="border-dashed mt-4">
                    <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <MessageCircle size={24} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            No joined threads yet
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Join a thread to start connecting with others.
                        </p>
                    </CardContent>
                </Card>
            )}

            {filteredThreads.length === 0 && searchData.length > 0 && (
                <Card className="border-dashed mt-4">
                    <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <MessageCircle size={24} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            No threads founded
                        </h3>
                    </CardContent>
                </Card>
            )}




            {filteredThreads.map((joinedThread) => (
                <JoinedThreadCard key={joinedThread.id} joinedThread={joinedThread} />
            ))}


        </div>
    )
}

export default JoinedThreadsClient
