"use client";

import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { useCreateAccessRole, useUpdateRolePermissions } from "@/lib/api/access-control/mutations";
import { useGetAccessPermissions, useGetAccessRoles, useGetRolePermissions } from "@/lib/api/access-control/queries";
import type { AccessPermission } from "@/lib/api/access-control/types";
import { useInviteUser } from "@/lib/api/users/mutations";
import { useGetUserById, useGetUsersList } from "@/lib/api/users/queries";
import type { UsersListResponse } from "@/lib/api/users/types";

import { MOCK_PERMISSIONS, MOCK_ROLE_PERMISSIONS_BY_ROLE_ID, MOCK_ROLES } from "./_data/mock-roles-permissions";
import { MOCK_USER_DETAILS_BY_ID, MOCK_USERS } from "./_data/mock-users";
import type { AdminUserDetails, AdminUserListItem, InvitePayload, Role } from "./types";

type AdminUsersTab = "users" | "roles";

interface UsersContextValue {
  activeTab: AdminUsersTab;
  setActiveTab: React.Dispatch<React.SetStateAction<AdminUsersTab>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  roleFilter: string;
  setRoleFilter: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  totalItems: number;
  totalPages: number;
  pagedUsers: AdminUserListItem[];
  isUsersLoading: boolean;
  selectedUserId: string | null;
  selectedUser: AdminUserDetails | null;
  isUserDetailsLoading: boolean;
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | null>>;
  inviteOpen: boolean;
  setInviteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roles: Role[];
  permissions: AccessPermission[];
  isRolesLoading: boolean;
  isPermissionsLoading: boolean;
  selectedRoleId: string;
  selectedRolePermissions: Set<string>;
  rolePermissionDraft: Set<string>;
  hasRolePermissionChanges: boolean;
  setSelectedRoleId: React.Dispatch<React.SetStateAction<string>>;
  toggleRolePermission: (permissionId: string) => void;
  saveRolePermissionChanges: () => void;
  createRole: (name: string, description: string) => void;
  inviteUser: (payload: InvitePayload) => void;
}

