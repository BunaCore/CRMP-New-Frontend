"use client";

import { useState } from "react";

import { FolderOpen, Lock, Search, Unlock } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { useAllProjectsQuery, useProjectDetailsQuery } from "@/lib/api/projects/queries";
import type { ProjectListItem } from "@/lib/api/projects/types";

import { ProjectDetailsDrawer } from "./project-details-drawer";
import { AllProjectsTableSkeleton } from "./skeletons/all-projects-table-skeleton";

export function AllProjectsTab() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [visibility, setVisibility] = useState<string>("all");
  const [program, setProgram] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const limit = 10;

  const { data, isLoading } = useAllProjectsQuery({
    search: debouncedSearch,
    isPublic: visibility === "all" ? undefined : visibility === "public",
    program: program === "all" ? undefined : program,
    page,
    limit,
  });

  // Fetch full project details when a project is selected
  const { data: projectDetails } = useProjectDetailsQuery(selectedProjectId);

  const openProjectDrawer = (project: ProjectListItem) => {
    setSelectedProjectId(project.projectId);
  };

  const totalPages = data?.meta.totalPages ?? 0;
  const totalItems = data?.meta.totalItems ?? 0;
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(page * limit, totalItems);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row">
        <div className="relative w-full sm:max-w-xs">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search all projects..."
            className="bg-background pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Select
            value={visibility}
            onValueChange={(val) => {
              setVisibility(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-35 bg-background">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={program}
            onValueChange={(val) => {
              setProgram(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-35 bg-background">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="UG">Undergraduate</SelectItem>
              <SelectItem value="PG">Postgraduate</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="overflow-x-auto">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-75">Project Title</TableHead>
                <TableHead>Principal Investigator</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead className="text-right">Submission Date</TableHead>
              </TableRow>
            </TableHeader>

            {isLoading ? (
              <AllProjectsTableSkeleton />
            ) : !data?.items.length ? (
              <TableBody className="[&_tr]:h-80">
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 opacity-60" />
                        <span className="absolute inset-0 animate-pulse rounded-full bg-primary/10 blur-xl" />
                        <span className="absolute inset-0 rounded-full ring-8 ring-primary/10" />
                        <FolderOpen className="relative z-10 h-10 w-10 text-primary opacity-90" />
                      </div>
                      <h3 className="font-bold text-2xl">No projects found</h3>
                      <p className="mt-2 mb-6 max-w-sm text-muted-foreground">
                        No projects match your current filters.
                      </p>
                      {(search || visibility !== "all" || program !== "all") && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearch("");
                            setVisibility("all");
                            setProgram("all");
                            setPage(1);
                          }}
                        >
                          Clear all filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {data.items.map((project) => (
                  <TableRow
                    key={project.projectId}
                    className="h-15 cursor-pointer transition-colors hover:bg-muted/30"
                    onClick={() => openProjectDrawer(project)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1">
                        <span className="line-clamp-1" title={project.projectTitle}>
                          {project.projectTitle}
                        </span>
                        <span className="line-clamp-1 text-muted-foreground text-xs">
                          {project.projectDescription || "No description provided."}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {project.pi ? (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.pi.id}`} />
                              <AvatarFallback>{project.pi.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="line-clamp-1 text-sm">{project.pi.fullName}</span>
                          </>
                        ) : (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>?</AvatarFallback>
                            </Avatar>
                            <span className="line-clamp-1 text-muted-foreground text-sm italic">Unknown PI</span>
                          </>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="bg-background font-normal text-xs">
                        {project.projectProgram}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={project.isPublic ? "default" : "secondary"} className="p-1">
                        {project.isPublic ? (
                          <Unlock className="h-4 w-4" aria-label="Public" />
                        ) : (
                          <Lock className="h-4 w-4" aria-label="Private" />
                        )}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right text-muted-foreground text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <span>
                          {project.submissionDate ? new Date(project.submissionDate).toLocaleDateString() : "—"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProjectDrawer(project);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            Showing{" "}
            <span className="font-medium text-foreground">
              {startItem}-{endItem}
            </span>{" "}
            of <span className="font-medium text-foreground">{totalItems}</span> projects
          </p>

          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={!data.meta.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isNearCurrent = Math.abs(pageNum - page) <= 2;
                const isEdge = pageNum === 1 || pageNum === totalPages;

                if (!isNearCurrent && !isEdge) {
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return (
                      <PaginationItem key={pageNum}>
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={!data.meta.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <ProjectDetailsDrawer
        open={!!selectedProjectId && !!projectDetails}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProjectId(null);
          }
        }}
        project={projectDetails || null}
      />
    </div>
  );
}
