export type UserRole =
  | "Super Admin"
  | "Admin"
  | "Power User"
  | "User"
  | "Support Desk";

export interface UserLoginPayload {
  email: string;
  password: string;
}
