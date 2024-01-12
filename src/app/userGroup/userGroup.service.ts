import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroup } from '../../entities/userGroup/userGroup.entity';
import { UserGroupRepository } from '../../entities/userGroup/userGroup.repository';
import type { NewUserGroupPayload } from '../../interfaces/userGroup';
import { In, type FindOptionsWhere } from 'typeorm';
import type { DbOpts } from '../../interfaces';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepo: UserGroupRepository,
  ) {}

  public async findOneByUserId(userId: string, opts?: DbOpts) {
    return await this.userGroupRepo.findOne({ ...opts, where: { userId } });
  }

  public async createNewUserGroup(payload: NewUserGroupPayload, opts?: DbOpts) {
    return await this.userGroupRepo.create({ ...payload }).save({ ...opts });
  }

  public async findByQuery(query: FindOptionsWhere<UserGroup>, opts?: DbOpts) {
    return await this.userGroupRepo.findAndCount({ ...opts, where: query });
  }

  public async findByUserIds(userIds: string[]) {
    return await this.userGroupRepo.findBy({ userId: In(userIds) });
  }

  public async findByGroupId(groupId: string) {
    return await this.userGroupRepo.findBy({ groupId });
  }
}
