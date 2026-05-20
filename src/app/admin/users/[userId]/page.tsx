"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  History,
  Mail,
  MoreVertical,
  Phone,
  Shield,
  ShieldCheck,
  UserRound,
  UserX,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentPreview from "@/components/ui/document-preview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserById } from "@/lib/api/users/queries";

import type { AdminUserDetails } from "../types";
import { EditUserModal } from "./_components/edit-user-modal";
import { UserRolesPanel } from "./_components/user-roles-panel";

// --- Loading Skeleton ---
function PageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 lg:p-10">
      <Skeleton className="h-8 w-32 rounded-full" />
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/50 p-6 dark:border-slate-800/50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params?.userId as string;

  const { data: userData, isLoading } = useGetUserById(userId);

  const user = userData as AdminUserDetails | undefined;

  if (isLoading) return <PageSkeleton />;

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <UserX className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="font-bold text-2xl">User Not Found</h2>
        <p className="text-slate-500">The user you are looking for does not exist or has been removed.</p>
        <Link href="/admin/users">
          <Button variant="outline" className="mt-4 rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>
        </Link>
      </div>
    );
  }

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 lg:p-10">
      {/* Back navigation */}
      <div className="mb-2">
        <Link href="/admin/users">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>
        </Link>
      </div>

      {/* --- Header Card --- */}
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200/50 bg-white p-8 shadow-sm md:flex-row md:items-center dark:border-slate-800/50 dark:bg-slate-950/50">
        <div className="flex flex-1 items-center gap-6">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-white shadow-xl dark:border-slate-900">
              <AvatarImage src={user.avatarUrl || ""} alt={user.fullName || ""} />
              <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 font-bold text-2xl text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute right-0 bottom-0 h-5 w-5 rounded-full border-4 border-white dark:border-slate-900 ${
                user.accountStatus === "active"
                  ? "bg-emerald-500"
                  : user.accountStatus === "invited"
                    ? "bg-amber-500"
                    : "bg-slate-400"
              }`}
            />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-bold text-3xl text-slate-900 tracking-tight dark:text-slate-100">
                {user.fullName || "Unnamed User"}
              </h1>
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-0.5 font-semibold text-xs uppercase tracking-wide"
              >
                {user.accountStatus}
              </Badge>
              {user.isExternal && (
                <Badge
                  variant="outline"
                  className="rounded-full border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400"
                >
                  External
                </Badge>
              )}
            </div>
            <p className="flex items-center gap-2 font-medium text-slate-500">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 md:w-auto">
          <EditUserModal user={user} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="text-amber-600 dark:text-amber-400">
                <ShieldCheck className="mr-2 h-4 w-4" /> Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                <UserX className="mr-2 h-4 w-4" /> Deactivate Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* --- Main Content Tabs --- */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="h-12 w-full justify-start rounded-none border-slate-200 border-b bg-transparent p-0 dark:border-slate-800">
          <TabsTrigger
            value="overview"
            className="rounded-none border-transparent border-b-2 px-8 py-3 font-semibold text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 data-[state=active]:shadow-none dark:data-[state=active]:text-blue-400"
          >
            <UserRound className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="rounded-none border-transparent border-b-2 px-8 py-3 font-semibold text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 data-[state=active]:shadow-none dark:data-[state=active]:text-blue-400"
          >
            <Shield className="mr-2 h-4 w-4" /> Roles & Security
          </TabsTrigger>
          {user.departmentCoordination?.isCoordinator && (
            <TabsTrigger
              value="coordination"
              className="rounded-none border-transparent border-b-2 px-8 py-3 font-semibold text-slate-500 data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent data-[state=active]:text-emerald-700 data-[state=active]:shadow-none dark:data-[state=active]:text-emerald-400"
            >
              <Building2 className="mr-2 h-4 w-4" /> Coordinated Departments
              <Badge className="ml-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {user.departmentCoordination.departments.length}
              </Badge>
            </TabsTrigger>
          )}
        </TabsList>

        <div className="py-8">
          {/* --- Overview Tab --- */}
          <TabsContent value="overview" className="mt-0 outline-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                {/* Contact Information */}
                <Card className="overflow-hidden border-slate-200/60 shadow-none dark:border-slate-800/60">
                  <CardHeader className="border-slate-100 border-b bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/20">
                    <CardTitle className="font-bold text-lg">Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Email Address</p>
                        <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                          <Mail className="h-4 w-4 text-blue-500" /> {user.email}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Phone Number</p>
                        <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                          <Phone className="h-4 w-4 text-blue-500" /> {user.phoneNumber || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Department</p>
                        <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                          <Building2 className="h-4 w-4 text-blue-500" /> {user.departmentName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">University</p>
                        <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                          <BadgeCheck className="h-4 w-4 text-blue-500" /> {user.university || "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Activity / Metadata */}
                <Card className="overflow-hidden border-slate-200/60 shadow-none dark:border-slate-800/60">
                  <CardHeader className="border-slate-100 border-b bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/20">
                    <CardTitle className="font-bold text-lg">Account Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                      <div className="space-y-1">
                        <p className="font-bold text-[11px] text-slate-400 uppercase">Joined On</p>
                        <p className="flex items-center gap-1.5 font-semibold text-sm">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-[11px] text-slate-400 uppercase">User Type</p>
                        <p className="flex items-center gap-1.5 font-semibold text-sm">
                          {user.isExternal ? (
                            <>
                              <ExternalLink className="h-3.5 w-3.5 text-blue-500" /> External
                            </>
                          ) : (
                            <>
                              <Briefcase className="h-3.5 w-3.5 text-indigo-500" /> Internal
                            </>
                          )}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-[11px] text-slate-400 uppercase">Status</p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${user.accountStatus === "active" ? "bg-emerald-500" : "bg-amber-500"}`}
                          />
                          <p className="font-semibold text-sm capitalize">{user.accountStatus}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-[11px] text-slate-400 uppercase">Roles</p>
                        <p className="font-semibold text-sm">{user.roles.length} Assigned</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Supporting Document */}
                {user.supportingDocument &&
                  (() => {
                    const supportingDocument = user.supportingDocument;
                    const previewFile = {
                      ...supportingDocument,
                      visibility: supportingDocument.visibility as "private" | "public",
                    };

                    return (
                      <Card className="overflow-hidden border-slate-200/60 shadow-none dark:border-slate-800/60">
                        <CardHeader className="border-slate-100 border-b bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/20">
                          <CardTitle className="font-bold text-lg">Supporting Document</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{user.supportingDocument?.name}</p>
                              <p className="text-muted-foreground text-sm">
                                {user.supportingDocument?.mimeType} •{" "}
                                {Math.round((user.supportingDocument?.size ?? 0) / 1024)} KB
                              </p>
                            </div>
                            <div>
                              <DocumentPreview file={previewFile} trigger={<Button>Preview</Button>} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-8">
                <Card className="border-blue-100 bg-blue-50/30 shadow-none dark:border-blue-900/20 dark:bg-blue-950/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 font-bold text-blue-800 text-sm dark:text-blue-300">
                      <ShieldCheck className="h-4 w-4" /> Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-blue-900/20"
                    >
                      <Mail className="mr-2 h-4 w-4 text-blue-500" /> Resend Invite
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-blue-900/20"
                    >
                      <History className="mr-2 h-4 w-4 text-blue-500" /> View Activity Logs
                    </Button>
                  </CardContent>
                </Card>

                {user.departmentCoordination?.isCoordinator && (
                  <Card className="border-emerald-100 bg-emerald-50/30 shadow-none dark:border-emerald-900/20 dark:bg-emerald-950/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 font-bold text-emerald-800 text-sm dark:text-emerald-300">
                        <BadgeCheck className="h-4 w-4" /> Coordinator Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-emerald-700 text-sm leading-relaxed dark:text-emerald-400">
                        This user is a coordinator for <strong>{user.departmentCoordination.departments.length}</strong>{" "}
                        departments. They have specialized permissions to manage proposals within these departments.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* --- Roles Tab --- */}
          <TabsContent value="roles" className="mt-0 outline-none">
            <UserRolesPanel user={user} />
          </TabsContent>

          {/* --- Coordination Tab --- */}
          {user.departmentCoordination?.isCoordinator && (
            <TabsContent value="coordination" className="mt-0 outline-none">
              <Card className="border-slate-200/60 shadow-none dark:border-slate-800/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Coordinated Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Department</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Assigned At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.departmentCoordination.departments.map((dept) => (
                          <TableRow key={dept.id}>
                            <TableCell className="font-medium">{dept.name}</TableCell>
                            <TableCell>{dept.code}</TableCell>
                            <TableCell>{new Date(dept.assignedAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}
