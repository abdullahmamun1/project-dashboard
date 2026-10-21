import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/modules/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Log in as a student or mentor</CardDescription>
      </CardHeader>
      <CardContent>
        {/* LoginForm reads ?redirect= via useSearchParams, which must sit behind a Suspense boundary. */}
        <Suspense fallback={<FormSkeleton />}>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-7">
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
      <Skeleton className="h-9" />
    </div>
  );
}
