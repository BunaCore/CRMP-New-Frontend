"use client";

import type React from "react";
import { useState } from "react";

import { AlertTriangle, Edit2, FileText, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitProposal, updateProposal } from "@/lib/api/proposals/mutations";
import type { ResearcherProposal } from "@/lib/api/proposals/types";

interface EditableProposalViewProps {
  proposal: ResearcherProposal;
  onUpdate?: (updated: ResearcherProposal) => void;
}

export function EditableProposalView({ proposal, onUpdate }: EditableProposalViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editTitle, setEditTitle] = useState(proposal.title);
  const [editAbstract, setEditAbstract] = useState(proposal.abstract || "");
  const [editResearchArea, setEditResearchArea] = useState(proposal.researchArea || "");

  const handleSave = async () => {
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      await updateProposal(proposal.id, {
        title: editTitle.trim(),
        abstract: editAbstract.trim(),
        researchArea: editResearchArea.trim(),
      });

      toast.success("Proposal updated successfully");
      setIsEditing(false);

      const updated: ResearcherProposal = {
        ...proposal,
        title: editTitle.trim(),
        abstract: editAbstract.trim(),
        researchArea: editResearchArea.trim(),
      };
      onUpdate?.(updated);
    } catch (error) {
      toast.error("Failed to update proposal");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitProposal(proposal.id);
      toast.success("Proposal resubmitted for review");
      onUpdate?.({
        ...proposal,
        status: "Under_Review",
        isEditable: false,
      });
    } catch (error) {
      toast.error("Failed to resubmit proposal");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(proposal.title);
    setEditAbstract(proposal.abstract || "");
    setEditResearchArea(proposal.researchArea || "");
    setIsEditing(false);
  };

  if (isEditing && proposal.isEditable) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-slate-200 border-b pb-4 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Edit Proposal</h3>
          {!isSaving && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-title" className="font-bold text-slate-900 text-sm dark:text-slate-100">
              Title *
            </Label>
            <Input
              id="edit-title"
              type="text"
              value={editTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
              className="h-10 rounded-lg border-slate-300 bg-white text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Proposal title"
              disabled={isSaving}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-area" className="font-bold text-slate-900 text-sm dark:text-slate-100">
              Research Area
            </Label>
            <Input
              id="edit-area"
              type="text"
              value={editResearchArea}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditResearchArea(e.target.value)}
              className="h-10 rounded-lg border-slate-300 bg-white text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="e.g. Machine Learning, Climate Science"
              disabled={isSaving}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-abstract" className="font-bold text-slate-900 text-sm dark:text-slate-100">
              Abstract
            </Label>
            <Textarea
              id="edit-abstract"
              value={editAbstract}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditAbstract(e.target.value)}
              className="min-h-28 rounded-lg border-slate-300 bg-white text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Provide a detailed abstract of your proposal"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="flex gap-3 border-slate-200 border-t pt-4 dark:border-slate-800">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? "Saving…" : "Save Changes"}
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            variant="outline"
            className="flex-1 font-semibold"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {proposal.isEditable && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-bold text-amber-800 text-sm dark:text-amber-300">Changes Requested</p>
            <p className="mt-0.5 text-amber-600 text-xs dark:text-amber-400">
              Please update your proposal and resubmit for review.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="mb-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Title</p>
            <p className="font-bold text-[15px] text-slate-900 leading-snug dark:text-slate-100">{proposal.title}</p>
          </div>
          {proposal.isEditable && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="ml-4 rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
              title="Edit proposal"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {proposal.researchArea && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/30">
          <p className="mb-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Research Area</p>
          <p className="font-semibold text-[13px] text-slate-700 dark:text-slate-300">{proposal.researchArea}</p>
        </div>
      )}

      {proposal.abstract && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/30">
          <h4 className="mb-2.5 flex items-center gap-2 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
            <FileText className="h-3.5 w-3.5" /> Abstract
          </h4>
          <p className="text-[13px] text-slate-600 leading-relaxed dark:text-slate-400">{proposal.abstract}</p>
        </div>
      )}

      {proposal.isEditable && (
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={handleResubmit}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Resubmitting…" : "Resubmit for Review"}
          </Button>
        </div>
      )}
    </div>
  );
}
