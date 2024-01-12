import { Injectable } from "@nestjs/common";
import type { AuthPayload } from "../../interfaces/auth";
import { JwtService } from "@nestjs/jwt";
import type { jwtValue } from "../../interfaces";
import { v4 } from "uuid";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public createSessionByToken(payload: AuthPayload) {
    return this.jwtService.sign(
      { ...payload, jwtId: this.createJwtId() },
      { secret: process.env.TOKEN_SECRET }
    );
  }

  public validateSessionToken<T = jwtValue>(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.TOKEN_SECRET,
    }) as T;
  }

  public createJwtId() {
    return v4();
  }
}
