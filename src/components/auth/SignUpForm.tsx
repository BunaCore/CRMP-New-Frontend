"use client";

import * as React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Hash, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { registerUser } from "@/lib/api/auth/mutations";
import { useSearchDepartments } from "@/lib/api/departments/queries";
import { performGuestFullUpload } from "@/lib/api/files/mutations";

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  departmentId: z.string().uuid("Department must be a valid UUID"),
  phoneNumber: z.string().optional(),
  universityId: z.string().optional(),
  userProgram: z.enum(["UG", "PG"]),
  isExternal: z.boolean().default(false),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [supportingDocumentFile, setSupportingDocumentFile] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      departmentId: "",
      phoneNumber: "",
      universityId: "",
      userProgram: "UG",
      isExternal: false,
    },
  });

  const isExternal = watch("isExternal");

  // Department search
  const [deptSearch, setDeptSearch] = React.useState("");
  const debouncedDeptSearch = useDebounce(deptSearch, 300);
  const isDeptSearchActive = debouncedDeptSearch.trim().length > 0;
  const { data: departments = [], isLoading: loadingDepts } = useSearchDepartments(
    debouncedDeptSearch,
    isDeptSearchActive,
  );

  const onSubmit = async (data: SignUpValues) => {
    setIsLoading(true);
    try {
      let supportingDocumentFileId: string | undefined;

      if (data.isExternal) {
        if (!supportingDocumentFile) {
          toast.error("Supporting document required", {
            description: "Please upload a supporting document for external registration.",
          });
          return;
        }

        supportingDocumentFileId = await performGuestFullUpload(supportingDocumentFile, "SUPPORTING_DOCUMENT");
      }

      await registerUser({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        departmentId: data.departmentId,
        phoneNumber: data.phoneNumber,
        universityId: data.universityId,
        userProgram: data.userProgram,
        isExternal: data.isExternal,
        supportingDocumentFileId,
      });

      toast.success("Account created!", {
        description: "You can now sign in.",
      });

      router.push("/login");
    } catch (_error: unknown) {
      const err = _error as { response?: { data?: { message?: string } } };
      toast.error("Sign Up Failed", {
        description: err?.response?.data?.message || "Something went wrong. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* Shared input wrapper class - matches the login form styling */
  const inputWrapperCls =
    "relative flex items-center rounded-none border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:focus-within:ring-primary/20 transition-all duration-200 shadow-none";

  const inputCls =
    "w-full pl-10 pr-4 py-2.5 bg-transparent border-0 outline-none text-foreground text-sm placeholder:text-muted-foreground/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  const labelCls = "text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 block";

  const errorCls =
    "flex items-center gap-1 text-[11px] text-destructive font-medium animate-in fade-in slide-in-from-top-1 duration-200";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      {/* Row 1: Full Name + Email side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="fullName" className={labelCls}>
            Full Name
          </label>
          <div className={inputWrapperCls}>
            <span className="absolute left-3.5 flex items-center justify-center text-muted-foreground/50">
              <User className="h-3.5 w-3.5" />
            </span>
            <input
              id="fullName"
              placeholder="John Doe"
              disabled={isLoading}
              className={inputCls}
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <div className={errorCls}>
              <AlertCircle className="h-3 w-3" />
              <span>{errors.fullName.message}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className={labelCls}>
            Email Address
          </label>
          <div className={inputWrapperCls}>
            <span className="absolute left-3.5 flex items-center justify-center text-muted-foreground/50">
              <Mail className="h-3.5 w-3.5" />
            </span>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={isLoading}
              className={inputCls}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <div className={errorCls}>
              <AlertCircle className="h-3 w-3" />
              <span>{errors.email.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className={labelCls}>
          Password
        </label>
        <div className={inputWrapperCls}>
          <span className="absolute left-3.5 flex items-center justify-center text-muted-foreground/50">
            <Lock className="h-3.5 w-3.5" />
          </span>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            disabled={isLoading}
            className="w-full border-0 bg-transparent py-2.5 pr-12 pl-10 text-foreground text-sm outline-none transition-colors placeholder:text-muted-foreground/40 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("password")}
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-slate-100 hover:text-foreground disabled:opacity-50 dark:hover:bg-slate-800"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
        {errors.password && (
          <div className={errorCls}>
            <AlertCircle className="h-3 w-3" />
            <span>{errors.password.message}</span>
          </div>
        )}
      </div>

      {/* Thin separator */}
      <div className="border-slate-200/60 border-t dark:border-white/10" />

      {/* Row 3: Department */}
      <div className="space-y-1.5">
        <label htmlFor="departmentId" className={labelCls}>
          Department
        </label>
        <Controller
          control={control}
          name="departmentId"
          render={({ field }) => (
            <Combobox
              value={field.value || ""}
              onValueChange={(val) => {
                field.onChange(val);
                // Update the search input to display the selected department label
                const selected = departments.find((d) => d.value === val);
                setDeptSearch(selected?.label ?? "");
              }}
            >
              <ComboboxInput
                placeholder="Search department..."
                value={deptSearch}
                onChange={(e) => setDeptSearch(e.target.value)}
                showClear={!!field.value}
                className="h-10 rounded-none border-slate-300 bg-white text-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:border-white/20 dark:bg-slate-900/50 dark:focus-within:ring-primary/20"
              />
              <ComboboxContent>
                <ComboboxList>
                  {loadingDepts && isDeptSearchActive && (
                    <div className="flex items-center justify-center p-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  {departments.map((dept) => (
                    <ComboboxItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </ComboboxItem>
                  ))}
                  <ComboboxEmpty>
                    {isDeptSearchActive ? "No departments found." : "Type to search departments..."}
                  </ComboboxEmpty>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        />
        {errors.departmentId && (
          <div className={errorCls}>
            <AlertCircle className="h-3 w-3" />
            <span>{errors.departmentId.message}</span>
          </div>
        )}
      </div>

      {/* Row 4: Program + University ID + Phone side by side */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="userProgram" className={labelCls}>
            Program
          </label>
          <Controller
            control={control}
            name="userProgram"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-10 rounded-none border-slate-300 bg-white shadow-none dark:border-white/20 dark:bg-slate-900/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UG">Undergraduate</SelectItem>
                  <SelectItem value="PG">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.userProgram && (
            <div className={errorCls}>
              <AlertCircle className="h-3 w-3" />
              <span>{errors.userProgram.message}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="universityId" className={labelCls}>
            University ID <span className="text-[10px] text-muted-foreground/50 normal-case">(Opt.)</span>
          </label>
          <div className={inputWrapperCls}>
            <span className="absolute left-3.5 flex items-center justify-center text-muted-foreground/50">
              <Hash className="h-3.5 w-3.5" />
            </span>
            <input
              id="universityId"
              placeholder="ID-1234"
              disabled={isLoading}
              className={inputCls}
              {...register("universityId")}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phoneNumber" className={labelCls}>
            Phone <span className="text-[10px] text-muted-foreground/50 normal-case">(Opt.)</span>
          </label>
          <div className={inputWrapperCls}>
            <span className="absolute left-3.5 flex items-center justify-center text-muted-foreground/50">
              <Phone className="h-3.5 w-3.5" />
            </span>
            <input
              id="phoneNumber"
              placeholder="+251 9xx"
              disabled={isLoading}
              className={inputCls}
              {...register("phoneNumber")}
            />
          </div>
        </div>
      </div>

      {/* External User Checkbox */}
      <div className="flex items-center gap-3 rounded-none border border-slate-300/60 bg-white/50 px-4 py-2.5 dark:border-white/10 dark:bg-slate-900/30">
        <Controller
          control={control}
          name="isExternal"
          render={({ field }) => (
            <Checkbox
              id="isExternal"
              checked={field.value}
              onCheckedChange={(checked) => {
                const nextValue = checked === true;
                field.onChange(nextValue);
                if (!nextValue) {
                  setSupportingDocumentFile(null);
                }
              }}
              disabled={isLoading}
              className="rounded-[4px] border-slate-300 dark:border-slate-700"
            />
          )}
        />
        <div>
          <Label htmlFor="isExternal" className="cursor-pointer font-semibold text-foreground/80 text-xs">
            Register as external user
          </Label>
          <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
            External users must upload a supporting document.
          </p>
        </div>
      </div>

      {/* Conditional: Supporting Document Upload */}
      {isExternal && (
        <div className="space-y-1.5">
          <label htmlFor="supportingDocument" className={labelCls}>
            Supporting Document
          </label>
          <Input
            id="supportingDocument"
            type="file"
            accept="application/pdf,image/*"
            disabled={isLoading}
            className="rounded-none border-slate-300 bg-white text-sm shadow-none dark:border-white/20 dark:bg-slate-900/50"
            onChange={(event) => {
              setSupportingDocumentFile(event.target.files?.[0] ?? null);
            }}
          />
          <p className="text-[10px] text-muted-foreground">
            Upload a PDF or image file that verifies your external status.
          </p>
          {supportingDocumentFile && <p className="text-foreground text-xs">Selected: {supportingDocumentFile.name}</p>}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-none border border-primary/20 bg-primary py-5 font-semibold text-primary-foreground text-sm shadow-md shadow-primary/10 transition-all hover:scale-[1.01] hover:opacity-95 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] dark:border-primary/30"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
