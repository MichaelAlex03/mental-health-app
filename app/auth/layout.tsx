export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh">
      {/* Decorative left panel — hidden on mobile */}
      <div className="relative hidden w-1/2 overflow-hidden bg-primary/5 lg:block">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,hsl(155_25%_38%/0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,hsl(35_20%_60%/0.12),transparent_60%)]" />

        {/* Organic blurred shapes */}
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-10 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute left-1/3 top-2/3 h-40 w-40 rounded-full bg-muted/30 blur-2xl" />

        {/* Tagline */}
        <div className="relative flex h-full flex-col items-center justify-center px-12">
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-5xl font-semibold text-primary">
              A calmer space
            </p>
            <p className="text-center text-5xl font-semibold text-primary">
              for what matters.
            </p>
          </div>
          <p className="mt-4 text-center text-base text-muted-foreground">
            Your mental health community
          </p>
        </div>
      </div>

      {/* Mobile top banner — visible only on small screens */}
      <div className="absolute inset-x-0 top-0 h-32 overflow-hidden bg-primary/5 lg:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(155_25%_38%/0.15),transparent_70%)]" />
        <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
      </div>

      {/* Form area */}
      <div className="flex w-full items-center justify-center p-6 pt-40 md:p-10 lg:w-1/2 lg:pt-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
