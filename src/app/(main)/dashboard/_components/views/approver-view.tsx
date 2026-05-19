"use client";

import { Building2, CheckCircle2, Clock, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const APPROVALS = [
  {
    id: "PRO-2024-005",
    title: "Nano-material Energy Storage",
    dept: "Engineering",
    submitter: "Liya M.",
    days: 1,
    priority: "high",
  },
  {
    id: "PRO-2024-006",
    title: "Urban Mobility AI Framework",
    dept: "Computing",
    submitter: "Girma S.",
    days: 3,
    priority: "medium",
  },
  {
    id: "PRO-2024-007",
    title: "Malaria Vaccine Efficacy Study",
    dept: "Health Sciences",
    submitter: "Hana T.",
    days: 5,
    priority: "low",
  },
];

export function ApproverView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pending Approvals", value: "4", color: "text-amber-400", icon: Clock },
          { label: "Approved This Month", value: "21", color: "text-emerald-400", icon: CheckCircle2 },
          { label: "Avg Turnaround", value: "2.4d", color: "text-blue-400", icon: TrendingUp },
          { label: "Dept Projects", value: "34", color: "text-violet-400", icon: Building2 },
        ].map((m) => (
          <Card key={m.label} className="border-border/50 bg-card/50">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-muted-foreground text-xs uppercase tracking-widest">{m.label}</p>
                  <p className="font-bold font-mono text-3xl">{m.value}</p>
                </div>
                <m.icon className={`h-5 w-5 ${m.color} opacity-40`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
                Approval Queue
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">Items waiting for your signature</CardDescription>
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
                <TableHead className="text-xs">Submitted By</TableHead>
                <TableHead className="text-xs">Waiting</TableHead>
                <TableHead className="pr-6 text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {APPROVALS.map((a) => (
                <TableRow key={a.id} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="pl-6">
                    <div className="font-medium text-sm">{a.title}</div>
                    <div className="font-mono text-muted-foreground text-xs">{a.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {a.dept}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{a.submitter}</TableCell>
                  <TableCell>
                    <Badge
                      variant={a.days <= 1 ? "destructive" : a.days <= 3 ? "secondary" : "outline"}
                      className="font-mono text-xs"
                    >
                      {a.days}d
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
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
