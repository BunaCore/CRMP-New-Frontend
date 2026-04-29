"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export function UsersTableSkeleton() {
  return (
    <TableBody className="[&_tr]:h-[60px]">
      {Array.from({ length: 5 }).map((_, idx) => (
        <TableRow key={`users-skeleton-${idx}`}>
          <TableCell className="pl-5">
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell className="pr-5 text-right">
            <Skeleton className="ml-auto h-7 w-7 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
