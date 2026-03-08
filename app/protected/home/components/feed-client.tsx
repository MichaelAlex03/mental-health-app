"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  MessageCircle,
  Star,
  Plus,

} from "lucide-react";
import { ServerThreadTopic } from "@/app/schemas/post";
import { Category } from "@/app/schemas/categories";
import { CreateThreadDialog } from "./create-thread-dialog";


const SPACE_ITEMS = ["All", "Anxiety", "Depression", "Self-care", "Relationships", "Grief", "Recovery"] as const;
type Spaces = (typeof SPACE_ITEMS)[number]


export function FeedClient({ threads, categories }: { threads: ServerThreadTopic[], categories: Category[] }) {
  const [activeFilter, setActiveFilter] = useState<Spaces>("All");
  const [composeValue, setComposeValue] = useState("");


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
        {SPACE_ITEMS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeFilter === filter
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
              }`}
          >
            {filter}
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
      {threads.map((thread) => (
        <ThreadCard
          key={thread.id}
          thread={thread}
        />
      ))}
    </>
  );
}

function ThreadCard({
  thread,
}: {
  thread: ServerThreadTopic;

}) {
  return (
    <Card className="hover:border-primary transition-colors cursor-pointer">
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
