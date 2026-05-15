"use client";

import { motion } from "framer-motion";
import { CheckSquare, ClipboardList, Clock, FileSearch } from "lucide-react";

import { StatusBadge } from "@/app/admin/_components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ASSIGNED_EVALUATIONS = [
  {
    id: "EVAL-001",
    proposalTitle: "Neural Interface for Robotics Control",
    submitter: "Girma Solomon",
    dept: "Engineering",
    assignedDate: "2024-12-10",
    dueDate: "2024-12-20",
    status: "Pending",
  },
  {
    id: "EVAL-002",
    proposalTitle: "Blockchain-Based Land Registry",
    submitter: "Tigist Alemu",
    dept: "Computing",
    assignedDate: "2024-12-08",
    dueDate: "2024-12-18",
    status: "In Progress",
  },
  {
    id: "EVAL-003",
    proposalTitle: "Renewable Energy Grid Modeling",
    submitter: "Dawit Haile",
    dept: "Engineering",
    assignedDate: "2024-12-05",
    dueDate: "2024-12-15",
    status: "Completed",
  },
];

export function AdminEvaluatorView() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Assigned Reviews",
            value: "3",
            sub: "2 pending",
            color: "text-amber-400",
            icon: ClipboardList,
          },
          {
            label: "Completed",
            value: "12",
            sub: "This semester",
            color: "text-emerald-400",
            icon: CheckSquare,
          },
          {
            label: "Avg Review Time",
            value: "4.2d",
            sub: "Target: 7d",
            color: "text-blue-400",
            icon: Clock,
          },
          {
            label: "Active Advisees",
            value: "5",
            sub: "UG & PG students",
            color: "text-violet-400",
            icon: FileSearch,
          },
        ].map((m, idx) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="h-full border-border/50 bg-card/50 transition-shadow hover:shadow-md">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-widest">
                      {m.label}
                    </p>
                    <p className="font-bold font-mono text-3xl text-foreground">{m.value}</p>
                    <p className={`mt-1 font-medium text-xs ${m.color}`}>{m.sub}</p>
                  </div>
                  <m.icon className={`h-5 w-5 opacity-50 ${m.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Evaluation Assignments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
                  My Evaluation Assignments
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Proposals assigned to you for review and scoring
                </CardDescription>
              </div>
              <Badge variant="secondary" className="font-mono text-[10px]">
                2 pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="pl-6 text-xs">Proposal</TableHead>
                  <TableHead className="text-xs">Department</TableHead>
                  <TableHead className="text-xs">Due Date</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="pr-6 text-right text-xs">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ASSIGNED_EVALUATIONS.map((e) => (
                  <TableRow key={e.id} className="border-border/30 hover:bg-muted/30">
                    <TableCell className="pl-6">
                      <div className="font-medium text-sm">{e.proposalTitle}</div>
                      <div className="font-mono text-muted-foreground text-xs">
                        {e.id} · by {e.submitter}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {e.dept}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-sm">
                      {new Date(e.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={e.status} />
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant={e.status === "Completed" ? "outline" : "default"}
                        size="sm"
                        className={`h-7 text-xs ${e.status !== "Completed" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      >
                        {e.status === "Completed" ? "View Score" : "Submit Score"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
