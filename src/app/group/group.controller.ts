import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from "@nestjs/common";
import { GroupValidation } from "./group.validation";
import { GroupService } from "./group.service";

@Controller("group")
export class GroupController {
  constructor(
    private readonly groupValidation: GroupValidation,
    private readonly groupService: GroupService
  ) {}

  @Post()
  @HttpCode(201)
  public async createGroup(@Body() payload: { name: string }) {
    const { name } = await this.groupValidation.validateCreateGroup(payload);

    if (await this.groupService.isExists(name)) throw new ConflictException();

    return {
      message: "success",
      data: await this.groupService.createGroup(name),
    };
  }
}
