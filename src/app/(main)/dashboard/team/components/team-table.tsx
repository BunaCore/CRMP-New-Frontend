/** biome-ignore-all assist/source/organizeImports: intentional suppression */
"use client";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TeamMember } from "@/lib/team-data";

interface TeamTableProps {
  members: TeamMember[];
  onView: (member: TeamMember) => void;
  onEdit: (member: TeamMember) => void;
  onRemove: (member: TeamMember) => void;
}

function getStatusColor(status: TeamMember["status"]) {
  switch (status) {
    case "Active":
      return "bg-emerald-500/15 text-emerald-700 border-emerald-500/20";
    case "Inactive":
      return "bg-gray-500/15 text-gray-700 border-gray-500/20";
    case "Pending":
      return "bg-amber-500/15 text-amber-700 border-amber-500/20";
    default:
      return "bg-gray-500/15 text-gray-700";
  }
}

function getRoleBadgeVariant(role: TeamMember["role"]) {
  switch (role) {
    case "Principal Investigator":
      return "bg-blue-500/15 text-blue-700 border-blue-500/20";
    case "Co-Investigator":
      return "bg-indigo-500/15 text-indigo-700 border-indigo-500/20";
    case "Research Assistant":
      return "bg-teal-500/15 text-teal-700 border-teal-500/20";
    case "Graduate Student":
      return "bg-cyan-500/15 text-cyan-700 border-cyan-500/20";
    case "Postdoctoral Fellow":
      return "bg-rose-500/15 text-rose-700 border-rose-500/20";
    default:
      return "bg-gray-500/15 text-gray-700";
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TeamTable({ members, onView, onEdit, onRemove }: TeamTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-75">Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="group">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-primary/10 font-medium text-primary text-sm">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-muted-foreground text-sm">{member.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getRoleBadgeVariant(member.role)}>
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{member.department}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onView(member)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(member)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Member
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onRemove(member)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
