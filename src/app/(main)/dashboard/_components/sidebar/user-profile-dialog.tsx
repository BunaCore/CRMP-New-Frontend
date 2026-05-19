"use client";

import { useEffect, useState } from "react";

import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  Camera,
  Clock,
  Edit3,
  Fingerprint,
  Globe,
  GraduationCap,
  Link as LinkIcon,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/context/SessionContext";
import { useUpdateSelfProfile } from "@/lib/api/users/mutations";
import { useGetMyProfile } from "@/lib/api/users/queries";

interface UserProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ isOpen, onOpenChange }: UserProfileDialogProps) {
  const { user: sessionUser } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  // ── Form state for editable fields ──
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // ── Fetch fresh profile from API when dialog opens ──
  const { data: profile, isLoading: isProfileLoading, isError } = useGetMyProfile(isOpen && !!sessionUser);

  // ── Mutation for saving profile ──
  const { mutate: saveProfile, isPending: isSaving } = useUpdateSelfProfile();

  // The display user: prefer fresh API data, fallback to session
  const user = profile
    ? {
        ...sessionUser,
        name: profile.fullName ?? sessionUser?.name ?? "",
        email: profile.email ?? sessionUser?.email ?? "",
        phoneNumber: profile.phoneNumber ?? sessionUser?.phoneNumber,
        department: profile.department ?? sessionUser?.department,
        university: profile.university ?? sessionUser?.university,
        universityId: profile.universityId ?? sessionUser?.universityId,
        userProgram: profile.userProgram ?? sessionUser?.userProgram,
        isExternal: profile.isExternal ?? sessionUser?.isExternal,
        accountStatus: profile.accountStatus ?? sessionUser?.accountStatus,
        roles: profile.roles ?? sessionUser?.roles,
        permissions: profile.permissions ?? sessionUser?.permissions,
        createdAt: profile.createdAt ?? sessionUser?.createdAt,
        avatarUrl: sessionUser?.avatarUrl,
      }
    : sessionUser;

  // Sync form state when profile data loads or edit mode changes
  useEffect(() => {
    setFullName(user?.name ?? "");
    setPhoneNumber(user?.phoneNumber ?? "");
  }, [user?.name, user?.phoneNumber]);

  if (!sessionUser) return null;

