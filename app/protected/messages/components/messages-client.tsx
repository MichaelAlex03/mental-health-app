"use client"

import { GetConversationsType } from '@/app/schemas/messages'
import { useEffect, useState } from 'react'
import { createConversastion, getConversations } from '../conversation_actions'
import { MessageCircle, Plus, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ConversationCard from './conversation-cards';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { useRouter } from 'next/navigation';
import MessageScreen from './message-screen';


interface MessagesClientProps {
  conversations: GetConversationsType[]
  currentUserId: string
}

const MessagesClient = ({ conversations, currentUserId }: MessagesClientProps) => {

  const router = useRouter();

  const [filteredConversations, setFilteredConversations] = useState<GetConversationsType[]>(conversations);
  const [searchData, setSearchData] = useState<string>('');
  const [errors, setErrors] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [activeConversation, setActiveConversation] = useState<number>(0);

  const handleSetActiveConversation = (convoId: number) => {
    setActiveConversation(convoId)
  }

  const handleBack = () => {
    router.refresh()
    setActiveConversation(0)
  }


  const handleCreateConversation = async () => {
    try {
      const response = await createConversastion(recipientName);
      if (!response.success) {
        setErrors(response.error)
        return;
      }
      setDialogOpen(false)
      setRecipientName("")
      router.refresh()
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }

      setErrors("Unhandled error please try again")
    }
  }

  useEffect(() => {
    if (searchData === '') setFilteredConversations(conversations)
    const filtered = conversations.filter((c) => 
      c.recipient_display_name.toLowerCase().includes(searchData.toLowerCase())
    )
    setFilteredConversations(filtered);
  }, [searchData])

  // Used for syncing client state conversations with server conversations
  useEffect(() => {
    setFilteredConversations(conversations)
  }, [conversations])

  return (
    <div className="flex h-[calc(100vh-104px)] rounded-xl border border-border bg-card overflow-hidden">
      {/* ── Conversation list (left panel) ── */}
      <div
        className={`shrink-0 flex flex-col border-r border-border transition-[width] duration-300 ease-in-out overflow-hidden ${activeConversation === 0 ? "w-[320px]" : "w-0 border-r-0"}`}
      >
        <div className="min-w-[320px] p-4 pb-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => {
                setDialogOpen(true)
                setRecipientName("")
                setErrors("")
              }}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8 h-9 rounded-lg bg-muted text-sm"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
        </div>

        {/* No conversations at all */}
        {conversations.length === 0 && (
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

        {/* No results for search */}
        {conversations.length > 0 && filteredConversations.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-3">
              <Search className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              No results found
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No conversations match &ldquo;{searchData}&rdquo;
            </p>
          </div>
        )}

        {filteredConversations.map((convo, index) => (
          <ConversationCard
            key={index}
            conversation={convo}
            setActiveConversation={handleSetActiveConversation}
          />
        ))}

      </div>

      {/* ── Chat panel (right) ── */}
      {activeConversation === 0 ? <div className="flex-1 flex flex-col min-w-0">

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
      </div> : (() => {
        const activeConvo = conversations.find(c => c.conversation_id === activeConversation)
        return (
          <MessageScreen
            key={activeConversation}
            conversationId={activeConversation}
            recipientName={activeConvo?.recipient_display_name ?? ''}
            recipientAvatarUrl={activeConvo?.recipient_avatar_url ?? null}
            currentUserId={currentUserId}
            recipientUserId={activeConvo!.recipient_user_id}
            onBack={handleBack}
          />
        )
      })()
      }

  
    </div>
  );
}

export default MessagesClient