"use client";

import { Building2, CircleDot, FileText, ShieldCheck, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { StatusBadge } from "../status-badge";

const PROJECTS = [
  { id: "PRO-2024-001", title: "AI-Based Crop Disease Detection", status: "Active" },
  { id: "PRO-2024-002", title: "Rural Water Quality Monitoring", status: "In Review" },
  { id: "PRO-2024-003", title: "Carbon Footprint Analytics Platform", status: "Draft" },
];

export function AdminView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: "342", color: "text-blue-400", icon: Users },
          { label: "Active Proposals", value: "87", color: "text-emerald-400", icon: FileText },
          { label: "Departments", value: "14", color: "text-violet-400", icon: Building2 },
          { label: "Pending Roles", value: "6", color: "text-amber-400", icon: ShieldCheck },
        ].map((m) => (
          <Card key={m.label} className="border-border/50 bg-card/50">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-muted-foreground text-xs uppercase tracking-widest">{m.label}</p>
                  <p className="font-bold font-mono text-3xl">{m.value}</p>
                </div>
                <m.icon className={`h-5 w-5 ${m.color} opacity-50`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
              Recent Proposals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="pl-6 text-xs">ID</TableHead>
                  <TableHead className="text-xs">Title</TableHead>
                  <TableHead className="pr-6 text-right text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PROJECTS.map((p) => (
                  <TableRow key={p.id} className="border-border/30 hover:bg-muted/30">
                    <TableCell className="pl-6 font-mono text-muted-foreground text-xs">{p.id}</TableCell>
                    <TableCell className="max-w-[160px] truncate text-sm">{p.title}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <StatusBadge status={p.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
              Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { role: "Students", pct: 53 },
              { role: "Faculty", pct: 21 },
              { role: "Coordinators", pct: 8 },
              { role: "Approvers", pct: 12 },
              { role: "Admins", pct: 6 },
            ].map((r) => (
              <div key={r.role}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-foreground/70">{r.role}</span>
                  <span className="font-mono text-muted-foreground">{r.pct}%</span>
                </div>
                <Progress value={r.pct} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
            Audit Log — Recent Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { action: "User role updated", user: "Dawit Haile → Faculty", time: "10m ago", type: "edit" },
            { action: "Department created", user: "School of Data Science", time: "2h ago", type: "create" },
            { action: "System settings modified", user: "Backup schedule changed", time: "5h ago", type: "warn" },
          ].map((l) => (
            <div key={l.action} className="flex items-center gap-3 py-1 text-sm">
              <CircleDot
                className={`h-3 w-3 flex-shrink-0 ${l.type === "create" ? "text-emerald-400" : l.type === "warn" ? "text-amber-400" : "text-blue-400"}`}
              />
              <span className="font-medium">{l.action}</span>
              <span className="text-muted-foreground text-xs">{l.user}</span>
              <span className="ml-auto font-mono text-muted-foreground text-xs">{l.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
