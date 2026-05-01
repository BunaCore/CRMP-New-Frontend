export type MainTab = "proposals" | "projects";
export type DrawerTab = "overview" | "team" | "budget" | "scores" | "defence" | "review";

export type ProjectEvalStatus = "On evaluation" | "Finished" | "Awaiting approval" | "Scheduled";

export interface BudgetItem {
  description: string;
  amount: number;
}

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
  program: string;
  teamCount: number;
  budgetItems?: BudgetItem[];
}

export interface EvalProjectRow {
  id: string;
  title: string;
  lead: string;
  leadAvatar: string;
  leadColor: string;
  dept: string;
  budget: string;
  budgetItems?: BudgetItem[];
  evalStatus: ProjectEvalStatus;
  totalScore: number;
  maxTotal: number;
}
