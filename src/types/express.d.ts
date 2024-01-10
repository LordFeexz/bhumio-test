import type { UserAttributes } from "src/interfaces/user";

declare global {
  namespace Express {
    interface Request {
      userCtx: UserAttributes;
    }
  }
}

export {};
