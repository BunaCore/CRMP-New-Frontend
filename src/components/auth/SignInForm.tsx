"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { loginUser } from "@/lib/api/auth/mutations";
import { useAuthStore } from "@/stores/authStore";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required"),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "password" }, // mock default password
  });

  const onSubmit = async (data: SignInValues) => {
    setIsLoading(true);
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      // Update global store
      login(response.access_token, response.user);

      // Sync cookies immediately so middleware recognizes this user on redirect
      Cookies.set("access_token", response.access_token, {
        expires: 7,
        path: "/",
        sameSite: "lax",
      });
      Cookies.set("user_permissions", JSON.stringify(response.user.permissions ?? []), {
        expires: 7,
        path: "/",
        sameSite: "lax",
      });

      toast.success("Welcome back!", {
        description: `Signed in as ${response.user.fullName} (${response.user.roles})`,
      });

      // Route dynamically based on user admin access (if no explicit redirect exists)
      if (redirect) {
        router.push(redirect);
      } else {
        // Default to /admin for those with admin access, otherwise go to /dashboard
        router.push(response.user.canAccessAdmin ? "/admin" : "/dashboard");
      }
    } catch (_error) {
      toast.error("Sign In Failed", {
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email Input */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block font-semibold text-muted-foreground/80 text-xs uppercase tracking-wider"
        >
          Email address
        </label>
        <div className="relative flex items-center rounded-none border border-slate-300 bg-white shadow-none transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:border-white/20 dark:bg-slate-900/50 dark:focus-within:ring-primary/20">
          <span className="absolute left-4 flex items-center justify-center text-muted-foreground/50 transition-colors group-focus-within:text-primary">
            <Mail className="h-4 w-4" />
          </span>
          <input
            id="email"
            type="email"
            placeholder="pi@crmp.edu or rad@crmp.edu"
            disabled={isLoading}
            className="w-full border-0 bg-transparent py-3.5 pr-4 pl-11 text-foreground text-sm outline-none transition-colors placeholder:text-muted-foreground/40 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <div className="fade-in slide-in-from-top-1 flex animate-in items-center gap-1.5 font-medium text-destructive text-xs duration-200">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{errors.email.message}</span>
          </div>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block font-semibold text-muted-foreground/80 text-xs uppercase tracking-wider"
          >
            Password
          </label>
        </div>
        <div className="relative flex items-center rounded-none border border-slate-300 bg-white shadow-none transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:border-white/20 dark:bg-slate-900/50 dark:focus-within:ring-primary/20">
          <span className="absolute left-4 flex items-center justify-center text-muted-foreground/50 transition-colors group-focus-within:text-primary">
            <Lock className="h-4 w-4" />
          </span>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            disabled={isLoading}
            className="w-full border-0 bg-transparent py-3.5 pr-12 pl-11 text-foreground text-sm outline-none transition-colors placeholder:text-muted-foreground/40 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("password")}
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-slate-100 hover:text-foreground disabled:opacity-50 dark:hover:bg-slate-800"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <div className="fade-in slide-in-from-top-1 flex animate-in items-center gap-1.5 font-medium text-destructive text-xs duration-200">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{errors.password.message}</span>
          </div>
        )}
      </div>

      {/* Remember Me & Forgot Password Row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" className="rounded-[4px] border-slate-300 dark:border-slate-700" />
          <label
            htmlFor="remember"
            className="cursor-pointer select-none font-medium text-muted-foreground text-xs leading-none transition-colors hover:text-foreground sm:text-sm"
          >
            Remember Me
          </label>
        </div>
        <Link
          href="/login"
          className="font-semibold text-primary text-xs transition-colors hover:text-primary/80 sm:text-sm"
        >
          Forgot Your Password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-none border border-primary/20 bg-primary py-6 font-semibold text-primary-foreground text-sm shadow-md shadow-primary/10 transition-all hover:scale-[1.01] hover:opacity-95 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] dark:border-primary/30"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Log In"
        )}
      </Button>
    </form>
  );
}
