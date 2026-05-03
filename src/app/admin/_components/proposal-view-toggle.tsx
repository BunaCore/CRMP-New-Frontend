"use client";

import type { ReactNode } from "react";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProposalViewToggleProps {
  leftValue: string;
  leftLabel: string;
  rightValue: string;
  rightLabel: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftBadge?: ReactNode;
  rightBadge?: ReactNode;
  className?: string;
}

export function ProposalViewToggle({
  leftValue,
  leftLabel,
  rightValue,
  rightLabel,
  leftIcon,
  rightIcon,
  leftBadge,
  rightBadge,
  className,
}: ProposalViewToggleProps) {
  return (
    <TabsList
      className={`h-10 w-full justify-start rounded-xl bg-slate-100 p-1 sm:w-auto dark:bg-slate-900 ${className ?? ""}`.trim()}
    >
      <TabsTrigger
        value={leftValue}
        className="rounded-lg px-5 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800"
      >
        {leftIcon}
        {leftLabel}
        {leftBadge ? <span className="ml-2">{leftBadge}</span> : null}
      </TabsTrigger>
      <TabsTrigger
        value={rightValue}
        className="rounded-lg px-5 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800"
      >
        {rightIcon}
        {rightLabel}
        {rightBadge ? <span className="ml-2">{rightBadge}</span> : null}
      </TabsTrigger>
    </TabsList>
  );
}
