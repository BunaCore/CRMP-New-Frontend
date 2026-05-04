"use client";

import * as React from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { APP_CONFIG } from "@/config/app-config";
import { acceptInvitation } from "@/lib/api/invitations/mutations";
import { getInvitationByToken } from "@/lib/api/invitations/queries";
import { useAuthStore } from "@/stores/authStore";

const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Invitation token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  universityId: z.string().optional(),
});

type AcceptInvitationValues = z.infer<typeof acceptInvitationSchema>;

type InvitationInfo = {
  email: string;
  roleName: string;
  expiresAt: string;
};

function formatExpiryRelative(expiresAt: string) {
  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime())) return "unknown";

  const diffMs = expiry.getTime() - Date.now();
  if (diffMs <= 0) return "expired";

  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffWeeks = Math.round(diffDays / 7);

  if (diffSecs < 60) return "less than a minute";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"}`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"}`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"}`;
  return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"}`;
}

export default function InvitationAcceptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";
  const { login } = useAuthStore();

  const [invite, setInvite] = React.useState<InvitationInfo | null>(null);
  const [isInviteLoading, setIsInviteLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [inviteError, setInviteError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AcceptInvitationValues>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      token: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      universityId: "",
    },
  });

  React.useEffect(() => {
    setValue("token", token);
  }, [setValue, token]);

  React.useEffect(() => {
    if (!token) {
      setInviteError("No invitation token was provided.");
      setIsInviteLoading(false);
      return;
    }

    let isMounted = true;

    (async () => {
      setIsInviteLoading(true);
      setInviteError(null);

      try {
        const data = await getInvitationByToken(token);
        if (!isMounted) return;

        setInvite(data);
      } catch (_error) {
        if (!isMounted) return;
        setInvite(null);
        setInviteError("Invitation not found or already expired.");
      } finally {
        if (isMounted) setIsInviteLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const onSubmit = async (values: AcceptInvitationValues) => {
    setIsSubmitting(true);
    try {
      const response = await acceptInvitation({
        token: values.token,
        password: values.password,
        fullName: values.fullName?.trim() || undefined,
        phoneNumber: values.phoneNumber?.trim() || undefined,
        universityId: values.universityId?.trim() || undefined,
      });

      // Update global store with the new user
      login(response.accessToken, response.user);

      // Sync cookies immediately so middleware recognizes this user on redirect
      Cookies.set("access_token", response.accessToken, {
        expires: 7,
        path: "/",
        sameSite: "lax",
      });
      Cookies.set("user_permissions", JSON.stringify(response.user.permissions ?? []), {
        expires: 7,
        path: "/",
        sameSite: "lax",
      });

      toast.success("Welcome!", {
        description: `Account created for ${response.user.fullName}. Redirecting to dashboard...`,
      });

      // Route dynamically based on user admin access
      router.push(response.user.canAccessAdmin ? "/admin" : "/dashboard");
    } catch (_error) {
      toast.error("Unable to accept invitation", {
        description: "Please verify the token and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExpired = React.useMemo(() => {
    if (!invite?.expiresAt) return false;
    const expiry = new Date(invite.expiresAt);
    return !Number.isNaN(expiry.getTime()) && expiry.getTime() < Date.now();
  }, [invite?.expiresAt]);

  const canSubmit = Boolean(invite) && !isExpired && !isSubmitting;

  return (
    <div className="flex min-h-dvh w-full bg-slate-50 font-sans dark:bg-slate-950">
      {/* Left Panel: Graphic / Brand Side */}
      <div className="relative hidden lg:flex w-1/2 h-dvh overflow-hidden flex-col justify-center border-slate-200 border-r bg-white px-10 pt-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-0 z-0 bg-[url('/media/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center justify-center text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <Image src="/logo.png" alt="CRMP Logo" width={64} height={64} className="object-contain" priority />
          </div>
          <h1 className="font-extrabold font-serif text-xl text-slate-900 tracking-tight sm:text-5xl dark:text-white/40">
            {APP_CONFIG.meta.title || "CRMP"} Access Portal
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            A secure gateway for Principal Investigators, Evaluators, and Administration. Accept your invitation to join
            the platform.
          </p>
        </div>
      </div>

      {/* Right Panel: Invitation Form Side */}
      <div className="flex h-dvh min-h-0 flex-1 flex-col overflow-hidden sm:px-6 lg:w-1/2 lg:flex-none lg:px-2 xl:px-2">
        <ScrollArea className="h-full min-h-0 w-full">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center lg:text-left">
              <h2 className="mt-2 font-bold text-3xl text-slate-900 tracking-tight dark:text-white">
                Accept your invitation
              </h2>
              <p className="mt-2 text-slate-600 text-sm dark:text-slate-400">
                Complete your account to start collaborating.
              </p>
            </div>

            <div className="mt-10">
              <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl sm:px-4 dark:bg-slate-900/10">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <input type="hidden" {...register("token")} />

                  {isInviteLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading invitation...
                    </div>
                  ) : inviteError ? (
                    <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {inviteError}
                    </div>
                  ) : invite ? (
                    <>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Invited to CRMP as{" "}
                        </p>
                        <span className="text-sm font-semibold text-foreground">{invite.roleName}</span>
                        <div className="text-sm text-muted-foreground">
                          {formatExpiryRelative(invite.expiresAt) === "expired"
                            ? "Invitation has expired"
                            : `Invitation will expire in ${formatExpiryRelative(invite.expiresAt)}`}
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <Label htmlFor="email" className="mb-2 text-sm font-medium leading-none">
                          Email address
                        </Label>
                        <Input id="email" value={invite.email} disabled />
                        <Label htmlFor="fullName" className="mb-2 text-sm font-medium leading-none">
                          Full name
                        </Label>
                        <Input id="fullName" autoComplete="name" {...register("fullName")} />
                        {errors.fullName && <p className="mt-2 text-red-500 text-sm">{errors.fullName.message}</p>}
                      </div>

                      <div className="flex flex-col">
                        <Label htmlFor="phoneNumber" className="mb-2 text-sm font-medium leading-none">
                          Phone number
                        </Label>
                        <Input id="phoneNumber" autoComplete="tel" {...register("phoneNumber")} />
                        {errors.phoneNumber && (
                          <p className="mt-2 text-red-500 text-sm">{errors.phoneNumber.message}</p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <Label htmlFor="universityId" className="mb-2 text-sm font-medium leading-none">
                          University ID
                        </Label>
                        <Input id="universityId" {...register("universityId")} />
                        {errors.universityId && (
                          <p className="mt-2 text-red-500 text-sm">{errors.universityId.message}</p>
                        )}
                      </div>

                      <PasswordField
                        id="password"
                        label="Create password"
                        error={errors.password?.message}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        {...register("password")}
                      />

                      {isExpired && (
                        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                          This invitation has expired. Please request a new invite from your administrator.
                        </div>
                      )}

                      <Button type="submit" className="w-full" disabled={!canSubmit}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Accept invitation...
                          </>
                        ) : (
                          "Accept invitation"
                        )}
                      </Button>

                      <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link prefetch={false} className="text-blue-600 hover:underline" href="/login">
                          Sign in
                        </Link>
                      </div>
                    </>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
