import {
  Controller,
  Post,
  Body,
  ConflictException,
  Patch,
  Param,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { AdminValidation } from "./admin.validation";
import type { CreateAdminInput } from "../../interfaces/admin";
import { AdminService } from "./admin.service";
import { ParseToGroup } from "./pipes/parseToGroup";
import { Group } from "../../entities/group/group.entity";
import { ParseToAdmin } from "./pipes/parseToAdmin";
import { User } from "../../entities/user/user.entity";
import { UserGroupService } from "../userGroup/userGroup.service";

@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminValidation: AdminValidation,
    private readonly adminService: AdminService,
    private readonly userGroupService: UserGroupService
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

  @Patch("/:adminId/:groupId")
  public async assignAdmin(
    @Param("adminId", ParseToAdmin) admin: User | null,
    @Param("groupId", ParseToGroup) group: Group | null
  ) {
    if (!group) throw new NotFoundException("group not found");
    if (!admin) throw new NotFoundException("admin not found");

    if (admin.role !== "Admin") throw new ForbiddenException();

    if (await this.userGroupService.findOneByUserId(admin.id))
      throw new ConflictException();

    return {
      message: "success",
      data: await this.userGroupService.createNewUserGroup({
        userId: admin.id,
        groupId: group.id,
      }),
    };
  }
}
