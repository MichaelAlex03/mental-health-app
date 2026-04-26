'use client'

import { Category } from '@/app/schemas/categories'
import { ServerThreadTopic } from '@/app/schemas/thread'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ThreadCard from './thread-card'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import { CreateThreadDialog } from './create-thread-dialog'
import { Input } from '@/components/ui/input'
import { getThreads } from '../actions'
import { useRouter, useSearchParams } from 'next/navigation'


interface MyThreadsClient {
    threads: ServerThreadTopic[]
    categories: Category[]
    nextCursor: number | null
}

const MyThreadsClient = ({ threads, categories, nextCursor }: MyThreadsClient) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const search = searchParams.get("searchQuery") ?? ""

    const [threadsList, setThreadsList] = useState<ServerThreadTopic[]>(threads);
    const [hasMore, setHasMore] = useState<boolean>(nextCursor !== null);
    const [searchData, setSearchData] = useState<string>(search)
    const [cursor, setCursor] = useState<number | null>(nextCursor);
    const isFetchingRef = useRef(false)
    const sentinalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setThreadsList(threads);
        setCursor(nextCursor);
        setHasMore(nextCursor !== null);
    }, [threads, nextCursor]);

    const loadMore = useCallback(async () => {
        if (isFetchingRef.current || !hasMore) return;

        isFetchingRef.current = true
        try {
            const { data, nextCursor } = await getThreads(cursor, search);
            setThreadsList((prev) => [...prev, ...data]);
            setCursor(nextCursor)
            setHasMore(nextCursor !== null)

        } finally {
            isFetchingRef.current = false
        }


    }, [cursor, hasMore, search])

    useEffect(() => {
        if (!sentinalRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore() },
            { threshold: 0.1 }
        )
        observer.observe(sentinalRef.current)
        return () => observer.disconnect()
    }, [loadMore])

    useEffect(() => {

        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("searchQuery", searchData)
            router.push(`/protected/my-threads?${params}`)
        }, 1000)

        return () => clearTimeout(timeout)

    }, [searchData])



    return (
        <div>
            {/* Compose box */}
            <Card>
                <CardContent className="flex items-center gap-3 p-4">
                    <Input
                        placeholder="What's on your mind? Share with the community..."
                        className="bg-muted"
                        value={searchData}
                        onChange={(e) => setSearchData(e.target.value)}
                    />
                    <div>
                        <CreateThreadDialog categories={categories} />
                    </div>
                </CardContent>
            </Card>

            {threadsList.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <MessageCircle size={24} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            No threads yet
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xs mb-5">
                            This space is waiting for its first voice. Start a conversation and connect with others.
                        </p>
                        <div>
                            <CreateThreadDialog categories={categories} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {threadsList.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
            ))}

            <div ref={sentinalRef} style={{ height: 1 }} />
        </div>
    )
}

export default MyThreadsClient