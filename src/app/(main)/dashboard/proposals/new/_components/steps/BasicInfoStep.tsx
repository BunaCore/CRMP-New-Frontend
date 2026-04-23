// biome-ignore-all lint/a11y/useSemanticElements: ignore use semantic
import type * as React from "react";
import { useState } from "react";

import { Check, FileUp, Loader2, Plus } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchDepartments } from "@/lib/api/departments/queries";
import { ProposalProgram } from "@/lib/api/proposals/types";
import { cn } from "@/lib/utils";

import type { CreateProposalFormValues } from "../../schema/create-proposal";

export function BasicInfoStep() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateProposalFormValues>();

  const file = watch("file");
  const _departmentLabel = watch("departmentLabel");

  // Department search state
  const [deptSearch, setDeptSearch] = useState("");
  const debouncedDeptSearch = useDebounce(deptSearch, 300);
  const isDeptSearchActive = debouncedDeptSearch.trim().length > 0;
  const { data: departments = [], isLoading: loadingDepts } = useSearchDepartments(
    debouncedDeptSearch,
    isDeptSearchActive,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must not exceed 10MB");
        return;
      }
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Only PDF and DOCX files are allowed");
        return;
      }
      setValue("file", selectedFile, { shouldValidate: true });
    }
  };

  return (
    <div className="fade-in slide-in-from-right-4 mx-auto mt-4 flex max-w-4xl animate-in flex-col gap-6 duration-500">
      {/* Proposal Title */}
      <div className="grid gap-1.5">
        <Label htmlFor="title" className={cn("font-semibold text-sm", errors.title && "text-red-500")}>
          Proposal Title
        </Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="e.g. Next-Gen Photovoltaic Micro-Cells..."
          className={cn(
            "h-10 rounded-md bg-white font-medium text-sm shadow-xs transition-shadow focus:shadow-md dark:bg-slate-950",
            errors.title && "border-red-500 focus-visible:ring-red-500",
          )}
        />
        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
      </div>

      {/* Research Info */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-1.5">
          <Label
            htmlFor="researchArea"
            className={cn(
              "font-semibold text-slate-700 text-sm dark:text-slate-300",
              errors.researchArea && "text-red-500",
            )}
          >
            Research Area
          </Label>
          <Input
            id="researchArea"
            {...register("researchArea")}
            placeholder="e.g. Renewable Energy..."
            className={cn(
              "h-10 rounded-md bg-white text-sm dark:bg-slate-950",
              errors.researchArea && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.researchArea && <p className="text-red-500 text-xs">{errors.researchArea.message}</p>}
        </div>

        <div className="grid gap-1.5">
          <Label
            htmlFor="proposalProgram"
            className={cn(
              "font-semibold text-slate-700 text-sm dark:text-slate-300",
              errors.proposalProgram && "text-red-500",
            )}
          >
            Proposal Program
          </Label>
          <Controller
            control={control}
            name="proposalProgram"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={cn(
                    "h-10 rounded-md bg-white text-sm dark:bg-slate-950",
                    errors.proposalProgram && "border-red-500 focus-visible:ring-red-500",
                  )}
                >
                  <SelectValue placeholder="Select a program..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProposalProgram.UG}>Undergraduate (UG)</SelectItem>
                  <SelectItem value={ProposalProgram.PG}>Postgraduate (PG)</SelectItem>
                  <SelectItem value={ProposalProgram.GENERAL}>General</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.proposalProgram && <p className="text-red-500 text-xs">{errors.proposalProgram.message}</p>}
        </div>

        {/* Department — Combobox (single, search-first) */}
        <div className="grid gap-1.5 sm:col-span-2 lg:col-span-1">
          <Label
            htmlFor="departmentId"
            className={cn(
              "font-semibold text-slate-700 text-sm dark:text-slate-300",
              errors.departmentId && "text-red-500",
            )}
          >
            Host Department
          </Label>
          <Controller
            control={control}
            name="departmentId"
            render={({ field }) => (
              <Combobox
                value={field.value || ""}
                onValueChange={(val) => {
                  field.onChange(val);
                  const dept = departments.find((d) => d.value === val);
                  setValue("departmentLabel", dept?.label || "");
                  setDeptSearch(dept?.label || "");
                }}
              >
                <ComboboxInput
                  placeholder="Search department..."
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                  showClear={!!field.value}
                  className={cn(
                    "h-10 rounded-md bg-white text-sm dark:bg-slate-950",
                    errors.departmentId && "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                <ComboboxContent>
                  <ComboboxList>
                    {loadingDepts && isDeptSearchActive && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    {departments.map((dept) => (
                      <ComboboxItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </ComboboxItem>
                    ))}
                    <ComboboxEmpty>
                      {isDeptSearchActive ? "No departments found." : "Type to search departments..."}
                    </ComboboxEmpty>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          />
          {errors.departmentId && <p className="text-red-500 text-xs">{errors.departmentId.message}</p>}
        </div>
      </div>

      {/* Duration & Funding Toggle */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label
            htmlFor="durationMonths"
            className={cn("font-semibold text-sm", errors.durationMonths && "text-red-500")}
          >
            Estimated Duration (Months)
          </Label>
          <Input
            id="durationMonths"
            type="number"
            min="1"
            {...register("durationMonths")}
            placeholder="e.g. 12"
            className={cn(
              "h-10 rounded-md bg-white text-sm dark:bg-slate-950",
              errors.durationMonths && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.durationMonths && <p className="text-red-500 text-xs">{errors.durationMonths.message}</p>}
        </div>
        <div className="flex flex-col justify-end">
          <Label className="mb-2 font-semibold text-slate-700 text-sm dark:text-slate-300">Grant & Funding</Label>
          <Controller
            control={control}
            name="isFunded"
            render={({ field }) => (
              <div
                role="button"
                tabIndex={0}
                onClick={() => field.onChange(!field.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    field.onChange(!field.value);
                  }
                }}
                className={cn(
                  "group flex h-16 cursor-pointer select-none items-center justify-between rounded-xl border p-4 transition-all duration-300",
                  field.value
                    ? "border-blue-200 bg-blue-50/50 shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:border-blue-800/50 dark:bg-blue-900/10"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                      field.value
                        ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900",
                    )}
                  >
                    <Plus className={cn("h-4 w-4 transition-transform duration-300", field.value && "rotate-45")} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[13px] text-slate-900 leading-tight dark:text-slate-100">
                      Is this a funded project?
                    </span>
                    <span className="text-[11px] text-slate-500">
                      If enabled, the Department Head will release the budget for this project.
                    </span>
                  </div>
                </div>
                <Switch
                  id="isFunded"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="pointer-events-none data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="isFunded" className="sr-only cursor-pointer font-medium text-sm">
                  Is Funded
                </Label>
              </div>
            )}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="abstract" className={cn("font-semibold text-sm", errors.abstract && "text-red-500")}>
          Abstract & Core Objectives
        </Label>
        <Textarea
          id="abstract"
          {...register("abstract")}
          placeholder="Provide a comprehensive summary of the research scope, expected outcomes, and scientific merit..."
          className={cn(
            "min-h-[140px] resize-y rounded-md bg-white text-sm dark:bg-slate-950",
            errors.abstract && "border-red-500 focus-visible:ring-red-500",
          )}
        />
        {errors.abstract && <p className="text-red-500 text-xs">{errors.abstract.message}</p>}
      </div>

      <div className="grid gap-1.5">
        <Label className="font-semibold text-sm">Supporting Layout Files</Label>
        <Controller
          control={control}
          name="file"
          render={({ field }) => (
            <>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => {
                  handleFileChange(e);
                }}
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-slate-300 border-dashed bg-slate-50/20 p-8 text-center transition-all hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-800/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <FileUp className="h-5 w-5" />
                </div>
                <p className="mt-2 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                  Upload full proposal layout
                </p>
                <p className="mt-0.5 text-balance text-slate-500 text-xs">PDF or DOCX (maximum 10MB)</p>
                {file && (
                  <div className="mt-4 flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-300">
                    <Check className="h-3.5 w-3.5" />
                    <span className="max-w-[200px] truncate font-semibold text-xs">{file.name}</span>
                  </div>
                )}
              </label>
            </>
          )}
        />
      </div>
    </div>
  );
}
