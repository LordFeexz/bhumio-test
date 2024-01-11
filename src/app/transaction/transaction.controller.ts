import { Body, Controller, Post, Req } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionValidation } from "./transaction.validation";
import type { Request } from "express";

@Controller("transaction")
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionValidation: TransactionValidation
  ) {}

  @Post()
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
}
