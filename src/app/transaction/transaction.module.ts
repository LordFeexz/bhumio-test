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

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User])],
  providers: [
    AuthService,
    JwtService,
    TransactionService,
    TransactionValidation,
  ],
  controllers: [TransactionController],
})
export class TransactionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const userOnly = AuthorizeRole(['User']);
    const adminOnly = AuthorizeRole(['Admin']);
    consumer
      .apply(Authentication, userOnly)
      .forRoutes(
        { path: '/transaction', method: RequestMethod.POST },
        { path: '/transaction/:transactionId', method: RequestMethod.DELETE },
      );

    consumer
      .apply(Authentication, adminOnly)
      .forRoutes({
        path: '/transaction/:transactionId',
        method: RequestMethod.PATCH,
      });
  }
}
