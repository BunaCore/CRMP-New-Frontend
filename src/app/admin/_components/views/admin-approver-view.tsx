"use client";

import { Building2, CheckCircle2, Clock, Eye, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PENDING_PROPOSALS = [
  {
    id: "PRO-2024-012",
    title: "Nano-material Energy Storage Research",
    dept: "Engineering",
    submitter: "Liya Mengistu",
    type: "PG",
    budget: 48000,
    daysWaiting: 1,
    priority: "high",
  },
  {
    id: "PRO-2024-015",
    title: "Urban Mobility AI Framework",
    dept: "Computing",
    submitter: "Girma Solomon",
    type: "GENERAL",
    budget: 125000,
    daysWaiting: 3,
    priority: "medium",
  },
  {
    id: "PRO-2024-018",
    title: "Malaria Vaccine Efficacy Study",
    dept: "Health Sciences",
    submitter: "Hana Tesfaye",
    type: "PG",
    budget: 67000,
    daysWaiting: 5,
    priority: "low",
  },
  {
    id: "PRO-2024-021",
    title: "Solar Panel Efficiency Optimization",
    dept: "Engineering",
    submitter: "Dawit Haile",
    type: "UG",
    budget: 0,
    daysWaiting: 2,
    priority: "medium",
  },
];

export function AdminApproverView() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Pending Approvals",
            value: "4",
            sub: "2 urgent",
            color: "text-amber-400",
            icon: Clock,
          },
          {
            label: "Approved This Month",
            value: "21",
            sub: "+5 from last month",
            color: "text-emerald-400",
            icon: CheckCircle2,
          },
          {
            label: "Avg Turnaround",
            value: "2.4d",
            sub: "Target: 3d",
            color: "text-blue-400",
            icon: TrendingUp,
          },
          {
            label: "Dept. Projects",
            value: "34",
            sub: "12 active",
            color: "text-violet-400",
            icon: Building2,
          },
        ].map((m) => (
          <Card key={m.label} className="border-border/50 bg-card/50">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-widest">{m.label}</p>
                  <p className="font-bold font-mono text-3xl text-foreground">{m.value}</p>
                  <p className={`mt-1 font-medium text-xs ${m.color}`}>{m.sub}</p>
                </div>
                <m.icon className={`h-5 w-5 opacity-50 ${m.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Approval Queue Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
                Approval Queue
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                Proposals waiting for your review and decision
              </CardDescription>
            </div>
            <Badge variant="destructive" className="font-mono text-[10px]">
              4 pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="pl-6 text-xs">Proposal</TableHead>
                <TableHead className="text-xs">Department</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Budget</TableHead>
                <TableHead className="text-xs">Waiting</TableHead>
                <TableHead className="pr-6 text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PENDING_PROPOSALS.map((p) => (
                <TableRow key={p.id} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="pl-6">
                    <div className="font-medium text-sm">{p.title}</div>
                    <div className="font-mono text-muted-foreground text-xs">
                      {p.id} · by {p.submitter}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {p.dept}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {p.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground text-sm">
                    {p.budget > 0 ? `ETB ${p.budget.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={p.daysWaiting <= 1 ? "destructive" : p.daysWaiting <= 3 ? "secondary" : "outline"}
                      className="font-mono text-xs"
                    >
                      {p.daysWaiting}d
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                        <Eye className="h-3 w-3" />
                        Review
                      </Button>
                      <Button size="sm" className="h-7 bg-emerald-600 text-xs hover:bg-emerald-700">
                        Approve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
