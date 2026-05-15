"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/sidebar/theme-switcher";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicProjectsQuery } from "@/lib/api/projects/queries";

import { ResearchProjectCard } from "../../_components/research-project-card";
import { ResearchSearchInput } from "../../_components/research-search-input";

export default function PublicProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: projects, isLoading, error } = usePublicProjectsQuery();

  const filteredProjects =
    projects?.filter((project) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.projectTitle.toLowerCase().includes(searchLower) ||
        project.projectDescription?.toLowerCase().includes(searchLower) ||
        project.department.toLowerCase().includes(searchLower) ||
        project.projectProgram?.toLowerCase().includes(searchLower) ||
        project.researchArea?.toLowerCase().includes(searchLower)
      );
    }) ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="border-border border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="CRMP Logo" width={40} height={40} className="object-contain" priority />
              <span className="font-semibold text-foreground">CRMP</span>
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-border border-b bg-gradient-to-b from-background to-background/50 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-3 font-bold text-4xl text-foreground md:text-5xl">Research Hub</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Explore published research projects and academic discoveries from our community
          </p>

          {/* Custom Search Input */}
          <div className="mx-auto max-w-3xl">
            <ResearchSearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by title..." />
            <p className="mt-2 text-muted-foreground text-xs">
              Use keywords or exact phrases to find specific projects
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-4xl px-4">
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
                <Skeleton className="h-28 w-20 flex-shrink-0" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredProjects.length === 0 && (
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

        {!isLoading && filteredProjects.length > 0 && (
          <div className="divide-y divide-border/30 border-border/30 border-t border-b">
            {filteredProjects.map((project) => (
              <ResearchProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
