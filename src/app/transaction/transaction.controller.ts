import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionValidation } from "./transaction.validation";
import type { Request } from "express";
import { Transaction } from "../../entities/transaction/transaction.entity";
import { ParseToTransaction } from "../../pipes/parseToTransaction";

@Controller("transaction")
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionValidation: TransactionValidation
  ) {}

  @Post()
  @HttpCode(201)
  public async createTransaction(@Body() payload: any, @Req() req: Request) {
    const { type } = await this.transactionValidation.validateCreateTransaction(
      payload
    );

    const { id } = req.userCtx;

    return {
      message: "success",
      data: await this.transactionService.createTransaction({
        type,
        userId: id,
      }),
    };
  }

  @Delete(":transactionId")
  public async cancelTransaction(
    @Param("transactionId", ParseToTransaction) transaction: Transaction | null,
    @Req() req: Request
  ) {
    if (!transaction) throw new NotFoundException("transaction not found");

    const { id } = req.userCtx;
    if (transaction.userId !== id) throw new ForbiddenException();

    this.transactionValidation.validateChangeStatus(transaction.status);

    transaction.status = "Cancel";
    await transaction.save();

    return { message: "success" };
  }

  @Patch(":transactionId")
  public async adminSetSuccess(
    @Param("transactionId", ParseToTransaction) transaction: Transaction | null
  ) {
    if (!transaction) throw new NotFoundException("transaction not found");
    this.transactionValidation.validateChangeStatus(transaction.status);

    transaction.status = "Success";
    await transaction.save();

    return { message: "success" };
  }
}
