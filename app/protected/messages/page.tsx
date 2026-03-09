import { MessageCircle, Search, Send, Paperclip, Smile, Heart, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {

    

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
            </div>

            {/* ── Chat panel (right) ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Empty state — welcoming CTA */}
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

                    <Button size="lg" className="rounded-xl px-6">
                        <MessageCircle className="size-4" />
                        New Message
                    </Button>

                    {/* Suggestions */}
                    <div className="mt-10 flex flex-col items-center gap-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Ways to connect
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <SuggestionChip icon={<Heart className="size-3.5" />} label="Thank someone for a helpful post" />
                            <SuggestionChip icon={<Users className="size-3.5" />} label="Reach out to a thread member" />
                            <SuggestionChip icon={<MessageCircle className="size-3.5" />} label="Check in on someone" />
                        </div>
                    </div>
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

function SuggestionChip({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
            {icon}
            {label}
        </div>
    );
}
