import {
  Controller,
  Post,
  Body,
  ConflictException,
  Patch,
  Param,
  NotFoundException,
  ForbiddenException,
  Req,
  HttpCode,
} from "@nestjs/common";
import { AdminValidation } from "./admin.validation";
import type { CreateAdminInput } from "../../interfaces/admin";
import { AdminService } from "./admin.service";
import { ParseToGroup } from "../../pipes/parseToGroup";
import { Group } from "../../entities/group/group.entity";
import { ParseToAdmin } from "../../pipes/parseToAdmin";
import { User } from "../../entities/user/user.entity";
import { UserGroupService } from "../userGroup/userGroup.service";
import type { Request } from "express";
import DataSource from "../../data-source";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserGroup } from "../../entities/userGroup/userGroup.entity";
import { EmailService } from "../../utils/email";
import { JwtService } from "@nestjs/jwt";

@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminValidation: AdminValidation,
    private readonly adminService: AdminService,
    private readonly userGroupService: UserGroupService,
    private readonly mailerService: EmailService,
    @InjectDataSource()
    private readonly dataSource: typeof DataSource,
    private readonly jwtService: JwtService
  ) {}

  @Post()
  @HttpCode(201)
  public async createAdmin(@Body() payload: CreateAdminInput) {
    const {
      name,
      email,
      role,
    } = await this.adminValidation.validateCreateAdmin(payload);

    if (await this.adminService.isExists(email)) throw new ConflictException();

    return {
      message: "success",
      data: await this.adminService.createDefaultAdmin({
        name,
        email,
        role,
      }),
    };
  }

  @Post("/user/:groupId")
  @HttpCode(201)
  public async createUser(
    @Body() payload: CreateAdminInput,
    @Param("groupId", ParseToGroup) group: Group | null,
    @Req() req: Request
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      if (!group) throw new NotFoundException("group not found");

      const { id } = req.userCtx;
      if (
        !(await this.userGroupService.findOneByUserId(id, {
          transaction: false,
        }))
      )
        throw new ForbiddenException();

      const {
        name,
        email,
        role,
      } = await this.adminValidation.validateCreateUser(payload);

      if (
        await this.adminService.isExists(email, {
          transaction: false,
          lock: { mode: "pessimistic_write" },
        })
      )
        throw new ConflictException("email is already register");

      const userRepo = queryRunner.manager.getRepository(User);
      const userGroupRepo = queryRunner.manager.getRepository(UserGroup);

      const user = await queryRunner.manager.save(
        userRepo.create({
          name,
          email,
          role,
        })
      );

      await queryRunner.manager.save(
        userGroupRepo.create({
          groupId: group.id,
          userId: user.id,
        })
      );

      this.mailerService.sendEmail(
        email,
        "Account Verification",
        `<button>
        <a href="http://localhost:3000/api/v1/user/verify?token=${this.jwtService.sign(
          {
            id: user.id,
            role: user.role,
            name: user.name,
          },
          { secret: process.env.TOKEN_SECRET }
        )}" style="display: inline-block; padding: 10px 20px; color: white; background-color: blue; text-decoration: none;">Verify And Add Password</a>
        </button>`
      );

      await queryRunner.commitTransaction();
      return { message: "success", data: user };
    } catch (err) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  @Patch("/:adminId/:groupId")
  @HttpCode(201)
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
