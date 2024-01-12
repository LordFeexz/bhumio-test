import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  type NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../entities/transaction/transaction.entity';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AuthorizeRole } from '../../middlewares/authorizeRole';
import { Authentication } from '../../middlewares/authentication.middleware';
import { TransactionValidation } from './transaction.validation';
import { User } from '../../entities/user/user.entity';
import { UserGroupService } from '../userGroup/userGroup.service';
import { UserGroup } from '../../entities/userGroup/userGroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, UserGroup])],
  providers: [
    AuthService,
    JwtService,
    TransactionService,
    TransactionValidation,
    UserGroupService,
  ],
  controllers: [TransactionController],
})
export class TransactionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Authentication)
      .forRoutes(
        { path: '/transaction', method: RequestMethod.ALL },
        { path: '/transaction/*', method: RequestMethod.ALL },
      )
      .apply(AuthorizeRole(['User']))
      .forRoutes(
        { path: '/transaction', method: RequestMethod.POST },
        { path: '/transaction', method: RequestMethod.GET },
        { path: '/transaction/:transactionId', method: RequestMethod.DELETE },
      )
      .apply(AuthorizeRole(['Admin']))
      .forRoutes({
        path: '/transaction/:transactionId',
        method: RequestMethod.PATCH,
      })
      .apply(AuthorizeRole(['Power User', 'Support Desk', 'Admin']))
      .forRoutes({ path: '/transaction/all', method: RequestMethod.GET })
      .apply(AuthorizeRole(['Admin', 'Power User', 'Support Desk', 'User']))
      .forRoutes({
        path: '/transaction/:transactionId',
        method: RequestMethod.GET,
      });
  }
}
