export interface CreateAdminInput {
  name: string;
  email: string;
  role: "Admin" | "Support Desk";
}
