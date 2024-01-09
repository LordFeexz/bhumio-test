import { Injectable } from "@nestjs/common";
import type { AuthPayload } from "src/interfaces/auth";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  createSessionByToken(payload: AuthPayload) {
    return this.jwtService.sign(
      { ...payload },
      { secret: process.env.TOKEN_SECRET }
    );
  }

  validateSessionToken(token: string) {
    return this.jwtService.verify(token, { secret: process.env.TOKEN_SECRET });
  }
}
