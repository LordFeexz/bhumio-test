import { Test, TestingModule } from '@nestjs/testing';
import { type INestApplication } from '@nestjs/common';
import { config } from 'dotenv';
import { AppModule } from '../../app.module';
import { AuthService } from './auth.service';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import type { AuthPayload } from '../../interfaces/auth';
import { createSandbox, type SinonSandbox, assert } from 'sinon';

config();

describe('Auth Module', () => {
  let app: INestApplication;
  let authService: AuthService;
  let jwtService: JwtService;
  let sandbox: SinonSandbox;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    app = module.createNestApplication();
    await app.init();
  });

  //service
  describe('Service', () => {
    beforeEach(() => {
        sandbox = createSandbox()
      })
    
      afterEach(() => {
        sandbox.restore()
      })

    const payload: AuthPayload = {
      email: 'tes@gmail.com',
      name: 'tes',
      id: randomUUID(),
      role: 'User',
    };

    it('createSessionByToken should return token string', () => {
      const mockValue = 'mockToken';
      const stubbed = sandbox.stub(jwtService, 'sign').returns(mockValue);

      const token = authService.createSessionByToken(payload);

      expect(token).toEqual(mockValue);
      assert.calledOnce(stubbed);
      assert.calledWith(stubbed, payload, { secret: process.env.TOKEN_SECRET });
    });

    it('validateSessionToken should thrown error', () => {
      const invalidToken =
        'eyedssdskfsfsdjf.fsdfjsdfsdifuhnvdvkf==.fsdfsfsc===';
      const call = sandbox.stub(authService, 'validateSessionToken');

      try {
        call(invalidToken);
      } catch (err) {
        assert.threw(call);
      }
    });

    it('validateSessionToken should return value', () => {
      const token = authService.createSessionByToken(payload);

      const value = authService.validateSessionToken(token)
      expect(value).toBeInstanceOf(Object);
    });
  });
});
