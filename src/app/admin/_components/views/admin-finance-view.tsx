"use client";

import { Clock, DollarSign, TrendingUp, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DISBURSEMENT_REQUESTS = [
  {
    id: "DIS-001",
    project: "AI-Based Crop Disease Detection",
    pi: "Dr. Kebede Tadesse",
    amount: 12000,
    sequence: 2,
    hasClearance: true,
    status: "Ready",
  },
  {
    id: "DIS-002",
    project: "Rural Water Quality Monitoring",
    pi: "Amira Hassan",
    amount: 8500,
    sequence: 1,
    hasClearance: false,
    status: "Ready",
  },
  {
    id: "DIS-003",
    project: "Malaria Vaccine Efficacy Study",
    pi: "Hana Tesfaye",
    amount: 25000,
    sequence: 3,
    hasClearance: true,
    status: "Pending",
  },
  {
    id: "DIS-004",
    project: "Solar Panel Efficiency",
    pi: "Dawit Haile",
    amount: 6200,
    sequence: 1,
    hasClearance: false,
    status: "Returned",
  },
];

export function AdminFinanceView() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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
          {
            label: "Available Budget",
            value: "ETB 830K",
            sub: "Institutional pool",
            color: "text-blue-400",
            icon: Wallet,
          },
          {
            label: "Paid This Month",
            value: "ETB 94K",
            sub: "8 disbursements",
            color: "text-violet-400",
            icon: DollarSign,
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

      {/* Disbursement Queue */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
                Disbursement Requests
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                Dean-approved items ready for financial processing
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono text-[10px]">
              4 requests
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="pl-6 text-xs">ID</TableHead>
                <TableHead className="text-xs">Project</TableHead>
                <TableHead className="text-xs">PI</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">Clearance</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="pr-6 text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DISBURSEMENT_REQUESTS.map((r) => (
                <TableRow key={r.id} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="pl-6 font-mono text-muted-foreground text-xs">{r.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{r.project}</div>
                    <div className="text-muted-foreground text-xs">Stage {r.sequence}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{r.pi}</TableCell>
                  <TableCell className="font-mono font-semibold text-sm">ETB {r.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={r.hasClearance ? "outline" : "destructive"} className="text-[10px]">
                      {r.hasClearance ? "✓ Attached" : "Missing"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={r.status === "Ready" ? "secondary" : r.status === "Returned" ? "destructive" : "outline"}
                      className="text-xs"
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      size="sm"
                      className="h-7 bg-emerald-600 text-xs hover:bg-emerald-700"
                      disabled={r.status !== "Ready"}
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
