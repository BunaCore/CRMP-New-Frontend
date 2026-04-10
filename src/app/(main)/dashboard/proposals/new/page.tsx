"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, ArrowRight, Check, CheckCircle2, FileUp, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getDepartmentsSelector } from "@/lib/api/departments/queries";
import { createProposal } from "@/lib/api/proposals/mutations";
import type { DepartmentOption, UserOption } from "@/lib/api/proposals/types";
import { type ProposalMemberRole, ProposalProgram } from "@/lib/api/proposals/types";
import { getAdvisors, getUsers } from "@/lib/api/users/queries";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

/**----------------------
 * MOCK DATA
 *------------------------*/
const STEPS = [
  { title: "Draft", desc: "Basic details" },
  { title: "Team", desc: "Collaborators" },
  { title: "Budget", desc: "Funding specifics" },
  { title: "Review", desc: "Final submit" },
];

export default function NewProposalPage() {
  const router = useRouter();

  // Step state
  const [currentStep, setCurrentStep] = React.useState(0);

  // Form states - Basic Info
  const [title, setTitle] = React.useState("");
  const [abstract, setAbstract] = React.useState("");
  const [proposalProgram, setProposalProgram] = React.useState<ProposalProgram | "">("");
  const [researchArea, setResearchArea] = React.useState("");
  const [durationMonths, setDurationMonths] = React.useState("");
  const [isFunded, setIsFunded] = React.useState(false);
  const [departmentId, setDepartmentId] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  // Selectors data
  const [departments, setDepartments] = React.useState<DepartmentOption[]>([]);
  const [advisors, setAdvisors] = React.useState<UserOption[]>([]);
  const [members, setMembers] = React.useState<UserOption[]>([]);
  const [loadingSelectors, setLoadingSelectors] = React.useState(true);

  // Team state
  const [teamSearch, setTeamSearch] = React.useState("");
  const [advisorSearch, setAdvisorSearch] = React.useState("");
  const [selectedTeam, setSelectedTeam] = React.useState<string[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = React.useState<string | null>(null);

  // Budget state
  const [budgetRows, setBudgetRows] = React.useState([
    {
      id: "1",
      title: "Equipment",
      description: "Lab sensors and compute servers",
      amount: "5000",
    },
  ]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Load selectors on mount
  React.useEffect(() => {
    const loadSelectors = async () => {
      try {
        setLoadingSelectors(true);
        // We still call the API but we prefer the specific engineering samples requested
        const [_, advs, membs] = await Promise.all([getDepartmentsSelector(), getAdvisors(), getUsers()]);

        const sampleDepartments = [
          { value: "dept-1", label: "Computer Science and Engineering" },
          { value: "dept-2", label: "Software Engineering" },
          { value: "dept-3", label: "Communication Engineering" },
          { value: "dept-4", label: "Architectural Engineering" },
          { value: "dept-5", label: "Civil Engineering" },
          { value: "dept-6", label: "Water Engineering" },
          { value: "dept-7", label: "Mechanical Engineering" },
          { value: "dept-8", label: "Chemical Engineering" },
        ];

        setDepartments(sampleDepartments);
        setAdvisors(advs);
        setMembers(membs);
      } catch (error) {
        console.error("Failed to load selectors:", error);
        toast.error("Could not load departments, advisors, and members");
      } finally {
        setLoadingSelectors(false);
      }
    };
    loadSelectors();
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      // Skip budget step if not funded
      if (currentStep === 1 && !isFunded) {
        setCurrentStep(3);
      } else {
        setCurrentStep((c) => c + 1);
      }
    }
  };
  const handleBack = () => {
    if (currentStep > 0) {
      // Skip budget step when going back if not funded
      if (currentStep === 3 && !isFunded) {
        setCurrentStep(1);
      } else {
        setCurrentStep((c) => c - 1);
      }
    }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must not exceed 10MB");
        return;
      }
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Only PDF and DOCX files are allowed");
        return;
      }
      setFile(selectedFile);
    }
  };

  // Handle proposal submission
  const handleSubmitProposal = async (submit = false) => {
    const { user } = useAuthStore.getState();

    // Validation
    if (!title.trim()) {
      toast.error("Please enter a proposal title");
      return;
    }
    if (!proposalProgram) {
      toast.error("Please select a proposal program");
      return;
    }
    if (!departmentId) {
      toast.error("Please select a department");
      return;
    }
    if (!researchArea.trim()) {
      toast.error("Please enter a research area");
      return;
    }
    if (!durationMonths || parseInt(durationMonths, 10) < 1) {
      toast.error("Please enter a valid duration in months (minimum 1)");
      return;
    }
    if (isFunded && budgetRows.length === 0) {
      toast.error("Please add at least one budget item");
      return;
    }

    try {
      setIsSubmitting(true);

      // Build payload
      const payload = {
        title: title.trim(),
        abstract: abstract.trim(),
        proposalProgram,
        researchArea: researchArea.trim(),
        durationMonths: parseInt(durationMonths, 10),
        isFunded,
        departmentId,
        budget: isFunded
          ? budgetRows.map((row) => ({
              description: row.title || row.description,
              amount: parseFloat(row.amount) || 0,
            }))
          : [],
        members: [
          {
            userId: user?.id || "",
            role: "PI" as ProposalMemberRole.PI,
          },
          ...selectedTeam.map((memberId) => ({
            userId: memberId,
            role: "MEMBER" as unknown as ProposalMemberRole,
          })),
          ...(selectedAdvisor
            ? [
                {
                  userId: selectedAdvisor,
                  role: "ADVISOR" as unknown as ProposalMemberRole,
                },
              ]
            : []),
        ],
      };

      const response = await createProposal(payload, file, { submit });

      if (response.submissionError) {
        toast.error(`Submission error: ${response.submissionError}`);
      } else {
        toast.success(submit ? "Proposal submitted successfully!" : "Proposal saved as draft!");
        // Redirect to proposals list
        router.push("/dashboard/proposals");
      }
    } catch (error) {
      console.error("Failed to submit proposal:", error);
      toast.error("Failed to submit proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTeam =
    teamSearch.trim().length > 0 ? members.filter((m) => m.label.toLowerCase().includes(teamSearch.toLowerCase())) : [];

  const filteredAdvisors =
    advisorSearch.trim().length > 0
      ? advisors.filter((a) => a.label.toLowerCase().includes(advisorSearch.toLowerCase()))
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
            Draft your research framework, complete your whole team, and organize the budget.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <Card className="flex w-full flex-1 flex-col overflow-hidden rounded-xl border-slate-200 bg-white px-4 pt-6 pb-8 shadow-sm md:px-8 dark:border-slate-800 dark:bg-slate-950/50">
        {renderStepper()}

        <CardContent className="flex-1 p-0">
          {/* STEP 1: DRAFT */}
          {currentStep === 0 && (
            <div className="fade-in slide-in-from-right-4 mx-auto mt-4 flex max-w-4xl animate-in flex-col gap-6 duration-500">
              {/* Proposal Title - Full Width */}
              <div className="grid gap-1.5">
                <Label htmlFor="title" className="font-semibold text-sm">
                  Proposal Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Photovoltaic Micro-Cells..."
                  className="h-10 rounded-md bg-white font-medium text-sm shadow-xs transition-shadow focus:shadow-md dark:bg-slate-950"
                />
              </div>

              {/* Research Info - Grid Layout */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="researchArea" className="font-semibold text-slate-700 text-sm dark:text-slate-300">
                    Research Area
                  </Label>
                  <Input
                    id="researchArea"
                    value={researchArea}
                    onChange={(e) => setResearchArea(e.target.value)}
                    placeholder="e.g. Renewable Energy..."
                    className="h-10 rounded-md bg-white text-sm dark:bg-slate-950"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="proposalProgram" className="font-semibold text-slate-700 text-sm dark:text-slate-300">
                    Proposal Program
                  </Label>
                  <Select value={proposalProgram} onValueChange={(val) => setProposalProgram(val as ProposalProgram)}>
                    <SelectTrigger className="h-10 rounded-md bg-white text-sm dark:bg-slate-950">
                      <SelectValue placeholder="Select a program..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProposalProgram.UG}>Undergraduate (UG)</SelectItem>
                      <SelectItem value={ProposalProgram.PG}>Postgraduate (PG)</SelectItem>
                      <SelectItem value={ProposalProgram.GENERAL}>General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="departmentId" className="font-semibold text-slate-700 text-sm dark:text-slate-300">
                    Host Department
                  </Label>
                  <Select value={departmentId} onValueChange={setDepartmentId} disabled={loadingSelectors}>
                    <SelectTrigger className="h-10 rounded-md bg-white text-sm dark:bg-slate-950">
                      <SelectValue placeholder={loadingSelectors ? "Loading..." : "Select a department..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duration & Funding Toggle */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="durationMonths" className="font-semibold text-sm">
                    Estimated Duration (Months)
                  </Label>
                  <Input
                    id="durationMonths"
                    type="number"
                    min="1"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(e.target.value)}
                    placeholder="e.g. 12"
                    className="h-10 rounded-md bg-white text-sm dark:bg-slate-950"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <Label className="mb-2 font-semibold text-slate-700 text-sm dark:text-slate-300">
                    Grant & Funding
                  </Label>
                  {/* biome-ignore lint/a11y/useSemanticElements: Nested interactive elements (Switch) prevent using button */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setIsFunded(!isFunded)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsFunded(!isFunded);
                      }
                    }}
                    className={cn(
                      "group flex h-16 cursor-pointer select-none items-center justify-between rounded-xl border p-4 transition-all duration-300",
                      isFunded
                        ? "border-blue-200 bg-blue-50/50 shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:border-blue-800/50 dark:bg-blue-900/10"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                          isFunded
                            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900",
                        )}
                      >
                        <Plus className={cn("h-4 w-4 transition-transform duration-300", isFunded && "rotate-45")} />
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
                      checked={isFunded}
                      onCheckedChange={setIsFunded}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="isFunded" className="cursor-pointer font-medium text-sm">
                      Is Funded
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="abstract" className="font-semibold text-sm">
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
                <Label className="font-semibold text-sm">Supporting Layout Files</Label>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
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
              </div>
            </div>
          )}

          {/* STEP 2: TEAM */}
          {currentStep === 1 && (
            <div className="fade-in slide-in-from-right-4 mt-4 grid min-h-[400px] animate-in grid-cols-1 gap-8 divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/30 duration-500 lg:grid-cols-2 lg:divide-x dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/10">
              {/* Members (Left) */}
              <div className="flex flex-col gap-4 p-4 lg:p-6 lg:pr-8">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm dark:text-slate-100">Members</h3>
                  <p className="mb-3 text-slate-500 text-xs">
                    You are automatically included as PI. Add team members below.
                  </p>
                  <div className="relative w-full">
                    <Search className="-translate-y-1/2 absolute top-1/2 left-2.5 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Search members by name..."
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
                      const isSelected = selectedTeam.includes(member.value);
                      return (
                        <button
                          type="button"
                          key={member.value}
                          onClick={() => handleToggleTeam(member.value)}
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
                  )}

                  {/* Selected count display inside team column */}
                  {selectedTeam.length > 0 && teamSearch.trim() === "" && (
                    <div className="mt-4 border-slate-100 border-t pt-4 dark:border-slate-800">
                      <p className="mb-2 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                        Team ({selectedTeam.length + 1})
                      </p>
                      <div className="flex flex-col gap-2">
                        {/* Current user as PI */}
                        {(() => {
                          const { user } = useAuthStore.getState();
                          return user ? (
                            <div
                              key="current-user-pi"
                              className="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 p-2 dark:border-blue-800/50 dark:bg-blue-900/20"
                            >
                              <div className="flex flex-1 items-center gap-2">
                                <span className="font-medium text-blue-700 text-xs dark:text-blue-300">
                                  {user.fullName}
                                </span>
                                <Badge className="h-5 bg-blue-600 px-1.5 text-[10px] text-white">PI</Badge>
                              </div>
                              <span className="text-[10px] text-slate-500">Added automatically</span>
                            </div>
                          ) : null;
                        })()}
                        {/* Other selected members */}
                        {selectedTeam.map((id) => {
                          const m = members.find((mem) => mem.value === id);
                          return m ? (
                            <div
                              key={id}
                              className="flex items-center justify-between rounded-md bg-slate-100 p-2 dark:bg-slate-800/50"
                            >
                              <span className="font-medium text-xs">{m.label}</span>
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
                      const isSelected = selectedAdvisor === adv.value;
                      return (
                        <button
                          type="button"
                          key={adv.value}
                          onClick={() => setSelectedAdvisor(adv.value)}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-colors ${
                            isSelected
                              ? "border-indigo-400 bg-indigo-50/50 shadow-sm dark:bg-indigo-900/20"
                              : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="font-bold text-[10px]">
                              {adv.label?.substring(0, 2).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-semibold text-[13px] text-slate-900 leading-tight dark:text-slate-100">
                              {adv.label}
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
                        const a = advisors.find((adv) => adv.value === selectedAdvisor);
                        return a ? (
                          <div className="flex items-center justify-between rounded-md border border-indigo-100 bg-indigo-50 p-2 dark:border-indigo-800 dark:bg-indigo-900/30">
                            <span className="font-semibold text-indigo-800 text-xs dark:text-indigo-300">
                              {a.label}
                            </span>
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
            <div className="fade-in slide-in-from-right-4 mx-auto mt-4 flex max-w-4xl animate-in flex-col gap-5 duration-500">
              {/* Financial Dashboard Header */}
              <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/40 p-5 sm:flex-row dark:border-slate-800 dark:bg-slate-900/10">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm tracking-tight dark:text-slate-100">
                    Project Financial Breakdown
                  </h3>
                  <p className="mt-1 text-slate-500 text-xs">Itemize all estimated expenditures for this research.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden h-10 w-px bg-slate-200 sm:block dark:bg-slate-800" />
                  <div className="text-right">
                    <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                      Initial Grant Estimate
                    </p>
                    <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                      $
                      {calculateTotalBudget().toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>

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
                        Amount ($)
                      </TableHead>
                      <TableHead className="h-11 w-[60px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetRows.map((row) => (
                      <TableRow key={row.id} className="group border-slate-100 dark:border-slate-800/50">
                        <TableCell className="p-2 px-3">
                          <Input
                            placeholder="e.g. Travel"
                            value={row.title}
                            onChange={(e) => handleUpdateBudgetRow(row.id, "title", e.target.value)}
                            className="h-9 border-none bg-transparent font-medium text-sm focus-visible:ring-1 focus-visible:ring-blue-500/30"
                          />
                        </TableCell>
                        <TableCell className="p-2 px-3">
                          <Input
                            placeholder="e.g. Academic conference flights..."
                            value={row.description}
                            onChange={(e) => handleUpdateBudgetRow(row.id, "description", e.target.value)}
                            className="h-9 border-none bg-transparent text-sm focus-visible:ring-1 focus-visible:ring-blue-500/30 dark:text-slate-300"
                          />
                        </TableCell>
                        <TableCell className="p-2 px-3">
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={row.amount}
                            onChange={(e) => handleUpdateBudgetRow(row.id, "amount", e.target.value)}
                            className="h-9 border-none bg-transparent text-right font-bold text-blue-600 focus-visible:ring-1 focus-visible:ring-blue-500/30 dark:text-blue-400"
                          />
                        </TableCell>
                        <TableCell className="p-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveBudgetRow(row.id)}
                            className="h-8 w-8 text-slate-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {budgetRows.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-slate-400 text-sm italic">No budget items added yet.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddBudgetRow}
                  className="h-9 gap-2 border-dashed bg-slate-50/50 px-6 font-semibold text-slate-600 shadow-none hover:border-slate-300 hover:bg-slate-100 dark:bg-slate-900/20 dark:text-slate-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Expenditure Line
                </Button>
              </div>
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
                        <p className="font-medium text-slate-500 text-xs">Members ({selectedTeam.length + 1})</p>
                      </div>
                      {/* Current user as PI */}
                      {(() => {
                        const { user } = useAuthStore.getState();
                        return user ? (
                          <div
                            key="pi-badge"
                            className="flex items-center gap-1 truncate rounded border border-blue-200 bg-blue-50 px-2 py-1 font-medium text-[13px] text-blue-800 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-300"
                          >
                            <span className="truncate">{user.fullName}</span>
                            <Badge className="h-4 whitespace-nowrap bg-blue-600 px-1 text-[10px] text-white">PI</Badge>
                          </div>
                        ) : null;
                      })()}
                      {/* Other members */}
                      {selectedTeam.length > 0
                        ? selectedTeam.map((id) => {
                            const m = members.find((mem) => mem.value === id);
                            return m ? (
                              <div
                                key={id}
                                className="truncate rounded border border-slate-200 bg-slate-100 px-2 py-1 font-medium text-[13px] text-slate-800 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
                              >
                                {m.label}
                              </div>
                            ) : null;
                          })
                        : null}
                    </div>
                    <div className="mt-1">
                      <p className="mb-1 font-medium text-slate-500 text-xs">Primary Advisor</p>
                      {selectedAdvisor ? (
                        (() => {
                          const a = advisors.find((adv) => adv.value === selectedAdvisor);
                          return a ? (
                            <p className="font-semibold text-[13px] text-indigo-700 dark:text-indigo-400">{a.label}</p>
                          ) : null;
                        })()
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
                      <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">3. Budget Est.</p>
                    </div>
                    <div className="flex flex-1 items-center p-4">
                      <div>
                        <p className="mb-1 font-medium text-slate-500 text-xs">Total Funds Requested</p>
                        <p className="font-bold text-slate-900 text-xl dark:text-slate-100">
                          $
                          {calculateTotalBudget().toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="mt-1 text-slate-400 text-xs">Spanning {budgetRows.length} categorized items.</p>
                      </div>
                    </div>
                  </div>
                )}
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
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSubmitProposal(false)}
                  disabled={isSubmitting}
                  className="h-9 px-6 font-semibold"
                >
                  {isSubmitting ? "Saving..." : "Save as Draft"}
                </Button>
                <Button
                  size="sm"
                  className="h-9 border-0 bg-blue-600 px-6 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => handleSubmitProposal(true)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Proposal"}
                  <CheckCircle2 className="ml-1.5 h-4 w-4" />
                </Button>
              </>
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
