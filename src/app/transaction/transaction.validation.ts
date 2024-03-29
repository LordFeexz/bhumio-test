import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import * as yup from "yup";
import BaseValidation from "../../base/validation";
import { TRANSACTION_TYPE } from "../../constant/transaction.constant";
import type {
  TransactionStatus,
  TransactionType,
} from "../../interfaces/transaction";

@Injectable()
export class TransactionValidation extends BaseValidation {
  public async validateCreateTransaction(data: any) {
    return await this.validate<{ type: TransactionType }>(
      yup.object().shape({
        type: yup
          .string()
          .required("type is required")
          .oneOf(TRANSACTION_TYPE, "invalid type"),
      }),
      data
    );
  }

  public async validateChangeStatus(status: TransactionStatus) {
    if (status === "Success")
      throw new BadRequestException("transaction already success");
    if (status === "Cancel")
      throw new ConflictException("transaction already canceled");
  }
}
