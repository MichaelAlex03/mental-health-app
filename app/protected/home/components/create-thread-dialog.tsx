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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/app/schemas/categories";
import { useState } from "react";
import { createTopicThreadSchema } from "@/app/schemas/post";
import { createTopicThread } from "../actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const MEMBER_MAX = 20;

export function CreateThreadDialog({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleResetForm = () => {
    setTitle("")
    setContent("")
    setCategory(null)
  }

  const handleSubmit = async () => {
    let input = {
      title,
      content,
      category_id: category,
      member_max: MEMBER_MAX
    }

    const validatedInput = createTopicThreadSchema.safeParse(input)

    if (!validatedInput.success) {
      let inputErrors: Record<string, string> = {}
      for (const error of validatedInput.error.issues) {
        inputErrors[error.path[0] as string] = error.message
      }

      setErrors(inputErrors)
      return
    }

    try {
      const result = await createTopicThread(validatedInput.data)

      if (result.error) {
        setErrors({ form: result.error })
        return
      }

      handleResetForm();
      setErrors({})
      setOpen(false)

    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }

      setErrors({ form: "Something went wrong please try again" })
    }
  }


  return (
    <Dialog open={open} onOpenChange={(value) => {
      setOpen(value)
      handleResetForm()
    }}>
      <DialogTrigger asChild>
        <Button variant={'default'} className='w-full cursor-pointer' onClick={() => {
          setOpen(true)
        }
        }>
          Create Thread
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a Thread</DialogTitle>
        </DialogHeader>

        {errors.form && (
          <p className="text-sm text-destructive">{errors.form}</p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="thread-title">Title</Label>
            <Input
              id="thread-title"
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="thread-content">Content</Label>
            <Textarea
              id="thread-content"
              placeholder="Share more details..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={errors.content ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="thread-category">Category</Label>
            <Select defaultValue="" value={category ? String(category) : ""} onValueChange={(val) => setCategory(Number(val))}>
              <SelectTrigger id="thread-category" className={errors.category ? "border-destructive focus-visible:ring-destructive" : ""}>
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
            {errors.category_id && (
              <p className="text-sm text-destructive">{errors.category_id}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="thread-member-max">Max Members</Label>
            <Input
              id="thread-member-max"
              type="number"
              value={MEMBER_MAX}
              readOnly
              className="bg-muted"
            />
          </div>

          <DialogFooter>
            <Button type="button" onClick={handleSubmit}>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
