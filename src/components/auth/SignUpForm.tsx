"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/api/auth/mutations"; // 👈 create this

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["PRINCIPAL_INVESTIGATOR", "UNDERGRADUATE", "POSTGRADUATE"]),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "UNDERGRADUATE",
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    setIsLoading(true);
    try {
      await registerUser(data);

      toast.success("Account created!", {
        description: "You can now sign in.",
      });

      router.push("/login");
    } catch (_error) {
      toast.error("Sign Up Failed", {
        description: "Something went wrong. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" placeholder="John Doe" disabled={isLoading} {...register("fullName")} />
        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" disabled={isLoading} {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" disabled={isLoading} {...register("password")} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          disabled={isLoading}
          {...register("role")}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="PRINCIPAL_INVESTIGATOR">Principal Investigator</option>
          <option value="UNDERGRADUATE">Undergraduate</option>
          <option value="POSTGRADUATE">Postgraduate</option>
        </select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
      </div>

      {/* Submit */}
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
