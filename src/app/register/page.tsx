import { Suspense } from "react";

import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up | Collaborative Research Management Platform",
  description: "Create an account to access the CRMP platform.",
};

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans transition-colors duration-300 dark:bg-slate-950">
      {/* Left Panel: Centered register form, matching login design */}
      <div className="relative flex h-full flex-1 flex-col justify-between overflow-hidden p-6 sm:p-8 lg:w-1/2 lg:flex-none">
        {/* Decorative Grid Background on Left Side */}
        <div className="absolute inset-0 z-0 bg-[url('/media/grid.svg')] bg-center opacity-[0.25] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-[0.1]" />

        {/* Header - Branding */}
        <div className="relative z-10 flex w-full shrink-0 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center transition-all group-hover:scale-105">
              <Image src="/logo.png" alt="CRMP Logo" width={36} height={36} className="object-contain" priority />
            </div>
            <span className="font-bold text-foreground text-lg tracking-tight transition-colors">CRMP</span>
          </Link>

          <div className="text-muted-foreground text-xs">
            System Status:{" "}
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-500 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Online
            </span>
          </div>
        </div>

        {/* Center Container: Centered header text + Register Form (wider for more inputs) */}
        <div className="relative z-10 mx-auto my-auto flex w-full max-w-[520px] shrink-0 flex-col justify-center">
          {/* Header Texts - Centered */}
          <div className="mb-5 text-center">
            <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">Create Account</h1>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              Fill in the details below to join the CRMP platform.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            }
          >
            <SignUpForm />
          </Suspense>

          {/* Login Link */}
          <div className="mt-4 text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              Sign In.
            </Link>
          </div>
        </div>

        {/* Spacer to balance layout */}
        <div className="h-6 shrink-0" />
      </div>

      {/* Right Panel: Same dark-indigo design as login page */}
      <div className="relative hidden h-full w-1/2 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0e163d] via-[#090e26] to-[#040612] p-8 lg:flex xl:p-12">
        {/* Floating Glowing Orbs */}
        <div className="pointer-events-none absolute top-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-[-150px] left-[-100px] h-[600px] w-[600px] rounded-full bg-primary/15 blur-[140px]" />

        {/* Grid pattern overlay */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/media/grid.svg')] bg-center opacity-[0.07] mix-blend-overlay" />

        {/* Banner Texts */}
        <div className="relative z-10 mb-6 max-w-lg space-y-3 self-start pl-8 text-center text-white lg:text-left xl:pl-12">
          <h2 className="font-extrabold text-2xl leading-tight tracking-tight xl:text-3xl">
            Join the research community.
          </h2>
          <p className="font-normal text-sm text-white/80 leading-relaxed">
            Create your account to submit proposals, collaborate with advisors, and track your academic milestones.
          </p>
        </div>

        {/* Mockup Presentation Container */}
        <div className="relative z-10 w-full max-w-md select-none px-6 xl:max-w-lg">
          {/* Main Dashboard Window Mockup */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:scale-[1.01] hover:border-white/15">
            {/* Window Chrome Header Bar */}
            <div className="flex items-center justify-between border-white/5 border-b bg-slate-950/30 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex items-center justify-center gap-1 rounded-md border border-white/5 bg-slate-950/60 px-3 py-1 font-mono text-[9px] text-white/40 tracking-wider">
                crmp.university.edu/dashboard
              </div>
              <div className="w-10" />
            </div>

            {/* Window Content - Custom styled CRMP system features */}
            <div className="space-y-4 p-4 text-left">
              {/* Stats Card Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3 backdrop-blur-md transition-all hover:bg-white/[0.07]">
                  <div className="font-medium text-[10px] text-white/50">Active Proposals</div>
                  <div className="mt-0.5 font-bold text-lg text-white">189 Projects</div>
                  <div className="mt-1 flex items-center gap-0.5 font-semibold text-[9px] text-emerald-400">
                    <span>↑ 12%</span>
                    <span className="font-normal text-white/30">from last month</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3 backdrop-blur-md transition-all hover:bg-white/[0.07]">
                  <div className="font-medium text-[10px] text-white/50">Funding Active</div>
                  <div className="mt-0.5 font-bold text-lg text-white">$4.2M Allocated</div>
                  <div className="mt-1 flex items-center gap-0.5 font-semibold text-[9px] text-blue-400">
                    <span>88% Approved</span>
                  </div>
                </div>
              </div>

              {/* Pipeline List Container */}
              <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.04] p-3.5 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] text-white/60 uppercase tracking-widest">
                    Live Research Feed
                  </span>
                  <span className="text-[9px] text-white/30">Updated 2m ago</span>
                </div>

                <div className="space-y-2.5">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-2 transition-all hover:border-white/[0.08] hover:bg-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-primary/25 bg-primary/20 font-bold text-[9px] text-primary-foreground">
                        ML
                      </div>
                      <div>
                        <div className="font-semibold text-white text-xs">Machine Learning Ethics</div>
                        <div className="text-[9px] text-white/40">Dr. Emily • Thesis Proposal</div>
                      </div>
                    </div>
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 font-semibold text-[8px] text-amber-300">
                      Under Review
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-2 transition-all hover:border-white/[0.08] hover:bg-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/20 font-bold text-[9px] text-emerald-400">
                        SE
                      </div>
                      <div>
                        <div className="font-semibold text-white text-xs">Sustainable Energy Grids</div>
                        <div className="text-[9px] text-white/40">Prof. James • Research Grant</div>
                      </div>
                    </div>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 font-semibold text-[8px] text-emerald-300">
                      Approved
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Donut Chart Card overlapping it - right corner */}
          <div className="hover:-translate-y-1 absolute right-[-14px] bottom-[-24px] z-20 w-44 rounded-2xl border border-white/10 bg-slate-950/75 p-4 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-white/15">
            <div className="mb-2.5 font-medium text-[10px] text-white/50">Category Breakdown</div>
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <svg className="-rotate-90 h-full w-full transform" viewBox="0 0 36 36">
                  <title>Category breakdown chart</title>
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary"
                    strokeWidth="3.5"
                    strokeDasharray="60, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400"
                    strokeWidth="3.5"
                    strokeDasharray="30, 100"
                    strokeDashoffset="-60"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="font-bold text-[9px]">90%</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-semibold text-[8.5px] text-white/70">Research (60%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-[8.5px] text-white/70">Thesis (30%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Advisors Stack Card overlapping it - left corner */}
          <div className="hover:-translate-y-1 absolute top-[140px] left-[-16px] z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/75 p-3 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-white/15">
            <div className="-space-x-2 flex shrink-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-900 bg-emerald-500 font-bold text-[7px] text-white shadow-md">
                DE
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-900 bg-blue-500 font-bold text-[7px] text-white shadow-md">
                PJ
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-900 bg-amber-500 font-bold text-[7px] text-white shadow-md">
                MW
              </div>
            </div>
            <div>
              <div className="font-medium text-[8px] text-white/50">Advisors Online</div>
              <div className="font-bold text-[9.5px] text-white">5 Active Reviewers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
