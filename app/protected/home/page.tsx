import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ThreadFeed } from "./components/thread-feed";
import { Skeleton } from "@/components/ui/skeleton";

// ── Placeholder types ──────────────────────────────────────────────

interface Space {
  name: string;
  color: string;
}


const QUICK_TOOLS = [
  { label: "Breathing exercise", href: "#" },
  { label: "5-4-3-2-1 grounding", href: "#" },
  { label: "Mood check-in", href: "#" },
  { label: "Find a therapist", href: "#" },
];

// ── Page ───────────────────────────────────────────────────────────

export default function HomePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <div className="flex gap-6 w-full">
      {/* ── Main feed ── */}
      <main className="flex-1 min-w-0 flex flex-col gap-4">
        <ThreadFeed searchParams={searchParams} />
      </main>

      {/* ── Right sidebar ── */}
      <aside className="w-[260px] shrink-0 hidden xl:flex flex-col gap-4 sticky top-20 self-start">
        <Card className="text-xs text-muted-foreground leading-relaxed">
          <CardContent className="p-4">
            In crisis? You&apos;re not alone.
            <br />
            <a
              href="https://988lifeline.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 text-accent font-medium hover:text-foreground transition-colors"
            >
              988 Suicide &amp; Crisis Lifeline
            </a>{" "}
            &mdash; call or text 988, 24/7.
          </CardContent>
        </Card>

        <Widget title="Quick Tools">
          {QUICK_TOOLS.map((tool) => (
            <Link
              key={tool.label}
              href={tool.href}
              className="block py-1.5 text-xs text-primary font-medium hover:underline"
            >
              {tool.label}
            </Link>
          ))}
        </Widget>
      </aside>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function Widget({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="text-[0.8rem] font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          {title}
        </h4>
        {children}
      </CardContent>
    </Card>
  );
}
