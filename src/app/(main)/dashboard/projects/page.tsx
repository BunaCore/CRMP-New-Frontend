"use client";

<<<<<<< HEAD
import * as React from "react";

import Link from "next/link";

import { FileCode, FileText, FileType2, Folder, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWorkspaceStore } from "@/store/workspace-store";
import type { FileType } from "@/types/workspace";

// Helper to grab appropriate icon based on file type
const getFileIcon = (type: FileType) => {
  switch (type) {
    case "pdf":
      return <FileText className="mr-3 h-4 w-4 text-rose-500" />;
    case "md":
      return <FileType2 className="mr-3 h-4 w-4 text-sky-500" />;
    case "ts":
    case "js":
      return <FileCode className="mr-3 h-4 w-4 text-yellow-500" />;
    default:
      return <FileText className="mr-3 h-4 w-4 text-slate-500" />;
  }
};

export default function ProjectsPage() {
  const uploadRef = React.useRef<HTMLInputElement>(null);
  const chatFileRef = React.useRef<HTMLInputElement>(null);
  const chatFolderRef = React.useRef<HTMLInputElement>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // Pull files directly from our zustand store
  const files = useWorkspaceStore((state) => state.files);

  const handleUpload = () => uploadRef.current?.click();
  const handleChatFile = () => chatFileRef.current?.click();
  const handleChatFolder = () => chatFolderRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, actionName: string) => {
    if (e.target.files && e.target.files.length > 0) {
      alert(`${actionName}: Selected ${e.target.files.length} item(s).`);
      e.target.value = "";
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-white text-slate-800">
      <div className="mx-auto w-full max-w-6xl p-8">
        {/* Hidden File Inputs */}
        <input
          type="file"
          className="hidden"
          ref={uploadRef}
          multiple
          onChange={(e) => handleFileChange(e, "Upload")}
        />
        <input
          type="file"
          className="hidden"
          ref={chatFileRef}
          accept=".pdf,.txt,.doc,.docx"
          onChange={(e) => handleFileChange(e, "Chat with file")}
        />
        <input
          type="file"
          className="hidden"
          ref={chatFolderRef}
          onChange={(e) => handleFileChange(e, "Chat with folder")}
          {...{ webkitdirectory: "true", directory: "true" }}
        />

        {/* Quick actions section */}
        <div className="mt-4 mb-10">
          <h2 className="mb-4 px-2 font-semibold text-slate-500 text-sm uppercase tracking-wide">Quick actions</h2>
          <div className="grid grid-cols-2 gap-4 px-2 lg:grid-cols-4">
            <Button
              variant="outline"
              onClick={handleUpload}
              className="group flex h-28 w-full flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-5 text-left font-normal shadow-sm outline-none transition-colors hover:bg-slate-50 focus:ring-[1px] focus:ring-blue-500"
            >
              <Upload className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-500" />
              <span className="font-semibold text-[14px] text-slate-800">Upload Data</span>
            </Button>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="group flex h-28 w-full flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-5 text-left font-normal shadow-sm outline-none transition-colors hover:bg-slate-50 focus:ring-[1px] focus:ring-blue-500"
                >
                  <Plus className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-500" />
                  <span className="font-semibold text-[14px] text-slate-800">Create Project</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="border-slate-200 bg-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-slate-800">Create Project</DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Enter a distinct name for your new workspace or project.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    id="name"
                    placeholder="Project Workspace"
                    className="w-full border-slate-200 bg-white focus-visible:ring-blue-500"
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                      alert("Project Created!");
                      setIsCreateOpen(false);
                    }}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={handleChatFile}
              className="group flex h-28 w-full flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-5 text-left font-normal shadow-sm outline-none transition-colors hover:bg-slate-50 focus:ring-[1px] focus:ring-blue-500"
            >
              <FileText className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-500" />
              <span className="font-semibold text-[14px] text-slate-800">Chat with file</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleChatFolder}
              className="group flex h-28 w-full flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-5 text-left font-normal shadow-sm outline-none transition-colors hover:bg-slate-50 focus:ring-[1px] focus:ring-blue-500"
            >
              <Folder className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-500" />
              <span className="font-semibold text-[14px] text-slate-800">Chat with folder</span>
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <div className="mt-12 px-2 pb-16">
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="border-slate-200 border-b hover:bg-transparent">
                <TableHead className="w-[45px] px-2 py-3">
                  <Checkbox className="border-slate-300 data-[state=checked]:bg-blue-600" />
                </TableHead>
                <TableHead className="w-[40%] py-3 font-semibold text-[13px] text-slate-500 uppercase tracking-wider">
                  Title
                </TableHead>
                <TableHead className="w-[20%] py-3 font-semibold text-[13px] text-slate-500 uppercase tracking-wider">
                  Authors / Team
                </TableHead>
                <TableHead className="w-[15%] py-3 font-semibold text-[13px] text-slate-500 uppercase tracking-wider">
                  Added
                </TableHead>
                <TableHead className="w-[15%] py-3 font-semibold text-[13px] text-slate-500 uppercase tracking-wider">
                  Size
                </TableHead>
                <TableHead className="w-[10%] py-3 font-semibold text-[13px] text-slate-500 uppercase tracking-wider">
                  Type
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="group border-slate-100 border-b transition-colors hover:bg-slate-50/70"
                >
                  <TableCell className="px-2 py-4">
                    <Checkbox className="border-slate-300 data-[state=checked]:bg-blue-600" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Link
                      href={`/dashboard/projects/${doc.id}`}
                      className="flex items-center font-medium text-slate-800 transition-colors group-hover:text-blue-600"
                    >
                      {getFileIcon(doc.type)}
                      <span className="truncate">{doc.title}</span>{" "}
                      {/* Using the actual mocked title instead of strict truncation */}
                    </Link>
                  </TableCell>
                  <TableCell className="py-4 text-[14px] text-slate-600">{doc.authors || "--"}</TableCell>
                  <TableCell className="py-4 text-[14px] text-slate-600">{doc.date}</TableCell>
                  <TableCell className="py-4 text-[14px] text-slate-600">{doc.size}</TableCell>
                  <TableCell className="py-4 font-medium font-mono text-[13px] text-slate-600 uppercase">
                    {doc.type}
                  </TableCell>
                </TableRow>
              ))}
              {files.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                    No files found. Upload a file to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
=======
import { useState } from "react";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProjects, type Project } from "@/data/projects";

export default function ProjectsPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Only display Approved projects for this workflow
  const approvedProjects = mockProjects.filter((p) => p.status === "Approved");

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const closeDialog = () => setSelectedProject(null);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 pt-0 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-extrabold text-4xl tracking-tight lg:text-5xl">Projects</h1>
        <p className="text-lg text-muted-foreground">Select an approved project to open its unified workspace.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {approvedProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="group focus-none block h-full cursor-pointer"
            type="button"
          >
            <Card className="group relative h-full overflow-hidden border-muted-foreground/10 bg-card transition-all duration-300 hover:scale-[1.02] hover:bg-accent/5 hover:shadow-xl active:scale-[0.98]">
              <div className="absolute top-0 left-0 h-1 w-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader className="pb-3">
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{project.description}</p>
              </CardContent>
            </Card>
          </button>
        ))}
>>>>>>> main
      </div>
    </div>
  );
}
