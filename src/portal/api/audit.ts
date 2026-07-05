// Server-only — audit events persist to the database (spec 02).
// Pass the DB instance in so callers control the connection; avoids circular deps.

import type { DB } from "../db/index";
import { audit_events } from "../db/schema";
import type { EntityType } from "../types";

export interface AuditEvent {
  actorId: string;
  entityType: EntityType;
  entityId: string;
  eventType: string;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
}

export async function recordAuditEvent(
  db: DB,
  event: AuditEvent,
): Promise<void> {
  const ts = event.timestamp ?? new Date();
  await db.insert(audit_events).values({
    actor_user_id: event.actorId,
    entity_type: event.entityType,
    entity_id: event.entityId,
    event_type: event.eventType,
    metadata: event.metadata ? JSON.stringify(event.metadata) : null,
    created_at: Math.floor(ts.getTime() / 1000),
  });
}
