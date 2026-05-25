"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Sparkles } from "lucide-react";

import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/sidebar/theme-switcher";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { usePublicProjectsQuery } from "@/lib/api/projects/queries";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { ResearchProjectCard } from "../../_components/research-project-card";
import { ResearchSearchInput } from "../../_components/research-search-input";

export default function PublicProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 350);

  const themeMode = usePreferencesStore((s) => s.themeMode);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      setIsDark(themeMode === "dark" || (themeMode === "system" && media.matches));
    };
    updateTheme();
    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);
  }, [themeMode]);

  const publicQueryParams = useMemo(() => ({ search: debouncedSearchTerm.trim() || undefined }), [debouncedSearchTerm]);

  const { data, isLoading, error } = usePublicProjectsQuery(publicQueryParams);

  const projects = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className={`relative min-h-screen transition-colors duration-300 ${isDark ? "bg-[#050a1b]" : "bg-[#f8fafc]"}`}>
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 transition-colors duration-300 ${isDark ? "bg-[#050a1b]" : "bg-[#f8fafc]"}`}
        />
        <div
          className={`-translate-x-1/2 absolute top-1/4 left-1/2 h-96 w-96 rounded-full blur-3xl transition-colors duration-300 ${isDark ? "bg-blue-600/8" : "bg-blue-500/4"}`}
        />
        <div
          className={`absolute right-1/4 bottom-1/3 h-80 w-80 rounded-full blur-3xl transition-colors duration-300 ${isDark ? "bg-cyan-500/4" : "bg-cyan-500/2"}`}
        />
      </div>

      <div className="relative z-10 text-foreground">
        <header
          className={`border-b backdrop-blur-sm transition-colors duration-300 ${isDark ? "border-white/10 bg-[#050a1b]/75" : "border-slate-200/60 bg-[#f8fafc]/80"}`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.01]">
              <Image src="/logo.png" alt="CRMP Logo" width={40} height={40} className="object-contain" priority />
              <div className="leading-tight">
                <div className="font-semibold text-foreground">CRMP</div>
                <div className="text-muted-foreground text-xs uppercase tracking-[0.24em]">Public Projects</div>
              </div>
            </Link>

            <ThemeSwitcher />
          </div>
        </header>

        <section
          className={`border-b transition-colors duration-300 px-4 py-16 md:py-24 ${isDark ? "border-white/5 bg-slate-900/10" : "border-slate-200/50 bg-slate-50/50"}`}
        >
          <div className="mx-auto max-w-3xl text-center">
            <div
              className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-medium text-xs shadow-sm backdrop-blur transition-colors duration-300 ${isDark ? "border-slate-700/50 bg-slate-800/40 text-slate-300 hover:bg-slate-800/60" : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <Sparkles className={`h-3.5 w-3.5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              Public research archive
            </div>
            <h1
              className={`mb-6 max-w-5xl text-balance text-center font-extrabold text-[44px] leading-[1.08] tracking-tight transition-colors duration-300 md:text-[64px] ${isDark ? "bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent" : "text-slate-900"}`}
            >
              Research Hub
            </h1>
            <p
              className={`mb-8 text-pretty text-center font-light text-sm leading-relaxed transition-colors duration-300 md:text-[17px] ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              Explore published research projects, see the PI, and scan the team members on each project.
            </p>

            <div className="mx-auto max-w-3xl">
              <ResearchSearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm("")}
                placeholder="Search by title, department, PI, or member name..."
              />
              <p className="mt-2 text-muted-foreground text-xs">
                Use keywords or exact phrases to find specific projects.
              </p>
            </div>
          </div>
        </section>

        <main className="mx-auto w-full max-w-4xl px-4 py-10">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-semibold text-xl text-foreground md:text-2xl">Published projects</h2>
              <p className="text-muted-foreground text-sm">
                {meta?.totalItems ?? projects.length} total public projects available
              </p>
            </div>
          </div>

          {error && (
            <div className="my-12 rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
              <p className="text-destructive">Failed to load projects. Please try again later.</p>
            </div>
          )}

          {isLoading && (
            <div className="divide-y divide-border/30 border-border/30 border-t">
              {[1, 2, 3, 4, 5].map((id) => (
                <div key={`skeleton-${id}`} className="flex items-center gap-6 px-6 py-5">
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-28 w-20 shrink-0" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && projects.length === 0 && (
            <div className="my-16 rounded-lg border border-border border-dashed bg-muted/30 p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="No projects icon"
                >
                  <title>No projects icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10a4 4 0 018 0m-7 4a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 font-semibold text-foreground text-lg">No projects found</h2>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search filters" : "No published research projects are available yet"}
              </p>
            </div>
          )}

          {!isLoading && projects.length > 0 && (
            <div className="divide-y divide-border/30 border-border/30 border-t border-b">
              {projects.map((project) => (
                <ResearchProjectCard key={project.projectId} project={project} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
