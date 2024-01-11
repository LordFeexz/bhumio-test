import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserGroup } from "../../entities/userGroup/userGroup.entity";
import { UserGroupService } from "./userGroup.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserGroup])],
  providers: [UserGroupService],
  exports: [UserGroupService],
})
export class UserGroupModule {}
