import { Skeleton } from "@/components/ui/skeleton";

export function ChatMessageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 py-6 opacity-60">
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-48 rounded-2xl" />
        </div>
      </div>

      <div className="flex flex-row-reverse gap-3">
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-10 w-36 rounded-2xl" />
        </div>
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-16 w-56 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
