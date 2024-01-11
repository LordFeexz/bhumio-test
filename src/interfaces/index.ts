import type { JwtPayload } from "jsonwebtoken";
import type { UserRole } from "./user";

export interface jwtValue extends JwtPayload {
  name: string;
  role: UserRole;
  id: string;
  email: string;
}

export interface DbOpts {
  transaction?: boolean;
  lock?:
    | {
        mode: "optimistic";
        version: number | Date;
      }
    | {
        mode:
          | "pessimistic_read"
          | "pessimistic_write"
          | "dirty_read"
          | "pessimistic_partial_write"
          | "pessimistic_write_or_fail"
          | "for_no_key_update"
          | "for_key_share";
        tables?: string[];
        onLocked?: "nowait" | "skip_locked";
      };
}
