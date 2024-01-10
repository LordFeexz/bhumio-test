import {
  Injectable,
  type NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user/user.entity';
import { UserRepository } from '../entities/user/user.repository';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class Authentication implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const sessionToken = req.session.user;
    if (!sessionToken) throw new UnauthorizedException('Invalid Session');

    const { id } = this.authService.validateSessionToken(sessionToken);

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('Invalid Session');

    req.userCtx = user;

    next()
  }
}
