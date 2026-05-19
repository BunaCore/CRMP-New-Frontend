import type { PaginatedResponse } from "@/lib/api/types/pagination";

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "fullName" | "email" | "createdAt";
  sortDir?: "asc" | "desc";
  roleId?: string;
  status?: string;
}

export interface UserListItem {
  id: string;
  fullName: string | null;
  email: string;
  departmentId: string | null;
  departmentName: string | null;
  universityId: string | null;
  phoneNumber: string | null;
  userProgram: "UG" | "PG" | null;
  isExternal: boolean;
  accountStatus: string;
  avatarUrl: string | null;
  createdAt: string;
  roles: Array<{ id: string; name: string }>;
}

export type UsersListResponse = PaginatedResponse<UserListItem>;

export interface DepartmentCoordinationDepartment {
  id: string;
  name: string;
  code: string;
  assignedAt: string;
}

export interface UserDetails extends UserListItem {
  university: string | null;
  roles: Array<{ id: string; name: string; grantedAt: string }>;
  departmentCoordination: {
    isCoordinator: boolean;
    departments: DepartmentCoordinationDepartment[];
  };
}

export interface InviteUserPayload {
  email: string;
  roleId: string;
}

export interface UpdateUserRolesPayload {
  userId: string;
  roleIds: string[];
}

export interface UpdateUserStatusPayload {
  userId: string;
  status: "active" | "deactive";
}

export interface UpdateUserProfilePayload {
  userId: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string | null;
  universityId?: string | null;
  userProgram?: "UG" | "PG" | null;
}

/**
 * Payload for self-profile update.
 * PATCH /users/me — only fullName and phoneNumber are editable by the user.
 */
export interface UpdateSelfProfilePayload {
  fullName?: string;
  phoneNumber?: string;
}
