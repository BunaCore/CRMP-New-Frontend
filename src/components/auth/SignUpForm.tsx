"use client";

import * as React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { PasswordField } from "@/components/auth/PasswordField";
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
import { Separator } from "@/components/ui/separator";
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-foreground">Account credentials</h3>
          <p className="text-muted-foreground text-sm">Create your login details first.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="block font-medium text-muted-foreground text-sm">
              Full name
            </Label>
            <Input id="fullName" placeholder="John Doe" disabled={isLoading} {...register("fullName")} />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="block font-medium text-muted-foreground text-sm">
              Email address
            </Label>
            <Input id="email" type="email" placeholder="you@example.com" disabled={isLoading} {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <PasswordField
            id="password"
            disabled={isLoading}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-foreground">Academic information</h3>
          <p className="text-muted-foreground text-sm">Help us place you in the right department and program.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="departmentId" className="block font-medium text-muted-foreground text-sm">
              Department
            </Label>
            <Controller
              control={control}
              name="departmentId"
              render={({ field }) => (
                <Combobox
                  value={field.value || ""}
                  onValueChange={(val) => {
                    field.onChange(val);
                  }}
                >
                  <ComboboxInput
                    placeholder="Search department..."
                    value={deptSearch}
                    onChange={(e) => setDeptSearch(e.target.value)}
                    showClear={!!field.value}
                    className="h-10 rounded-md bg-white text-sm dark:bg-slate-950"
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
            {errors.departmentId && <p className="text-red-500 text-sm">{errors.departmentId.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="userProgram" className="block font-medium text-muted-foreground text-sm">
                Program
              </Label>
              <Controller
                control={control}
                name="userProgram"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UG">Undergraduate (UG)</SelectItem>
                      <SelectItem value="PG">Postgraduate (PG)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.userProgram && <p className="text-red-500 text-sm">{errors.userProgram.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="universityId" className="block font-medium text-muted-foreground text-sm">
                University ID <span className="text-muted-foreground/80">(Optional)</span>
              </Label>
              <Input id="universityId" placeholder="ID-1234" disabled={isLoading} {...register("universityId")} />
              {errors.universityId && <p className="text-red-500 text-sm">{errors.universityId.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="block font-medium text-muted-foreground text-sm">
              Phone number <span className="text-muted-foreground/80">(Optional)</span>
            </Label>
            <Input id="phoneNumber" placeholder="+251 9xx xxx xxx" disabled={isLoading} {...register("phoneNumber")} />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
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
              className="mt-1"
            />
          )}
        />
        <div className="space-y-1">
          <Label htmlFor="isExternal" className="font-medium text-sm">
            Register as external user
          </Label>
          <p className="text-muted-foreground text-sm">
            External users must upload a supporting document before submitting the form.
          </p>
        </div>
      </div>

      {isExternal && (
        <div className="space-y-2">
          <Label htmlFor="supportingDocument" className="block font-medium text-muted-foreground text-sm">
            Supporting document
          </Label>
          <Input
            id="supportingDocument"
            type="file"
            accept="application/pdf,image/*"
            disabled={isLoading}
            onChange={(event) => {
              setSupportingDocumentFile(event.target.files?.[0] ?? null);
            }}
          />
          <p className="text-muted-foreground text-xs">
            Upload a PDF or image file that verifies your external status.
          </p>
          {supportingDocumentFile && <p className="text-foreground text-sm">Selected: {supportingDocumentFile.name}</p>}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Sign up"
        )}
      </Button>
    </form>
  );
}
