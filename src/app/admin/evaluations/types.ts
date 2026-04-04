export type MainTab = "proposals" | "projects";
export type DrawerTab = "overview" | "scores" | "defence" | "review";

export type ProjectEvalStatus =
  | "On evaluation"
  | "Finished"
  | "Awaiting approval"
  | "Scheduled";

export interface RubricItem {
  order: number;
  name: string;
  kind: "continuous" | "final";
  max: number;
  score: number;
}

export interface EvalProposalRow {
  id: string;
  title: string;
  pi: string;
  piAvatar: string;
  piColor: string;
  dept: string;
  stage: string;
  budget: string;
}

export interface EvalProjectRow {
  id: string;
  title: string;
  lead: string;
  leadAvatar: string;
  leadColor: string;
  dept: string;
  budget: string;
  evalStatus: ProjectEvalStatus;
  totalScore: number;
  maxTotal: number;
}
