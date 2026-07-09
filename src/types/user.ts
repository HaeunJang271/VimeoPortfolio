export type UserRole = "admin";

export interface AdminRecord {
  uid: string;
  email: string;
  role: UserRole;
  created_at?: string;
}
