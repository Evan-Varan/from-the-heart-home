// Server-only — audit events persist to the database added in spec 02.

import type { EntityType } from "../types";

export interface AuditEvent {
  actorId: string;
  entityType: EntityType;
  entityId: string;
  eventType: string;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
}

// Stub: wired to the DB in spec 02 when audit_events table is created.
export async function recordAuditEvent(event: AuditEvent): Promise<void> {
  void event;
}
