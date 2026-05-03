export interface AccessRole {
  id: string;
  name: string;
  description: string;
}

export interface AccessPermission {
  id: string;
  key: string;
  description: string;
  createdAt: string;
}

export interface AccessRolePermission {
  mappingId: string;
  roleId: string;
  permissionId: string;
  key: string;
  description: string;
}

export interface AccessRolePermissionsResponse {
  role: AccessRole;
  permissions: AccessRolePermission[];
}
