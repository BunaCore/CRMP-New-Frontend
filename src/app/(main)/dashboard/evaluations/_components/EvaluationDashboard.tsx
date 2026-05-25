"use client";

import { useState } from "react";

import { RequiresPermissions } from "@/access-control/permission-gates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useGetEvaluationProjects, useGetEvaluationProposals } from "@/lib/api/evaluations/queries";
import type { EvaluationItem, EvaluationRubric } from "@/lib/api/evaluations/types";
import { useScheduleProjectDefence } from "@/lib/api/projects/queries";
import { useScheduleProposalDefence } from "@/lib/api/proposals/queries";

import { EvaluationScoreModal } from "./EvaluationScoreModal";

// ─── Root Component ──────────────────────────────────────────────────────────

export function EvaluationDashboard() {
  const [activeTab, setActiveTab] = useState<"proposals" | "projects">("proposals");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Evaluation & Defence</h2>
          <p className="text-muted-foreground">Manage evaluations and schedule defences for proposals and projects.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {/* ── Proposal tab: calls POST /proposals/:id/defence ── */}
        <TabsContent value="proposals" className="space-y-4">
          <EvaluationList type="proposal" />
        </TabsContent>

        {/* ── Project tab: calls POST /projects/:id/defence ── */}
        <TabsContent value="projects" className="space-y-4">
          <EvaluationList type="project" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── List Component (shared, type-aware) ─────────────────────────────────────

function EvaluationList({ type }: { type: "proposal" | "project" }) {
  const proposalData = useGetEvaluationProposals();
  const projectData = useGetEvaluationProjects();
  const { data, isLoading, error } = type === "proposal" ? proposalData : projectData;

  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<EvaluationItem | null>(null);
  const [selectedRubric, setSelectedRubric] = useState<EvaluationRubric | null>(null);

  // Defence scheduling form state
  const [defenceDate, setDefenceDate] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");

  // ── Mutations — one per phase, selected at submit time ────────────────────
  // Proposal tab → POST /proposals/:proposalId/defence
  const scheduleProposalMutation = useScheduleProposalDefence();
  // Project tab  → POST /projects/:projectId/defence
  const scheduleProjectMutation = useScheduleProjectDefence();

  const isPending = type === "proposal" ? scheduleProposalMutation.isPending : scheduleProjectMutation.isPending;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Failed to load data.</div>;

  const items = data?.items || [];

  if (items.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground text-sm">No {type}s found.</p>
      </div>
    );
  }

  const handleScoreClick = (item: EvaluationItem, rubric: EvaluationRubric) => {
    setSelectedItem(item);
    setSelectedRubric(rubric);
    setScoreModalOpen(true);
  };

  const handleScheduleClick = (item: EvaluationItem) => {
    setSelectedItem(item);
    // Reset form
    setDefenceDate("");
    setLocation("");
    setNote("");
    setFormError("");
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = async () => {
    setFormError("");

    if (!defenceDate) {
      setFormError("Defence date is required.");
      return;
    }
    if (!location.trim()) {
      setFormError("Location is required.");
      return;
    }
    if (!selectedItem) return;

    const payload = {
      defenceDate: new Date(defenceDate).toISOString(),
      location: location.trim(),
      note: note.trim() || undefined,
    };

    try {
      if (type === "proposal") {
        // Proposal tab → POST /proposals/:proposalId/defence
        await scheduleProposalMutation.mutateAsync({ proposalId: selectedItem.id, payload });
      } else {
        // Project tab → POST /projects/:projectId/defence
        await scheduleProjectMutation.mutateAsync({ projectId: selectedItem.id, payload });
      }
      setScheduleModalOpen(false);
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to schedule defence. Please try again.";
      setFormError(errorMessage);
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
                  <CardDescription className="mt-1">{item.program}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-sm">Missing Evaluations</h4>
                {item.missingRubrics?.length > 0 ? (
                  <div className="space-y-2">
                    {item.missingRubrics.map((rubric) => (
                      <div key={rubric.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                        <span>{rubric.name}</span>
                        <RequiresPermissions permissions={["EVALUATION_SCORE_SUBMIT"]} fallback={null}>
                          <Button size="sm" variant="secondary" onClick={() => handleScoreClick(item, rubric)}>
                            Evaluate
                          </Button>
                        </RequiresPermissions>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No pending evaluations.</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <RequiresPermissions permissions={["DEFENCE_SCHEDULE"]} fallback={null}>
                <Button className="w-full" variant="outline" onClick={() => handleScheduleClick(item)}>
                  Schedule Defence
                </Button>
              </RequiresPermissions>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Score modal — unchanged */}
      <EvaluationScoreModal
        open={scoreModalOpen}
        onOpenChange={setScoreModalOpen}
        item={selectedItem}
        rubric={selectedRubric}
        type={type}
      />

      {/* ── Defence Scheduling Dialog ── */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule {type === "project" ? "Project" : "Proposal"} Defence</DialogTitle>
            <DialogDescription>
              Fill in the defence details for <strong>{selectedItem?.title}</strong>.
              {type === "project"
                ? " This will schedule a project-phase defence and set the project to Under Review."
                : " This will schedule a proposal-phase defence and set the proposal to Under Review."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Date & Time */}
            <div className="space-y-1">
              <Label htmlFor="defence-date">Defence Date & Time *</Label>
              <Input
                id="defence-date"
                type="datetime-local"
                value={defenceDate}
                onChange={(e) => setDefenceDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <Label htmlFor="defence-location">Location / Link *</Label>
              <Input
                id="defence-location"
                placeholder="e.g. Room A201 or https://zoom.us/j/..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Note */}
            <div className="space-y-1">
              <Label htmlFor="defence-note">Note (optional)</Label>
              <Textarea
                id="defence-note"
                placeholder="e.g. Bring printed copies of your research paper"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            {/* Inline validation error */}
            {formError && <p className="text-destructive text-sm">{formError}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setScheduleModalOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule} disabled={isPending}>
              {isPending ? "Scheduling…" : "Save Schedule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
