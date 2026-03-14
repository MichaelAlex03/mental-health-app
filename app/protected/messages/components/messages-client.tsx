"use client"

import { GetConversationsType } from '@/app/schemas/messages'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createConversastion, getConversations } from '../conversation_actions'
import { MessageCircle, Search, Send, Paperclip, Smile, Heart, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ConversationCard from './conversation-cards';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { useRouter } from 'next/navigation';


interface MessagesClientProps {
  conversations: GetConversationsType[]
  nextPage: number | null
}

const MessagesClient = ({ conversations, nextPage }: MessagesClientProps) => {

  const router = useRouter();


  const [convoList, setConvoList] = useState<GetConversationsType[]>(conversations);
  const [page, setPage] = useState<number | null>(nextPage);
  const isFetchingRef = useRef(false);
  const sentinalRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [activeConversation, setActiveConversation] = useState<number>(0);


  const handleCreateConversation = async () => {
    try {
      const response = await createConversastion(recipientName);
      if(!response.success){
        setErrors(response.error)
        return;
      }
      setDialogOpen(false)
      setRecipientName("")
      router.refresh()
    } catch (error) {
      if (isRedirectError(error)){
        throw error
      }

      setErrors("Unhandled error please try again")
    }
  } 

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || page === null) return;

    isFetchingRef.current = true
    try {
      const { validatedData, nextPage } = await getConversations(page)
      setConvoList((prev) => [...prev, ...validatedData])
      setPage(nextPage)
      setErrors("")
    } finally {
      isFetchingRef.current = true
    }

  }, [page])

  useEffect(() => {
    if (!sentinalRef.current) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { threshold: 0.1 }
    )
    observer.observe(sentinalRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className="flex h-[calc(100vh-104px)] rounded-xl border border-border bg-card overflow-hidden">
      {/* ── Conversation list (left panel) ── */}
      <div className="w-[320px] shrink-0 flex flex-col border-r border-border">
        <div className="p-4 pb-3 border-b border-border">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8 h-9 rounded-lg bg-muted text-sm"
              disabled
            />
          </div>
        </div>

        {/* Empty conversation list */}
        {convoList.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-3">
              <Users className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              No conversations yet
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your conversations with community members will show up here.
            </p>
          </div>
        )}

        {convoList.map((convo) => (
          <ConversationCard conversation={convo} setConversation={setActiveConversation}/>
        ))}

      </div>

      {/* ── Chat panel (right) ── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <MessageCircle className="size-8 text-primary" />
          </div>

          <h3 className="text-xl font-semibold tracking-tight mb-2">
            Start a Conversation
          </h3>

          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-2">
            Connect privately with someone who understands. Reach out to a
            community member to share, support, or simply talk.
          </p>

          <p className="text-xs text-muted-foreground/70 max-w-xs mb-6">
            All messages are private between you and the other person.
          </p>

          <Button size="lg" className="rounded-xl px-6" onClick={() => {
            setDialogOpen(true)
            setRecipientName("")
            setErrors("")
            }}>
            <MessageCircle className="size-4" />
            New Message
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
                <DialogDescription>
                  Enter a display name to start a conversation.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label htmlFor="recipient">Display Name</Label>
                <Input
                  id="recipient"
                  placeholder="Enter display name..."
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
                {errors && <p className="text-sm text-destructive">{errors}</p>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleCreateConversation()}
                  disabled={!recipientName.trim()}
                >
                  Start Conversation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>

        {/* Input bar (disabled state) */}
        <div className="flex items-center gap-2 p-3 border-t border-border">
          <button className="size-9 shrink-0 rounded-lg flex items-center justify-center text-muted-foreground/50 cursor-not-allowed">
            <Paperclip className="size-[18px]" />
          </button>
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              className="h-10 rounded-xl bg-muted pr-10 text-sm"
              disabled
            />
            <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 cursor-not-allowed">
              <Smile className="size-[18px]" />
            </button>
          </div>
          <button className="size-10 shrink-0 rounded-xl bg-primary/50 flex items-center justify-center cursor-not-allowed">
            <Send className="size-[18px] text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessagesClient