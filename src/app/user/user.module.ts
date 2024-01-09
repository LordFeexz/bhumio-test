import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user/user.entity";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserValidation, AuthService, JwtService],
  controllers: [UserController],
})
export class UserModule {}
