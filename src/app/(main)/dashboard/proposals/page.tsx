"use client";

import * as React from "react";

import Link from "next/link";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Clock,
  Edit,
  Eye,
  FileText,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyProposals } from "@/lib/api/proposals/queries";
import type { ResearcherProposal } from "@/lib/api/proposals/types";
import {
  formatProposalDate,
  formatRelativeDate,
  getStatusBadgeClass,
  getStatusLabel,
  shortProposalId,
} from "@/lib/api/proposals/utils";

// ─── Tab definitions ───────────────────────────────────────────────────────────

const TABS = [
  { value: "all", label: "All" },
  { value: "Draft", label: "Drafts" },
  { value: "Under_Review", label: "Under Review" },
  { value: "Revision", label: "Revisions" },
  { value: "Accepted", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Pending", label: "Submitted" },
] as const;

// ─── Loading skeleton rows ─────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <TableRow className="border-slate-100 dark:border-slate-800/50">
      <TableCell className="px-6 py-4">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <Skeleton className="h-5 w-24 rounded-sm" />
      </TableCell>
      <TableCell className="hidden px-6 py-4 md:table-cell">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </TableCell>
      <TableCell className="px-6 py-4 text-right">
        <Skeleton className="ml-auto h-8 w-8 rounded-full" />
      </TableCell>
    </TableRow>
  );
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function ProposalsPage() {
  const [proposals, setProposals] = React.useState<ResearcherProposal[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("all");
  const [search, setSearch] = React.useState("");

  // ─── Fetch proposals ─────────────────────────────────────────────────────────

  const fetchProposals = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProposals();
      setProposals(data);
    } catch {
      setError("Failed to load proposals. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  // ─── Filtering ───────────────────────────────────────────────────────────────

  const filteredProposals = React.useMemo(() => {
    let result = proposals;

    // Status tab filter
    if (activeTab !== "all") {
      result = result.filter((p) => p.status === activeTab);
    }

    // Client-side search by title
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    return result;
  }, [proposals, activeTab, search]);

  // ─── Tab counts ──────────────────────────────────────────────────────────────

  const tabCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: proposals.length };
    for (const p of proposals) {
      counts[p.status] = (counts[p.status] ?? 0) + 1;
    }
    return counts;
  }, [proposals]);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 lg:p-10 ">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-extrabold text-lg text-slate-900 tracking-tight sm:text-2xl dark:text-slate-100">
            My Proposals
          </h1>
          <p className="mt-1 text-slate-500 text-xs md:text-sm dark:text-slate-400">
            Track and manage all your research proposals in one place.
          </p>
        </div>
        <Link href="/dashboard/proposals/new" className="w-full sm:w-auto">
          <Button className="group h-8 w-full rounded-full border-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 text-xs font-medium text-white shadow transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-sm">
            <Plus className="mr-1 h-3 w-3 transition-transform duration-300 group-hover:rotate-90" />
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Error Banner */}
      {error && !loading && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex flex-1 items-start justify-between gap-4">
            <p className="text-red-700 text-sm dark:text-red-300">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchProposals}
              className="h-7 shrink-0 rounded-full px-3 text-red-700 text-xs hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <RefreshCw className="mr-1.5 h-3 w-3" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Tabs + Table */}
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            {/* Tab List */}
            <div className="-mb-1 scrollbar-hide w-full overflow-x-auto pb-1 md:w-auto">
              <TabsList className="h-auto rounded-lg border border-slate-200/50 bg-slate-100/50 p-1 dark:border-slate-800/50 dark:bg-slate-900/50">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-md px-4 font-medium text-slate-500 transition-all hover:text-slate-900 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm dark:hover:text-slate-100"
                  >
                    {tab.label}

                    {!loading && tabCounts[tab.value] > 0 && (
                      <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0.5 font-semibold text-[10px] text-slate-600 leading-none data-[state=active]:bg-white/20 data-[state=active]:text-white dark:bg-slate-700 dark:text-slate-400">
                        {tabCounts[tab.value]}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Search + Filter */}
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="relative w-full md:w-[240px]">
                {loading ? (
                  <Loader2 className="absolute top-2.5 left-2.5 h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-500" />
                )}
                <Input
                  type="search"
                  placeholder="Search proposals..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border-slate-200 bg-white pl-9 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                />
              </div>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <Card className="overflow-hidden rounded-xl border-slate-200/60 bg-white shadow-none dark:border-slate-800/60 dark:bg-slate-950/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50 dark:bg-slate-900/20">
                    <TableRow className="border-slate-100 hover:bg-transparent dark:border-slate-800">
                      <TableHead className="h-11 w-[110px] px-6 font-medium text-slate-500">ID</TableHead>
                      <TableHead className="h-11 px-6 font-medium text-slate-500">Proposal Details</TableHead>
                      <TableHead className="h-11 px-6 font-medium text-slate-500">Status</TableHead>
                      <TableHead className="hidden h-11 px-6 font-medium text-slate-500 md:table-cell">
                        Submitted
                      </TableHead>
                      <TableHead className="h-11 px-6 text-right font-medium text-slate-500">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {/* ── Loading state ── */}
                    {loading &&
                      Array.from({ length: 5 }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: skeletons have no identity
                        <SkeletonRow key={i} />
                      ))}

                    {/* ── Populated rows ── */}
                    {!loading &&
                      filteredProposals.length > 0 &&
                      filteredProposals.map((proposal) => (
                        <motion.tr
                          key={proposal.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.25 }}
                          whileHover={{ scale: 1.01 }}
                          className="border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-slate-800/50 dark:hover:bg-slate-800/20"
                        >
                          {/* ID */}
                          <TableCell className="px-6 py-4 font-medium font-mono text-slate-500 text-xs dark:text-slate-400">
                            {shortProposalId(proposal.id)}
                          </TableCell>

                          {/* Title + Department */}
                          <TableCell className="max-w-[300px] px-6 py-4 lg:max-w-[400px]">
                            <div className="flex flex-col gap-1.5">
                              <span className="line-clamp-1 font-semibold text-slate-800 dark:text-slate-200">
                                {proposal.title}
                              </span>
                              <span className="line-clamp-1 text-slate-500 text-xs">
                                {proposal.department?.name ?? "—"}
                                {proposal.type ? ` · ${proposal.type}` : ""}
                              </span>
                            </div>
                          </TableCell>

                          {/* Status badge */}
                          <TableCell className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={`${getStatusBadgeClass(proposal.status)} inline-flex items-center whitespace-nowrap rounded px-2.5 py-0.5 shadow-none`}
                            >
                              {getStatusLabel(proposal.status)}
                            </Badge>
                          </TableCell>

                          {/* Date */}
                          <TableCell className="hidden px-6 py-4 md:table-cell">
                            <div className="flex flex-col gap-1">
                              <span className="text-slate-700 text-sm dark:text-slate-300">
                                {formatProposalDate(proposal.createdAt)}
                              </span>
                              <span className="flex items-center gap-1 text-emerald-600 text-xs">
                                <Clock className="h-3 w-3 text-emerald-600" />
                                {formatRelativeDate(proposal.createdAt)}
                              </span>
                            </div>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 rounded-full p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
                                <DropdownMenuLabel className="font-normal text-slate-500 text-xs">
                                  Proposal Actions
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <Link href={`/dashboard/proposals/${proposal.id}`}>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                </Link>

                                {(proposal.status === "Draft" || proposal.status === "Revision") && (
                                  <Link href={`/dashboard/proposals/${proposal.id}/edit`}>
                                    <DropdownMenuItem className="cursor-pointer text-blue-600 dark:text-blue-400">
                                      <Edit className="mr-2 h-4 w-4" />
                                      Continue Editing
                                    </DropdownMenuItem>
                                  </Link>
                                )}

                                {proposal.status === "Draft" && (
                                  <DropdownMenuItem className="cursor-pointer text-emerald-600 dark:text-emerald-400">
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Proposal
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}

                    {/* ── Empty state (no data after fetch) ── */}
                    {!loading && !error && filteredProposals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-48 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                              <FileText className="h-7 w-7 text-slate-400 dark:text-slate-500" />
                            </div>
                            {search ? (
                              <>
                                <p className="font-medium text-slate-700 text-sm dark:text-slate-300">
                                  No proposals match &ldquo;{search}&rdquo;
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSearch("")}
                                  className="h-7 rounded-full text-slate-500 text-xs"
                                >
                                  Clear search
                                </Button>
                              </>
                            ) : (
                              <>
                                <p className="font-medium text-slate-700 text-sm dark:text-slate-300">
                                  No proposals in this category
                                </p>
                                <p className="max-w-xs text-center text-slate-400 text-xs">
                                  {activeTab === "all"
                                    ? "You haven't submitted any proposals yet. Start by creating a new one."
                                    : `No proposals with status "${getStatusLabel(activeTab)}" found.`}
                                </p>
                                {activeTab === "all" && (
                                  <Link href="/dashboard/proposals/new">
                                    <Button
                                      size="sm"
                                      className="mt-1 rounded-full border-0 bg-blue-600 px-4 text-white hover:bg-blue-700"
                                    >
                                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                                      New Proposal
                                    </Button>
                                  </Link>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
