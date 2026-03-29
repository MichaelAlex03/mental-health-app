"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Users,
} from "lucide-react";
import { ServerThreadTopic } from "@/app/schemas/post";
import { Category } from "@/app/schemas/categories";
import { CreateThreadDialog } from "./create-thread-dialog";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { getThreads, joinThreadTopic } from "../actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// In the future probably want to filter out threads from feed that you are already joined into and ones that are full
// Also need to filter ones out that we created


export function FeedClient({ threads, categories, nextCursor }: { threads: ServerThreadTopic[], categories: Category[], nextCursor: number | null }) {
  const [composeValue, setComposeValue] = useState("");
  const [categoryList, setCategoryList] = useState<Record<string, number | undefined>>({})
  const [threadList, setThreadList] = useState<ServerThreadTopic[]>(threads)
  const [cursor, setCursor] = useState(nextCursor)
  const [hasMore, setHasMore] = useState(nextCursor !== null)
  const isFetchingRef = useRef(false)
  const sentinalRef = useRef<HTMLDivElement>(null)
  const [errors, setErrors] = useState<string>("");


  const router = useRouter();
  const searchParams = useSearchParams()

  const joinThread = async (threadId: number) => {
    try {
      const joinThreadResponse = await joinThreadTopic(threadId);
      if (!joinThreadResponse.success){
        setErrors(joinThreadResponse.error)
        return;
      }

      router.push('/protected/joined-threads')
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }
      setErrors("Something went wrong. Please try again.")
    }
  }

  const currentCategory = searchParams.get('category') ? Number(searchParams.get('category')) : undefined


  const loadMore = useCallback(async () => {

    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true

    try {
      const { data, nextCursor } = await getThreads(cursor, currentCategory)
      setThreadList((prev) => [...prev, ...data])
      setCursor(nextCursor)
      setHasMore(nextCursor !== null)

    } finally {
      isFetchingRef.current = false
    }

  }, [currentCategory, cursor, hasMore])


  useEffect(() => {
    if (!sentinalRef.current) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { threshold: 0.1 }
    )
    observer.observe(sentinalRef.current)
    return () => observer.disconnect();
  }, [loadMore])


  const handleCategoryFilter = (categoryId?: number) => {
    router.push(`/protected/home${categoryId ? `?category=${categoryId}` : ''}`)
  }

  const createCategoriesMap = () => {
    let map: Record<string, number | undefined> = { "All": undefined }
    for (const category of categories) {
      map[category.category_name] = category.id
    }
    setCategoryList(map)
  }

  useEffect(() => {
    createCategoriesMap()
  }, [])


  return (
    <>
      {/* Compose box */}
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          {/* TODO: replace with real user initial */}
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">
            A
          </div>
          <Input
            placeholder="What's on your mind? Share with the community..."
            value={composeValue}
            onChange={(e) => setComposeValue(e.target.value)}
            className="bg-muted"
          />
          <div>
            <CreateThreadDialog categories={categories} />
          </div>
        </CardContent>
      </Card>

      {/* Feed filters */}
      <div className="flex gap-2">
        {Object.entries(categoryList).map(([name, id]) => (
          <button
            key={name}
            onClick={() => {
              handleCategoryFilter(id)
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${id === currentCategory
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
              }`}
          >
            {name}
          </button>
        ))}
      </div>

      {threads.length === 0 && (
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

      {/* Threads */}
      {threadList.map((thread) => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          onJoin={joinThread}
        />
      ))}


      <div ref={sentinalRef} className="h-1" />
    </>
  );
}

function ThreadCard({
  thread,
  onJoin,
}: {
  thread: ServerThreadTopic;
  onJoin: (threadId: number) => void;
}) {
  return (
    <Card className="hover:border-primary transition-colors cursor-pointer">
      <CardContent className="flex flex-col gap-2.5 p-5">
        {/* Title + body */}
        <h3 className="text-base font-semibold text-card-foreground leading-snug">
          {thread.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {thread.content}
        </p>

        {/* Footer: member count + join */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users size={14} />
            <span>{thread.member_count}/{thread.member_max}</span>
          </div>
          {!thread.is_full && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onJoin(thread.id);
              }}
            >
              Join
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
