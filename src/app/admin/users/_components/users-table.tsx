"use client";

import { MoreVertical, Search, UserPlus, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useAdminUsers } from "../users-context";
import { UsersTableSkeleton } from "./skeletons/users-table-skeleton";

export function UsersTable() {
  const {
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    roles,
    page,
    setPage,
    totalPages,
    totalItems,
    pagedUsers,
    isUsersLoading,
    setSelectedUserId,
    setInviteOpen,
  } = useAdminUsers();

  const truncateId = (id: string) => `${id.slice(0, 8)}...`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row dark:border-slate-800 dark:bg-slate-950">
        <div className="relative w-full sm:max-w-xs">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search by name, email, or ID..."
            className="h-9 pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[170px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="deactive">Deactive</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-9 bg-blue-600 font-semibold hover:bg-blue-700" onClick={() => setInviteOpen(true)}>
            <UserPlus className="mr-1.5 h-4 w-4" />
            Invite User
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm [scrollbar-gutter:stable] dark:border-slate-800 dark:bg-slate-950">
        <Table className="table-fixed">
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="w-[14%] pl-5 font-semibold text-xs uppercase">ID</TableHead>
              <TableHead className="w-[30%] font-semibold text-xs uppercase">User</TableHead>
              <TableHead className="w-[26%] font-semibold text-xs uppercase">Department</TableHead>
              <TableHead className="w-[12%] font-semibold text-xs uppercase">Roles</TableHead>
              <TableHead className="w-[14%] font-semibold text-xs uppercase">Status</TableHead>
              <TableHead className="w-[72px] pr-5 text-right font-semibold text-xs uppercase" />
            </TableRow>
          </TableHeader>
          {isUsersLoading ? (
            <UsersTableSkeleton />
          ) : (
            <TableBody className="min-h-[300px]">
              {pagedUsers.length === 0 ? (
                <TableRow className="h-[300px]">
                  <TableCell colSpan={6} className="py-14 text-center text-slate-400 text-sm italic">
                    No users found for the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                pagedUsers.map((user) => (
                  <TableRow key={user.id} className="h-[60px] border-slate-100 dark:border-slate-800">
                    <TableCell className="truncate py-4 pl-5 font-mono text-[12px] text-slate-500">
                      {truncateId(user.id)}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback className="bg-blue-100 font-semibold text-[11px] text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {user.fullName?.trim()
                              ? user.fullName
                                  .trim()
                                  .split(" ")
                                  .slice(0, 2)
                                  .map((p) => p[0]?.toUpperCase() ?? "")
                                  .join("")
                              : user.email.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex flex-col gap-0.5">
                          <span className="truncate font-semibold text-[13px] text-slate-900 dark:text-slate-100">
                            {user.fullName || "Unnamed user"}
                          </span>
                          <span className="truncate text-[12px] text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="truncate py-4 text-[13px] text-slate-700 dark:text-slate-300">
                      {user.departmentName ?? "N/A"}
                    </TableCell>
                    <TableCell className="py-4 text-[13px] text-slate-700 dark:text-slate-300">
                      {user.roles.length} role{user.roles.length === 1 ? "" : "s"}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className="bg-transparent px-0 text-slate-700 shadow-none dark:text-slate-300">
                        <span
                          className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${
                            user.accountStatus === "active"
                              ? "bg-emerald-500"
                              : user.accountStatus === "invited"
                                ? "bg-amber-500"
                                : "bg-slate-400"
                          }`}
                        />
                        {user.accountStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 pr-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">User actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => setSelectedUserId(user.id)}>View details</DropdownMenuItem>
                          <DropdownMenuItem disabled>Edit user</DropdownMenuItem>
                          <DropdownMenuItem disabled>Reset password</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
        <div className="flex flex-col justify-between gap-2 border-slate-100 border-t px-4 py-3 sm:flex-row sm:items-center dark:border-slate-800">
          <p className="text-slate-500 text-xs">
            Showing page {page} of {totalPages} ({totalItems} users)
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage((p) => p - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <Badge variant="outline" className="h-9 px-3 font-semibold text-xs">
                  <Users className="mr-1.5 h-3.5 w-3.5" />
                  {page} / {totalPages}
                </Badge>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage((p) => p + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
