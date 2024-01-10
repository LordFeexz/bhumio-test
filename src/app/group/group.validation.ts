import { Injectable } from "@nestjs/common";
import * as yup from "yup";
import BaseValidation from "../../base/validation";

@Injectable()
export class GroupValidation extends BaseValidation {
  public async validateCreateGroup(data: any) {
    return await this.validate<{ name: string }>(
      yup.object().shape({
        name: yup.string().required("name is required"),
      }),
      data
    );
  }
}
