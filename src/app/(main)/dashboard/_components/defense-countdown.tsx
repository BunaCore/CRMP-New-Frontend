"use client";

import { useEffect, useState } from "react";

import { Timer } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface DefenseCountdownProps {
  date: Date;
}

export function DefenseCountdown({ date }: DefenseCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    expired?: boolean;
  }>({});

  useEffect(() => {
    const calc = () => {
      const diff = new Date(date).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ expired: true });

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [date]);

  if (timeLeft.expired) return null;

  return (
    <Card className="mb-6 border-amber-500/40 bg-amber-500/5">
      <CardContent className="pt-4 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Timer className="h-5 w-5 animate-pulse" />
            <span className="font-bold text-sm uppercase tracking-wide">Project Defense Countdown</span>
          </div>
          <div className="ml-auto flex gap-3">
            {[
              ["days", "Days"],
              ["hours", "Hrs"],
              ["minutes", "Min"],
              ["seconds", "Sec"],
            ].map(([k, l]) => (
              <div key={k} className="flex flex-col items-center">
                <span className="font-bold font-mono text-2xl text-amber-400 leading-none">
                  {String((timeLeft as Record<string, number | boolean>)[k] ?? 0).padStart(2, "0")}
                </span>
                <span className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-widest">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
