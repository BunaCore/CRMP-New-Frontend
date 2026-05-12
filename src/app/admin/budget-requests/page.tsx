"use client";

import Link from "next/link";

import { AlertCircle, Lock, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";

import { BudgetRequestDrawer } from "./_components/BudgetRequestDrawer";
import { BudgetRequestsTable } from "./_components/BudgetRequestsTable";
import { ControlsRow } from "./_components/ControlsRow";
import { MetricCards, MetricCardsSkeleton } from "./_components/MetricCards";
import { ApproveModal } from "./_components/modals/ApproveModal";
import { ReturnModal } from "./_components/modals/ReturnModal";
import { BudgetRequestsProvider } from "./_context/BudgetRequestsContext";
import { useBudgetMetrics } from "./_hooks/useBudgetMetrics";

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
            <h2 className="font-bold text-foreground text-xl tracking-tight">Finance Access Only</h2>
            <p className="mt-1 text-muted-foreground text-sm">
              You do not have the required permissions to access the Finance Budget Management module.
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

// ─── Page Content ──────────────────────────────────────────────────────────
function BudgetRequestsPageContent() {
  const { metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useBudgetMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Budget Disbursement Requests</h1>
        <p className="text-muted-foreground text-sm">Review and release approved project funds</p>
      </div>

      {/* Metric Cards */}
      {metricsLoading ? (
        <MetricCardsSkeleton />
      ) : metricsError ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{metricsError}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={refetchMetrics} className="h-8 gap-1">
              <RefreshCw className="h-3 w-3" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        metrics && <MetricCards data={metrics} />
      )}

      {/* Controls: Tabs, Search, Export */}
      <ControlsRow />

      {/* Main Table */}
      <BudgetRequestsTable isLoading={metricsLoading} />

      {/* Overlays */}
      <BudgetRequestDrawer />
      <ApproveModal />
      <ReturnModal />
    </div>
  );
}

// ─── Entry Point ───────────────────────────────────────────────────────────
export default function BudgetRequestsPage() {
  const { user } = useAuthStore();
  const permissions = user?.permissions ?? [];

  if (!permissions.includes("BUDGET_VIEW")) {
    return <AccessDenied />;
  }

  return (
    <BudgetRequestsProvider>
      <BudgetRequestsPageContent />
    </BudgetRequestsProvider>
  );
}
