import {
  type MiddlewareConsumer,
  Module,
  RequestMethod,
  type NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../../entities/group/group.entity';
import { UserGroup } from '../../entities/userGroup/userGroup.entity';
import { GroupValidation } from './group.validation';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Authentication } from '../../middlewares/authentication.middleware';
import { AuthorizeRole } from '../../middlewares/authorizeRole';
import { User } from '../../entities/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, UserGroup,User])],
  providers: [GroupValidation, AuthService, JwtService, GroupService],
  controllers: [GroupController],
})
export class GroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Authentication, AuthorizeRole(['Super Admin']))
      .forRoutes({ path: '/group', method: RequestMethod.POST });
  }
}
