import { Suspense } from "react";

import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import { SignInForm } from "@/components/auth/SignInForm";
import { APP_CONFIG } from "@/config/app-config";

export const metadata: Metadata = {
  title: "Sign In | Collaborative Research Management Platform",
  description: "Authenticate to access the CRMP dashboards for PIs and Administrators.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[100dvh] w-full bg-slate-50 font-sans dark:bg-slate-950">
      {/* Left Panel: Graphic / Brand Side */}
      <div className="relative hidden w-0 w-1/2 flex-1 flex-col justify-center border-slate-200 border-r bg-white px-10 pt-10 lg:flex dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-0 z-0 bg-[url('/media/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center justify-center text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <Image src="/logo.png" alt="CRMP Logo" width={64} height={64} className="object-contain" priority />
          </div>
          <h1 className="font-extrabold text-4xl text-slate-900 tracking-tight sm:text-5xl dark:text-white">
            {APP_CONFIG.meta.title || "CRMP"} Access Portal
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            A secure gateway for Principal Investigators, Evaluators, and Administration logic. Use role-based
            assignments to safely manage and evaluate ongoing projects.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form Side */}
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
              Sign in to your account
            </h2>
            <p className="mt-2 text-slate-600 text-sm dark:text-slate-400">
              Need access?{" "}
              <a
                href="mailto:support@crmp.com"
                className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Contact your systemic administrator
              </a>
            </p>
          </div>

          <div className="mt-10">
            <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl sm:px-12 dark:bg-slate-900 dark:ring-white/10">
              {/* Client Component handling state & submission */}
              <Suspense fallback={null}>
                <SignInForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
