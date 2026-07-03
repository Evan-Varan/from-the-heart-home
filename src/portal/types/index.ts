export type UserId = string;
export type FamilyId = string;
export type TutorId = string;
export type SessionId = string;
export type BookingId = string;
export type InvoiceId = string;
export type FileId = string;

export type UserRole = "admin" | "tutor" | "family";

export type EntityType =
  | "user"
  | "family"
  | "tutor"
  | "session"
  | "booking"
  | "invoice"
  | "file"
  | "message";
