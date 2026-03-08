"use client";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-10">
      <p className="text-destructive">Failed to load feed.</p>
      <button onClick={reset} className="mt-4 underline">Try again</button>
    </div>
  );
}