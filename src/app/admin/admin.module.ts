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
import type { Request, Response, NextFunction } from "express";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminValidation, AdminService, AuthService, JwtService],
  controllers: [AdminController],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const superAdminOnly = AuthorizeRole(['Super Admin']);
    consumer
      .apply(Authentication, (req: Request, res: Response, next: NextFunction) => {
        superAdminOnly(req, res, next);
      })
      .forRoutes({ path: '/admin', method: RequestMethod.POST });
  }
}
