"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateUserProfile } from "@/lib/api/users/mutations";

import type { AdminUserDetails } from "../../types";

const editUserSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional().nullable(),
  universityId: z.string().optional().nullable(),
  userProgram: z.enum(["UG", "PG"]).optional().nullable(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  user: AdminUserDetails;
  trigger?: React.ReactNode;
}

export function EditUserModal({ user, trigger }: EditUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateUserProfile();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: user.fullName || "",
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      universityId: user.universityId || "",
      userProgram: user.userProgram || null,
    },
  });

  const onSubmit = (data: EditUserFormData) => {
    updateProfile(
      {
        userId: user.id,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("User profile updated successfully");
          setIsOpen(false);
        },
        // biome-ignore lint/suspicious/noExplicitAny: error object
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to update user profile");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex-1 rounded-full font-semibold md:flex-auto">
            Edit Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>Update user information. Changes will be saved immediately.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="John Doe" {...register("fullName")} disabled={isPending} />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="john@example.com" {...register("email")} disabled={isPending} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <Input id="phoneNumber" placeholder="+1 (555) 123-4567" {...register("phoneNumber")} disabled={isPending} />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>

          {/* University ID */}
          <div className="space-y-2">
            <Label htmlFor="universityId">University ID (Optional)</Label>
            <Input
              id="universityId"
              placeholder="University identifier"
              {...register("universityId")}
              disabled={isPending}
            />
            {errors.universityId && <p className="text-red-500 text-sm">{errors.universityId.message}</p>}
          </div>

          {/* User Program */}
          <div className="space-y-2">
            <Label htmlFor="userProgram">User Program (Optional)</Label>
            <Controller
              control={control}
              name="userProgram"
              render={({ field }) => (
                <Select
                  value={field.value || "NONE"}
                  onValueChange={(value) => field.onChange(value === "NONE" ? null : value)}
                  disabled={isPending}
                >
                  <SelectTrigger id="userProgram">
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Clear</SelectItem>
                    <SelectItem value="UG">Undergraduate</SelectItem>
                    <SelectItem value="PG">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.userProgram && <p className="text-red-500 text-sm">{errors.userProgram.message}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
