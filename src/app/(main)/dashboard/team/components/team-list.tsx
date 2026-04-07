/** biome-ignore-all assist/source/organizeImports: <explanation> */
/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type TeamMember, roleOptions, statusOptions } from "@/lib/team-data";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamListProps {
  members: TeamMember[];
  selectedMemberId: string | null;
  onSelectMember: (member: TeamMember) => void;
  onAddMember: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "Principal Investigator":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    case "Co-Investigator":
      return "bg-violet-500/10 text-violet-600 border-violet-200";
    case "Research Assistant":
      return "bg-amber-500/10 text-amber-600 border-amber-200";
    case "Graduate Student":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
    case "Postdoctoral Fellow":
      return "bg-rose-500/10 text-rose-600 border-rose-200";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function TeamList({
  members,
  selectedMemberId,
  onSelectMember,
  onAddMember,
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
}: TeamListProps) {
  return (
    <div className="flex h-full flex-col border-r bg-card">
      {/* Header */}
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-foreground text-lg">Team Members</h2>
          <Button onClick={onAddMember} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute h-4 left-3 text-muted-foreground top-1/2 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="h-8 flex-1 text-xs">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roleOptions.map((role) => (
                <SelectItem key={role} value={role} className="text-xs">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-8 w-[100px] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status} className="text-xs">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground text-sm">No members found</p>
              <p className="mt-1 text-muted-foreground text-xs">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-1">
              {members.map((member) => (
                <button
                  type="button"
                  key={member.id}
                  onClick={() => onSelectMember(member)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                    "hover:bg-accent/50",
                    selectedMemberId === member.id && "bg-accent",
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 font-medium text-primary text-sm">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-card",
                        member.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground/50",
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-foreground truncate">{member.name}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("mt-1 text-[10px] px-1.5 py-0 font-normal", getRoleBadgeVariant(member.role))}
                    >
                      {member.role}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        <p className="text-xs text-muted-foreground text-center">
          {members.length} member{members.length !== 1 ? "s" : ""} shown
        </p>
      </div>
    </div>
  );
}
