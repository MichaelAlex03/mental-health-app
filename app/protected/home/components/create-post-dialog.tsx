"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "./post-feed";

const MEMBER_MAX = 20;

export function CreatePostDialog({
  open,
  onOpenChange,
  categories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}) {
  // TODO: add state for title, content, categoryId, errors, submitting
  // TODO: add resetForm function
  // TODO: add handleSubmit using createPostSchema from @/app/schemas/post

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              placeholder="What's on your mind?"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-content">Content</Label>
            <Textarea
              id="post-content"
              placeholder="Share more details..."
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-category">Category</Label>
            <Select>
              <SelectTrigger id="post-category">
                <SelectValue placeholder="Select a space" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-member-max">Max Members</Label>
            <Input
              id="post-member-max"
              type="number"
              value={MEMBER_MAX}
              readOnly
              className="bg-muted"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
