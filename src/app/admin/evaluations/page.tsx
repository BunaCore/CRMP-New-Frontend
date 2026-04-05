"use client";

import React from "react";
import { EvaluationsProvider } from "./evaluations-context";
import { EvaluationsTabs } from "./_components/evaluations-tabs";
import { EvaluationDrawer } from "./_components/evaluation-drawer";
import { ActionsAndModals } from "./_components/actions-and-modals";
import { ClipboardList } from "lucide-react";

export default function AdminEvaluationsPage() {
  return (
    <EvaluationsProvider>
      <div className="flex flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 font-bold text-2xl text-slate-900 tracking-tight dark:text-slate-100">
              <ClipboardList className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Evaluations
            </h1>
            <p className="mt-0.5 max-w-2xl text-slate-500 text-sm">
              Review scoring rubrics, schedule defences, and approve completed evaluations for proposals and funded projects.
            </p>
          </div>
        </div>

        <EvaluationsTabs />
        <EvaluationDrawer />
        <ActionsAndModals />
      </div>
    </EvaluationsProvider>
  );
}
