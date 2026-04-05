"use client";

import * as React from "react";

import Link from "next/link";

import { Clock, Edit, Eye, FileText, Filter, History, MoreHorizontal, Plus, Search, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data
const proposals = [
  {
    id: "PRP-042",
    title: "Quantum Computing Simulation Framework",
    abstract: "Developing a robust framework for simulating 128-qubit environments...",
    status: "Under Review",
    lastModified: "2 days ago",
    date: "Oct 24, 2026",
    color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200/50",
  },
  {
    id: "PRP-043",
    title: "AI Health Diagnostics",
    abstract: "A machine learning pipeline for early stage oncology detection...",
    status: "Approved",
    lastModified: "1 week ago",
    date: "Oct 18, 2026",
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200/50",
  },
  {
    id: "PRP-044",
    title: "Neural Interface Robotics Control",
    abstract: "Brain-computer interface protocols for advanced robotic prosthetics.",
    status: "Revisions Required",
    lastModified: "4 hours ago",
    date: "Oct 26, 2026",
    color: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50",
  },
  {
    id: "PRP-045",
    title: "Climate Change Predictive Modeling",
    abstract: "Utilizing distributed sensor networks to predict local weather anomalies.",
    status: "Draft",
    lastModified: "Just now",
    date: "Oct 26, 2026",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50",
  },
  {
    id: "PRP-046",
    title: "Advanced Bio-Polymers Synthesis",
    abstract: "Biodegradable polymer synthesis using modified cyanobacteria.",
    status: "Rejected",
    lastModified: "3 weeks ago",
    date: "Oct 02, 2026",
    color: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200/50",
  },
  {
    id: "PRP-047",
    title: "Next-Gen Photovoltaic Cells",
    abstract: "Improving solar efficiency using perovskite tandem cells.",
    status: "Submitted",
    lastModified: "1 day ago",
    date: "Oct 25, 2026",
    color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200/50",
  },
];

export default function ProposalsPage() {
  const [activeTab, setActiveTab] = React.useState("all");

  const filteredProposals = proposals.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "drafts") return p.status === "Draft";
    if (activeTab === "submitted") return p.status === "Submitted";
    if (activeTab === "under-review") return p.status === "Under Review";
    if (activeTab === "revisions") return p.status === "Revisions Required";
    if (activeTab === "approved") return p.status === "Approved";
    if (activeTab === "rejected") return p.status === "Rejected";
    return true;
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 lg:p-10">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-semibold text-3xl text-slate-900 tracking-tight dark:text-slate-100">
            Proposals Management
          </h1>
          <p className="mt-1 text-slate-500 text-sm dark:text-slate-400">
            Create, track, and manage the lifecycle of your research proposals.
          </p>
        </div>

        <Link href="/dashboard/proposals/new" className="w-full sm:w-auto">
          <Button className="w-full rounded-full border-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 font-medium text-white shadow transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-md">
            <Plus className="mr-2 h-4 w-4" /> New Proposal
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="-mb-1 scrollbar-hide w-full overflow-x-auto pb-1 md:w-auto">
              <TabsList className="rounded-lg border border-slate-200/50 bg-slate-100/50 p-1 dark:border-slate-800/50 dark:bg-slate-900/50">
                <TabsTrigger value="all" className="rounded-md px-4 data-[state=active]:shadow-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="drafts" className="rounded-md px-4 data-[state=active]:shadow-sm">
                  Drafts
                </TabsTrigger>
                <TabsTrigger value="submitted" className="rounded-md px-4 data-[state=active]:shadow-sm">
                  Submitted
                </TabsTrigger>
                <TabsTrigger value="under-review" className="rounded-md px-4 data-[state=active]:shadow-sm">
                  Under Review
                </TabsTrigger>
                <TabsTrigger value="revisions" className="rounded-md px-4 data-[state=active]:shadow-sm">
                  Revisions
                </TabsTrigger>
                <TabsTrigger value="approved" className="rounded-md px-4 data-[state=active]:shadow-sm">
                  Approved
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="relative w-full md:w-[240px]">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search proposals..."
                  className="w-full rounded-full border-slate-200 bg-white pl-9 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 rounded-full border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <Filter className="h-4 w-4 text-slate-600" />
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <Card className="overflow-hidden rounded-xl border-slate-200/60 bg-white shadow-none dark:border-slate-800/60 dark:bg-slate-950/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50 dark:bg-slate-900/20">
                    <TableRow className="border-slate-100 hover:bg-transparent dark:border-slate-800">
                      <TableHead className="h-11 w-[100px] px-6 font-medium text-slate-500">ID</TableHead>
                      <TableHead className="h-11 px-6 font-medium text-slate-500">Proposal Details</TableHead>
                      <TableHead className="h-11 px-6 font-medium text-slate-500">Status</TableHead>
                      <TableHead className="hidden h-11 px-6 font-medium text-slate-500 md:table-cell">
                        Last Updated
                      </TableHead>
                      <TableHead className="h-11 px-6 text-right font-medium text-slate-500">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProposals.length > 0 ? (
                      filteredProposals.map((proposal) => (
                        <TableRow
                          key={proposal.id}
                          className="border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-slate-800/50 dark:hover:bg-slate-800/20"
                        >
                          <TableCell className="px-6 py-4 font-medium text-slate-600 text-xs dark:text-slate-400">
                            {proposal.id}
                          </TableCell>
                          <TableCell className="max-w-[300px] px-6 py-4 lg:max-w-[400px]">
                            <div className="flex flex-col gap-1.5">
                              <span className="line-clamp-1 font-semibold text-slate-800 dark:text-slate-200">
                                {proposal.title}
                              </span>
                              <span className="line-clamp-1 text-slate-500 text-xs">{proposal.abstract}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={`${proposal.color} inline-flex items-center whitespace-nowrap rounded px-2.5 py-0.5 shadow-none`}
                            >
                              {proposal.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden px-6 py-4 md:table-cell">
                            <div className="flex flex-col gap-1">
                              <span className="text-slate-700 text-sm dark:text-slate-300">{proposal.date}</span>
                              <span className="flex items-center gap-1 text-slate-500 text-xs">
                                <Clock className="h-3 w-3" /> {proposal.lastModified}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 rounded-full p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
                                <DropdownMenuLabel className="font-normal text-slate-500 text-xs">
                                  Proposal Actions
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href={`/dashboard/proposals/${proposal.id}`}>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                </Link>

                                {proposal.status === "Draft" || proposal.status === "Revisions Required" ? (
                                  <DropdownMenuItem className="cursor-pointer text-blue-600 dark:text-blue-400">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Continue Editing
                                  </DropdownMenuItem>
                                ) : null}

                                {proposal.status === "Draft" && (
                                  <DropdownMenuItem className="cursor-pointer text-emerald-600 dark:text-emerald-400">
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Proposal
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                  <History className="mr-2 h-4 w-4" />
                                  View History
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                            <p>No proposals found in this category.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
