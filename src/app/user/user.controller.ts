import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
} from "@nestjs/common";
import type { UserLoginPayload } from "src/interfaces/user";
import { UserService } from "./user.service";
import { UserValidation } from "./user.validation";
import encryption from "src/utils/encryption";
import type { Response } from "express";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userValidation: UserValidation
  ) {}

  @Post("/login")
  public async loginHandler(
    @Body() payload: UserLoginPayload,
    @Res() res: Response
  ) {
    const { email, password } = await this.userValidation.validateUserLogin(
      payload
    );

    const user = await this.userService.findOneByEmail(email);
    if (!user || !encryption.compareHash(password, user.password))
      throw new UnauthorizedException("invalid email/password");

    return res
      .status(200)
      .json({ message: "success", data: this.userService.createSession(user) });
  }
}
