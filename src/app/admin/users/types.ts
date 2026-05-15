export type UserAccountStatus = "active" | "deactive" | "invited";

export interface UserRoleRef {
  id: string;
  name: string;
}

export interface AdminUserListItem {
  id: string;
  fullName: string | null;
  email: string;
  departmentId: string | null;
  departmentName: string | null;
  universityId: string | null;
  phoneNumber: string | null;
  userProgram: "UG" | "PG" | null;
  isExternal: boolean;
  accountStatus: UserAccountStatus;
  avatarUrl: string | null;
  createdAt: string;
  roles: UserRoleRef[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminUsersListResponse {
  items: AdminUserListItem[];
  meta: PaginationMeta;
}

export interface AdminUserDetails extends Omit<AdminUserListItem, "roles"> {
  roles: Array<UserRoleRef & { grantedAt: string }>;
  university: string | null;
  departmentCoordination: {
    isCoordinator: boolean;
    departments: Array<{
      id: string;
      name: string;
      code: string;
      assignedAt: string;
    }>;
    supportingDocument?: import("@/lib/api/files/types").FileDetails | null;
  };
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Permission {
  id: string;
  key: string;
  description: string;
  createdAt: string;
}

export interface RolePermissionMapping {
  mappingId: string;
  roleId: string;
  permissionId: string;
  key: string;
  description: string;
}

export interface RolePermissionsResponse {
  role: Role;
  permissions: RolePermissionMapping[];
}

export interface InvitePayload {
  email: string;
  roleId: string;
}
