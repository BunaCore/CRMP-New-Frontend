export interface ProjectDefenceSchedule {
  id: string;
  defenceDate: string; // ISO string
  location: string;
  note?: string | null;
  scheduledBy?: string | null;
  createdAt: string;
}

export interface ProjectListItem {
  projectId: string;
  projectTitle: string;
  isFunded: boolean;
  projectStage: string;
  projectDescription: string;
  submissionDate: string;
  researchArea: string | null;
  projectProgram: string;
  departmentId: string;
  durationMonths: number;
  ethicalClearanceStatus: string;
  bannerUrl: string | null;
  publicFileUrl: string | null;
  publishedAt: string | null;
  isPublic: boolean;
  createdAt: string;
  defenceSchedules: ProjectDefenceSchedule[];
  pi: {
    id: string;
    fullName: string;
    email: string;
  } | null;
}

export interface PublicProjectListItem {
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  researchArea: string | null;
  bannerUrl: string;
  publicFileUrl: string;
  projectProgram: string;
  department: string;
  departmentId: string;
  publishedAt: string;
  durationMonths: number;
}

export interface ProjectMember {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role: "PI" | "ADVISOR" | "MEMBER";
  addedAt: string;
}

export interface BudgetItem {
  id: string;
  lineIndex: number;
  description: string;
  requestedAmount: string;
}

export interface ProjectBudget {
  id: string;
  proposalId: string;
  projectId: string;
  currentStatus: string;
  totalAmount: string;
  approvedAmount?: string | null;
  createdAt: string;
  items: BudgetItem[];
}

export interface ProjectDetails {
  projectId: string;
  projectTitle: string;
  isFunded: boolean;
  projectStage: string;
  projectDescription: string;
  submissionDate: string;
  proposalFile?: string | null;
  researchArea: string;
  projectProgram: string;
  department?: string | null;
  departmentId?: string | null;
  durationMonths: number;
  ethicalClearanceStatus: string;
  createdAt: string;
  isPublic: boolean;
  bannerUrl?: string | null;
  publicFileUrl?: string | null;
  publishedAt?: string | null;
  publishedBy?: string | null;
  members?: ProjectMember[] | null;
  budget?: ProjectBudget | null;
}

export interface ProjectsQueryParams {
  me?: boolean;
  isPublic?: boolean;
  program?: string;
  search?: string;
  page?: number;
  limit?: number;
}
