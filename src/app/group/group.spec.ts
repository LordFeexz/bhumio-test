import { Test, type TestingModule } from '@nestjs/testing';
import { type INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { GroupService } from './group.service';
import { Group } from '../../entities/group/group.entity';
import { randomUUID } from 'crypto';

describe('Group Module', () => {
  let app: INestApplication;
  let groupService: GroupService;
  let group: Group;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    groupService = module.get<GroupService>(GroupService);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Service', () => {
    beforeEach(async () => {
      group = await Group.create({
        name: 'testing group',
      }).save();
    });

    afterEach(async () => {
      await Group.delete({ id: group.id });
    });

    describe('isExists', () => {
      it('should return boolean', async () => {
        const result = await groupService.isExists('tes group');

        expect(typeof result).toBe('boolean');
      });
    });

    describe('createGroup', () => {
      it('should return instanceof Group', async () => {
        const data = await groupService.createGroup('testingCreate');

        expect(data).toBeInstanceOf(Group);
      });
    });

    describe('getById', () => {
      it('should return null', async () => {
        const data = await groupService.getById(randomUUID());

        expect(data).toBeNull();
      });

      it('should return Group', async () => {
        const data = await groupService.getById(group.id);

        expect(data).toBeInstanceOf(Group);
      });
    });
  });
});
