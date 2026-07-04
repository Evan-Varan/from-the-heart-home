import type { UserRole } from "./index";

// Extend Clerk's type so publicMetadata.role is typed throughout the codebase.
// The role value is set by admins via the Clerk dashboard or webhook (spec 02).
declare global {
  interface UserPublicMetadata {
    role?: UserRole;
  }
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: UserRole;
    };
  }
}
