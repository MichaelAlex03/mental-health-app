"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  MessageCircle,
  Users,
  X,
} from "lucide-react";
import { ServerThreadTopic } from "@/app/schemas/thread";
import { Category } from "@/app/schemas/categories";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { getThreads, joinThreadTopic } from "../actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";


export function FeedClient({ threads, categories, nextCursor }: { threads: ServerThreadTopic[], categories: Category[], nextCursor: number | null }) {
  const [composeValue, setComposeValue] = useState<string>("");
  const [categoryList, setCategoryList] = useState<Record<string, number | undefined>>({})
  const [threadList, setThreadList] = useState<ServerThreadTopic[]>(threads)
  const [cursor, setCursor] = useState(nextCursor)
  const [hasMore, setHasMore] = useState(nextCursor !== null)
  const isFetchingRef = useRef(false)
  const sentinalRef = useRef<HTMLDivElement>(null)
  const [errors, setErrors] = useState<string>("");


  const router = useRouter();
  const searchParams = useSearchParams();


  const joinThread = async (threadId: number) => {
    try {
      const joinThreadResponse = await joinThreadTopic(threadId);
      if (!joinThreadResponse.success) {
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
  const searchData = searchParams.get('searchQuery') ? searchParams.get('searchQuery') : null


  const loadMore = useCallback(async () => {

    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true

    try {
      const { data, nextCursor } = await getThreads(cursor, searchData, currentCategory)
      setThreadList((prev) => [...prev, ...data])
      setCursor(cursor)
      setHasMore(nextCursor !== null)

    } finally {
      isFetchingRef.current = false
    }

  }, [currentCategory, cursor, hasMore, searchData])


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

  useEffect(() => {
    const createCategoriesMap = () => {
      const map: Record<string, number | undefined> = { "All": undefined }
      for (const category of categories) {
        map[category.category_name] = category.id
      }
      setCategoryList(map)
    }
    createCategoriesMap()
  }, [categories])

  useEffect(() => {
    setThreadList(threads)
  }, [threads])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("searchQuery", composeValue)
      router.push(`/protected/home?${params}`)
    }, 1000)

    return () => clearTimeout(timeout)

  }, [composeValue])


  return (
    <>
      {/* Compose box */}
      <Card>
        <CardContent className="flex items-center gap-3 p-4">

          <Input
            placeholder="What's on your mind? Share with the community..."
            value={composeValue}
            onChange={(e) => setComposeValue(e.target.value)}
            className="bg-muted"
          />
        </CardContent>
      </Card>

      {/* Error banner */}
      {errors && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={16} className="shrink-0" />
          <p className="flex-1">{errors}</p>
          <button
            onClick={() => setErrors("")}
            className="shrink-0 rounded-md p-0.5 hover:bg-destructive/20 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

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
    <Dialog>
      <DialogTrigger asChild>
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <CardContent className="flex flex-col gap-2.5 p-5">
            <h3 className="text-base font-semibold text-card-foreground leading-snug">
              {thread.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {thread.content}
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users size={14} />
                <span>{thread.member_count}/{thread.member_max}</span>
              </div>
              {!thread.is_full && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJoin(thread.id);
                  }}
                >
                  Join
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{thread.title}</DialogTitle>
          <DialogDescription>
            You need to join this group to be able to see inside of it.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users size={16} />
            <span>{thread.member_count}/{thread.member_max} members</span>
          </div>
          {!thread.is_full && (
            <Button
              onClick={() => {
                onJoin(thread.id);
              }}
            >
              Join Group
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
