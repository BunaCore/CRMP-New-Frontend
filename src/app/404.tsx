"use client";

import Link from "next/link";

import { AlertTriangle, Lock } from "lucide-react";

import { hasPermission } from "@/access-control/permission-gates";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/context/SessionContext";

export default function NotFound404() {
  const { user, isLoading } = useSession();

  const homePath = hasPermission(user?.permissions ?? [], "PROJECT_CREATE") ? "/dashboard" : "/admin";
  const backTo = user ? homePath : "/login";

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="-top-28 -translate-x-1/2 absolute left-1/2 h-72 w-[42rem] rounded-full bg-gradient-to-b from-blue-600/10 to-transparent blur-2xl" />
      </div>

      <Card className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-sm ring-1 ring-foreground/10">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400">
              <Lock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xl sm:text-2xl">Not Found or Access Denied</CardTitle>
              <p className="mt-1 text-muted-foreground text-sm">
                The page you requested doesn&apos;t exist, or you don&apos;t have permission to view it.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>404</AlertTitle>
            <AlertDescription>
              {user ? "Your account can&apos;t access this resource." : "Please sign in to continue."}
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-3">
            <Link prefetch={false} replace href={backTo} className="w-full">
              <Button variant="default" className="w-full rounded-full">
                {user ? "Back to Dashboard" : "Back to Sign In"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
