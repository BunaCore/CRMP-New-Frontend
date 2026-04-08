/** biome-ignore-all lint/nursery/useSortedClasses: false positive */
/** biome-ignore-all assist/source/organizeImports: false positive */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { TeamMember } from "@/lib/team-data";
import { Building2, Calendar, Mail, Sparkles } from "lucide-react";

interface ViewMemberDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function ViewMemberDialog({ member, open, onOpenChange }: ViewMemberDialogProps) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{member.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getRoleBadgeVariant(member.role)}>
                  {member.role}
                </Badge>
                <Badge variant="outline" className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <a href={`mailto:${member.email}`} className="text-foreground hover:text-primary transition-colors">
                {member.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-foreground">{member.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Joined Date</p>
              <p className="text-foreground">
                {new Date(member.joinedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {member.expertise.length > 0 && (
            <div className="flex items-start gap-3 text-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary shrink-0">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Expertise</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button asChild>
            <a href={`mailto:${member.email}`}>Send Email</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
