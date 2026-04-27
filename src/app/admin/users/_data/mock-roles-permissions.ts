import type { Permission, Role, RolePermissionsResponse } from "../types";

export const MOCK_ROLES: Role[] = [
  {
    id: "3c0ce038-dc21-42f8-b6e3-159b4b0f3137",
    name: "STUDENT",
    description: "Role: STUDENT",
  },
  {
    id: "role-admin",
    name: "ADMIN",
    description: "Role: ADMIN",
  },
  {
    id: "role-evaluator",
    name: "EVALUATOR",
    description: "Role: EVALUATOR",
  },
];

export const MOCK_PERMISSIONS: Permission[] = [
  {
    id: "50e49f21-df15-40b6-8a12-54d366f6d72e",
    key: "proposal:create",
    description: "Permission: proposal:create",
    createdAt: "2026-04-17T06:53:12.230Z",
  },
  {
    id: "ce7d5077-1b0d-40d8-8db5-213ba587de6c",
    key: "proposal:review",
    description: "Permission: proposal:review",
    createdAt: "2026-04-17T06:53:12.230Z",
  },
  {
    id: "7dba95e1-2f8d-41fa-9201-771d83052f24",
    key: "user:view",
    description: "Permission: user:view",
    createdAt: "2026-04-17T06:53:12.230Z",
  },
  {
    id: "8f0f63d8-5c63-4470-9773-d0c7d64ea5f3",
    key: "admin:edit",
    description: "Permission: admin:edit",
    createdAt: "2026-04-17T06:53:12.230Z",
  },
];

export const MOCK_ROLE_PERMISSIONS_BY_ROLE_ID: Record<string, RolePermissionsResponse> = {
  "3c0ce038-dc21-42f8-b6e3-159b4b0f3137": {
    role: MOCK_ROLES[0],
    permissions: [
      {
        mappingId: "df36fc5c-d294-4ee1-83b9-eb82d3033692",
        roleId: "3c0ce038-dc21-42f8-b6e3-159b4b0f3137",
        permissionId: "50e49f21-df15-40b6-8a12-54d366f6d72e",
        key: "proposal:create",
        description: "Permission: proposal:create",
      },
    ],
  },
  "role-admin": {
    role: MOCK_ROLES[1],
    permissions: [
      {
        mappingId: "9f7a73f1-7d88-4ab7-a59b-aecb8ce0ba1f",
        roleId: "role-admin",
        permissionId: "7dba95e1-2f8d-41fa-9201-771d83052f24",
        key: "user:view",
        description: "Permission: user:view",
      },
      {
        mappingId: "74d67945-d5da-447d-9018-267ad9ffd58d",
        roleId: "role-admin",
        permissionId: "8f0f63d8-5c63-4470-9773-d0c7d64ea5f3",
        key: "admin:edit",
        description: "Permission: admin:edit",
      },
    ],
  },
  "role-evaluator": {
    role: MOCK_ROLES[2],
    permissions: [
      {
        mappingId: "5bc1f5d2-5db5-4f4f-a8b7-af19f15e95bb",
        roleId: "role-evaluator",
        permissionId: "ce7d5077-1b0d-40d8-8db5-213ba587de6c",
        key: "proposal:review",
        description: "Permission: proposal:review",
      },
    ],
  },
};
