"use client";

import * as React from "react";

import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
  endLabel?: React.ReactNode;
};

export function PasswordField({
  id = "password",
  label = "Password",
  error,
  endLabel,
  className,
  disabled,
  ...inputProps
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {endLabel}
      </div>

      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          className={`pr-10 ${className ?? ""}`.trim()}
          {...inputProps}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsVisible((v) => !v)}
          className="absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error ? <p className="font-medium text-red-500 text-sm">{error}</p> : null}
    </div>
  );
}
