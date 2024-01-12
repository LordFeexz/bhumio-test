import { Injectable } from "@nestjs/common";
import * as yup from "yup";
import BaseValidation from "../../base/validation";
import type { CreateAdminInput } from "../../interfaces/admin";
import type { CreateUserInput } from "src/interfaces/user";

@Injectable()
export class AdminValidation extends BaseValidation {
  public async validateCreateAdmin(data: any) {
    return await this.validate<CreateAdminInput>(
      yup.object().shape({
        email: yup
          .string()
          .required("email is required")
          .email("invalid email format"),
        name: yup.string().required("email is required"),
        role: yup
          .string()
          .required("role is required")
          .default("Admin")
          .oneOf(["Admin", "Support Desk"], "Invalid Role"),
      }),
      data
    );
  }

  public async validateCreateUser(data: any) {
    return await this.validate<CreateUserInput>(
      yup.object().shape({
        email: yup
          .string()
          .required("email is required")
          .email("invalid email format"),
        name: yup.string().required("email is required"),
        role: yup
          .string()
          .required("role is required")
          .oneOf(["Power User", "User"], "invalid role"),
      }),
      data
    );
  }
}
