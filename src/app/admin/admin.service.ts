import { UserRepository } from "../../entities/user/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user/user.entity";
import { Injectable } from "@nestjs/common";
import type { CreateAdminInput } from "../../interfaces/admin";
import encryption from "../../utils/encryption";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository
  ) {}

  public async createDefaultAdmin({ email, name }: CreateAdminInput) {
    return await this.userRepo
      .create({
        name,
        email,
        password: encryption.hashData("Default@123"),
        role: "Admin",
      })
      .save();
  }

  public async isExists(email: string) {
    return await this.userRepo.exists({ where: { email } });
  }
}
