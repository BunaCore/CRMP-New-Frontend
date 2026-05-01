"use client";

import { useState } from "react";

import { FileText, LayoutGrid } from "lucide-react";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { usePendingApprovalsQuery, useProposalsListQuery } from "@/lib/api/proposals/queries";
import type { ProposalListQueryParams } from "@/lib/api/proposals/types";

import { ProposalViewToggle } from "../_components/proposal-view-toggle";
import { ProposalsDrawer } from "./_components/proposals-drawer";
import { ProposalsTable } from "./_components/proposals-table";
import { ProposalsProvider } from "./proposals-context";

export default function AdminProposalsPage() {
  const [outerTab, setOuterTab] = useState<"pending" | "proposals">("pending");
  const [filterParams, setFilterParams] = useState<ProposalListQueryParams>({});

  // Fetch both data sources via React Query
  const pendingApprovalsQuery = usePendingApprovalsQuery();
  const proposalsListQuery = useProposalsListQuery(filterParams, outerTab === "proposals");

  return (
    <ProposalsProvider>
      <div className="flex flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8">
        {/* ── Header ── */}
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 font-bold text-2xl text-slate-900 tracking-tight dark:text-slate-100">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              Proposal Management
            </h1>
            <p className="mt-0.5 text-slate-500 text-sm">
              Route, assign, and manage all submitted research proposals across the university.
            </p>
          </div>
        </div>

        {/* ── Tab Switch ── */}
        <Tabs
          value={outerTab}
          onValueChange={(v: string) => setOuterTab(v as "pending" | "proposals")}
          className="w-full"
        >
          <ProposalViewToggle
            leftValue="pending"
            leftLabel="Pending Approvals"
            leftIcon={<LayoutGrid className="mr-2 h-4 w-4" />}
            rightValue="proposals"
            rightLabel="All Proposals"
            rightIcon={<LayoutGrid className="mr-2 h-4 w-4" />}
          />

          {/* ── Tab: Pending Approvals ── */}
          <TabsContent value="pending" className="mt-6">
            <ProposalsTable
              data={pendingApprovalsQuery.data ?? []}
              isLoading={pendingApprovalsQuery.isLoading}
              type="pending"
              onFilterChange={() => {
                console.log;
              }}
            />
          </TabsContent>

          {/* ── Tab: All Proposals ── */}
          <TabsContent value="proposals" className="mt-6">
            <ProposalsTable
              data={proposalsListQuery.data ?? []}
              isLoading={proposalsListQuery.isLoading}
              type="proposals"
              onFilterChange={setFilterParams}
              filterParams={filterParams}
            />
          </TabsContent>
        </Tabs>

        {/* ── Drawer (shown for both tabs) ── */}
        <ProposalsDrawer />
      </div>
    </ProposalsProvider>
  );
}
