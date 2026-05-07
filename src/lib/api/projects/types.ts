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
  pi: {
    id: string;
    fullName: string;
    email: string;
  } | null;
}

export interface ProjectsQueryParams {
  me?: boolean;
  isPublic?: boolean;
  program?: string;
  search?: string;
  page?: number;
  limit?: number;
}
