import { Test, type TestingModule } from '@nestjs/testing';
import { type INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { User } from '../../entities/user/user.entity';
import { UserGroup } from '../../entities/userGroup/userGroup.entity';
import { UserGroupService } from './userGroup.service';
import { randomUUID } from 'crypto';
import encryption from '../../utils/encryption';
import { Group } from '../../entities/group/group.entity';

describe('UserGroup Module', () => {
  let app: INestApplication;
  let user: User;
  let userGroup: UserGroup;
  let userGroupService: UserGroupService;
  let group: Group;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userGroupService = module.get<UserGroupService>(UserGroupService);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async() => {
    await app.close()
  })

  describe('Service', () => {
    beforeAll(async () => {
      user = await User.create({
        name: 'usserrnew',
        email: 'user@gmail.com',
        password: encryption.hashData('@Users123'),
        role: 'User',
      }).save();

      group = await Group.create({
        name: 'testing group',
      }).save();

      userGroup = await UserGroup.create({
        userId: user.id,
        groupId: group.id,
      }).save();
    });

    afterAll(async () => {
      await UserGroup.delete({});
      await Group.delete({ id: group.id });
      await User.delete({ id: user.id });
    });

    describe('findOneByUserId', () => {
      it('should return null', async () => {
        const data = await userGroupService.findOneByUserId(randomUUID());

        expect(data).toBeNull();
      });

      it('should return userGroup', async () => {
        const data = await userGroupService.findOneByUserId(user.id);

        expect(data).toBeInstanceOf(UserGroup);
      });
    });

    describe('createNewUserGroup', () => {
      let testUser: User;
      beforeEach(async () => {
        testUser = await User.create({
          name: 'testing',
          email: 'testinsertgroup@gmail.com',
          role: 'User',
          password: encryption.hashData('@Users123'),
        }).save();
      });

      afterEach(async () => {
        await UserGroup.delete({ userId: testUser.id });
        await User.delete({ id: testUser.id });
      });

      it('should return instanceOf UserGroup', async () => {
        const data = await userGroupService.createNewUserGroup({
          userId: testUser.id,
          groupId: group.id,
        });

        expect(data).toBeInstanceOf(UserGroup);
      });
    });

    describe('findByQuery', () => {
      it('should return array of userGroup and total', async () => {
        const [data, total] = await userGroupService.findByQuery({
          userId: user.id,
        });

        expect(total).toBeGreaterThanOrEqual(0);
        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toBeInstanceOf(UserGroup);
      });
    });

    describe('findByUserIds', () => {
      it('should return array of userGroup', async () => {
        const data = await userGroupService.findByUserIds([user.id]);

        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toBeInstanceOf(UserGroup);
      });
    });

    describe('findByGroupId', () => {
      it('should return array of userGroup', async () => {
        const data = await userGroupService.findByGroupId(group.id);

        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toBeInstanceOf(UserGroup);
      });
    });
  });
});
