import { UserRepository } from "../../entities/user/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user/user.entity";
import { Injectable } from "@nestjs/common";
import type { CreateAdminInput } from "../../interfaces/admin";
import encryption from "../../utils/encryption";
import type { DbOpts } from "../../interfaces";
import type { CreateUserInput } from "../../interfaces/user";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository
  ) {}

  public async createDefaultAdmin(
    {
      email,
      name,
      role,
    }: CreateAdminInput & { role: "Admin" | "Support Desk" },
    opts?: DbOpts
  ) {
    return await this.userRepo
      .create({
        name,
        email,
        password: encryption.hashData("Default@123"),
        role,
      })
      .save({ ...opts });
  }

  public async isExists(email: string, opts?: DbOpts) {
    return await this.userRepo.exists({ ...opts, where: { email } });
  }

  public async getOneById(id: string, opts?: DbOpts) {
    return await this.userRepo.findOne({ ...opts, where: { id } });
  }

  public async createOneUser(payload: CreateUserInput, opts?: DbOpts) {
    return await this.userRepo.create({ ...payload }).save({ ...opts });
  }
}
