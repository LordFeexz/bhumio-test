import { Injectable } from "@nestjs/common";
import * as yup from "yup";
import BaseValidation from "src/base/validation";
import { UserLoginPayload } from "src/interfaces/user";

@Injectable()
export class UserValidation extends BaseValidation {
  public async validateUserLogin(data: any) {
    return await this.validate<UserLoginPayload>(
      yup.object().shape({
        email: yup
          .string()
          .required("email is required")
          .email("invalid email format"),
        password: yup.string().required("password is required"),
      }),
      data
    );
  }
}
