import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="text-sm text-muted-foreground">
          Details: {params.error}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Please try again or reach out if this
          keeps happening.
        </p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Something went sideways</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense>
          <ErrorContent searchParams={searchParams} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
