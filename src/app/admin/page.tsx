"use client";

import {
  AlertCircle,
  Bell,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Coins,
  FileCheck2,
  FileSearch,
  Files,
  FileText,
  LayoutDashboard,
  Search,
  ShieldAlert,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock User Context (for Role-Based UI demo)
const currentUser = {
  name: "Dr. Admin",
  role: "Finance", // e.g. VPRTT, RAD, Finance
};

export default function AdminDashboardPage() {
  return (
    <div className="z-0 flex min-h-screen w-full flex-1 flex-col bg-slate-50/50 p-4 md:p-6 lg:p-8 xl:p-10 dark:bg-slate-950/20">
      {/* ----------------- TOP HEADER ----------------- */}
      <header className="mb-8 flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            Research Control Center
          </h1>
          <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400">
            Welcome back, {currentUser.name}. Here's an overview of the university research ecosystem today.
          </p>
        </div>

        <div className="flex w-full items-center gap-4 md:w-auto">
          <div className="relative w-full md:w-[280px]">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search projects, researchers..."
              className="h-10 rounded-full border-slate-200 bg-white pl-9 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="relative h-10 w-10 shrink-0 rounded-full border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-red-500 dark:border-slate-900" />
          </Button>
          <Avatar className="h-10 w-10 shrink-0 border-2 border-white shadow-sm dark:border-slate-800">
            <AvatarFallback className="bg-blue-600 text-sm font-bold text-white">AD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* ----------------- STAT SUMMARY CARDS ----------------- */}
      <div className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
        {/* Total Projects */}
        <Card className="border-slate-200/60 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <Badge className="pointer-events-none border-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                +12% from last month
              </Badge>
            </div>
            <p className="mb-1 text-sm font-semibold tracking-wider text-slate-500 uppercase">Total Active Projects</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">142</h2>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <Badge className="pointer-events-none border-0 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                Requires Attention
              </Badge>
            </div>
            <p className="mb-1 text-sm font-semibold tracking-wider text-slate-500 uppercase">Pending Approvals</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">28</h2>
          </CardContent>
        </Card>

        {/* Budget Requests */}
        <Card className="relative overflow-hidden border-slate-200/60 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
          <div className="pointer-events-none absolute top-0 right-0 h-full w-full bg-gradient-to-bl from-blue-500 to-transparent p-4 opacity-5" />
          <CardContent className="relative z-10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                <Coins className="h-6 w-6" />
              </div>
              <Badge className="pointer-events-none border-0 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                6 Awaiting Release
              </Badge>
            </div>
            <p className="mb-1 text-sm font-semibold tracking-wider text-slate-500 uppercase">Budget Processing</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              <span className="mr-1 text-2xl font-semibold text-slate-400">$</span>2.4M
            </h2>
          </CardContent>
        </Card>

        {/* Completed Projects */}
        <Card className="border-slate-200/60 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <p className="mb-1 text-sm font-semibold tracking-wider text-slate-500 uppercase">Completed (YTD)</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">56</h2>
          </CardContent>
        </Card>
      </div>

      {/* ----------------- TWO-COLUMN MAIN LAYOUT ----------------- */}
      <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        {/* ========== LEFT AREA (Larger) ========== */}
        <div className="flex flex-col gap-6 xl:col-span-2 xl:gap-8">
          {/* Charts Row (Mock CSS Bars) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Project Status Distribution
                </CardTitle>
                <CardDescription className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Current Lifecycle Stages
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-2 mb-2 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600 dark:text-slate-400">Review & Evaluation</span>
                    <span className="font-bold">45</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full w-[45%] rounded-full bg-sky-500" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600 dark:text-slate-400">Active Execution</span>
                    <span className="font-bold">78</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full w-[78%] rounded-full bg-blue-600" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600 dark:text-slate-400">Completed & Closed</span>
                    <span className="font-bold">19</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full w-[19%] rounded-full bg-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Budget Trend Overview
                </CardTitle>
                <CardDescription className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Funding Requested vs Approved
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-4 flex h-[120px] items-end gap-2 pl-4">
                {/* Visual Chart Bars Mockup */}
                {[40, 60, 45, 80, 50, 95].map((val, i) => (
                  <div key={val} className="group flex h-full flex-1 flex-col items-center justify-end">
                    <div
                      className="mx-1 w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-blue-400 opacity-80 transition-opacity group-hover:opacity-100"
                      style={{ height: `${val}%` }}
                    />
                    <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase">M{i + 1}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Core Admin Actions Panel */}
          <Card className="border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
            <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-800">
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Administrative Action Hub
              </CardTitle>
              <CardDescription className="text-xs font-medium text-slate-500">
                Fast access to operational workflows based on your clearance.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 divide-y divide-slate-100 p-0 md:grid-cols-4 md:divide-x md:divide-y-0 dark:divide-slate-800">
              {/* Action 1 */}
              <div className="group flex cursor-pointer flex-col items-center p-6 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                <div className="mb-3 rounded-2xl bg-blue-50 p-3 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900/20 dark:text-blue-400">
                  <FileSearch className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Evaluations</h4>
                <p className="mt-1 text-[11px] font-medium text-slate-500">Assign Reviewers</p>
              </div>
              {/* Action 2 */}
              <div className="group flex cursor-pointer flex-col items-center p-6 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                <div className="mb-3 rounded-2xl bg-emerald-50 p-3 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <Coins className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Budget Release</h4>
                <p className="mt-1 text-[11px] font-medium text-slate-500">Approve Tranches</p>
              </div>
              {/* Action 3 */}
              <div className="group relative flex cursor-pointer flex-col items-center p-6 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                <div className="mb-3 rounded-2xl bg-amber-50 p-3 text-amber-600 transition-transform group-hover:scale-110 dark:bg-amber-900/20 dark:text-amber-400">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Terminations</h4>
                <p className="mt-1 text-[11px] font-medium text-slate-500">Handle Extensions</p>
              </div>
              {/* Action 4 */}
              <div className="group flex cursor-pointer flex-col items-center p-6 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                <div className="mb-3 rounded-2xl bg-indigo-50 p-3 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-900/20 dark:text-indigo-400">
                  <UserCog className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">User Roles</h4>
                <p className="mt-1 text-[11px] font-medium text-slate-500">Manage Personnel</p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Reviews Table */}
          <Card className="overflow-hidden border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Recent Proposal Submissions
                </CardTitle>
                <CardDescription className="mt-1 text-xs font-medium text-slate-500">
                  Ready for high-level administrative review.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8 font-semibold text-blue-600 dark:text-blue-400">
                View All Register <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                <TableRow className="border-slate-100 dark:border-slate-800">
                  <TableHead className="h-10 w-[45%] text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Project Title
                  </TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Lead PI
                  </TableHead>
                  <TableHead className="h-10 w-[120px] text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Status
                  </TableHead>
                  <TableHead className="h-10 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    title: "Advanced Deep Learning For Medical Imagery",
                    pi: "Dr. L. Vance",
                    status: "Under Review",
                    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                  },
                  {
                    title: "Sustainable Renewable Energy Systems",
                    pi: "Prof. E. Stark",
                    status: "Pending Release",
                    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                  },
                  {
                    title: "Quantum Computing Algorithms",
                    pi: "Dr. A. Turing",
                    status: "Completed",
                    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                  },
                ].map((row) => (
                  <TableRow
                    key={row.title}
                    className="group border-slate-100 hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-900/30"
                  >
                    <TableCell className="max-w-0 truncate text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                      {row.title}
                    </TableCell>
                    <TableCell className="max-w-[100px] truncate text-[12px] font-medium text-slate-500">
                      {row.pi}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${row.badge} pointer-events-none border-0 px-2 py-0.5 text-[10px] font-bold uppercase shadow-none`}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 rounded text-xs font-semibold transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:border-blue-800 dark:group-hover:bg-blue-900/20 dark:group-hover:text-blue-400"
                      >
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* ========== RIGHT AREA (Smaller) ========== */}
        <div className="flex flex-col gap-6 xl:gap-8">
          {/* Urgent Priority Tasks */}
          <Card className="border-red-200/50 bg-gradient-to-b from-white to-red-50/30 shadow-sm dark:border-red-900/30 dark:from-slate-950 dark:to-red-950/10">
            <CardHeader className="border-b border-red-100 pb-3 dark:border-red-900/20">
              <CardTitle className="text-md flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                <AlertCircle className="h-5 w-5 text-red-500" /> Action Required
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex cursor-pointer items-start gap-3 rounded-lg border border-red-100 bg-white p-3 shadow-sm transition-colors hover:border-red-300 dark:border-red-900/30 dark:bg-slate-900 dark:hover:border-red-800">
                <div className="shrink-0 rounded-md bg-red-100 p-2 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                  <Files className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-200">
                    Extension Request: PRJ-901
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-tight font-medium text-slate-500">
                    Dr. Carter requested a 3-month timeline extension. Review needed.
                  </p>
                </div>
              </div>
              <div className="flex cursor-pointer items-start gap-3 rounded-lg border border-amber-100 bg-white p-3 shadow-sm transition-colors hover:border-amber-300 dark:border-amber-900/30 dark:bg-slate-900 dark:hover:border-amber-800">
                <div className="shrink-0 rounded-md bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-200">
                    Team Replacement Conflict
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-tight font-medium text-slate-500">
                    Pending approval to replace Co-PI in Active Project P-204.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Timeline / Activity */}
          <Card className="h-full min-h-[#300px] flex-1 flex-col border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
            <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-800">
              <CardTitle className="text-md font-bold text-slate-800 dark:text-slate-100">
                Live System Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="relative ml-6 flex flex-1 flex-col gap-8 border-l-2 border-slate-100 pt-6 pr-2 pb-6 pl-6 dark:border-slate-800">
              {/* Activity 1 */}
              <div className="relative">
                <span className="absolute top-0 -left-[35px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-emerald-600 shadow-sm dark:border-slate-950 dark:bg-emerald-900/40 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">10 mins ago</p>
                <p className="mb-0.5 text-[13px] leading-tight font-semibold text-slate-800 dark:text-slate-200">
                  Project P-908 Budget Finalized
                </p>
                <p className="text-xs font-medium text-slate-500">Finance Dept released Phase II funding.</p>
              </div>
              {/* Activity 2 */}
              <div className="relative">
                <span className="absolute top-0 -left-[35px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-blue-600 shadow-sm dark:border-slate-950 dark:bg-blue-900/40 dark:text-blue-400">
                  <FileText className="h-3.5 w-3.5" />
                </span>
                <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">1 hr ago</p>
                <p className="mb-0.5 text-[13px] leading-tight font-semibold text-slate-800 dark:text-slate-200">
                  New Proposal Uploaded
                </p>
                <p className="text-xs font-medium text-slate-500">Submitted by Dr. Emily Wong (Chemistry).</p>
              </div>
              {/* Activity 3 */}
              <div className="relative">
                <span className="absolute top-0 -left-[35px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-600 shadow-sm dark:border-slate-950 dark:bg-slate-800 dark:text-slate-400">
                  <UserPlus className="h-3.5 w-3.5" />
                </span>
                <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Yesterday</p>
                <p className="mb-0.5 text-[13px] leading-tight font-semibold text-slate-800 dark:text-slate-200">
                  Reviewer Access Granted
                </p>
                <p className="text-xs font-medium text-slate-500">Assigned Prof X to Evaluate Sub-023.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
