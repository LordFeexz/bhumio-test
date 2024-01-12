import { Test, type TestingModule } from '@nestjs/testing';
import { User } from '../../entities/user/user.entity';
import encryption from '../../utils/encryption';
import { type INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { config } from 'dotenv';
import { UserService } from './user.service';
import { randomUUID } from 'crypto';

config();

describe('User Module', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = module.get<UserService>(UserService);
    app = module.createNestApplication();
    await app.init();
  });

  describe('Service', () => {
    let user: User;
    beforeAll(async () => {
      user = await User.create({
        name: 'usserrnew',
        email: 'user@gmail.com',
        password: encryption.hashData('@Users123'),
        role: 'User',
      }).save();
    });

    afterAll(async () => {
      await User.query(`DELETE FROM "Users" WHERE name = 'usserrnew'`);
    });

    describe('findOneByEmail', () => {
      it('should return null / falsy', async () => {
        const data = await userService.findOneByEmail('test@gmail.com');

        expect(data).toBeFalsy();
      });

      it('should return User', async () => {
        const data = await userService.findOneByEmail('user@gmail.com');

        expect(data).toHaveProperty('password', expect.any(String));
        expect(data).toHaveProperty('email', user.email);
        expect(data).toHaveProperty('role', user.role);
        expect(data).toHaveProperty('id', user.id);
      });
    });

    describe('createSession', () => {
      it('should return token string', async () => {
        const user = await userService.findOneByEmail('user@gmail.com');
        const token = userService.createSession(user);

        expect(token).toBeTruthy();
      });
    });

    describe('findById', () => {
      it('should return null', async () => {
        const data = await userService.findById(randomUUID());

        expect(data).toBeNull();
      });

      it('should return user', async () => {
        const data = await userService.findById(user.id);

        expect(data).toBeInstanceOf(User);
      });
    });
  });
});
