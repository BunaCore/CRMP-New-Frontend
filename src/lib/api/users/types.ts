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
