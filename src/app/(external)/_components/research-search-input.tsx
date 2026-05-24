"use client";

import { cn } from "@/lib/utils";

interface ResearchSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function ResearchSearchInput({
  value,
  onChange,
  placeholder = "Search by title...",
  onClear: _onClear,
}: ResearchSearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-14 w-full max-w-3xl rounded-none border-0 border-b-2 border-b-border bg-transparent px-0 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-b-primary focus:ring-0",
      )}
    />
  );
}
