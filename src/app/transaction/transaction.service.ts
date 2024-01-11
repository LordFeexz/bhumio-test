import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "../../entities/transaction/transaction.entity";
import { TransactionRepository } from "../../entities/transaction/transaction.repository";
import type { TransactionType } from "../../interfaces/transaction";
import type { DbOpts } from "../../interfaces";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: TransactionRepository
  ) {}

  public async createTransaction(
    { type, userId }: { type: TransactionType; userId: string },
    DbOpts?: DbOpts
  ) {
    return await this.transactionRepo
      .create({ status: "Process", type, userId })
      .save({ ...DbOpts });
  }
}
