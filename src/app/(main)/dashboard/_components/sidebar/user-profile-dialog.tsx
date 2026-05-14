"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  Camera,
  ChevronRight,
  Edit3,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/context/SessionContext";

interface UserProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ isOpen, onOpenChange }: UserProfileDialogProps) {
  const { user } = useSession();

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[calc(100vw-4rem)] -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 flex h-[calc(100vh-4rem)] w-[calc(100vw-4rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border/40 bg-background p-0 shadow-2xl">
        <DialogHeader className="flex shrink-0 flex-col gap-5 border-border/40 border-b bg-card px-5 py-4 sm:px-8 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/10 bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm">
                <User className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <DialogTitle className="font-black text-foreground text-xl uppercase tracking-tight sm:text-2xl">
                  Account <span className="text-primary">Settings</span>
                </DialogTitle>
                <DialogDescription className="hidden font-medium text-muted-foreground text-sm sm:block">
                  Manage your institutional identity, research profiles, and personal preferences.
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-1.5 font-semibold">
                <Edit3 className="h-3.5 w-3.5" /> Edit Profile
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div className="custom-scrollbar flex-1 overflow-y-auto bg-background/50">
            <div className="mx-auto max-w-5xl space-y-10 p-6 sm:p-10">
              {/* Profile Overview Section */}
              <section className="space-y-6">
                <div className="flex flex-col items-start gap-8 md:flex-row">
                  <div className="group relative shrink-0">
                    <Avatar className="h-40 w-40 overflow-hidden rounded-[2rem] border-4 border-background shadow-2xl">
                      <AvatarImage src={user.avatarUrl || ""} className="object-cover" />
                      <AvatarFallback className="bg-muted font-black text-4xl text-primary">
                        {user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="-bottom-2 -right-2 absolute h-10 w-10 rounded-full border shadow-xl"
                    >
                      <Camera className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4 pt-2">
                    <div className="space-y-1">
                      <h2 className="font-black text-4xl text-foreground tracking-tight">{user.name}</h2>
                      <p className="flex items-center gap-2 font-medium text-lg text-muted-foreground">
                        <Mail className="h-4 w-4 text-primary/60" /> {user.email}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {user.roles?.map((role) => (
                        <Badge
                          key={role}
                          variant="secondary"
                          className="border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[10px] text-primary uppercase tracking-[0.1em]"
                        >
                          {role}
                        </Badge>
                      ))}
                      <Badge
                        variant="outline"
                        className="border-emerald-500/20 bg-emerald-500/5 px-3 py-1 font-semibold text-emerald-500"
                      >
                        <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Verified Scholar
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
                  <div className="space-y-4 rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-sm">
                    <h3 className="flex items-center gap-2 font-black text-muted-foreground text-xs uppercase tracking-[0.2em]">
                      <Building2 className="h-3.5 w-3.5 text-primary" /> Institutional Data
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-1">
                        <span className="font-medium text-muted-foreground text-sm">Department</span>
                        <span className="font-bold text-sm">{user.department || "Information Technology"}</span>
                      </div>
                      <Separator className="bg-border/30" />
                      <div className="flex items-center justify-between py-1">
                        <span className="font-medium text-muted-foreground text-sm">Institution</span>
                        <span className="font-bold text-sm">Addis Ababa University</span>
                      </div>
                      <Separator className="bg-border/30" />
                      <div className="flex items-center justify-between py-1">
                        <span className="font-medium text-muted-foreground text-sm">Campus</span>
                        <span className="font-bold text-sm">Main Campus (6-Kilo)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-sm">
                    <h3 className="flex items-center gap-2 font-black text-muted-foreground text-xs uppercase tracking-[0.2em]">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> Account Activity
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-1">
                        <span className="font-medium text-muted-foreground text-sm">Last Active</span>
                        <span className="font-bold text-emerald-500 text-sm">Online Now</span>
                      </div>
                      <Separator className="bg-border/30" />
                      <div className="flex items-center justify-between py-1">
                        <span className="font-medium text-muted-foreground text-sm">Joined At</span>
                        <span className="font-bold text-sm">February 12, 2024</span>
                      </div>
                      <Separator className="bg-border/30" />
                      <div className="flex items-center justify-between py-1">
                        <span className="font-medium text-muted-foreground text-sm">Session Type</span>
                        <span className="rounded bg-muted px-2 py-0.5 font-bold text-[10px] text-sm uppercase tracking-widest">
                          Persistent
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Research Metrics / Placeholder section */}
              <section className="border-border/40 border-t p-1 pt-10">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {[
                    { label: "Active Proposals", value: "04", icon: Globe },
                    { label: "Research Areas", value: "02", icon: MapPin },
                    { label: "Team Collaborations", value: "07", icon: Users },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="group flex flex-col gap-1 rounded-xl p-4 transition-colors hover:bg-muted/30"
                    >
                      <stat.icon className="mb-2 h-5 w-5 text-primary/40 transition-colors group-hover:text-primary" />
                      <span className="font-black text-3xl">{stat.value}</span>
                      <span className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Right Sidebar - Properties style */}
          <div className="hidden h-full w-[340px] flex-col space-y-8 overflow-y-auto border-border/40 border-l bg-muted/5 p-8 lg:flex">
            <div className="space-y-6">
              <h4 className="border-border/40 border-b pb-4 font-black text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
                System Properties
              </h4>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="flex items-center gap-2 font-bold text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Authority ID
                  </p>
                  <div className="break-all rounded-lg border border-border/20 bg-muted/50 p-3 font-mono text-[10px]">
                    {user.id}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-2 font-bold text-[11px] text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" /> Contact Verification
                  </p>
                  <div className="rounded-lg border border-border/20 bg-muted/50 p-3 font-semibold text-xs">
                    +251 912 345 678
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <Button
                    variant="secondary"
                    className="h-10 w-full justify-between font-bold text-xs uppercase tracking-wider"
                  >
                    Security Logs <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-between border-destructive/20 font-bold text-destructive text-xs uppercase tracking-wider hover:bg-destructive/5"
                  >
                    Delete Account <AlertCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                <p className="mb-1 font-bold text-[10px] text-primary uppercase tracking-widest">Help & Support</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Need to change your institutional email? Contact the
                  <span className="font-semibold text-foreground"> PG Office Support</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
