"use client";

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
          <h2 className="mb-4 px-2 text-sm font-semibold tracking-wide text-slate-500 uppercase">Quick actions</h2>
          <div className="grid grid-cols-2 gap-4 px-2 lg:grid-cols-4">
            <Button
              variant="outline"
              onClick={handleUpload}
              className="group flex h-28 w-full flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-5 text-left font-normal shadow-sm transition-colors outline-none hover:bg-slate-50 focus:ring-[1px] focus:ring-blue-500"
            >
              <Upload className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-500" />
              <span className="text-[14px] font-semibold text-slate-800">Upload Data</span>
            </Button>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="group flex h-28 w-full flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-5 text-left font-normal shadow-sm transition-colors outline-none hover:bg-slate-50 focus:ring-[1px] focus:ring-blue-500"
                >
                  <Plus className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-500" />
                  <span className="text-[14px] font-semibold text-slate-800">Create Section</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create new section</DialogTitle>
                  <DialogDescription>Add a new section to organize your project data.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right text-sm">
                      Name
                    </label>
                    <Input id="name" placeholder="Project section name" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setIsCreateOpen(false)}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={handleChatFile}
              className="group flex h-28 w-full flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-5 text-left font-normal shadow-sm transition-colors outline-none hover:bg-slate-50 focus:ring-[1px] focus:ring-blue-500"
            >
              <FileText className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-500" />
              <span className="text-[14px] font-semibold text-slate-800">Chat with file</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleChatFolder}
              className="group flex h-28 w-full flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-5 text-left font-normal shadow-sm transition-colors outline-none hover:bg-slate-50 focus:ring-[1px] focus:ring-blue-500"
            >
              <Folder className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-500" />
              <span className="text-[14px] font-semibold text-slate-800">Chat with folder</span>
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <div className="mt-12 px-2 pb-16">
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="border-b border-slate-200 hover:bg-transparent">
                <TableHead className="w-[45px] px-2 py-3">
                  <Checkbox className="border-slate-300 data-[state=checked]:bg-blue-600" />
                </TableHead>
                <TableHead className="w-[40%] py-3 text-[13px] font-semibold tracking-wider text-slate-500 uppercase">
                  Title
                </TableHead>
                <TableHead className="w-[20%] py-3 text-[13px] font-semibold tracking-wider text-slate-500 uppercase">
                  Authors / Team
                </TableHead>
                <TableHead className="w-[15%] py-3 text-[13px] font-semibold tracking-wider text-slate-500 uppercase">
                  Added
                </TableHead>
                <TableHead className="w-[15%] py-3 text-[13px] font-semibold tracking-wider text-slate-500 uppercase">
                  Size
                </TableHead>
                <TableHead className="w-[10%] py-3 text-[13px] font-semibold tracking-wider text-slate-500 uppercase">
                  Type
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="group border-b border-slate-100 transition-colors hover:bg-slate-50/70"
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
                    </Link>
                  </TableCell>
                  <TableCell className="py-4 text-[14px] text-slate-600">{doc.authors || "--"}</TableCell>
                  <TableCell className="py-4 text-[14px] text-slate-600">{doc.date}</TableCell>
                  <TableCell className="py-4 text-[14px] text-slate-600">{doc.size}</TableCell>
                  <TableCell className="py-4 font-mono text-[13px] font-medium text-slate-600 uppercase">
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
      </div>
    </div>
  );
}
