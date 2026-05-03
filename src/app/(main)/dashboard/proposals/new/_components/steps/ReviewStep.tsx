import { useFormContext } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";

import type { CreateProposalFormValues } from "../../schema/create-proposal";

export function ReviewStep() {
  const { watch } = useFormContext<CreateProposalFormValues>();

  const title = watch("title");
  const abstract = watch("abstract");
  const file = watch("file");
  const selectedTeam = watch("members") || [];
  const selectedAdvisor = watch("advisor");
  const isFunded = watch("isFunded");
  const budgetRows = watch("budget") || [];
  const departmentLabel = watch("departmentLabel");

  const calculateTotalBudget = () => {
    return budgetRows.reduce((acc, row) => acc + (parseFloat(String(row?.amount)) || 0), 0);
  };

  return (
    <div className="fade-in slide-in-from-right-4 mx-auto mt-4 flex max-w-4xl animate-in flex-col gap-6 duration-500">
      <div className="mb-2 flex items-end justify-between border-slate-200 border-b pb-3 dark:border-slate-800">
        <div>
          <h2 className="font-semibold text-lg text-slate-700 dark:text-slate-100">Review & Submit</h2>
          <p className="text-slate-500 text-sm">Please verify the details below before official submission.</p>
        </div>
        <Badge className="border-0 bg-emerald-100 font-bold text-[10px] text-emerald-800 uppercase tracking-widest shadow-none hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
          Ready
        </Badge>
      </div>

      <div className="hover:-translate-y-0.5 flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)] dark:border-slate-800/60 dark:bg-slate-950/40">
        {/* 1. Basic Details */}
        <div className="flex flex-col border-slate-200 border-b md:flex-row dark:border-slate-700">
          <div className="shrink-0 border-slate-200 border-r bg-slate-50 p-4 md:w-1/4 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">1. Basic Details</p>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div>
              <p className="mb-0.5 font-medium text-slate-500 text-sm">Proposal Title</p>
              <p className="font-semibold text-slate-900 text-sm dark:text-slate-100">{title || "—"}</p>
            </div>
            <div>
              <p className="mb-0.5 font-medium text-slate-500 text-sm">Abstract Summary</p>
              <p className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed dark:text-slate-300">
                {abstract || "—"}
              </p>
            </div>
            <div>
              <p className="mb-0.5 font-medium text-slate-500 text-sm">Department</p>
              <p className="font-medium text-slate-700 text-sm dark:text-slate-300">{departmentLabel || "—"}</p>
            </div>
            <div>
              <p className="mb-0.5 font-medium text-slate-500 text-xs">Attachments</p>
              <p className="font-medium text-slate-700 text-sm dark:text-slate-300">{file?.name || "None"}</p>
            </div>
          </div>
        </div>

        {/* 2. Team */}
        <div className="flex flex-col border-slate-200 border-b md:flex-row dark:border-slate-700">
          <div className="shrink-0 border-slate-200 border-r bg-slate-50 p-4 md:w-1/4 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">2. Project Team</p>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
              <div className="col-span-full mb-1">
                <p className="font-medium text-slate-500 text-sm">Members ({selectedTeam.length + 1})</p>
              </div>
              {/* Current user as PI */}
              {(() => {
                const { user } = useAuthStore.getState();
                return user ? (
                  <div
                    key="pi-badge"
                    className="flex items-center gap-1 truncate rounded-full border border-blue-200 bg-blue-50 px-2 py-1 font-medium text-[13px] text-blue-800 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-300"
                  >
                    <span className="truncate">{user.fullName}</span>
                    <Badge className="h-4 whitespace-nowrap bg-blue-600 px-1 text-[10px] text-white">PI</Badge>
                  </div>
                ) : null;
              })()}
              {/* Other members — labels stored in form state */}
              {selectedTeam.map((m) => (
                <div
                  key={m.value}
                  className="truncate rounded-full border border-slate-200 bg-slate-100 px-2 py-1 font-medium text-[13px] text-slate-800 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
                >
                  {m.label}
                </div>
              ))}
            </div>
            <div className="mt-1">
              <p className="mb-1 font-medium text-slate-500 text-sm">Primary Advisor</p>
              {selectedAdvisor ? (
                <p className="font-semibold text-[13px] text-indigo-700 dark:text-indigo-400">
                  {selectedAdvisor.label}
                </p>
              ) : (
                <p className="text-slate-400 text-sm italic">None</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Budget */}
        {isFunded && (
          <div className="flex flex-col md:flex-row">
            <div className="shrink-0 border-slate-200 border-r bg-slate-50 p-4 md:w-1/4 dark:border-slate-700 dark:bg-slate-900">
              <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">3. Budget Estimation</p>
            </div>
            <div className="flex flex-1 items-center p-4">
              <div>
                <p className="mb-1 font-medium text-slate-500 text-sm">Total Funds Requested</p>
                <p className="font-bold text-slate-900 text-xl dark:text-slate-100">
                  Birr{" "}
                  {calculateTotalBudget().toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  Birr
                </p>
                <p className="mt-1 text-slate-400 text-xs">Spanning {budgetRows.length} categorized items.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
