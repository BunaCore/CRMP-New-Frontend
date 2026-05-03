import { apiClient } from "@/lib/api/client";

export interface ProjectMember {
  userId: string;
  fullName: string;
  email: string;
  role?: string;
}

/**
 * GET /projects/:projectId/members
 *
 * Returns the list of users who are members of the given project.
 * Used by useCollabProvider to decide whether collab mode is needed:
 *   • 1 member  → solo mode (no collab)
 *   • 2+ members → collab mode
 *
 * Backend requirement:
 *   - Endpoint must exist and return 200 with member array
 *   - Must enforce JWT auth (same as all other endpoints)
 *   - Only members of the project should be able to call this
 */
export async function fetchProjectMembers(projectId: string): Promise<ProjectMember[]> {
  const res = await apiClient.get<ProjectMember[]>(`/projects/${projectId}/members`);
  return res.data;
}
