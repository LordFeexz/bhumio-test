import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserGroup } from "../../entities/userGroup/userGroup.entity";
import { UserGroupRepository } from "../../entities/userGroup/userGroup.repository";
import type { NewUserGroupPayload } from "../../interfaces/userGroup";

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepo: UserGroupRepository
  ) {}

  public async findOneByUserId(userId: string) {
    return await this.userGroupRepo.findOne({ where: { userId } });
  }

  public async createNewUserGroup(payload: NewUserGroupPayload) {
    return await this.userGroupRepo.create({ ...payload }).save();
  }
}
