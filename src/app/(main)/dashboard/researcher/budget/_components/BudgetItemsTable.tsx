"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { BudgetItem } from "../_hooks/useProjectBudget";

function formatETB(amount: number) {
  return `ETB ${amount.toLocaleString("en-ET")}`;
}

const statusConfig: Record<BudgetItem["status"], { label: string; className: string }> = {
  AVAILABLE: {
    label: "Available",
    className: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  },
  PENDING_DISBURSEMENT: {
    label: "Pending Disbursement",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  PAID: {
    label: "Paid",
    className:
      "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
};

interface BudgetItemsTableProps {
  items: BudgetItem[];
}

export function BudgetItemsTable({ items }: BudgetItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <p className="text-sm">No budget items found for this project.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">Item</TableHead>
            <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Category
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Amount
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const config = statusConfig[item.status];
            return (
              <TableRow key={item.id} className={cn("transition-colors", item.status === "PAID" && "opacity-60")}>
                <TableCell className="font-medium text-sm">{item.description}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{item.category}</TableCell>
                <TableCell className="text-right font-medium font-mono text-sm">{formatETB(item.amount)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium text-xs", config.className)}>
                    {config.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function BudgetItemsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Item</TableHead>
            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Category</TableHead>
            <TableHead className="text-right text-muted-foreground text-xs uppercase tracking-wider">Amount</TableHead>
            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
