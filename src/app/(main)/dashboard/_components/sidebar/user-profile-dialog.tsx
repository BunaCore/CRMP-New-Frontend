"use client";

import { useState } from "react";

import {
  AlertCircle,
  BadgeCheck,
  BellRing,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Fingerprint,
  Globe,
  GraduationCap,
  Key,
  Languages,
  Laptop,
  LineChart,
  Link as LinkIcon,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  User,
  Users,
  X,
} from "lucide-react";

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

interface UserProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ isOpen, onOpenChange }: UserProfileDialogProps) {
  const { user } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[calc(100vw-4rem)] -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 flex h-[calc(100vh-4rem)] w-[calc(100vw-4rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border/40 bg-background p-0 shadow-2xl xl:!max-w-6xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your institutional identity, research profiles, and personal preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="custom-scrollbar flex h-full w-full flex-col overflow-y-auto">
          {/* Gradient Banner Header with Avatar & Name inside */}
          <div className="relative w-full shrink-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 pb-6 pt-12 sm:px-10 sm:pb-8 sm:pt-20">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />

            {/* Avatar Overlay & Title */}
            <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-5">
                <div className="group relative shrink-0">
                  <Avatar className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-background bg-muted shadow-xl sm:h-40 sm:w-40">
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
                    className="-bottom-2 -right-2 absolute h-10 w-10 rounded-full border shadow-lg"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
                <div className="mb-2 space-y-1 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-3xl text-white tracking-tight sm:text-4xl">{user.name}</h2>
                    <TooltipBadge title="Verified Identity">
                      <BadgeCheck className="h-6 w-6 text-blue-200" />
                    </TooltipBadge>
                  </div>
                  <p className="font-medium text-lg text-white/80">{user.roles?.[0] || "Researcher"}</p>
                </div>
              </div>
              <div className="mb-2 sm:mb-4">
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  className="gap-2 border-white/20 bg-white/10 font-semibold text-white shadow-sm hover:bg-white/20 hover:text-white"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
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
            {/* Main Tabs Area */}
            <Tabs defaultValue="profile" className="mt-8 flex flex-col pb-6">
              <TabsList className="h-auto w-full justify-start rounded-none border-b border-border/50 bg-transparent p-0">
                <TabsTrigger
                  value="profile"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Profile Details
                </TabsTrigger>
                <TabsTrigger
                  value="institutional"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Institutional Identity
                </TabsTrigger>
                <TabsTrigger
                  value="research"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Research Profile
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Preferences
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Security
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 pr-2">
                {/* 1. Profile Details */}
                <TabsContent value="profile" className="m-0 focus-visible:outline-none">
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" /> Email Address
                      </Label>
                      {isEditing ? (
                        <Input defaultValue={user.email} />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{user.email}</span>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
                            Verified
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" /> Phone Number
                      </Label>
                      {isEditing ? (
                        <Input defaultValue="+251 911 234 567" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">+251 911 234 567</span>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
                            Verified
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" /> Location
                      </Label>
                      {isEditing ? (
                        <Input defaultValue="Addis Ababa, Ethiopia" />
                      ) : (
                        <span className="font-medium text-foreground">Addis Ababa, Ethiopia</span>
                      )}
                    </div>
                    <div className="space-y-4 lg:col-span-3">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" /> Short Bio
                      </Label>
                      {isEditing ? (
                        <Input defaultValue="Senior researcher focusing on AI and ML." className="max-w-xl" />
                      ) : (
                        <span className="font-medium text-foreground">
                          Senior researcher focusing on AI and ML. Passionate about applying computational methods to
                          solve localized problems in agriculture and health.
                        </span>
                      )}
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
                            <Briefcase className="h-5 w-5 text-primary" /> {user.roles?.[0] || "Faculty"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Staff ID</Label>
                          <div className="flex items-center gap-2 font-semibold text-lg">
                            <Fingerprint className="h-5 w-5 text-slate-500" /> AASTU-2023-8942
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Department</Label>
                          <div className="flex items-center gap-2 font-semibold text-lg">
                            <Building2 className="h-5 w-5 text-blue-500" /> Software Engineering
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">School/College</Label>
                          <div className="flex items-center gap-2 font-semibold text-lg">
                            <GraduationCap className="h-5 w-5 text-indigo-500" /> College of Electrical & Mechanical
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <Label className="text-lg font-semibold text-foreground">Active Permissions</Label>
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
                          <CardTitle className="text-lg">Dual Role Access</CardTitle>
                          <CardDescription>You hold secondary administrative responsibilities.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-background p-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <ShieldCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Department Coordinator</p>
                              <p className="text-muted-foreground text-xs">Software Engineering</p>
                            </div>
                          </div>
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
                        <CardDescription className="font-semibold">Active Projects</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="font-black text-3xl text-primary">4</div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardDescription className="font-semibold">Publications</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="font-black text-3xl text-indigo-600">12</div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardDescription className="font-semibold">H-Index</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="font-black text-3xl text-emerald-600">7</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold text-foreground">Expertise & Interests</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="px-3 py-1">
                          Machine Learning
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1">
                          Natural Language Processing
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1">
                          Data Science
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1">
                          AI in Healthcare
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 rounded-full border border-dashed px-3 text-xs"
                        >
                          <Plus className="h-3 w-3" /> Add Expertise
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-lg font-semibold text-foreground">External Profiles</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#A6CE39]/20 text-[#A6CE39]">
                              <Globe className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">ORCID</p>
                              <p className="text-muted-foreground text-xs">0000-0002-1825-0097</p>
                            </div>
                          </div>
                          <BadgeCheck className="h-5 w-5 text-emerald-500" />
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
                        <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
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
                        <h3 className="text-lg font-semibold text-foreground">System Preferences</h3>
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

                {/* 5. Security */}
                <TabsContent value="security" className="m-0 focus-visible:outline-none">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Password Management</h3>
                        <p className="text-muted-foreground text-sm">Update your account password.</p>
                      </div>
                      <div className="space-y-4 rounded-xl border p-5">
                        <div className="space-y-2">
                          <Label>Current Password</Label>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>New Password</Label>
                          <Input type={showPassword ? "text" : "password"} />
                        </div>
                        <Button className="w-full">Update Password</Button>
                      </div>

                      <div>
                        <h3 className="mt-8 text-lg font-semibold text-foreground">Two-Factor Authentication (2FA)</h3>
                        <p className="mb-4 text-muted-foreground text-sm">Add an extra layer of security.</p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                              <Smartphone className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">Authenticator App</p>
                                <p className="text-muted-foreground text-xs">Not configured</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Enable
                            </Button>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-emerald-600" />
                              <div>
                                <p className="font-medium text-sm text-emerald-800 dark:text-emerald-400">
                                  Email Verification
                                </p>
                                <p className="text-emerald-600/80 text-xs">Configured</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Active Sessions</h3>
                        <p className="text-muted-foreground text-sm">Devices currently logged into your account.</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <Laptop className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">Windows • Chrome</p>
                                <Badge className="h-5 bg-emerald-500 text-[10px]">Current Session</Badge>
                              </div>
                              <p className="text-muted-foreground text-xs">Addis Ababa, ET • Active now</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                              <Smartphone className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">iPhone 13 • Safari</p>
                              <p className="text-muted-foreground text-xs">Addis Ababa, ET • Last active 2 hours ago</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for tooltip badge
function TooltipBadge({ children, title }: { children: React.ReactNode; title: string }) {
  // Can wrap in Tooltip from shadcn if imported, simplified here for ease
  return <div title={title}>{children}</div>;
}
