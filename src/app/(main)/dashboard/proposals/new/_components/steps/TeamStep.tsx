import { useState } from "react";

import { CheckCircle2, Loader2, Search } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchAdvisors, useSearchUsers } from "@/lib/api/users/queries";
import { useAuthStore } from "@/stores/authStore";

import type { CreateProposalFormValues } from "../../schema/create-proposal";

export function TeamStep() {
  const { watch, setValue } = useFormContext<CreateProposalFormValues>();

  // Members search (debounced, backend-driven)
  const [memberSearch, setMemberSearch] = useState("");
  const debouncedMemberSearch = useDebounce(memberSearch, 300);
  const isMemberSearchActive = debouncedMemberSearch.trim().length > 0;
  const { data: memberResults = [], isLoading: loadingMembers } = useSearchUsers(
    debouncedMemberSearch,
    isMemberSearchActive,
  );

  // Advisor search (debounced, backend-driven)
  const [advisorSearch, setAdvisorSearch] = useState("");
  const debouncedAdvisorSearch = useDebounce(advisorSearch, 300);
  const isAdvisorSearchActive = debouncedAdvisorSearch.trim().length > 0;
  const { data: advisorResults = [], isLoading: loadingAdvisors } = useSearchAdvisors(
    debouncedAdvisorSearch,
    isAdvisorSearchActive,
  );

  const selectedTeam = watch("members") || [];
  const selectedAdvisor = watch("advisor");

  const handleToggleTeam = (id: string, label: string) => {
    const current = selectedTeam;
    if (current.some((m) => m.value === id)) {
      setValue(
        "members",
        current.filter((m) => m.value !== id),
        { shouldValidate: true },
      );
    } else {
      setValue("members", [...current, { value: id, label }], { shouldValidate: true });
    }
  };

  const handleRemoveMember = (id: string) => {
    setValue(
      "members",
      selectedTeam.filter((m) => m.value !== id),
      { shouldValidate: true },
    );
  };

  return (
    <div className="fade-in slide-in-from-right-4 mt-4 grid min-h-[400px] animate-in grid-cols-1 gap-8 divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/30 duration-500 lg:grid-cols-2 lg:divide-x dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/10">
      {/* Members (Left) */}
      <div className="flex flex-col gap-4 p-4 lg:p-6 lg:pr-8">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm dark:text-slate-100">Members</h3>
          <p className="mb-3 text-slate-500 text-xs">You are automatically included as PI. Add team members below.</p>

          {/* Search input */}
          <div className="relative w-full">
            <Search className="-translate-y-1/2 absolute top-1/2 left-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search members by name..."
              className="h-9 rounded-md bg-white pl-8 text-sm dark:bg-slate-950"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
          {/* Search results — only when searching */}
          {isMemberSearchActive &&
            (loadingMembers ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : memberResults.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-xs italic">No exact matches found.</div>
            ) : (
              memberResults.map((member) => {
                const isSelected = selectedTeam.some((m) => m.value === member.value);
                return (
                  <button
                    type="button"
                    key={member.value}
                    onClick={() => handleToggleTeam(member.value, member.label)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-colors ${
                      isSelected
                        ? "border-blue-400 bg-blue-50/50 shadow-sm dark:bg-blue-900/20"
                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="font-bold text-[10px]">
                        {member.label?.substring(0, 2).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-semibold text-[13px] text-slate-900 leading-tight dark:text-slate-100">
                        {member.label}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-500" />}
                  </button>
                );
              })
            ))}

          {/* Prompt when not searching and no members selected */}
          {!isMemberSearchActive && selectedTeam.length === 0 && (
            <div className="rounded-md border border-slate-200 border-dashed bg-white p-6 text-center text-slate-400 text-sm dark:bg-slate-950/50">
              Type above to search for available collaborators.
            </div>
          )}

          {/* Team summary — ALWAYS visible */}
          <div className="mt-4 border-slate-100 border-t pt-4 dark:border-slate-800">
            <p className="mb-2 font-semibold text-slate-500 text-xs uppercase tracking-wider">
              Team ({selectedTeam.length + 1})
            </p>
            <div className="flex flex-col gap-2">
              {/* Current user as PI — always shown */}
              {(() => {
                const { user } = useAuthStore.getState();
                return user ? (
                  <div
                    key="current-user-pi"
                    className="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 p-2 dark:border-blue-800/50 dark:bg-blue-900/20"
                  >
                    <div className="flex flex-1 items-center gap-2">
                      <span className="font-medium text-blue-700 text-xs dark:text-blue-300">{user.fullName}</span>
                      <Badge className="h-5 bg-blue-600 px-1.5 text-[10px] text-white">PI</Badge>
                    </div>
                    <span className="text-[10px] text-slate-500">Added automatically</span>
                  </div>
                ) : null;
              })()}
              {/* Other selected members */}
              {selectedTeam.map((m) => (
                <div
                  key={m.value}
                  className="flex items-center justify-between rounded-md bg-slate-100 p-2 dark:bg-slate-800/50"
                >
                  <span className="font-medium text-xs">{m.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-2 text-[10px] text-slate-500 hover:text-red-500"
                    onClick={() => handleRemoveMember(m.value)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advisor (Right) — Combobox single select */}
      <div className="flex flex-col gap-4 p-4 lg:p-6 lg:pl-8">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm dark:text-slate-100">Primary Advisor</h3>
          <p className="mb-3 text-slate-500 text-xs">Select exactly one faculty advisor.</p>

          <Combobox
            value={selectedAdvisor?.value || ""}
            onValueChange={(val) => {
              const adv = advisorResults.find((a) => a.value === val);
              if (adv) {
                setValue("advisor", { value: adv.value, label: adv.label }, { shouldValidate: true });
                // Fill the input with the selected advisor's full name
                setAdvisorSearch(adv.label);
              }
            }}
          >
            <ComboboxInput
              placeholder="Search advisors..."
              value={advisorSearch}
              onChange={(e) => setAdvisorSearch(e.target.value)}
              showClear={!!selectedAdvisor}
              className="h-9 rounded-md bg-white text-sm dark:bg-slate-950"
            />
            <ComboboxContent>
              <ComboboxList>
                {loadingAdvisors && isAdvisorSearchActive && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
                {advisorResults.map((adv) => (
                  <ComboboxItem key={adv.value} value={adv.value}>
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[9px]">
                        {adv.label?.substring(0, 2).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    {adv.label}
                  </ComboboxItem>
                ))}
                <ComboboxEmpty>
                  {isAdvisorSearchActive ? "No advisors found." : "Type to search advisors..."}
                </ComboboxEmpty>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
    </div>
  );
}
