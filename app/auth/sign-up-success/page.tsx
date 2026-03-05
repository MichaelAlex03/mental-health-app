import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">You&apos;re almost there</CardTitle>
        <CardDescription>
          Just one more step to join the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a confirmation link to your email. Please check your
          inbox and click the link to activate your account.
        </p>
      </CardContent>
    </Card>
  );
}
