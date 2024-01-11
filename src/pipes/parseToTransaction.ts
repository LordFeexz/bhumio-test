import { Injectable, type PipeTransform } from '@nestjs/common';
import { TransactionService } from '../app/transaction/transaction.service';

@Injectable()
export class ParseToTransaction implements PipeTransform {
  constructor(private readonly transactionService: TransactionService) {}

  public async transform(value: any) {
    return await this.transactionService.findById(value);
  }
}
