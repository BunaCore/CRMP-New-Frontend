"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export function AllProjectsTableSkeleton() {
  return (
    <TableBody className="[&_tr]:h-15">
      {Array.from({ length: 8 }).map((_, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton rows are static placeholders that never reorder
        <TableRow key={`projects-skeleton-${idx}`}>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-64 max-w-full" />
              <Skeleton className="h-3 w-80 max-w-full" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-7 w-7 rounded-md" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="ml-auto h-4 w-28" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
