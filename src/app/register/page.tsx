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
    <div className="flex min-h-[100dvh] w-full bg-slate-50 font-sans dark:bg-slate-950">
      {/* Left Panel */}
      <div className="relative hidden w-0 w-1/2 flex-1 flex-col justify-center border-slate-200 border-r bg-white px-10 pt-10 lg:flex dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-0 z-0 bg-[url('/media/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center justify-center text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <Image src="/logo.png" alt="CRMP Logo" width={48} height={48} className="object-contain" priority />
          </div>

          <h1 className="font-extrabold font-serif text-slate-900 text-xl tracking-tight sm:text-5xl dark:text-white/70">
            {APP_CONFIG.meta.title || "CRMP"} Join Platform
          </h1>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            Create your account to collaborate on research projects, manage submissions, and access role-based tools
            tailored for investigators and students.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <Link
              href="/"
              className="mb-10 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <title>Back</title>
                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
              </svg>
            </Link>

            <h2 className="mt-2 font-bold text-3xl text-slate-900 tracking-tight dark:text-white">
              Create your account
            </h2>

            <p className="mt-2 text-slate-600 text-sm dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl sm:px-12 dark:bg-slate-900 dark:ring-white/10">
              <Suspense fallback={null}>
                <SignUpForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