  const handleSave = () => {
    saveProfile(
      { fullName, phoneNumber },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          setIsEditing(false);
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err?.response?.data?.message || "Failed to update profile");
        },
      },
    );
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[calc(100vw-4rem)] -translate-x-1/2 -translate-y-1/2 xl:!max-w-6xl fixed top-1/2 left-1/2 flex h-[calc(100vh-4rem)] w-[calc(100vw-4rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border/40 bg-background p-0 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your institutional identity, research profiles, and personal preferences.
          </DialogDescription>
        </DialogHeader>

        {/* Loading state */}
        {isProfileLoading && (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error state */}
        {isError && !isProfileLoading && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <p>Failed to load profile data.</p>
            <p className="text-sm">Showing cached session data instead.</p>
          </div>
        )}

        {/* Main content — show once we have user data */}
        {user && !isProfileLoading && (
          <div className="custom-scrollbar flex h-full w-full flex-col overflow-y-auto">
            {/* Gradient Banner Header */}
            <div className="relative h-32 w-full shrink-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 sm:h-40">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
            </div>

            {/* Profile Identity Section */}
            <div className="px-6 pb-6 sm:px-10">
              <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                  <div className="group -mt-16 sm:-mt-20 relative shrink-0">
                    <Avatar className="h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-muted shadow-xl sm:h-40 sm:w-40">
                      <AvatarImage src={user.avatarUrl || ""} className="object-cover" />
                      <AvatarFallback className="font-black text-4xl text-primary sm:text-5xl">
                        {user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="-bottom-1 -right-1 absolute h-9 w-9 rounded-full border shadow-lg sm:h-10 sm:w-10"
                    >
                      <Camera className="h-4 w-4 w-5 sm:h-5" />
                    </Button>
                  </div>

                  <div className="space-y-1.5 pb-1">
                    <div className="flex items-center gap-3">
                      <h2 className="font-black text-2xl text-foreground tracking-tight sm:text-4xl">{user.name}</h2>
                      <Badge
                        variant="outline"
                        className="gap-1 border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-bold text-[10px] text-emerald-600 dark:text-emerald-400"
                      >
                        <BadgeCheck className="h-3 w-3" /> Verified Profile
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                      <span className="font-medium">{user.roles?.[0] || "Researcher"}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Start Date:{" "}
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pb-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 rounded-xl border-border/60 font-semibold shadow-xs transition-all hover:bg-muted"
                    onClick={handleEditToggle}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                      </>
                    ) : isEditing ? (
                      <>
                        <Save className="h-4 w-4" /> Save Changes
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4" /> Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col px-6 sm:px-10">
              <Tabs defaultValue="profile" className="mt-6 flex flex-col pb-6">
                <TabsList className="h-auto w-full justify-center gap-8 rounded-none border-border/50 border-b bg-transparent p-0">
                  <TabsTrigger
                    value="profile"
                    className="relative rounded-none border-transparent border-b-2 bg-transparent px-1 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    Profile Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="institutional"
                    className="relative rounded-none border-transparent border-b-2 bg-transparent px-1 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    Institutional Identity
                  </TabsTrigger>
                  <TabsTrigger
                    value="research"
                    className="relative rounded-none border-transparent border-b-2 bg-transparent px-1 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    Research Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="relative rounded-none border-transparent border-b-2 bg-transparent px-1 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    Preferences
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6 pr-2">
                  {/* 1. Profile Details */}
                  <TabsContent value="profile" className="m-0 focus-visible:outline-none">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" /> Full Name
                        </Label>
                        {isEditing ? (
                          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isSaving} />
                        ) : (
                          <span className="font-medium text-foreground">{user.name}</span>
                        )}
                      </div>
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" /> Email Address
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{user.email}</span>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
                            Verified
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" /> Phone Number
                        </Label>
                        {isEditing ? (
                          <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+251 911 234 567"
                            disabled={isSaving}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{user.phoneNumber || "Not provided"}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" /> University
                        </Label>
                        <span className="font-medium text-foreground">{user.university || "Not specified"}</span>
                      </div>
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" /> Member Since
                        </Label>
                        <span className="font-medium text-foreground">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                            : "N/A"}
                        </span>
                      </div>
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                          <ShieldCheck className="h-4 w-4" /> Account Status
                        </Label>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              user.accountStatus === "active"
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30"
                                : "bg-amber-50 text-amber-600 dark:bg-amber-950/30"
                            }
                          >
                            {user.accountStatus?.toUpperCase() || "ACTIVE"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 2. Institutional Identity */}
                  <TabsContent value="institutional" className="m-0 focus-visible:outline-none">
                    <div className="grid gap-8 lg:grid-cols-3">
                      <div className="space-y-8 lg:col-span-2">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Primary Role</Label>
                            <div className="flex items-center gap-2 font-semibold text-lg">
                              <Briefcase className="h-5 w-5 text-primary" /> {user.roles?.[0] || "N/A"}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Identification ID</Label>
                            <div className="flex items-center gap-2 font-semibold text-lg">
                              <Fingerprint className="h-5 w-5 text-slate-500" /> {user.universityId || "N/A"}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Department</Label>
                            <div className="flex items-center gap-2 font-semibold text-lg">
                              <Building2 className="h-5 w-5 text-blue-500" /> {user.department || "N/A"}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">University / Institution</Label>
                            <div className="flex items-center gap-2 font-semibold text-lg">
                              <GraduationCap className="h-5 w-5 text-indigo-500" /> {user.university || "N/A"}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Academic Program</Label>
                            <div className="flex items-center gap-2 font-semibold text-lg">
                              <BookOpen className="h-5 w-5 text-emerald-500" />{" "}
                              {user.userProgram === "PG"
                                ? "Postgraduate (PG)"
                                : user.userProgram === "UG"
                                  ? "Undergraduate (UG)"
                                  : "N/A"}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Affiliation Type</Label>
                            <div className="flex items-center gap-2 font-semibold text-lg">
                              <ShieldCheck className="h-5 w-5 text-amber-500" />{" "}
                              {user.isExternal ? "External Researcher" : "Internal Member"}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <Label className="font-semibold text-foreground text-lg">Active Permissions</Label>
                          <div className="flex flex-wrap gap-2">
                            {user.permissions?.map((perm) => (
                              <Badge
                                key={perm}
                                variant="secondary"
                                className="bg-primary/10 px-3 py-1 font-medium text-primary"
                              >
                                {perm.replace(/_/g, " ")}
                              </Badge>
                            ))}
                            {!user.permissions?.length && (
                              <span className="text-muted-foreground text-sm">No specific permissions assigned.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 shadow-none">
                          <CardHeader>
                            <CardTitle className="text-lg">Role Access</CardTitle>
                            <CardDescription>Your assigned system roles.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {user.roles?.map((role) => (
                              <div
                                key={role}
                                className="flex items-center gap-3 rounded-lg border border-primary/20 bg-background p-3"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                  <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">{role}</p>
                                </div>
                              </div>
                            ))}
                            {!user.roles?.length && <p className="text-muted-foreground text-sm">No roles assigned.</p>}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 3. Research Profile */}
                  <TabsContent value="research" className="m-0 space-y-8 focus-visible:outline-none">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardDescription className="font-semibold">Primary Role</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="font-black text-3xl text-primary">{user.roles?.[0] || "—"}</div>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardDescription className="font-semibold">Department</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="font-black text-indigo-600 text-xl">{user.department || "—"}</div>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardDescription className="font-semibold">Program</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="font-black text-emerald-600 text-xl">{user.userProgram || "—"}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                      <div className="space-y-4">
                        <Label className="font-semibold text-foreground text-lg">All Roles</Label>
                        <div className="flex flex-wrap gap-2">
                          {user.roles?.map((role) => (
                            <Badge key={role} variant="outline" className="px-3 py-1">
                              {role}
                            </Badge>
                          ))}
                          {!user.roles?.length && (
                            <span className="text-muted-foreground text-sm">No roles assigned.</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="font-semibold text-foreground text-lg">External Profiles</Label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#A6CE39]/20 text-[#A6CE39]">
                                <Globe className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">ORCID</p>
                                <p className="text-muted-foreground text-xs">Not connected</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              Connect
                            </Button>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-600 dark:bg-blue-900/50">
                                <BookOpen className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">Google Scholar</p>
                                <LinkIcon className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              Connect
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 4. Preferences */}
                  <TabsContent value="preferences" className="m-0 focus-visible:outline-none">
                    <div className="grid gap-8 md:grid-cols-2">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">Notifications</h3>
                          <p className="text-muted-foreground text-sm">Manage how you receive alerts.</p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Proposal Updates</Label>
                              <p className="text-muted-foreground text-xs">Status changes on your submissions.</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Approvals & Reviews</Label>
                              <p className="text-muted-foreground text-xs">When you are assigned as a reviewer.</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Collaboration Invites</Label>
                              <p className="text-muted-foreground text-xs">When invited to join a research team.</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">System Preferences</h3>
                          <p className="text-muted-foreground text-sm">Customize your dashboard experience.</p>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Language</Label>
                            <Select defaultValue="en">
                              <SelectTrigger>
                                <SelectValue placeholder="Select Language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English (US)</SelectItem>
                                <SelectItem value="am">Amharic</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Default Dashboard Perspective</Label>
                            <Select defaultValue="researcher">
                              <SelectTrigger>
                                <SelectValue placeholder="Select Default View" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="researcher">Workspace (Researcher)</SelectItem>
                                <SelectItem value="admin">Admin Console</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-muted-foreground text-xs">Applies only if you hold dual roles.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
