"use client";

import { motion } from "framer-motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AllProjectsTab } from "./_components/all-projects-tab";
import { WorkspaceTab } from "./_components/workspace-tab";

export default function ProjectsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 pt-0 md:p-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -4 }}
        className="group relative mb-8 flex flex-col gap-6 overflow-hidden rounded-3xl border border-slate-200/50 bg-gray-50 p-5 shadow-sm transition-all hover:shadow-lg sm:flex-row dark:border-slate-800/50 dark:bg-slate-950/50"
      >
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between w-full">
          <div>
            <h1 className="font-black text-lg text-slate-900 tracking-tighter md:text-2xl dark:text-slate-100">
              Projects
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground text-sm md:text-base">
              View all available projects or select an approved project to open its workspace and collaborate.
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="workspace" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="workspace">My Workspace</TabsTrigger>
          <TabsTrigger value="all">All Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="space-y-6 outline-none">
          <WorkspaceTab />
        </TabsContent>

        <TabsContent value="all" className="space-y-6 outline-none">
          <AllProjectsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
