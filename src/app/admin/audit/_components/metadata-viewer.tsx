export function MetadataViewer({ metadata }: { metadata: Record<string, any> }) {
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
          className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800/50 last:border-0"
        >
          <span className="text-xs font-mono font-semibold text-slate-500 min-w-24 shrink-0">{key}</span>
          <div className="text-xs text-slate-700 dark:text-slate-300 font-mono break-all bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded">
            {typeof value === "object" && value !== null ? JSON.stringify(value) : String(value)}
          </div>
        </div>
      ))}
    </div>
  );
}
