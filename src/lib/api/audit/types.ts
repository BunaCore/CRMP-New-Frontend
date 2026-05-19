export type AuditAction = "CREATED" | "UPDATED" | "DELETED" | "LOGIN" | "PERMISSION_CHANGED" | "APPROVED" | "REJECTED";

export type AuditEntityType = "proposals" | "projects" | "users" | "budget" | "auth";

export interface AuditEntry {
  id: string;
  actorUserId: string;
  actorFullName: string;
  actorEmail: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  metadata: Record<string, string | number | boolean | null | undefined>;
  createdAt: string;
}

export interface CursorAuditResponse {
  items: AuditEntry[];
  next: string | null;
}

export interface AuditLogsQueryParams {
  search?: string;
  entityType?: AuditEntityType;
  action?: AuditAction;
  limit?: number;
}

export interface AuditStatsResponse {
  totalEvents: number;
  activeActors: number;
  topAction: {
    action: AuditAction;
    count: number;
  };
  mostRecentActivity: string;
}
