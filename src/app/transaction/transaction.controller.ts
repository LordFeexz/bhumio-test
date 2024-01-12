import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionValidation } from './transaction.validation';
import type { Request } from 'express';
import { Transaction } from '../../entities/transaction/transaction.entity';
import { ParseToTransaction } from '../../pipes/parseToTransaction';
import {
  PaginationQuery,
  type PaginationQueryProps,
} from '../../pipes/parseQuery';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionValidation: TransactionValidation,
  ) {}

  @Post()
  @HttpCode(201)
  public async createTransaction(@Body() payload: any, @Req() req: Request) {
    const { type } =
      await this.transactionValidation.validateCreateTransaction(payload);

    const { id } = req.userCtx;

    return {
      message: 'success',
      data: await this.transactionService.createTransaction({
        type,
        userId: id,
      }),
    };
  }

  @Get()
  public async getMyTransaction(
    @Req() req: Request,
    @Query(PaginationQuery) { page, limit, sort }: PaginationQueryProps,
  ) {
    const { id } = req.userCtx;

    const [data, total] = await this.transactionService.findByUserId(
      id,
      (page - 1) * limit,
      limit,
      sort,
    );
    if (total < 1 || !data.length)
      throw new NotFoundException('data not found');

    return {
      message: 'OK',
      data,
      total,
      totalPage: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  @Get('/all')
  public async findAll(
    @Req() req: Request,
    @Query(PaginationQuery) { page, limit, sort }: PaginationQueryProps,
  ) {
    const { id, role } = req.userCtx;

    const [data, total] =
      role === 'Support Desk'
        ? await this.transactionService.findAllTransaction(
            (page - 1) * limit,
            limit,
            sort,
          )
        : await this.transactionService.findAllGroupTransaction(
            id,
            (page - 1) * limit,
            limit,
            sort,
          );
    if (total < 1 || !data.length)
      throw new NotFoundException('data not found');

    return {
      message: 'OK',
      data,
      total,
      totalPage: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  @Get(':transactionId')
  public async getById(
    @Param('transactionId', ParseToTransaction) transaction: Transaction | null,
    @Req() req: Request,
  ) {
    if (!transaction) throw new NotFoundException('transaction not found');

    const { role, id } = req.userCtx;
    if (role === 'User' && id !== transaction.userId)
      throw new ForbiddenException();

    return { message: 'OK', data: transaction };
  }

  @Delete(':transactionId')
  public async cancelTransaction(
    @Param('transactionId', ParseToTransaction) transaction: Transaction | null,
    @Req() req: Request,
  ) {
    if (!transaction) throw new NotFoundException('transaction not found');

    const { id } = req.userCtx;
    if (transaction.userId !== id) throw new ForbiddenException();

    this.transactionValidation.validateChangeStatus(transaction.status);

    transaction.status = 'Cancel';
    await transaction.save();

    return { message: 'success' };
  }

  @Patch(':transactionId')
  public async adminSetSuccess(
    @Param('transactionId', ParseToTransaction) transaction: Transaction | null,
  ) {
    if (!transaction) throw new NotFoundException('transaction not found');
    this.transactionValidation.validateChangeStatus(transaction.status);

    transaction.status = 'Success';
    await transaction.save();

    return { message: 'success' };
  }
}
