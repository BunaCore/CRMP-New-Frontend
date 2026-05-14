"use client";

import { Activity, AlertCircle, CheckCircle2, Layers, Plus, Users, Wallet } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { StatusBadge } from "../status-badge";

const PROJECTS = [
  {
    id: "PRO-2024-001",
    title: "AI-Based Crop Disease Detection",
    status: "Active",
    progress: 65,
    type: "Funded",
    updated: "2h ago",
    budget: 48000,
    spent: 18200,
  },
  {
    id: "PRO-2024-002",
    title: "Rural Water Quality Monitoring",
    status: "In Review",
    progress: 82,
    type: "PG",
    updated: "1d ago",
    budget: 22000,
    spent: 17500,
  },
  {
    id: "PRO-2024-003",
    title: "Carbon Footprint Analytics Platform",
    status: "Draft",
    progress: 20,
    type: "UG",
    updated: "3d ago",
    budget: 35000,
    spent: 0,
  },
];

const NOTIFICATIONS = [
  { id: 1, type: "info", icon: Activity, text: "PRO-2024-001 advanced to ADRPM review", time: "2h ago" },
  { id: 2, type: "warning", icon: AlertCircle, text: "Budget revision requested for PRO-2024-004", time: "5h ago" },
  { id: 3, type: "success", icon: CheckCircle2, text: "PRO-2024-002 fully approved & funded", time: "1d ago" },
];

export function ResearcherView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Projects", value: "3", sub: "2 in review", icon: Layers, color: "text-emerald-400" },
          { label: "Total Budget", value: "ETB 105K", sub: "ETB 35.7K spent", icon: Wallet, color: "text-blue-400" },
          { label: "Team Members", value: "4", sub: "2 online now", icon: Users, color: "text-violet-400" },
        ].map((m) => (
          <Card key={m.label} className="border-border/50 bg-card/50">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-widest">{m.label}</p>
                  <p className="font-bold font-mono text-3xl text-foreground">{m.value}</p>
                  <p className={`mt-1 font-medium text-xs ${m.color}`}>{m.sub}</p>
                </div>
                <m.icon className={`h-5 w-5 opacity-70 ${m.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
              My Active Projects
            </CardTitle>
            <Button size="sm" className="h-8 gap-1.5">
              <Plus className="h-3.5 w-3.5" /> New Proposal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="pl-6 text-xs">Project</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Progress</TableHead>
                <TableHead className="pr-6 text-right text-xs">Budget Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PROJECTS.map((p) => (
                <TableRow key={p.id} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="pl-6">
                    <div className="font-medium text-sm">{p.title}</div>
                    <div className="font-mono text-muted-foreground text-xs">
                      {p.id} · {p.updated}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {p.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-[100px] items-center gap-2">
                      <Progress value={p.progress} className="h-1.5 flex-1" />
                      <span className="w-8 font-mono text-muted-foreground text-xs">{p.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 text-right font-mono text-muted-foreground text-xs">
                    ETB {p.spent.toLocaleString()} / ETB {p.budget.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
              Team Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Dr. Kebede Tadesse", role: "Advisor", initials: "KT", online: true },
              { name: "Amira Hassan", role: "Co-researcher", initials: "AH", online: true },
              { name: "Liya Mengistu", role: "Student", initials: "LM", online: false },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-xs">{m.initials}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-background ${m.online ? "bg-emerald-500" : "bg-muted"}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-sm">{m.name}</div>
                  <div className="text-muted-foreground text-xs">{m.role}</div>
                </div>
                <span className={`text-xs ${m.online ? "text-emerald-400" : "text-muted-foreground"}`}>
                  {m.online ? "Online" : "Offline"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {NOTIFICATIONS.map((n) => (
              <div key={n.id} className="flex items-start gap-3">
                <n.icon
                  className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                    n.type === "success"
                      ? "text-emerald-400"
                      : n.type === "warning"
                        ? "text-amber-400"
                        : "text-blue-400"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground/80 text-xs leading-relaxed">{n.text}</p>
                  <p className="mt-0.5 text-muted-foreground text-xs">{n.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
