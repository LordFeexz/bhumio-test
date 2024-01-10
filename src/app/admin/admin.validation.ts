import { Injectable } from "@nestjs/common";
import * as yup from "yup";
import BaseValidation from "../../base/validation";
import type { CreateAdminInput } from "../../interfaces/admin";

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
      }),
      data
    );
  }
}
