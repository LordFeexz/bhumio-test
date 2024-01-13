import { Test, type TestingModule } from '@nestjs/testing';
import { type INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { TransactionService } from './transaction.service';
import { User } from '../../entities/user/user.entity';
import encryption from '../../utils/encryption';
import { Transaction } from '../../entities/transaction/transaction.entity';
import { randomUUID } from 'crypto';
import { type SinonSandbox, createSandbox, assert } from 'sinon';
import { UserGroupService } from '../userGroup/userGroup.service';

describe('Transaction Module', () => {
  let app: INestApplication;
  let transactionService: TransactionService;
  let user: User;
  let transaction: Transaction;
  let sandbox: SinonSandbox;
  let userGroupService: UserGroupService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    userGroupService = module.get<UserGroupService>(UserGroupService);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Service', () => {
    beforeAll(async () => {
      user = await User.create({
        name: 'usserrnew',
        email: 'user@gmail.com',
        password: encryption.hashData('@Users123'),
        role: 'User',
      }).save();

      transaction = await transactionService.createTransaction({
        type: 'Purchase',
        userId: user.id,
      });
    });

    afterAll(async () => {
      await Transaction.delete({});
      await User.query(`DELETE FROM "Users" WHERE name = 'usserrnew'`);
    });

    beforeEach(() => {
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    describe('createTransaction', () => {
      it('should return transaction', async () => {
        const transaction = await transactionService.createTransaction({
          type: 'Top Up',
          userId: user.id,
        });

        expect(transaction).toBeInstanceOf(Transaction);
      });
    });

    describe('findById', () => {
      it('should return null', async () => {
        const data = await transactionService.findById(randomUUID());

        expect(data).toBeNull();
      });

      it('should return transaction', async () => {
        const data = await transactionService.findById(transaction.id);

        expect(data).toBeInstanceOf(Transaction);
      });
    });

    describe('findByUserId', () => {
      it('should return empty array', async () => {
        const [data, total] =
          await transactionService.findByUserId(randomUUID());

        expect(total).toEqual(0);
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toEqual(0);
      });

      it('should return array of transactions', async () => {
        const [data, total] = await transactionService.findByUserId(user.id);

        expect(total).toBeGreaterThan(0);
        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toBeInstanceOf(Transaction);
      });
    });

    describe('findAllPerUserGroup', () => {
      it('should return empty array', async () => {
        const [data, total] = await transactionService.findAllPerUserGroup([
          randomUUID(),
        ]);

        expect(total).toEqual(0);
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toEqual(0);
      });

      it('should return array of transactions', async () => {
        const [data, total] = await transactionService.findAllPerUserGroup([
          user.id,
        ]);

        expect(total).toBeGreaterThan(0);
        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toBeInstanceOf(Transaction);
      });
    });

    describe('findAllTransaction', () => {
      it('should return array of transactions', async () => {
        const [data, total] = await transactionService.findAllTransaction();

        expect(total).toBeGreaterThan(0);
        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toBeInstanceOf(Transaction);
      });
    });
  });
});
