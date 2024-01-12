import {
  MiddlewareConsumer,
  Module,
  type NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user/user.entity';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';
import { AdminService } from './admin.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthorizeRole } from '../../middlewares/authorizeRole';
import { Authentication } from '../../middlewares/authentication.middleware';
import type { Request, Response, NextFunction } from 'express';
import { Group } from '../../entities/group/group.entity';
import { GroupService } from '../group/group.service';
import { UserGroup } from '../../entities/userGroup/userGroup.entity';
import { UserGroupService } from '../userGroup/userGroup.service';
import { EmailService } from '../../utils/email';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group, UserGroup])],
  providers: [
    AdminValidation,
    AdminService,
    AuthService,
    JwtService,
    GroupService,
    UserGroupService,
    EmailService,
  ],
  controllers: [AdminController],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Authentication, AuthorizeRole(['Super Admin']))
      .forRoutes(
        { path: '/admin', method: RequestMethod.POST },
        { path: '/admin/:adminId/:groupId', method: RequestMethod.PATCH },
      )
      .apply(Authentication, AuthorizeRole(['Admin']))
      .forRoutes({ path: '/admin/user/:groupId', method: RequestMethod.POST });
  }
}
