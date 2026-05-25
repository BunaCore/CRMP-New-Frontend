export function MetadataViewer({ metadata }: { metadata: Record<string, unknown> }) {
  if (!metadata || typeof metadata !== "object" || Object.keys(metadata).length === 0) {
    return <span className="text-slate-400 italic">No metadata provided</span>;
  }

  const entries = Object.entries(metadata).filter(([k]) => k !== "id" && k !== "_id");

  if (entries.length === 0) {
    return <span className="text-slate-400 italic">No metadata provided</span>;
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="flex flex-col gap-1 border-slate-100 border-b py-1.5 last:border-0 sm:flex-row sm:items-start sm:gap-4 dark:border-slate-800/50"
        >
          <span className="min-w-24 shrink-0 font-mono font-semibold text-slate-500 text-xs">{key}</span>
          <div className="break-all rounded bg-slate-50 px-2 py-0.5 font-mono text-slate-700 text-xs dark:bg-slate-900 dark:text-slate-300">
            {typeof value === "object" && value !== null ? JSON.stringify(value) : String(value)}
          </div>
        </div>
      ))}
    </div>
  );
}
