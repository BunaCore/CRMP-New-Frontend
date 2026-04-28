import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { CreateProposalFormValues } from "../../schema/create-proposal";

export function BudgetStep() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<CreateProposalFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "budget",
  });

  const budgetRows = watch("budget");

  const calculateTotalBudget = () => {
    return budgetRows.reduce((acc, row) => acc + (parseFloat(String(row.amount)) || 0), 0);
  };

  const handleAddBudgetRow = () => {
    append({ description: "", amount: 0, title: "" });
  };

  return (
    <div className="fade-in slide-in-from-right-4 mx-auto mt-4 flex max-w-4xl animate-in flex-col gap-5 duration-500">
      {/* Financial Dashboard Header */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/40 p-5 sm:flex-row dark:border-slate-800 dark:bg-slate-900/10">
        <div>
          <h3 className="font-bold text-base text-slate-800 tracking-tight dark:text-slate-100">
            Project Financial Breakdown
          </h3>
          <p className="mt-1 text-slate-500 text-sm">Itemize all estimated expenditures for this research.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden h-10 w-px bg-slate-200 sm:block dark:bg-slate-800" />
          <div className="text-right">
            <p className="font-bold text-[10px] text-slate-400 text-sm uppercase tracking-widest">
              Initial Grant Estimate
            </p>
            <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
              {calculateTotalBudget().toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              Birr
            </p>
          </div>
        </div>
      </div>

      {errors.budget?.root?.message && (
        <div className="font-semibold text-red-500 text-sm">{errors.budget.root.message}</div>
      )}

      {/* Table Construction */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11 w-[20%] px-4 font-bold text-slate-700 text-xs uppercase tracking-wider dark:text-slate-300">
                Category
              </TableHead>
              <TableHead className="h-11 px-4 font-bold text-slate-700 text-xs uppercase tracking-wider dark:text-slate-300">
                Justification / Details
              </TableHead>
              <TableHead className="h-11 w-[180px] px-4 text-right font-bold text-slate-700 text-xs uppercase tracking-wider dark:text-slate-300">
                Amount (Birr)
              </TableHead>
              <TableHead className="h-11 w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id} className="group border-slate-100 dark:border-slate-800/50">
                <TableCell className="p-2 px-3">
                  <Input
                    placeholder="e.g. Travel"
                    {...register(`budget.${index}.title`)}
                    className="h-9 border-none bg-transparent font-medium text-sm focus-visible:ring-1 focus-visible:ring-blue-500/30"
                  />
                </TableCell>
                <TableCell className="p-2 px-3">
                  <Input
                    placeholder="e.g. Academic conference flights..."
                    {...register(`budget.${index}.description`)}
                    className="h-9 border-none bg-transparent text-sm focus-visible:ring-1 focus-visible:ring-blue-500/30 dark:text-slate-300"
                  />
                  {errors.budget?.[index]?.description && (
                    <span className="text-red-500 text-xs">{errors.budget[index]?.description?.message}</span>
                  )}
                </TableCell>
                <TableCell className="p-2 px-3">
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    {...register(`budget.${index}.amount`)}
                    className="h-9 border-none bg-transparent text-right font-bold text-blue-600 focus-visible:ring-1 focus-visible:ring-blue-500/30 dark:text-blue-400"
                  />
                  {errors.budget?.[index]?.amount && (
                    <span className="block text-right text-red-500 text-xs">
                      {errors.budget[index]?.amount?.message}
                    </span>
                  )}
                </TableCell>
                <TableCell className="p-2 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-slate-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-slate-400 text-sm italic">No budget items added yet.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={handleAddBudgetRow}
          className="h-9 gap-2 border-dashed bg-slate-50/50 px-6 font-semibold text-slate-600 shadow-none hover:border-slate-300 hover:bg-slate-100 dark:bg-slate-900/20 dark:text-slate-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Expenditure Line
        </Button>
      </div>
    </div>
  );
}
