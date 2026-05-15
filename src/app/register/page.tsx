import { Suspense } from "react";

import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import { SignUpForm } from "@/components/auth/SignUpForm";
import { APP_CONFIG } from "@/config/app-config";

export const metadata: Metadata = {
  title: "Sign Up | Collaborative Research Management Platform",
  description: "Create an account to access the CRMP platform.",
};

export default function SignUpPage() {
  return (
    <div className="fixed inset-0 flex overflow-hidden bg-slate-50 font-sans dark:bg-slate-950">
      {/* Left Panel */}
      <div className="relative hidden w-1/2 flex-col justify-center border-slate-200 border-r bg-white px-8 pt-10 lg:flex lg:sticky lg:top-0 lg:h-full lg:w-[42%] dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-0 z-0 bg-[url('/media/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center justify-center text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <Image src="/logo.png" alt="CRMP Logo" width={48} height={48} className="object-contain" priority />
          </div>

          <h1 className="font-extrabold font-serif text-slate-900 text-3xl tracking-tight leading-tight sm:text-4xl dark:text-white/70">
            {APP_CONFIG.meta.title || "CRMP"} Join Platform
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Create your account to collaborate on research projects, manage submissions, and access role-based tools
            tailored for investigators and students.
          </p>
        </div>
      </div>

      {/* Right Panel - Scrollable */}
      <div className="flex w-full flex-1 flex-col items-start justify-start h-full overflow-y-auto px-4 py-12 sm:px-6 lg:px-20 xl:px-24 dark:bg-slate-950">
        <div className="w-full max-w-md lg:w-120 xl:w-130">
          <div className="mb-8 text-center lg:text-left">
            <Link
              href="/"
              className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <title>Back</title>
                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
              </svg>
            </Link>

            <h2 className="mt-2 font-bold text-3xl text-slate-900 tracking-tight dark:text-white">
              Create your account
            </h2>
          </div>

          <div className="rounded-2xl bg-white px-6 py-8 shadow-sm ring-1 ring-slate-900/5 sm:px-8 dark:bg-slate-900 dark:ring-white/10">
            <Suspense fallback={null}>
              <SignUpForm />
            </Suspense>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600 lg:text-left dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
