import { Controller, Post, Body, ConflictException } from "@nestjs/common";
import { AdminValidation } from "./admin.validation";
import type { CreateAdminInput } from "../../interfaces/admin";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminValidation: AdminValidation,
    private readonly adminService: AdminService
  ) {}

  @Post()
  public async createAdmin(@Body() payload: CreateAdminInput) {
    const { name, email } = await this.adminValidation.validateCreateAdmin(
      payload
    );

    if (await this.adminService.isExists(email)) throw new ConflictException();

    return {
      message: "success",
      data: await this.adminService.createDefaultAdmin({ name, email }),
    };
  }
}
