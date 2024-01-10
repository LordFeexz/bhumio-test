import type { JwtPayload } from "jsonwebtoken";
import type { UserRole } from "./user";

export interface jwtValue extends JwtPayload {
  name: string;
  role: UserRole;
  id: string;
  email: string;
}
