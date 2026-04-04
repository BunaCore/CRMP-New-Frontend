"use client";

import React from "react";
import { format } from "date-fns";
import { useEvaluations } from "../evaluations-context";
import { STATUS_STYLES } from "./evaluations-tabs";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Can } from "@/access-control/permission-gates";
import { CheckCircle2, FileText, Award, CalendarDays, ShieldCheck, Sparkles, Clock, Send } from "lucide-react";

export function EvaluationDrawer() {
  const {
    drawerOpen, drawerKind, drawerTab, setDrawerTab,
    activeProposal, activeProject,
    rubric, setRubric, totals,
    defenceDate, setDefenceDate, defenceTime, setDefenceTime,
    defenceVenue, setDefenceVenue, defenceMessage, setDefenceMessage,
    defenceDraftSent, handleSendDefenceInvite,
    isEvalApproved, closeDrawer, setShowApproveDialog
  } = useEvaluations();

  const drawerTitle = drawerKind === "proposal" ? activeProposal?.title : activeProject?.title;
  const drawerSubtitle = drawerKind === "proposal"
    ? activeProposal ? `${activeProposal.id} · ${activeProposal.dept} · ${activeProposal.pi}` : ""
    : activeProject ? `${activeProject.id} · ${activeProject.dept} · ${activeProject.lead}` : "";

  return (
    <Sheet open={drawerOpen} onOpenChange={(o) => !o && closeDrawer()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-hidden border-l border-slate-200/80 p-0 shadow-2xl dark:border-slate-800 sm:max-w-[920px] xl:max-w-[1100px]"
      >
        {drawerTitle && (
          <>
            <SheetHeader className="shrink-0 space-y-0 border-slate-100 border-b bg-gradient-to-br from-indigo-50/90 via-white to-white px-6 pt-6 pb-4 dark:border-slate-800 dark:from-indigo-950/40 dark:via-slate-950 dark:to-slate-950">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-white/80 font-bold text-[10px] text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
                  {drawerKind === "proposal" ? "Proposal evaluation" : "Project evaluation"}
                </Badge>
                {drawerKind === "project" && activeProject && (
                  <Badge className={cn("border-0 font-bold text-[10px]", STATUS_STYLES[activeProject.evalStatus].className)}>
                    {activeProject.evalStatus}
                  </Badge>
                )}
                {isEvalApproved && (
                  <Badge className="border-0 bg-emerald-600 font-bold text-[10px] text-white">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Evaluation approved
                  </Badge>
                )}
              </div>
              <SheetTitle className="mt-2 pr-2 text-left font-bold text-[17px] text-slate-900 leading-snug dark:text-slate-100">
                {drawerTitle}
              </SheetTitle>
              <SheetDescription className="text-left text-xs leading-relaxed">
                {drawerSubtitle}
              </SheetDescription>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { id: "overview" as const, label: "Overview", icon: FileText },
                  { id: "scores" as const, label: "Scores", icon: Award },
                  { id: "defence" as const, label: "Defence", icon: CalendarDays },
                  { id: "review" as const, label: "Approve", icon: ShieldCheck },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDrawerTab(t.id)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border px-2 py-2.5 font-semibold text-xs transition-all",
                      drawerTab === t.id
                        ? "border-indigo-300 bg-indigo-600 text-white shadow-md dark:border-indigo-500 dark:bg-indigo-600"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    )}
                  >
                    <t.icon className="h-3.5 w-3.5 shrink-0" />
                    {t.label}
                  </button>
                ))}
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
              {/* ── TAB: OVERVIEW ── */}
              {drawerTab === "overview" && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                      <p className="font-bold text-[11px] text-slate-400 uppercase tracking-widest">Weighted Total</p>
                      <p className="mt-2 text-3xl font-black text-indigo-600 tabular-nums dark:text-indigo-400">
                        {totals.earned.toFixed(2)}
                        <span className="text-xl font-bold text-slate-400 ml-1">/ {totals.max}</span>
                      </p>
                      <p className="mt-1.5 font-medium text-[12px] text-slate-500">{totals.pct}% of evaluation maximum</p>
                    </div>
                    <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                      <p className="font-bold text-[11px] text-slate-400 uppercase tracking-widest">Criteria Rows</p>
                      <p className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">{rubric.length}</p>
                      <p className="mt-1.5 font-medium text-[12px] text-slate-500">Continuous and final components</p>
                    </div>
                    <div className="flex flex-col justify-between rounded-2xl border border-indigo-200 bg-indigo-50/80 p-5 shadow-sm dark:border-indigo-900/40 dark:bg-indigo-950/30 lg:col-span-1 sm:col-span-2">
                      <p className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-800 uppercase tracking-widest dark:text-indigo-300">
                        <Sparkles className="h-3.5 w-3.5" /> Next Step
                      </p>
                      <p className="mt-2 font-medium text-indigo-900 dark:text-indigo-100 text-[13px] leading-relaxed">
                        Review scores, confirm defence timing, then proceed to the <span className="font-bold">Approve</span> tab when the packet is ready for official sign-off.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-dashed border-slate-200 p-5 dark:border-slate-800 text-[13px] text-slate-600 leading-relaxed dark:text-slate-400">
                    <strong>Tip:</strong> This panel mirrors proposal management. Use the <strong className="text-indigo-600 dark:text-indigo-400">Scores</strong> tab for the rubric breakdown and <strong className="text-indigo-600 dark:text-indigo-400">Defence</strong> to propose the presentation date, time, and venue.
                  </div>
                </div>
              )}

              {/* ── TAB: SCORES ── */}
              {drawerTab === "scores" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm dark:text-slate-100">Evaluation rubric</h3>
                      <p className="mt-0.5 text-slate-500 text-xs">Each row shows component type, cap, and awarded points. Adjust demo scores to preview totals.</p>
                    </div>
                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 dark:border-indigo-900/50 dark:bg-indigo-950/40">
                      <p className="font-bold text-[10px] text-indigo-800 uppercase tracking-wider dark:text-indigo-300">Aggregate</p>
                      <p className="font-black text-indigo-900 text-lg tabular-nums dark:text-indigo-100">
                        {totals.earned.toFixed(2)} <span className="font-semibold text-slate-500 text-sm">/ {totals.max}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {rubric.map((row, i) => {
                      const pct = row.max > 0 ? (row.score / row.max) * 100 : 0;
                      return (
                        <div key={row.order} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-violet-500 opacity-80" />
                          <div className="flex flex-col gap-3 pl-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-start gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-black text-indigo-600 text-sm dark:bg-slate-800 dark:text-indigo-400">
                                {row.order}
                              </span>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 text-sm dark:text-slate-100">{row.name}</p>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  <Badge variant="outline" className="border-slate-200 font-semibold text-[10px] uppercase dark:border-slate-700">{row.kind}</Badge>
                                  <span className="font-medium text-[11px] text-slate-500">Max {row.max} pts</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex w-full flex-col gap-2 sm:w-52">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="font-bold text-slate-500 text-xs">Result</span>
                                <span className="font-black text-indigo-700 text-lg tabular-nums dark:text-indigo-300">
                                  {row.score}
                                  <span className="font-semibold text-slate-400 text-sm"> / {row.max}</span>
                                </span>
                              </div>
                              <Progress value={pct} className="h-2 bg-slate-100 dark:bg-slate-800" />
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 pl-2 sm:pl-12">
                            <Label className="w-14 shrink-0 font-semibold text-[11px] text-slate-500">Edit</Label>
                            <Input
                              type="number" step="0.01" min={0} max={row.max}
                              className="h-8 max-w-[120px] font-mono text-sm"
                              value={row.score}
                              onChange={(e) => {
                                const v = Number.parseFloat(e.target.value);
                                if (Number.isNaN(v)) return;
                                setRubric((prev) => prev.map((r, idx) => idx === i ? { ...r, score: Math.min(r.max, Math.max(0, v)) } : r));
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <Can
                      permission="EVALUATION_SCORE_SUBMIT"
                      fallback={
                        <p className="font-medium text-[11px] text-slate-500 italic">
                          You do not have permission to submit these evaluations.
                        </p>
                      }
                    >
                      <Button type="button" className="h-10 bg-indigo-600 font-semibold text-white shadow hover:bg-indigo-700">
                        <Send className="mr-1.5 h-4 w-4" />
                        Submit Evaluation Scores
                      </Button>
                    </Can>
                  </div>
                </div>
              )}

              {/* ── TAB: DEFENCE ── */}
              {drawerTab === "defence" && (
                <div className="flex flex-col gap-6">
                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white flex flex-col sm:flex-row sm:items-center p-5 gap-4 shadow-sm dark:border-slate-800 dark:from-slate-900/40 dark:to-slate-950">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base dark:text-slate-100 tracking-tight">Defence Appointment</h3>
                      <p className="mt-1 text-slate-500 text-[13px] leading-relaxed dark:text-slate-400">
                        Schedule the evaluation defence. A calendar invitation will be automatically drafted for the PI upon confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 rounded-2xl border border-slate-100 p-5 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
                    <div className="flex flex-col gap-2.5">
                      <Label className="font-bold text-[12px] text-slate-700 uppercase tracking-widest dark:text-slate-300">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="h-11 w-full justify-start font-medium text-slate-700 bg-slate-50/50 hover:bg-slate-100 dark:text-slate-300 dark:bg-slate-900/50 dark:hover:bg-slate-800">
                            <CalendarDays className="mr-2.5 h-4 w-4 text-indigo-500" />
                            {defenceDate ? format(defenceDate, "EEEE, d MMM yyyy") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                          <Calendar mode="single" selected={defenceDate} onSelect={setDefenceDate} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <Label htmlFor="def-time" className="font-bold text-[12px] text-slate-700 uppercase tracking-widest dark:text-slate-300">Time (EAT)</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500 pointer-events-none" />
                        <Input id="def-time" type="time" className="h-11 pl-10 font-medium text-slate-700 bg-slate-50/50 dark:text-slate-300 dark:bg-slate-900/50" value={defenceTime} onChange={(e) => setDefenceTime(e.target.value)} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 md:col-span-2">
                      <Label htmlFor="def-venue" className="font-bold text-[12px] text-slate-700 uppercase tracking-widest dark:text-slate-300">Location / Link</Label>
                      <Input id="def-venue" placeholder="Room number, building, or Teams/Zoom URL" className="h-11 bg-slate-50/50 dark:bg-slate-900/50" value={defenceVenue} onChange={(e) => setDefenceVenue(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-2.5 md:col-span-2">
                      <Label htmlFor="def-msg" className="font-bold text-[12px] text-slate-700 uppercase tracking-widest dark:text-slate-300">Direct Message to PI</Label>
                      <Textarea id="def-msg" className="min-h-[120px] resize-none text-[13px] bg-slate-50/50 dark:bg-slate-900/50 leading-relaxed" value={defenceMessage} onChange={(e) => setDefenceMessage(e.target.value)} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                    <Button type="button" className="h-11 w-full sm:flex-1 bg-indigo-600 font-bold text-white shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all" disabled={!defenceDate} onClick={handleSendDefenceInvite}>
                      <Send className="mr-2 h-4 w-4" /> Send Invite to PI
                    </Button>

                    {defenceDraftSent && defenceDate && (
                      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 sm:flex-1 dark:border-emerald-900/60 dark:bg-emerald-950/40">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <div className="min-w-0">
                          <p className="font-bold text-emerald-900 text-[12px] dark:text-emerald-200">Invitation successfully queued</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB: REVIEW ── */}
              {drawerTab === "review" && (
                <div className="flex flex-col gap-5">
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg dark:border-slate-700">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Official evaluation total</p>
                        <p className="mt-1 font-black text-4xl text-white tabular-nums tracking-tight">
                          {totals.earned.toFixed(2)}
                          <span className="font-semibold text-2xl text-slate-400"> / {totals.max}</span>
                        </p>
                        <p className="mt-2 font-medium text-slate-400 text-sm">{totals.pct}% of rubric maximum — all {rubric.length} components recorded.</p>
                      </div>
                      <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-indigo-400/40 bg-indigo-500/20 font-black text-2xl text-indigo-100">
                        {totals.pct}%
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <h4 className="mb-3 font-bold text-slate-800 text-xs uppercase tracking-wider dark:text-slate-200">Admin checklist</h4>
                    <ul className="flex flex-col gap-2 text-[13px] text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> Rubric rows complete and within caps</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> Defence invitation sent or scheduled</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className={cn("h-4 w-4 shrink-0", isEvalApproved ? "text-emerald-500" : "text-slate-300 dark:text-slate-600")} /> Formal approval recorded</li>
                    </ul>
                  </div>

                  {isEvalApproved ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
                      <p className="font-bold text-sm">This evaluation is approved on file.</p>
                      <p className="mt-1 text-xs opacity-90">The project row can move to <strong>Finished</strong> once your backend updates status.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Button type="button" className="h-10 bg-emerald-600 font-semibold hover:bg-emerald-700" onClick={() => setShowApproveDialog(true)}>
                        <ShieldCheck className="mr-2 h-4 w-4" /> Approve evaluation
                      </Button>
                      <p className="text-slate-500 text-xs sm:flex-1">Locks the rubric totals for audit and notifies finance / registry per your workflow.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
