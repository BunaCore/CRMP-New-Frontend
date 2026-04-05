"use client";

import { Coins } from "lucide-react";

import { RequiresPermissions } from "@/access-control/permission-gates";

import { BudgetRequestDrawer } from "./_components/budget-drawer";
import { BudgetRequestModals } from "./_components/budget-modals";
import { BudgetRequestsTable } from "./_components/budget-table";
import { BudgetRequestsProvider } from "./budget-context";

export default function BudgetRequestsPage() {
  return (
    <BudgetRequestsProvider>
      <RequiresPermissions
        permissions={["BUDGET_VIEW", "BUDGET_APPROVE", "BUDGET_REJECT"]}
        mode="any"
        fallback="notFoundOrRedirect"
      >
        <div className="flex flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8">
          {/* ── PAGE HEADER ── */}
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h1 className="flex items-center gap-2 font-bold text-2xl text-slate-900 tracking-tight dark:text-slate-100">
                <Coins className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                Budget Requests
              </h1>
              <p className="mt-0.5 max-w-2xl text-slate-500 text-sm">
                Review fund release requests, validate clearance documents, and stamp payments as transferred. All
                actions are recorded with bank transaction references for audit compliance.
              </p>
            </div>
          </div>

          <BudgetRequestsTable />
          <BudgetRequestDrawer />
          <BudgetRequestModals />
        </div>
      </RequiresPermissions>
    </BudgetRequestsProvider>
  );
}
