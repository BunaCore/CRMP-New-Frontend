export interface EvaluationStudent {
  id: string;
  name: string;
  studentId?: string; // Optional matriculation number if available
}

export interface EvaluationRubric {
  id: string;
  name: string;
  isIndividual: boolean;
  totalPoints?: number;
}

export interface EvaluationItem {
  id: string;
  title: string;
  program: string;
  createdAt: string;
  members: EvaluationStudent[];
  missingRubrics: EvaluationRubric[];
}

export interface SubmitScorePayload {
  rubricId: string;
  proposalId?: string;
  projectId?: string;
  scores: Array<{
    studentId: string;
    score: number;
  }>;
}
