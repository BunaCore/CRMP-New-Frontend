/** biome-ignore-all assist/source/organizeImports: legacy code */
"use client";

import { Eye, Mail, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TeamMember } from "@/lib/team-data";

interface TeamMemberCardProps {
  member: TeamMember;
  onView: (member: TeamMember) => void;
  onEdit: (member: TeamMember) => void;
  onRemove: (member: TeamMember) => void;
}

function getStatusColor(status: TeamMember["status"]) {
  switch (status) {
    case "Active":
      return "bg-emerald-500/15 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/25";
    case "Inactive":
      return "bg-gray-500/15 text-gray-700 border-gray-500/20 hover:bg-gray-500/25";
    case "Pending":
      return "bg-amber-500/15 text-amber-700 border-amber-500/20 hover:bg-amber-500/25";
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

export function TeamMemberCard({ member, onView, onEdit, onRemove }: TeamMemberCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:border-primary/20 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="bg-primary/10 font-semibold text-lg text-primary">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-foreground leading-none">{member.name}</h3>
              <p className="text-muted-foreground text-sm">{member.department}</p>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline" className={getRoleBadgeVariant(member.role)}>
                  {member.role}
                </Badge>
                <Badge variant="outline" className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
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
              <DropdownMenuItem onClick={() => onRemove(member)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 border-border/50 border-t pt-4">
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4" />
            {member.email}
          </a>
          {member.expertise.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {member.expertise.slice(0, 3).map((skill) => (
                <span key={skill} className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground text-xs">
                  {skill}
                </span>
              ))}
              {member.expertise.length > 3 && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-muted-foreground text-xs">
                  +{member.expertise.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
