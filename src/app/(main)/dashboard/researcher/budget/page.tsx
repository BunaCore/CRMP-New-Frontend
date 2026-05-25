"use client";

import { useState } from "react";

import Link from "next/link";

import { AlertCircle, Ban, CircleDollarSign, Lock, Plus, RefreshCw } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/authStore";

import { BudgetItemsTable, BudgetItemsTableSkeleton } from "./_components/BudgetItemsTable";
import { DisbursementHistoryTable, DisbursementHistoryTableSkeleton } from "./_components/DisbursementHistoryTable";
import { MetricCards, MetricCardsSkeleton } from "./_components/MetricCards";
import { NewRequestDialog } from "./_components/NewRequestDialog";
import { ProjectSelectorCard, ProjectSelectorSkeleton } from "./_components/ProjectSelectorCard";
import { ReturnedBanner } from "./_components/ReturnedBanner";
import { useMyProjects } from "./_hooks/useMyProjects";
import { useProjectBudget } from "./_hooks/useProjectBudget";

// ─── Access Denied fallback ────────────────────────────────────────────────
function AccessDenied() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md border-border text-center shadow-lg">
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-950/40">
            <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-xl tracking-tight">Access Restricted</h2>
            <p className="mt-1 text-muted-foreground text-sm">
              You do not have permission to view the Budget module. Contact your administrator if you believe this is an
              error.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-2">
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────
function NoProjects() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center text-muted-foreground">
      <CircleDollarSign className="h-14 w-14 text-muted-foreground/30" />
      <div>
        <p className="font-semibold text-base text-foreground">No Projects Found</p>
        <p className="mt-1 text-sm">You have no approved projects with a budget assigned yet.</p>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ResearcherBudgetPage() {
  const { user } = useAuthStore();
  const permissions = user?.permissions ?? [];

  // ── Permission gate
  if (!permissions.includes("BUDGET_VIEW") || user?.userProgram === "UG") {
    return <AccessDenied />;
  }

  return <BudgetPageContent />;
}

function BudgetPageContent() {
  const { projects, isLoading: projectsLoading, error: projectsError, refetch: refetchProjects } = useMyProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Auto-select first project when data loads
  const effectiveProjectId = selectedProjectId ?? (projects.length > 0 ? projects[0].projectId : null);

  const {
    dashboard,
    isLoading: dashLoading,
    error: dashError,
    refetch: refetchDashboard,
  } = useProjectBudget(effectiveProjectId);

  // ── Disabled reason for "Request Funds" button
  const _activeRequest = dashboard?.disbursementHistory.find(
    (r) => r.status === "PENDING" || r.status === "RESUBMITTED",
  );
  const returnedRequest = dashboard?.disbursementHistory.find((r) => r.status === "RETURNED");
  const hasAvailableItems = dashboard?.budgetItems.some((i) => i.status === "AVAILABLE");

  const requestDisabledReason: string | null = returnedRequest
    ? "You must fix and resubmit your returned request before making a new one."
    : !dashboard
      ? null
      : dashboard.budgetItems.length === 0
        ? "No budget line items have been assigned to this project."
        : !hasAvailableItems
          ? "All budget items have been requested or disbursed."
          : null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl text-foreground tracking-tight">Budget Management</h1>
          <p className="mt-0.5 text-muted-foreground text-sm">
            View and manage disbursement requests for your approved research projects.
          </p>
        </div>

        {/* Request Funds button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  className="gap-2 shadow-sm"
                  disabled={!!requestDisabledReason || !dashboard || dashLoading}
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Request Funds
                </Button>
              </span>
            </TooltipTrigger>
            {requestDisabledReason && (
              <TooltipContent side="bottom" className="max-w-xs text-center text-xs">
                <Ban className="mx-auto mb-1 h-3.5 w-3.5 text-red-400" />
                {requestDisabledReason}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Returned request banner */}
      <ReturnedBanner projects={projects} onSelectProject={(id) => setSelectedProjectId(id)} />

      {/* ── Projects Loading ── */}
      {projectsLoading && <ProjectSelectorSkeleton />}

      {/* ── Projects Error ── */}
      {!projectsLoading && projectsError && (
        <Alert className="border-destructive/40 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="flex items-center justify-between">
            <span>{projectsError}</span>
            <Button variant="outline" size="sm" className="ml-4 h-7 gap-1.5 text-xs" onClick={refetchProjects}>
              <RefreshCw className="h-3 w-3" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── No projects ── */}
      {!projectsLoading && !projectsError && projects.length === 0 && <NoProjects />}

      {/* ── Project Selector Cards ── */}
      {!projectsLoading && !projectsError && projects.length > 0 && (
        <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {projects.map((project) => (
            <ProjectSelectorCard
              key={project.projectId}
              project={project}
              isSelected={effectiveProjectId === project.projectId}
              onClick={() => setSelectedProjectId(project.projectId)}
            />
          ))}
        </div>
      )}

      {/* ── Dashboard for selected project ── */}
      {effectiveProjectId && (
        <div className="space-y-6">
          {/* Dashboard Error */}
          {!dashLoading && dashError && (
            <Alert className="border-destructive/40 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="flex items-center justify-between">
                <span>{dashError}</span>
                <Button variant="outline" size="sm" className="ml-4 h-7 gap-1.5 text-xs" onClick={refetchDashboard}>
                  <RefreshCw className="h-3 w-3" /> Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Metric Cards */}
          {dashLoading ? <MetricCardsSkeleton /> : dashboard && <MetricCards dashboard={dashboard} />}

          {/* Approved Budget Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-semibold text-base">Approved Budget Items</CardTitle>
            </CardHeader>
            <CardContent>
              {dashLoading ? (
                <BudgetItemsTableSkeleton />
              ) : (
                dashboard && <BudgetItemsTable items={dashboard.budgetItems} />
              )}
            </CardContent>
          </Card>

          {/* Disbursement History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-semibold text-base">Disbursement History</CardTitle>
            </CardHeader>
            <CardContent>
              {dashLoading ? (
                <DisbursementHistoryTableSkeleton />
              ) : (
                dashboard && (
                  <DisbursementHistoryTable
                    history={dashboard.disbursementHistory}
                    onResubmitSuccess={refetchDashboard}
                  />
                )
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Request Dialog */}
      {dashboard && (
        <NewRequestDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSuccess={() => {
            refetchDashboard();
            refetchProjects();
          }}
          projectId={dashboard.projectId}
          budgetItems={dashboard.budgetItems}
          disbursementHistory={dashboard.disbursementHistory}
        />
      )}
    </div>
  );
}