const UsersContext = createContext<UsersContextValue | undefined>(undefined);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<AdminUsersTab>("users");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 5;
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(MOCK_ROLES[0]?.id ?? "");
  const [draftByRole, setDraftByRole] = useState<Record<string, Set<string>>>(
    Object.fromEntries(
      Object.entries(MOCK_ROLE_PERMISSIONS_BY_ROLE_ID).map(([id, value]) => [
        id,
        new Set(value.permissions.map((p) => p.permissionId)),
      ]),
    ),
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const listParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      sortBy: "createdAt" as const,
      sortDir: "desc" as const,
      roleId: roleFilter !== "all" ? roleFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    }),
    [debouncedSearch, page, roleFilter, statusFilter],
  );

  const usersQuery = useGetUsersList(listParams);
  const rolesQuery = useGetAccessRoles();
  const permissionsQuery = useGetAccessPermissions();
  const rolePermissionsQuery = useGetRolePermissions(selectedRoleId || null);
  const userDetailsQuery = useGetUserById(selectedUserId);

  useEffect(() => {
    if (!selectedRoleId) return;
    if (!rolePermissionsQuery.data) return;
    const permissionIds = new Set(rolePermissionsQuery.data.permissions.map((p) => p.permissionId));
    setDraftByRole((prev) => ({ ...prev, [selectedRoleId]: permissionIds }));
  }, [rolePermissionsQuery.data, selectedRoleId]);

  const usersResponse: UsersListResponse = usersQuery.data ?? {
    items: MOCK_USERS,
    meta: {
      page,
      limit,
      totalItems: MOCK_USERS.length,
      totalPages: Math.max(1, Math.ceil(MOCK_USERS.length / limit)),
      hasNextPage: false,
      hasPrevPage: false,
    },
  };

  const roles: Role[] =
    rolesQuery.data?.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
    })) ?? MOCK_ROLES;
  const permissions: AccessPermission[] = permissionsQuery.data ?? MOCK_PERMISSIONS;

  const totalItems = usersResponse.meta.totalItems;
  const totalPages = usersResponse.meta.totalPages;
  const safePage = usersResponse.meta.page;
  const pagedUsers = usersResponse.items as unknown as AdminUserListItem[];

  const selectedUser = (
    userDetailsQuery.data
      ? ({
          ...userDetailsQuery.data,
          accountStatus: userDetailsQuery.data.accountStatus as AdminUserDetails["accountStatus"],
        } satisfies AdminUserDetails)
      : selectedUserId
        ? (MOCK_USER_DETAILS_BY_ID[selectedUserId] ?? null)
        : null
  ) as AdminUserDetails | null;

  const selectedRolePermissions = draftByRole[selectedRoleId] ?? new Set<string>();
  const sourceRolePermissions = new Set((rolePermissionsQuery.data?.permissions ?? []).map((p) => p.permissionId));
  const hasRolePermissionChanges =
    selectedRolePermissions.size !== sourceRolePermissions.size ||
    [...selectedRolePermissions].some((id) => !sourceRolePermissions.has(id));

  const updateRolePermissionsMutation = useUpdateRolePermissions();
  const createRoleMutation = useCreateAccessRole();
  const inviteUserMutation = useInviteUser();

  const toggleRolePermission = (permissionId: string) => {
    setDraftByRole((prev) => {
      const next = new Set(prev[selectedRoleId] ?? []);
      if (next.has(permissionId)) next.delete(permissionId);
      else next.add(permissionId);
      return { ...prev, [selectedRoleId]: next };
    });
  };

  const saveRolePermissionChanges = async () => {
    if (!selectedRoleId) return;
    await updateRolePermissionsMutation.mutateAsync({
      roleId: selectedRoleId,
      permissionIds: [...selectedRolePermissions],
    });
    toast.success("Role permissions saved.");
  };

  const createRole = async (name: string, description: string) => {
    const created = await createRoleMutation.mutateAsync({
      name: name.trim().toUpperCase(),
      description: description.trim() || `Role: ${name.trim().toUpperCase()}`,
    });
    const role: Role = {
      id: created.id,
      name: created.name,
      description: created.description,
    };
    setDraftByRole((prev) => ({ ...prev, [role.id]: new Set() }));
    setSelectedRoleId(role.id);
    toast.success(`Created role ${role.name}.`);
  };

  const inviteUser = async ({ email, roleId }: InvitePayload) => {
    const role = roles.find((item) => item.id === roleId);
    await inviteUserMutation.mutateAsync({ email, roleId });
    toast.success(`Invite sent to ${email} as ${role?.name ?? "role"}.`);
    setInviteOpen(false);
  };

  return (
    <UsersContext.Provider
      value={{
        activeTab,
        setActiveTab,
        search,
        setSearch,
        roleFilter,
        setRoleFilter,
        statusFilter,
        setStatusFilter,
        page: safePage,
        setPage,
        limit,
        totalItems,
        totalPages,
        pagedUsers,
        isUsersLoading: usersQuery.isLoading,
        selectedUserId,
        selectedUser,
        isUserDetailsLoading: userDetailsQuery.isLoading,
        setSelectedUserId,
        inviteOpen,
        setInviteOpen,
        roles,
        permissions,
        isRolesLoading: rolesQuery.isLoading,
        isPermissionsLoading: permissionsQuery.isLoading,
        selectedRoleId,
        selectedRolePermissions,
        rolePermissionDraft: selectedRolePermissions,
        hasRolePermissionChanges,
        setSelectedRoleId,
        toggleRolePermission,
        saveRolePermissionChanges,
        createRole,
        inviteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export function useAdminUsers() {
  const context = useContext(UsersContext);
  if (!context) throw new Error("useAdminUsers must be used within UsersProvider");
  return context;
}
