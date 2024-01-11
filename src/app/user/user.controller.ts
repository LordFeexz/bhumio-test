import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
  Req,
  Patch,
  Query,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import type {
  TokenVerifyPayload,
  UserLoginPayload,
} from "../../interfaces/user";
import { UserService } from "./user.service";
import { UserValidation } from "./user.validation";
import encryption from "../../utils/encryption";
import type { Response, Request } from "express";
import { TokenVerifyPipe } from "../../pipes/parseToken";
import { DEFAULT_USER_PASSWORD } from "../../constant/user.constant";

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

  @Patch("/verify")
  public async verifyAndAddPass(
    @Query(TokenVerifyPipe) { id }: TokenVerifyPayload,
    @Body() payload: any
  ) {
    const { password } = await this.userValidation.validateVerifyUser(payload);

    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException("user not found");

    if (user.password !== DEFAULT_USER_PASSWORD) throw new ForbiddenException();

    user.password = encryption.hashData(password);
    await user.save();

    return { message: "success" };
  }
}
