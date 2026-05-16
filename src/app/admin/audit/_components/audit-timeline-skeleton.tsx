export function AuditTimelineSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative pl-16 opacity-70 animate-pulse">
          <div className="absolute left-12 top-2 z-[1] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-4 border-white bg-slate-200 dark:border-slate-950 dark:bg-slate-800" />
          <div className="rounded-2xl border border-slate-200/50 bg-slate-50/50 p-4 pl-6 dark:border-slate-800/50 dark:bg-slate-900/50">
            <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800 mb-2" />
            <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800 mb-4" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
