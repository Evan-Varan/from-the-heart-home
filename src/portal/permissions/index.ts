import { ForbiddenError, UnauthorizedError } from "../lib/errors";
import type { UserRole } from "../types";

const ROLE_RANK: Record<UserRole, number> = {
  admin: 100,
  tutor: 50,
  family: 10,
};

export function assertAuthenticated(userId: string | null | undefined): asserts userId is string {
  if (!userId) throw new UnauthorizedError();
}

export function assertRole(actual: UserRole, required: UserRole): void {
  if (ROLE_RANK[actual] < ROLE_RANK[required]) {
    throw new ForbiddenError();
  }
}

export function assertAdmin(role: UserRole): void {
  assertRole(role, "admin");
}

export function canAccessFamily(actorRole: UserRole, actorId: string, familyId: string): boolean {
  if (actorRole === "admin") return true;
  if (actorRole === "family") return actorId === familyId;
  return false;
}

export function assertFamilyAccess(actorRole: UserRole, actorId: string, familyId: string): void {
  if (!canAccessFamily(actorRole, actorId, familyId)) {
    throw new ForbiddenError();
  }
}
