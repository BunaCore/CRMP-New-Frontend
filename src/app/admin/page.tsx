"use client";

import { motion } from "framer-motion";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock User Context (for Role-Based UI demo)
const currentUser = {
  name: "Dr. Admin",
  role: "Finance", // e.g. VPRTT, RAD, Finance
};
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Cards will pop in one after another
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function AdminDashboardPage() {
  return (
    <div className="z-0 flex min-h-screen w-full flex-1 flex-col bg-white p-2 md:p-3 lg:p-4 xl:p-6 dark:bg-slate-950/20">
      {/* ----------------- TOP HEADER ----------------- */}
      <header className="mb-3 flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div className="flex flex-col gap-0.5">
          <h1 className="flex items-center gap-2 font-extrabold text-lg text-slate-900 tracking-tight dark:text-slate-100">
            <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            Research Control Center
          </h1>

          <p className="font-medium text-sm text-slate-500 leading-tight dark:text-slate-400">
            Welcome back, {currentUser.name}. Here's an overview of the university research ecosystem today.
          </p>
        </div>
      </header>

      {/* ----------------- STAT SUMMARY CARDS ----------------- */}
      <div className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
        <motion.div variants={cardVariants} whileHover={{ y: -5 }} className="w-full group">
          <Card className="h-full border-slate-200/60 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
            <CardContent className="p-2">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="
                      flex h-7 w-7 items-center justify-center rounded-md
                      bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400
                      transition-all duration-300
                      group-hover:bg-blue-600 group-hover:text-white
                      group-hover:shadow-[0_0_12px_rgba(59,130,246,0.45)]
                      group-hover:scale-105
                    "
                  >
                    <Briefcase className="h-3 w-3" />
                  </div>

                  <div className="leading-none">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Projects</p>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">142</h2>
                  </div>
                </div>

                <span className="text-[12px] text-emerald-600 dark:text-emerald-400">+12%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants} whileHover={{ y: -5 }} className="w-full group">
          <Card className="h-full border-slate-200/60 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
            <CardContent className="p-2">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="
                    flex h-7 w-7 items-center justify-center rounded-md
                    bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400
                    transition-all duration-300
                    group-hover:bg-amber-600 group-hover:text-white
                group-hover:shadow-[0_0_12px_rgba(245,158,11,0.45)]
                group-hover:scale-105
              "
                  >
                    <FileCheck2 className="h-3 w-3" />
                  </div>

                  <div className="leading-none">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Pending</p>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">28</h2>
                  </div>
                </div>

                <span className="text-[12px] font-bold text-red-600 dark:text-red-400">Alert</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants} whileHover={{ y: -5 }} className="w-full group">
          <Card className="relative h-full border-slate-200/60 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
            <CardContent className="p-2">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="
                flex h-7 w-7 items-center justify-center rounded-md
                bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400
                transition-all duration-300
                group-hover:bg-indigo-600 group-hover:text-white
                group-hover:shadow-[0_0_12px_rgba(99,102,241,0.45)]
                group-hover:scale-105
              "
                  >
                    <Coins className="h-3 w-3" />
                  </div>

                  <div className="leading-none">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Budget</p>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">2.4M</h2>
                  </div>
                </div>

                <span className="text-[12px] text-blue-600 dark:text-blue-400">Birr</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants} whileHover={{ y: -5 }} className="w-full group">
          <Card className="h-full border-slate-200/60 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
            <CardContent className="p-2">
              <div className="flex items-center justify-between gap-1">
                {/* LEFT SIDE */}
                <div className="flex items-center gap-1.5">
                  <div
                    className="
                  flex h-7 w-7 items-center justify-center rounded-md
                  bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400
                  transition-all duration-300
                  group-hover:bg-emerald-600 group-hover:text-white
                  group-hover:shadow-[0_0_12px_rgba(16,185,129,0.45)]
                  group-hover:scale-105
                "
                  >
                    <CheckCircle2 className="h-3 w-3" />
                  </div>

                  <div className="leading-none">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Done</p>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">56</h2>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <span className="text-[12px] text-amber-600 dark:text-amber-400">All</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ----------------- MAIN CONTROL AREA ----------------- */}
      <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        {/* ================= LEFT: NOTIFICATION CENTER ================= */}

        <div className="flex flex-col gap-3 xl:col-span-1">
          <Card className="border-red-200/40 bg-white shadow-sm dark:border-red-900/30 dark:bg-slate-950/50">
            {/* HEADER (compact) */}
            <CardHeader className="border-b border-red-100 px-3 py-2 dark:border-red-900/20">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Bell className="h-4 w-4 text-red-500" />
                  Notifications
                </CardTitle>

                <Badge className="bg-red-100 px-2 py-0 text-[10px] text-red-700 dark:bg-red-900/40 dark:text-red-300">
                  2
                </Badge>
              </div>

              <CardDescription className="text-[10px] text-slate-500 leading-tight">
                Transfer requests & team changes requiring action
              </CardDescription>
            </CardHeader>

            {/* CONTENT */}
            <CardContent className="flex flex-col gap-2 p-2">
              {/* Notification Item */}
              <div className="flex items-start gap-2 rounded-md border border-slate-100 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                {/* Avatar */}
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-red-100 text-[10px] text-red-700">DR</AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex flex-1 flex-col leading-tight">
                  <div className="flex justify-between">
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">Dr. Research Office</p>
                    <span className="text-[9px] text-slate-400">2m</span>
                  </div>

                  <p className="text-[10px] text-slate-500">Project Transfer Request (PRJ-102)</p>

                  <div className="mt-1.5 flex gap-2">
                    <Button size="sm" className="h-5 px-2 text-[10px] bg-emerald-600">
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="h-5 px-2 text-[10px]">
                      Reject
                    </Button>
                  </div>
                </div>
              </div>

              {/* Notification Item */}
              <div className="flex items-start gap-2 rounded-md border border-slate-100 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                {/* Avatar */}
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-blue-100 text-[10px] text-blue-700">CP</AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex flex-1 flex-col leading-tight">
                  <div className="flex justify-between">
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">Co-PI Office</p>
                    <span className="text-[9px] text-slate-400">10m</span>
                  </div>

                  <p className="text-[10px] text-slate-500">Team Replacement Request (PRJ-204)</p>

                  <div className="mt-1.5 flex gap-2">
                    <Button size="sm" className="h-5 px-2 text-[10px] bg-blue-600">
                      Review
                    </Button>
                    <Button size="sm" variant="outline" className="h-5 px-2 text-[10px]">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* ================= RIGHT: DATA TABLE ================= */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <Card className="border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
            {/* Header + Search */}
            <CardHeader className="border-b pb-3 dark:border-slate-800">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="font-bold text-md text-slate-900 dark:text-slate-100">
                    Project Registry
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Search and manage all active research projects
                  </CardDescription>
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input placeholder="Search projects..." className="h-9 pl-8 rounded-full" />
                </div>
              </div>
            </CardHeader>

            {/* Table */}
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                  <TableRow>
                    <TableHead className="text-xs">Project</TableHead>
                    <TableHead className="text-xs">PI</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-right text-xs">Quick Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {[
                    { name: "AI Medical Imaging", PI: "Dr. Vance", status: "Active" },
                    { name: "Energy Grid Optimization", PI: "Prof. Stark", status: "Pending" },
                    { name: "Quantum Research Model", PI: "Dr. Turing", status: "Review" },
                  ].map((p) => (
                    <TableRow key={p.name} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                      <TableCell className="font-medium text-sm">{p.name}</TableCell>

                      <TableCell className="text-sm text-slate-500">{p.PI}</TableCell>

                      <TableCell className="text-xs text-slate-500">{p.status}</TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="text-emerald-600">Approve</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Terminate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
