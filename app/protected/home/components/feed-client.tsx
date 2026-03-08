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
import type { Category, Post } from "./post-feed";

const FILTERS = ["Latest", "Most Supported", "Unanswered"] as const;
type Filter = (typeof FILTERS)[number];

export function FeedClient({ posts, categories }: { posts: Post[], categories: Category[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("Latest");
  const [composeValue, setComposeValue] = useState("");

  // TODO: implement create-post handler
  const handleCreatePost = () => {};

  // TODO: implement support/save actions
  const handleSupport = (_postId: string) => {};
  const handleSave = (_postId: string) => {};

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
          <Button size="sm" className="shrink-0" onClick={handleCreatePost}>
            <Plus size={16} />
            Create Post
          </Button>
        </CardContent>
      </Card>

      {/* Feed filters */}
      <div className="flex gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === filter
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onSupport={() => handleSupport(post.id)}
          onSave={() => handleSave(post.id)}
        />
      ))}
    </>
  );
}

function PostCard({
  post,
  onSupport,
  onSave,
}: {
  post: Post;
  onSupport: () => void;
  onSave: () => void;
}) {
  return (
    <Card className="hover:border-primary transition-colors cursor-pointer">
      <CardContent className="flex flex-col gap-2.5 p-5">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[0.65rem] font-semibold text-muted-foreground">
            {post.authorInitial}
          </div>
          <span>Anonymous &middot; {post.timeAgo}</span>
          <Badge
            className={`${post.tagColor} text-primary-foreground border-0 rounded-full text-[0.65rem] px-2 py-0`}
          >
            {post.tag}
          </Badge>
        </div>

        {/* Title + body */}
        <h3 className="text-base font-semibold text-card-foreground leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {post.body}
        </p>

        {/* Actions */}
        <div className="flex gap-4 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSupport();
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:bg-muted px-2 py-1 rounded-lg transition-colors"
          >
            <Heart size={14} /> {post.supportCount} support
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:bg-muted px-2 py-1 rounded-lg transition-colors">
            <MessageCircle size={14} /> {post.replyCount} replies
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:bg-muted px-2 py-1 rounded-lg transition-colors"
          >
            <Star size={14} /> Save
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
