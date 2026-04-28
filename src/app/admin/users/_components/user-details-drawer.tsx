"use client";

import { BadgeCheck, Mail, Phone, Shield, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { useAdminUsers } from "../users-context";

export function UserDetailsDrawer() {
  const { selectedUser, selectedUserId, isUserDetailsLoading, setSelectedUserId } = useAdminUsers();

  return (
    <Sheet open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
      <SheetContent side="right" className="w-full border-slate-200 p-0 sm:max-w-[560px] dark:border-slate-800">
        {isUserDetailsLoading ? (
          <div className="flex h-full items-center justify-center text-slate-400 text-sm">Loading user details...</div>
        ) : selectedUser ? (
          <>
            <SheetHeader className="border-slate-100 border-b bg-slate-50/60 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SheetTitle className="font-bold text-lg">{selectedUser.fullName || "Unnamed user"}</SheetTitle>
                  <SheetDescription className="mt-1">User ID: {selectedUser.id}</SheetDescription>
                  {!selectedUser.fullName && (
                    <Button size="sm" variant="outline" className="mt-2 h-8 text-xs">
                      Edit Profile
                    </Button>
                  )}
                </div>
                <Badge variant="outline" className="font-semibold text-[10px] uppercase">
                  <span
                    className={`mr-2 inline-block h-2 w-2 rounded-full ${
                      selectedUser.accountStatus === "active"
                        ? "bg-emerald-500"
                        : selectedUser.accountStatus === "invited"
                          ? "bg-amber-500"
                          : "bg-slate-400"
                    }`}
                  />
                  {selectedUser.accountStatus}
                </Badge>
              </div>
            </SheetHeader>
            <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
              <section className="space-y-2">
                <h4 className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Contact</h4>
                <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-400" /> {selectedUser.email}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-slate-400" /> {selectedUser.phoneNumber ?? "No phone"}
                  </p>
                </div>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Access Roles</h4>
                <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  {selectedUser.roles.map((role) => (
                    <Badge key={role.id} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <Shield className="mr-1 h-3.5 w-3.5" />
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Profile Meta</h4>
                <div className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
                  <p className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-slate-400" /> Department: {selectedUser.departmentName ?? "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-slate-400" /> Coordinator:{" "}
                    {selectedUser.departmentCoordination.isCoordinator ? "Yes" : "No"}
                  </p>
                  <p>Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </section>
              {selectedUser.departmentCoordination.isCoordinator &&
                selectedUser.departmentCoordination.departments.length > 0 && (
                  <section className="space-y-2">
                    <h4 className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                      Coordinated Departments
                    </h4>
                    <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                      {selectedUser.departmentCoordination.departments.map((department) => (
                        <div
                          key={department.id}
                          className="flex items-center justify-between gap-3 rounded-md border border-slate-100 px-3 py-2 dark:border-slate-800"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[13px]">{department.name}</p>
                            <p className="text-slate-500 text-xs">{department.code}</p>
                          </div>
                          <p className="shrink-0 text-slate-500 text-xs">
                            Since {new Date(department.assignedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
