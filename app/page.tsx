import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      {/* Background blurs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,hsl(155_25%_38%/0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,hsl(35_20%_60%/0.10),transparent_55%)]" />
      <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute left-1/2 top-3/4 h-48 w-48 rounded-full bg-muted/30 blur-2xl" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <span className="text-xl font-semibold text-primary">Haven</span>
        <nav className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center px-6 pb-20 pt-16 text-center md:pt-24">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-primary md:text-5xl lg:text-6xl">
          A calmer space for what matters.
        </h1>
        <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
          An anonymous, supportive community where you can share what you&apos;re
          going through &mdash; and find others who truly understand.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">Join the community</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/auth/login">I already have an account</Link>
          </Button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 mx-auto grid max-w-5xl gap-6 px-6 pb-24 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Anonymous &amp; Safe</CardTitle>
            <CardDescription>
              No real names required. Share freely without fear of judgment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your identity stays private. Focus on what you want to say, not
              who you are.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peer Support</CardTitle>
            <CardDescription>
              Connect with people who get it &mdash; because they&apos;ve been
              there too.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Give and receive support in a moderated environment built around
              empathy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Curated Resources</CardTitle>
            <CardDescription>
              Evidence-based tools and guides, right when you need them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coping strategies, grounding exercises, and crisis links &mdash;
              always one tap away.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Stats strip */}
      <section className="relative z-10 border-t bg-card/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 py-14 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col items-center">
            <p className="text-3xl font-semibold text-primary">100 %</p>
            <p className="text-sm text-muted-foreground">Anonymous</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-semibold text-primary">24 / 7</p>
            <p className="text-sm text-muted-foreground">Community available</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-semibold text-primary">Free</p>
            <p className="text-sm text-muted-foreground">
              Always, for everyone
            </p>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative z-10 flex flex-col items-center gap-4 px-6 py-20 text-center">
        <h2 className="max-w-md text-2xl font-semibold text-foreground md:text-3xl">
          You don&apos;t have to go through it alone.
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Join a growing community that listens without judging.
        </p>
        <Button size="lg" className="mt-2" asChild>
          <Link href="/auth/sign-up">Get started</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t px-6 py-6 text-center text-xs text-muted-foreground">
        <p>
          If you are in crisis, please contact the{" "}
          <a
            href="https://988lifeline.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            988 Suicide &amp; Crisis Lifeline
          </a>{" "}
          (call or text 988).
        </p>
      </footer>
    </div>
  );
}
