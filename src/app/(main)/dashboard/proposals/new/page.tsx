"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, ArrowRight, Check, CheckCircle2, FileUp, Plus, Search, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

/**----------------------
 * MOCK DATA
 *------------------------*/
const STEPS = [
  { title: "Draft", desc: "Basic details" },
  { title: "Team", desc: "Collaborators" },
  { title: "Budget", desc: "Funding specifics" },
  { title: "Review", desc: "Final submit" },
];

const AVAILABLE_TEAM = [
  {
    id: "t1",
    name: "Dr. Elena Rostova",
    role: "Co-Investigator",
    dept: "Physics",
    avatar: "ER",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "t2",
    name: "Prof. Michael Chen",
    role: "AI Specialist",
    dept: "Computer Science",
    avatar: "MC",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "t3",
    name: "Sarah Jenkins",
    role: "Data Analyst",
    dept: "Bioinformatics",
    avatar: "SJ",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "t4",
    name: "Dr. Alan Grant",
    role: "Lead Researcher",
    dept: "Biology",
    avatar: "AG",
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "t5",
    name: "Dr. Emily Wong",
    role: "Biochemist",
    dept: "Chemistry",
    avatar: "EW",
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: "t6",
    name: "James Carter",
    role: "Systems Engineer",
    dept: "Engineering",
    avatar: "JC",
    color: "bg-slate-200 text-slate-700",
  },
];

const AVAILABLE_ADVISORS = [
  {
    id: "a1",
    name: "Dr. Robert Ford",
    role: "Senior Faculty",
    dept: "Engineering",
    avatar: "RF",
    color: "bg-slate-200 text-slate-700",
  },
  {
    id: "a2",
    name: "Prof. Lisa Su",
    role: "Department Head",
    dept: "Computer Science",
    avatar: "LS",
    color: "bg-indigo-100 text-indigo-700",
  },
];

