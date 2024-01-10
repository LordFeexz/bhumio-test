import { ForbiddenException } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../interfaces/user";

export function AuthorizeRole(allowed: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.userCtx;

    for (const userRole of allowed) if (role === userRole) return next();

    throw new ForbiddenException("Forbidden");
  };
}
