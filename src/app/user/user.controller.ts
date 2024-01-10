import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
  Req,
} from "@nestjs/common";
import type { UserLoginPayload } from "../../interfaces/user";
import { UserService } from "./user.service";
import { UserValidation } from "./user.validation";
import encryption from "../../utils/encryption";
import type { Response, Request } from "express";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userValidation: UserValidation
  ) {}

  @Post("/login")
  public async loginHandler(
    @Body() payload: UserLoginPayload,
    @Res() res: Response,
    @Req() req: Request
  ) {
    if (req.session.user)
      throw new UnauthorizedException("Another session still active");

    const { email, password } = await this.userValidation.validateUserLogin(
      payload
    );

    const user = await this.userService.findOneByEmail(email);
    if (!user || !encryption.compareHash(password, user.password))
      throw new UnauthorizedException("invalid email/password");

    req.session.user = this.userService.createSession(user);

    return res.status(200).json({ message: "success" });
  }
}