export default function NewProposalPage() {
  const router = useRouter();

  // Step state
  const [currentStep, setCurrentStep] = React.useState(0);

  // Form states
  const [title, setTitle] = React.useState("");
  const [abstract, setAbstract] = React.useState("");
  const [file, _setFile] = React.useState<File | null>(null);

  const [teamSearch, setTeamSearch] = React.useState("");
  const [advisorSearch, setAdvisorSearch] = React.useState("");
  const [selectedTeam, setSelectedTeam] = React.useState<string[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = React.useState<string | null>(null);

  const [budgetRows, setBudgetRows] = React.useState([
    { id: "1", title: "Equipment", description: "Lab sensors and compute servers", amount: "5000" },
  ]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((c) => c + 1);
  };
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((c) => c - 1);
  };

  const handleToggleTeam = (id: string) => {
    setSelectedTeam((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleAddBudgetRow = () => {
    setBudgetRows([...budgetRows, { id: Date.now().toString(), title: "", description: "", amount: "" }]);
  };
  const handleRemoveBudgetRow = (id: string) => {
    setBudgetRows(budgetRows.filter((r) => r.id !== id));
  };
  const handleUpdateBudgetRow = (id: string, field: string, value: string) => {
    setBudgetRows(budgetRows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const calculateTotalBudget = () => {
    return budgetRows.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0);
  };

  const filteredTeam =
    teamSearch.trim().length > 0
      ? AVAILABLE_TEAM.filter((t) => (t.name + t.dept + t.role).toLowerCase().includes(teamSearch.toLowerCase()))
      : [];

  const filteredAdvisors =
    advisorSearch.trim().length > 0
      ? AVAILABLE_ADVISORS.filter((a) => (a.name + a.dept + a.role).toLowerCase().includes(advisorSearch.toLowerCase()))
      : [];

  /**----------------------
   * RENDER STEPPER
   *------------------------*/
  const renderStepper = () => (
    <div className="relative mx-auto mb-6 flex w-full max-w-2xl justify-between">
      <div className="-z-10 absolute top-[16px] right-[5%] left-[5%] h-[2px] bg-slate-100 dark:bg-slate-800" />
      <div
        className="-z-10 absolute top-[16px] left-[5%] h-[2px] bg-blue-600 transition-all duration-500 ease-in-out"
        style={{ width: `calc(${(currentStep / (STEPS.length - 1)) * 90}%)` }}
      />
      {STEPS.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        return (
          <div key={step.title} className="relative z-10 flex w-1/4 flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-[13px] transition-all ease-out ${
                isActive
                  ? "bg-blue-600 text-white ring-2 ring-blue-100 dark:ring-blue-900/50"
                  : isCompleted
                    ? "border-2 border-blue-600 bg-white text-blue-600 dark:border-blue-500 dark:bg-slate-950"
                    : "border border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-950"
              }`}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <div className="text-center">
              <p
                className={`font-bold text-[11px] uppercase tracking-wider ${isActive ? "text-blue-700 dark:text-blue-400" : isCompleted ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}`}
              >
                {step.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 md:p-6">
      {/* Header */}
      <div className="mb-2 flex flex-col">
        <Link href="/dashboard/proposals" className="mb-2 w-fit">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-7 rounded px-2 text-slate-500 text-xs transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Proposals
          </Button>
        </Link>
        <div>
          <h1 className="font-semibold text-2xl text-slate-900 tracking-tight dark:text-slate-100">
            New Research Proposal
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
            Draft your research framework, complete your team, and organize the budget.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <Card className="flex w-full flex-1 flex-col overflow-hidden rounded-xl border-slate-200 bg-white px-4 pt-6 pb-8 shadow-sm md:px-8 dark:border-slate-800 dark:bg-slate-950/50">
        {renderStepper()}

        <CardContent className="flex-1 p-0">
          {/* STEP 1: DRAFT */}
          {currentStep === 0 && (
            <div className="fade-in slide-in-from-right-4 mx-auto mt-4 flex max-w-3xl animate-in flex-col gap-5 duration-500">
              <div className="grid gap-1.5">
                <Label htmlFor="title" className="font-medium text-sm">
                  Proposal Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Photovoltaic Micro-Cells..."
                  className="h-10 rounded-md bg-white text-sm dark:bg-slate-950"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="abstract" className="font-medium text-sm">
                  Abstract & Core Objectives
                </Label>
                <Textarea
                  id="abstract"
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Provide a comprehensive summary of the research scope, expected outcomes, and scientific merit..."
                  className="min-h-[140px] resize-y rounded-md bg-white text-sm dark:bg-slate-950"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="font-medium text-sm">Supporting Document</Label>
                <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-slate-300 border-dashed bg-slate-50/50 p-6 text-center transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/30 dark:hover:bg-slate-800/50">
                  <FileUp className="mb-2 h-5 w-5 text-slate-400" />
                  <p className="font-medium text-[13px] text-slate-700 dark:text-slate-300">
                    Upload full proposal layout (Optional)
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">PDF or DOCX (max 10MB)</p>
                  {file && (
                    <Badge className="mt-3 border border-slate-200 bg-slate-100 px-2 py-0.5 text-slate-700 text-xs shadow-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {file.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TEAM */}
          {currentStep === 1 && (
            <div className="fade-in slide-in-from-right-4 mt-4 grid min-h-[400px] animate-in grid-cols-1 gap-8 divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/30 duration-500 lg:grid-cols-2 lg:divide-x dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/10">
              {/* Co-Investigators (Left) */}
              <div className="flex flex-col gap-4 p-4 lg:p-6 lg:pr-8">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm dark:text-slate-100">Co-Investigators</h3>
                  <p className="mb-3 text-slate-500 text-xs">Search and add team members.</p>
                  <div className="relative w-full">
                    <Search className="-translate-y-1/2 absolute top-1/2 left-2.5 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Search teammates by name or department..."
                      className="h-9 rounded-md bg-white pl-8 text-sm dark:bg-slate-950"
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                  {teamSearch.trim().length === 0 ? (
                    <div className="rounded-md border border-slate-200 border-dashed bg-white p-6 text-center text-slate-400 text-sm dark:bg-slate-950/50">
                      Type above to search for available collaborators.
                    </div>
                  ) : filteredTeam.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-xs italic">No exact matches found.</div>
                  ) : (
                    filteredTeam.map((member) => {
                      const isSelected = selectedTeam.includes(member.id);
                      return (
                        <button
                          type="button"
                          key={member.id}
                          onClick={() => handleToggleTeam(member.id)}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-colors ${
                            isSelected
                              ? "border-blue-400 bg-blue-50/50 shadow-sm dark:bg-blue-900/20"
                              : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={`${member.color} font-bold text-[10px]`}>
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-semibold text-[13px] text-slate-900 leading-tight dark:text-slate-100">
                              {member.name}
                            </span>
                            <span className="truncate text-[11px] text-slate-500 leading-tight">
                              {member.role} • {member.dept}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-500" />}
                        </button>
                      );
                    })
                  )}

                  {/* Selected count display inside team column */}
                  {selectedTeam.length > 0 && teamSearch.trim() === "" && (
                    <div className="mt-4 border-slate-100 border-t pt-4 dark:border-slate-800">
                      <p className="mb-2 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                        Currently Selected ({selectedTeam.length})
                      </p>
                      <div className="flex flex-col gap-2">
                        {selectedTeam.map((id) => {
                          const m = AVAILABLE_TEAM.find((t) => t.id === id);
                          return m ? (
                            <div
                              key={id}
                              className="flex items-center justify-between rounded-md bg-slate-100 p-2 dark:bg-slate-800/50"
                            >
                              <span className="font-medium text-xs">{m.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 px-2 text-[10px] text-slate-500 hover:text-red-500"
                                onClick={() => handleToggleTeam(id)}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Advisor (Right) */}
              <div className="flex flex-col gap-4 p-4 lg:p-6 lg:pl-8">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm dark:text-slate-100">Primary Advisor</h3>
                  <p className="mb-3 text-slate-500 text-xs">Select exactly one faculty advisor.</p>
                  <div className="relative w-full">
                    <Search className="-translate-y-1/2 absolute top-1/2 left-2.5 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Search advisors..."
                      className="h-9 rounded-md bg-white pl-8 text-sm dark:bg-slate-950"
                      value={advisorSearch}
                      onChange={(e) => setAdvisorSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                  {advisorSearch.trim().length === 0 ? (
                    <div className="rounded-md border border-slate-200 border-dashed bg-white p-6 text-center text-slate-400 text-sm dark:bg-slate-950/50">
                      Type above to search for an advisor.
                    </div>
                  ) : filteredAdvisors.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-xs italic">No exact matches found.</div>
                  ) : (
                    filteredAdvisors.map((adv) => {
                      const isSelected = selectedAdvisor === adv.id;
                      return (
                        <button
                          type="button"
                          key={adv.id}
                          onClick={() => setSelectedAdvisor(adv.id)}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-colors ${
                            isSelected
                              ? "border-indigo-400 bg-indigo-50/50 shadow-sm dark:bg-indigo-900/20"
                              : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={`${adv.color} font-bold text-[10px]`}>
                              {adv.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-semibold text-[13px] text-slate-900 leading-tight dark:text-slate-100">
                              {adv.name}
                            </span>
                            <span className="truncate text-[11px] text-slate-500 leading-tight">
                              {adv.role} • {adv.dept}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-500" />
                          )}
                        </button>
                      );
                    })
                  )}

                  {/* Selected count display inside advisor column */}
                  {selectedAdvisor && advisorSearch.trim() === "" && (
                    <div className="mt-4 border-slate-100 border-t pt-4 dark:border-slate-800">
                      <p className="mb-2 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                        Currently Selected
                      </p>
                      {(() => {
                        const a = AVAILABLE_ADVISORS.find((t) => t.id === selectedAdvisor);
                        return a ? (
                          <div className="flex items-center justify-between rounded-md border border-indigo-100 bg-indigo-50 p-2 dark:border-indigo-800 dark:bg-indigo-900/30">
                            <span className="font-semibold text-indigo-800 text-xs dark:text-indigo-300">{a.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 px-2 text-[10px] text-slate-500 hover:text-red-500"
                              onClick={() => setSelectedAdvisor(null)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET */}
          {currentStep === 2 && (
            <div className="fade-in slide-in-from-right-4 mx-auto mt-4 flex max-w-4xl animate-in flex-col gap-4 duration-500">
              {/* Simple Header */}
              <div className="mb-2 flex items-end justify-between border-slate-200 border-b pb-2 dark:border-slate-800">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Financial Breakdown</h3>
                  <p className="text-slate-500 text-xs">Provide detailed estimate of needed funds.</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[10px] text-slate-500 uppercase">Total Requested</p>
                  <p className="font-bold text-blue-600 text-xl dark:text-blue-400">
                    $
                    {calculateTotalBudget().toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-800">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                    <TableRow>
                      <TableHead className="h-9 w-[25%] font-semibold text-xs">Category</TableHead>
                      <TableHead className="h-9 font-semibold text-xs">Justification</TableHead>
                      <TableHead className="h-9 w-[150px] text-right font-semibold text-xs">Amount ($)</TableHead>
                      <TableHead className="h-9 w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="p-2">
                          <Input
                            placeholder="e.g. Travel"
                            value={row.title}
                            onChange={(e) => handleUpdateBudgetRow(row.id, "title", e.target.value)}
                            className="h-8 border-slate-200 text-sm focus-visible:ring-1 dark:border-slate-800"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Input
                            placeholder="Details..."
                            value={row.description}
                            onChange={(e) => handleUpdateBudgetRow(row.id, "description", e.target.value)}
                            className="h-8 border-slate-200 text-sm focus-visible:ring-1 dark:border-slate-800"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={row.amount}
                            onChange={(e) => handleUpdateBudgetRow(row.id, "amount", e.target.value)}
                            className="h-8 border-slate-200 text-right font-medium text-sm focus-visible:ring-1 dark:border-slate-800"
                          />
                        </TableCell>
                        <TableCell className="p-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveBudgetRow(row.id)}
                            className="h-8 w-8 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleAddBudgetRow}
                className="mt-2 h-8 w-fit border-dashed text-xs"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Row
              </Button>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {currentStep === 3 && (
            <div className="fade-in slide-in-from-right-4 mx-auto mt-4 flex max-w-4xl animate-in flex-col gap-6 duration-500">
              <div className="mb-2 flex items-end justify-between border-slate-200 border-b pb-3 dark:border-slate-800">
                <div>
                  <h2 className="font-semibold text-slate-900 text-xl dark:text-slate-100">Review & Submit</h2>
                  <p className="text-slate-500 text-sm">Please verify the details below before official submission.</p>
                </div>
                <Badge className="border-0 bg-emerald-100 font-bold text-[10px] text-emerald-800 uppercase tracking-widest shadow-none hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Ready
                </Badge>
              </div>

              {/* Data Table Review */}
              <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950/50">
                {/* 1. Basic Details */}
                <div className="flex flex-col border-slate-200 border-b md:flex-row dark:border-slate-700">
                  <div className="shrink-0 border-slate-200 border-r bg-slate-50 p-4 md:w-1/4 dark:border-slate-700 dark:bg-slate-900">
                    <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">1. Basic Details</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div>
                      <p className="mb-0.5 font-medium text-slate-500 text-xs">Proposal Title</p>
                      <p className="font-semibold text-slate-900 text-sm dark:text-slate-100">{title || "—"}</p>
                    </div>
                    <div>
                      <p className="mb-0.5 font-medium text-slate-500 text-xs">Abstract Summary</p>
                      <p className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed dark:text-slate-300">
                        {abstract || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-0.5 font-medium text-slate-500 text-xs">Attachments</p>
                      <p className="font-medium text-slate-700 text-sm dark:text-slate-300">
                        {file ? file.name : "None"}
                      </p>
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
                        <p className="font-medium text-slate-500 text-xs">Co-Investigators ({selectedTeam.length})</p>
                      </div>
                      {selectedTeam.length > 0 ? (
                        selectedTeam.map((id) => {
                          const m = AVAILABLE_TEAM.find((t) => t.id === id);
                          return m ? (
                            <div
                              key={id}
                              className="truncate rounded border border-slate-200 bg-slate-100 px-2 py-1 font-medium text-[13px] text-slate-800 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
                            >
                              {m.name}
                            </div>
                          ) : null;
                        })
                      ) : (
                        <p className="text-slate-400 text-sm italic">None</p>
                      )}
                    </div>
                    <div className="mt-1">
                      <p className="mb-1 font-medium text-slate-500 text-xs">Primary Advisor</p>
                      {selectedAdvisor ? (
                        (() => {
                          const a = AVAILABLE_ADVISORS.find((t) => t.id === selectedAdvisor);
                          return a ? (
                            <p className="font-semibold text-[13px] text-indigo-700 dark:text-indigo-400">
                              {a.name} <span className="ml-1 font-normal text-slate-500">({a.dept})</span>
                            </p>
                          ) : null;
                        })()
                      ) : (
                        <p className="text-slate-400 text-sm italic">None</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Budget */}
                <div className="flex flex-col md:flex-row">
                  <div className="shrink-0 border-slate-200 border-r bg-slate-50 p-4 md:w-1/4 dark:border-slate-700 dark:bg-slate-900">
                    <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">3. Budget Est.</p>
                  </div>
                  <div className="flex flex-1 items-center p-4">
                    <div>
                      <p className="mb-1 font-medium text-slate-500 text-xs">Total Funds Requested</p>
                      <p className="font-bold text-slate-900 text-xl dark:text-slate-100">
                        ${calculateTotalBudget().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p className="mt-1 text-slate-400 text-xs">Spanning {budgetRows.length} categorized items.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation Footer placed nicely inside the form Card but at the bottom */}
        <div className="mt-10 flex w-full items-center justify-between border-slate-100 border-t pt-4 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`h-9 px-4 font-medium transition-opacity ${currentStep === 0 ? "pointer-events-none opacity-0" : ""}`}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {currentStep === 3 ? (
              <Button
                size="sm"
                className="h-9 border-0 bg-blue-600 px-6 font-semibold text-white shadow-sm hover:bg-blue-700"
                onClick={() => router.push("/dashboard/proposals")}
              >
                Submit Proposal <CheckCircle2 className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleNext}
                className="h-9 border-0 bg-slate-900 px-6 font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Next <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
