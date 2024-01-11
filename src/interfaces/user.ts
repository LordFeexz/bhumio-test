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

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: "Power User" | "User";
}
