import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../entities/user/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user/user.entity";
import { AuthService } from "../auth/auth.service";
import type { AuthPayload } from "../../interfaces/auth";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService
  ) {}

  public async findOneByEmail(email: string) {
    return await this.userRepo
      .createQueryBuilder("u")
      .select(["u.password", "u.email", "u.name", "u.role", "u.id"])
      .where({ email })
      .getOne();
  }

  public createSession(payload: AuthPayload) {
    return this.authService.createSessionByToken(payload);
  }
}
