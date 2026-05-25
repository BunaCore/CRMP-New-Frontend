"use client";

import { useState } from "react";

import { format } from "date-fns";
import { AlertCircle, CheckCircle, ChevronRight, Clock, Eye, Timer, Wrench, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { DisbursementRecord } from "../_hooks/useProjectBudget";
import { FixResubmitDrawer } from "./FixResubmitDrawer";

function formatETB(amount: number) {
  return `ETB ${amount.toLocaleString("en-ET")}`;
}

function formatDate(iso: string) {
  try {
    return format(new Date(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
}

function getDaysWaiting(submittedAt: string) {
  return Math.floor((Date.now() - new Date(submittedAt).getTime()) / 86_400_000);
}

type StatusKey = DisbursementRecord["status"];

const statusConfig: Record<StatusKey, { label: string; className: string; icon: React.ElementType }> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  RESUBMITTED: {
    label: "Resubmitted",
    icon: Timer,
    className: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  },
  PAID: {
    label: "Paid",
    icon: CheckCircle,
    className:
      "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  RETURNED: {
    label: "Returned",
    icon: XCircle,
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className:
      "border-destructive bg-destructive/10 text-destructive dark:border-destructive dark:bg-destructive/20 dark:text-destructive",
  },
};

interface DisbursementHistoryTableProps {
  history: DisbursementRecord[];
  onResubmitSuccess: () => void;
}

export function DisbursementHistoryTable({ history, onResubmitSuccess }: DisbursementHistoryTableProps) {
  const [viewRecord, setViewRecord] = useState<DisbursementRecord | null>(null);
  const [fixRecord, setFixRecord] = useState<DisbursementRecord | null>(null);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <p className="text-sm">No disbursement requests have been made yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-16 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                #
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Items
              </TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Submitted
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Waiting
              </TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((record) => {
              const config = statusConfig[record.status];
              const StatusIcon = config.icon;
              const isActive = record.status === "PENDING" || record.status === "RESUBMITTED";
              const days = getDaysWaiting(record.submittedAt);
              const isOverdue = days > 7;

              return (
                <TableRow key={record.id} className="transition-colors">
                  <TableCell className="font-semibold text-muted-foreground text-sm">
                    #{record.requestSequence}
                  </TableCell>
                  <TableCell className="max-w-xs text-sm">
                    <p className="truncate text-muted-foreground">
                      {record.items.map((i) => i.description).join(", ")}
                    </p>
                  </TableCell>
                  <TableCell className="text-right font-medium font-mono text-sm">
                    {formatETB(record.totalAmount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(record.submittedAt)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("gap-1 font-medium text-xs", config.className)}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isActive ? (
                      <span
                        className={cn(
                          "font-medium text-xs",
                          isOverdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
                        )}
                      >
                        {days}d {isOverdue && "⚠️"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50 text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {record.status === "RETURNED" ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 gap-1.5 text-xs"
                        onClick={() => setFixRecord(record)}
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        Fix &amp; Resubmit
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1.5 text-xs"
                        onClick={() => setViewRecord(record)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* View Details Sheet */}
      <Sheet open={!!viewRecord} onOpenChange={(o) => !o && setViewRecord(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader className="mb-6">
            <SheetTitle>Request #{viewRecord?.requestSequence} Details</SheetTitle>
            <SheetDescription>Submitted {viewRecord ? formatDate(viewRecord.submittedAt) : ""}</SheetDescription>
          </SheetHeader>
          {viewRecord && (
            <div className="space-y-5">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">Status:</span>
                <Badge
                  variant="outline"
                  className={cn("font-medium text-xs", statusConfig[viewRecord.status].className)}
                >
                  {statusConfig[viewRecord.status].label}
                </Badge>
              </div>

              {/* Items */}
              <div>
                <p className="mb-2 font-semibold text-sm">Requested Items</p>
                <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
                  {viewRecord.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.description}</span>
                      <span className="font-medium font-mono">{formatETB(item.amount)}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex items-center justify-between border-border border-t pt-2 font-semibold text-sm">
                    <span>Total</span>
                    <span className="font-mono">{formatETB(viewRecord.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment info if PAID */}
              {viewRecord.status === "PAID" && viewRecord.paidAt && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <p className="font-semibold text-emerald-700 text-sm dark:text-emerald-400">Payment Confirmed</p>
                  <p className="mt-1 text-muted-foreground text-sm">Paid on {formatDate(viewRecord.paidAt)}</p>
                </div>
              )}

              {/* Finance feedback */}
              {viewRecord.financeFeedback && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
                  <div className="mb-1 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <p className="font-semibold text-red-700 text-sm dark:text-red-400">Finance Feedback</p>
                  </div>
                  <p className="text-muted-foreground text-sm">{viewRecord.financeFeedback}</p>
                </div>
              )}

              {/* Clearance document */}
              {viewRecord.clearanceDocumentUrl && (
                <div>
                  <p className="mb-1 font-semibold text-sm">Clearance Document</p>
                  <a
                    href={viewRecord.clearanceDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-sm underline underline-offset-2 hover:opacity-80"
                  >
                    Open Document ↗
                  </a>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Fix & Resubmit Drawer */}
      {fixRecord && (
        <FixResubmitDrawer
          record={fixRecord}
          open={!!fixRecord}
          onClose={() => setFixRecord(null)}
          onSuccess={() => {
            setFixRecord(null);
            onResubmitSuccess();
          }}
        />
      )}
    </>
  );
}

export function DisbursementHistoryTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {["#", "Items", "Amount", "Submitted", "Status", "Waiting", "Action"].map((h) => (
              <TableHead key={h} className="text-muted-foreground text-xs uppercase tracking-wider">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-52" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-7 w-16 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
