"use client";

import { useRef, useState } from "react";

import Image from "next/image";

import { Banknote, Building2, Calendar, FileText, Image as ImageIcon, RefreshCw, Upload, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  useUpdateProjectVisibility,
  useUploadProjectBanner,
  useUploadProjectPublicFile,
} from "@/lib/api/projects/queries";
import type { ProjectDetails, ProjectMember } from "@/lib/api/projects/types";

export type { ProjectDetails };

interface ProjectDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectDetails | null;
}

export function ProjectDetailsDrawer({ open, onOpenChange, project }: ProjectDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState("main");
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const publicFileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleVisibilityMut = useUpdateProjectVisibility();
  const uploadBannerMut = useUploadProjectBanner();
  const uploadPublicFileMut = useUploadProjectPublicFile();

  if (!project) return null;

  const getRoleBadgeVariant = (role: ProjectMember["role"]) => {
    switch (role) {
      case "PI":
        return "default";
      case "ADVISOR":
        return "secondary";
      default:
        return "outline";
    }
  };

  const rolesGrouped = project.members
    ? {
        PI: project.members.filter((member) => member.role === "PI"),
        ADVISOR: project.members.filter((member) => member.role === "ADVISOR"),
        MEMBER: project.members.filter((member) => member.role === "MEMBER"),
      }
    : null;

  const openBannerPicker = () => bannerInputRef.current?.click();
  const openPublicFilePicker = () => publicFileInputRef.current?.click();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex w-full flex-col overflow-hidden border-l border-slate-200/80 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:max-w-200 xl:max-w-250"
        side="right"
      >
        <SheetHeader className="shrink-0 space-y-0 border-b border-slate-100 bg-linear-to-b from-slate-50/90 to-white px-6 pb-4 pt-6 dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-950">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-0 bg-slate-200/80 font-bold text-[10px] uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {project.isPublic ? "Public" : "Private"}
              </Badge>
              <Badge
                variant="outline"
                className="border-slate-200 bg-white font-bold text-[10px] uppercase tracking-wider dark:border-slate-700 dark:bg-slate-950"
              >
                {project.projectProgram}
              </Badge>
              <Badge className="border-0 bg-blue-100 font-bold text-[10px] uppercase text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {project.projectStage}
              </Badge>
            </div>
            <SheetTitle className="pr-2 text-[16px] font-bold leading-snug tracking-tight text-slate-900 dark:text-slate-100">
              {project.projectTitle}
            </SheetTitle>
            <div className="text-xs font-medium leading-relaxed text-slate-500">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Submitted {new Date(project.submissionDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {project.department || "No department"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  {project.ethicalClearanceStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-900/60">
            <button
              type="button"
              onClick={() => setActiveTab("main")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "main"
                  ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Main
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("team")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "team"
                  ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Team
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("budget")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "budget"
                  ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Budget
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("publication")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "publication"
                  ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Publication
            </button>
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {activeTab === "main" && (
            <>
              <div>
                <h4 className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <FileText className="h-3.5 w-3.5" /> Description
                </h4>
                <p className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-[13px] leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400">
                  {project.projectDescription || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Research Area</p>
                  <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                    {project.researchArea || "N/A"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</p>
                  <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                    {project.durationMonths} months
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Funded</p>
                  <Badge variant={project.isFunded ? "default" : "secondary"}>{project.isFunded ? "Yes" : "No"}</Badge>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ethical Clearance
                  </p>
                  <Badge variant="outline">{project.ethicalClearanceStatus}</Badge>
                </div>
              </div>
            </>
          )}

          {activeTab === "team" && (
            <>
              {project.members && project.members.length > 0 ? (
                <div className="space-y-5">
                  {rolesGrouped &&
                    Object.entries(rolesGrouped).map(
                      ([roleKey, members]) =>
                        members.length > 0 && (
                          <div key={roleKey}>
                            <h4 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              <Users className="h-3.5 w-3.5" />
                              {roleKey === "PI"
                                ? "Principal Investigator"
                                : roleKey === "ADVISOR"
                                  ? "Advisors"
                                  : "Members"}
                            </h4>
                            <div className="space-y-3">
                              {members.map((member) => (
                                <div
                                  key={member.userId}
                                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                                >
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-blue-100/80 font-bold text-[11px] text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                      {member.fullName
                                        .split(" ")
                                        .slice(0, 2)
                                        .map((part) => part[0])
                                        .join("")
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                                      {member.fullName}
                                    </p>
                                    <p className="truncate text-[12px] text-slate-500 dark:text-slate-400">
                                      {member.email}
                                    </p>
                                  </div>
                                  <Badge variant={getRoleBadgeVariant(member.role)} className="font-bold text-[10px]">
                                    {member.role}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                    )}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Users className="mx-auto mb-2 h-10 w-10 text-slate-300 dark:text-slate-700" />
                  <p className="text-[13px] text-slate-500 dark:text-slate-400">No team members assigned yet.</p>
                </div>
              )}
            </>
          )}

          {activeTab === "budget" && (
            <>
              {project.budget ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</p>
                      <Badge variant="outline" className="text-[11px]">
                        {project.budget.currentStatus}
                      </Badge>
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Total Amount
                      </p>
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                        ETB{" "}
                        {parseFloat(project.budget.totalAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {project.budget.approvedAmount && (
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Approved Amount
                      </p>
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                        ETB{" "}
                        {parseFloat(project.budget.approvedAmount).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <Banknote className="h-3.5 w-3.5" /> Budget Items
                    </h4>
                    <div className="space-y-3">
                      {project.budget.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                                {item.description}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Line {item.lineIndex}</p>
                            </div>
                            <p className="whitespace-nowrap text-[13px] font-bold text-slate-800 dark:text-slate-200">
                              ETB{" "}
                              {parseFloat(item.requestedAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Created on {new Date(project.budget.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Banknote className="mx-auto mb-2 h-10 w-10 text-slate-300 dark:text-slate-700" />
                  <p className="text-[13px] text-slate-500 dark:text-slate-400">No budget information available.</p>
                </div>
              )}
            </>
          )}

          {activeTab === "publication" && (
            <div className="space-y-5">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Visibility</p>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400">
                      Make this project public so others can view and download public files.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {project.isPublic ? "Public" : "Private"}
                    </span>
                    <Switch
                      size="default"
                      checked={project.isPublic}
                      onCheckedChange={(checked) => {
                        toggleVisibilityMut.mutate({
                          projectId: project.projectId,
                          isPublic: checked,
                        });
                      }}
                      aria-label="Toggle project visibility"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <ImageIcon className="h-3.5 w-3.5" /> Banner
                  </p>
                  {project.bannerUrl ? (
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-800">
                        <img
                          src={project.bannerUrl}
                          alt="Project banner"
                          width={1200}
                          height={500}
                          className="h-40 w-full object-cover"
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={openBannerPicker} className="w-full justify-center">
                        <RefreshCw className="mr-2 h-4 w-4" /> Swap Banner
                      </Button>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <ImageIcon className="mx-auto mb-2 h-10 w-10 text-slate-300 dark:text-slate-700" />
                      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">No banner uploaded.</p>
                      <Button onClick={openBannerPicker} className="mx-auto">
                        <Upload className="mr-2 h-4 w-4" /> Upload Banner
                      </Button>
                    </div>
                  )}
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      uploadBannerMut.mutate({
                        projectId: project.projectId,
                        file,
                      });
                      e.currentTarget.value = "";
                    }}
                  />
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <FileText className="h-3.5 w-3.5" /> Public File
                  </p>
                  {project.publicFileUrl ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (project.publicFileUrl) {
                              window.open(project.publicFileUrl, "_blank");
                            }
                          }}
                        >
                          Download
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="h-[80vh] min-w-[80%] max-w-4xl p-0">
                            <DialogTitle className="px-6 py-4">Public File Preview</DialogTitle>
                            <div className="h-[calc(80vh-64px)]">
                              <iframe
                                src={project.publicFileUrl}
                                className="h-full w-full"
                                title="Public file preview"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={openPublicFilePicker}>
                          <RefreshCw className="mr-2 h-4 w-4" /> Swap File
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Uploaded: {project.publishedAt ? new Date(project.publishedAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <FileText className="mx-auto mb-2 h-10 w-10 text-slate-300 dark:text-slate-700" />
                      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">No public file uploaded.</p>
                      <Button onClick={openPublicFilePicker} className="mx-auto">
                        <Upload className="mr-2 h-4 w-4" /> Upload PDF
                      </Button>
                    </div>
                  )}
                  <input
                    ref={publicFileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.type !== "application/pdf") {
                        alert("Please select a PDF file for the public file.");
                        e.currentTarget.value = "";
                        return;
                      }
                      uploadPublicFileMut.mutate({
                        projectId: project.projectId,
                        file,
                      });
                      e.currentTarget.value = "";
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
