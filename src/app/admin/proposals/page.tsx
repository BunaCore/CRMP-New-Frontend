"use client";

import React from "react";
import { ProposalsProvider } from "./proposals-context";
import { ProposalsTable } from "./_components/proposals-table";
import { ProposalsDrawer } from "./_components/proposals-drawer";
import { ActionsAndModals } from "./_components/actions-and-modals";
import { FileText } from "lucide-react";

export default function AdminProposalsPage() {
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

        {/* ── Main Layout Components ── */}
        <ProposalsTable />
        <ProposalsDrawer />
        <ActionsAndModals />
      </div>
    </ProposalsProvider>
  );
}
