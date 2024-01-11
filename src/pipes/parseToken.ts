import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenVerifyPipe implements PipeTransform {
  constructor(private readonly jwtService: JwtService) {}

  transform({ token }: { token: string }) {
    try {
      if (!token) throw new BadRequestException('Invalid Token');

      return this.jwtService.verify(token, {
        secret: process.env.TOKEN_SECRET,
      });
    } catch (err) {
      throw new BadRequestException('Invalid Token');
    }
  }
}
