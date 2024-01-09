import type { UserRole } from "./user";

export interface AuthSession {
  signature: string;
  id: string;
}

export interface AuthPayload {
  name: string;
  role: UserRole;
  id: string;
  email: string;
}
