import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Group } from "../../entities/group/group.entity";
import { GroupRepository } from "../../entities/group/group.repository";

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: GroupRepository
  ) {}

  public async isExists(name: string) {
    return await this.groupRepo.exists({ where: { name } });
  }

  public async createGroup(name: string) {
    return await this.groupRepo.create({ name }).save();
  }

  public async getById(id: string) {
    return await this.groupRepo.findOne({ where: { id } });
  }
}
