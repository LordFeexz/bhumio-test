import type { UserAttributes } from "../interfaces/user";

declare global {
  namespace Express {
    interface Request {
      userCtx: UserAttributes;
    }
  }
}

export {};
