import { Injectable } from "@nestjs/common";
import * as yup from "yup";
import BaseValidation from "../../base/validation";
import type { UserLoginPayload } from "../../interfaces/user";

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

  public async validateVerifyUser(data: any) {
    return await this.validate<{ password: string; confirmPassword: string }>(
      yup
        .object()
        .shape({
          password: yup
            .string()
            .required("password is required")
            .test(this.passwordValidation),
          confirmPassword: yup.string().required("confirmPassword is required"),
        })
        .test(
          "is same",
          "password and confirmPassword doesnt match",
          ({ password, confirmPassword }) => password === confirmPassword
        ),
      data
    );
  }
}
