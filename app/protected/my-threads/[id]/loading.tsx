export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <p className="text-sm text-muted-foreground font-medium">
          Fetching threads…
        </p>
        <div className="w-full h-1.5 rounded-full bg-accent overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-primary animate-[slide_1.2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
