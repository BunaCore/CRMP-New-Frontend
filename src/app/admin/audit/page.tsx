"use client";

import { useMemo, useState } from "react";

import { motion } from "framer-motion";
import { Activity, AlertTriangle, Clock3, Copy, LayoutList, Loader2, Search, UserCog } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useAuditLogsInfiniteQuery, useAuditStatsQuery } from "@/lib/api/audit/queries";
import type { AuditEntityType, AuditEntry, CursorAuditResponse } from "@/lib/api/audit/types";

import { AuditDetailsPanel } from "./_components/audit-details-panel";
import { AuditTimelineSkeleton } from "./_components/audit-timeline-skeleton";
import { actionStyles, entityIcons } from "./_constants";

export default function AdminAuditPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | AuditEntityType>("all");
  const [limit, setLimit] = useState<number>(20);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: statsData } = useAuditStatsQuery();
  const { copy } = useCopyToClipboard();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useAuditLogsInfiniteQuery({
    search: search.trim() || undefined,
    entityType: activeFilter === "all" ? undefined : activeFilter,
    limit,
  });

  const allItems = useMemo<AuditEntry[]>(() => {
    return data?.pages.flatMap((page: CursorAuditResponse) => page.items) || [];
  }, [data]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allItems.filter((entry) => {
      const matchesFilter = activeFilter === "all" || entry.entityType === activeFilter;
      const matchesQuery =
        !query ||
        [
          entry.actorFullName,
          entry.actorEmail,
          entry.action,
          entry.entityType,
          entry.entityId,
          JSON.stringify(entry.metadata),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesFilter && matchesQuery;
    });
  }, [allItems, activeFilter, search]);

  const selectedEntry = filteredItems.find((entry) => entry.id === selectedId) ?? filteredItems[0] ?? null;

  const summaryCards = [
    {
      label: "Total Events",
      value: statsData ? statsData.totalEvents.toLocaleString() : "-",
      note: "All recorded actions",
      icon: Activity,
    },
    {
      label: "Top Action",
      value: statsData?.topAction?.action.replace(/_/g, " ") || "-",
      note: statsData ? `${statsData.topAction.count} occurrences` : "Gathering metrics",
      icon: AlertTriangle,
    },
    {
      label: "Active Admins",
      value: statsData ? statsData.activeActors.toLocaleString() : "-",
      note: "Users with admin access",
      icon: UserCog,
    },
    {
      label: "Recent Login",
      value: statsData?.mostRecentActivity
        ? new Date(statsData.mostRecentActivity).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "-",
      note: "System access verified",
      icon: Clock3,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div>
              <h1 className="font-black text-3xl tracking-tight text-slate-950 dark:text-slate-50">Audit Log</h1>
              <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                A timeline view for tracking sensitive admin actions. Use the tools below to filter and investigate
                system events.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.label}
                className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/5"
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-950 dark:text-slate-50">{item.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.note}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="border-slate-200/70 bg-white shadow-sm dark:border-slate-800/70 dark:bg-slate-950/80">
        <CardContent className="space-y-5 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
                placeholder="Search actor, action, entity, or metadata..."
                className="h-11 rounded-full border-slate-200 bg-white pl-10 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "All entries", value: "all" },
                { label: "Proposals", value: "proposals" },
                { label: "Projects", value: "projects" },
                { label: "Users", value: "users" },
                { label: "Auth", value: "auth" },
              ].map((chip) => (
                <Button
                  key={chip.value}
                  variant={activeFilter === chip.value ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActiveFilter(chip.value as "all" | AuditEntityType)}
                >
                  {chip.label}
                </Button>
              ))}

              <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                <SelectTrigger className="w-[110px] h-9 rounded-full ml-auto">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.9fr)]">
            <div className="relative">
              <div className="mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <LayoutList className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <p className="font-semibold text-sm">Today</p>
              </div>

              <div className="relative pl-16">
                <div className="absolute top-0 bottom-0 left-12 w-px bg-slate-200 dark:bg-slate-800" />

                <div className="space-y-8">
                  {isLoading ? (
                    <AuditTimelineSkeleton />
                  ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 rounded-full bg-slate-100 p-3 text-slate-400 dark:bg-slate-800">
                        <Search className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">No logs found</h3>
                      <p className="text-sm text-slate-500">Adjust your search or filters to see more results.</p>
                    </div>
                  ) : (
                    filteredItems.map((entry, index) => {
                      const style = actionStyles[entry.action];
                      const EntityIcon = entityIcons[entry.entityType];
                      const isSelected = selectedEntry?.id === entry.id;
                      const actionLabel = entry.action
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/^[a-z]/, (character: string) => character.toUpperCase());

                      return (
                        <motion.button
                          key={entry.id}
                          type="button"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: index * 0.03 }}
                          onClick={() => setSelectedId(entry.id)}
                          className="relative w-full text-left"
                        >
                          <div className="absolute left-[-3rem] top-2 flex w-10 justify-end text-right font-mono text-[13px] text-slate-500 dark:text-slate-400">
                            {new Date(entry.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>

                          <div
                            className={`absolute left-12 top-2 z-[1] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-4 border-white shadow-sm dark:border-slate-950 ${style.dot}`}
                          />

                          <div
                            className={`rounded-2xl border p-4 pl-6 shadow-sm transition-colors ${
                              isSelected
                                ? "border-sky-300 bg-sky-50/70 dark:border-sky-800 dark:bg-sky-950/25"
                                : "border-slate-200/70 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800/70 dark:bg-slate-950/80 dark:hover:border-slate-700"
                            }`}
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-sky-500 text-sm">{entry.actorFullName}</span>
                                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                    {actionLabel}
                                  </span>
                                  <Badge
                                    className={`border text-[10px] font-bold uppercase tracking-wider ${style.badge}`}
                                  >
                                    {style.label}
                                  </Badge>
                                </div>

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {entry.entityType}
                                  </span>{" "}
                                  {entry.action === "LOGIN"
                                    ? "signed into the system"
                                    : entry.action === "PERMISSION_CHANGED"
                                      ? "changed access"
                                      : `${entry.action.toLowerCase()} ${entry.entityType}`}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-900">
                                    <EntityIcon className="h-3.5 w-3.5" />
                                    {entry.entityType}
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-900">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    {new Date(entry.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col items-start gap-2 sm:items-end">
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {entry.actorEmail}
                                </span>
                                <div className="inline-flex items-center gap-2">
                                  <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                    ID ••••
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      copy(entry.id);
                                    }}
                                    className="h-7 w-7 rounded-full p-0"
                                    aria-label="Copy full id"
                                  >
                                    <Copy className="h-4 w-4 text-slate-500" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <AuditDetailsPanel selectedEntry={selectedEntry} />
          </div>

          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className="rounded-full px-8"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : hasNextPage ? (
                "Load more"
              ) : (
                "No more entries"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
