"use client";

import { Clock, TrendingUp, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { StatusBadge } from "../status-badge";

const BUDGET_ITEMS = [
  {
    id: "BUD-001",
    project: "AI-Based Crop Disease Detection",
    amount: 12000,
    approvedBy: "Dean Tesfaye",
    status: "Ready",
  },
  {
    id: "BUD-002",
    project: "Rural Water Quality Monitoring",
    amount: 8500,
    approvedBy: "ADRPM Office",
    status: "Ready",
  },
  { id: "BUD-003", project: "Malaria Vaccine Study", amount: 25000, approvedBy: "Academic Council", status: "Pending" },
];

export function FinanceView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Disbursed",
            value: "ETB 2.4M",
            sub: "This fiscal year",
            color: "text-emerald-400",
            icon: TrendingUp,
          },
          {
            label: "Pending Requests",
            value: "ETB 45.5K",
            sub: "3 items awaiting",
            color: "text-amber-400",
            icon: Clock,
          },
          { label: "Available Budget", value: "ETB 830K", sub: "As of today", color: "text-blue-400", icon: Wallet },
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

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
            Actionable Disbursement Requests
          </CardTitle>
          <CardDescription className="mt-0.5 text-xs">
            Dean-approved items ready for final financial stamp
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="pl-6 text-xs">ID</TableHead>
                <TableHead className="text-xs">Project</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="pr-6 text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BUDGET_ITEMS.map((b) => (
                <TableRow key={b.id} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="pl-6 font-mono text-muted-foreground text-xs">{b.id}</TableCell>
                  <TableCell className="font-medium text-sm">{b.project}</TableCell>
                  <TableCell className="font-mono font-semibold text-sm">ETB {b.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      size="sm"
                      className="h-7 bg-emerald-600 text-xs hover:bg-emerald-700"
                      disabled={b.status !== "Ready"}
                    >
                      Release Funds
                    </Button>
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
