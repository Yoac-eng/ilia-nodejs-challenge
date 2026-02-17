import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import { CreateTransactionUseCase } from '../application/useCases/create-transaction.use-case';
import { GetTransactionsUseCase } from '../application/useCases/get-transactions.use-case';
import { AuthenticatedUserId } from '../common/auth/authenticated-user-id.decorator';
import { ZodValidationPipe } from '../common/pipe/zod-validation.pipe';
import { TransactionType } from '../domain/enum/transaction-type.enum';

import {
  type CreateTransactionHeadersDto,
  createTransactionHeadersSchema,
} from './dtos/create-transaction-headers.dto';
import {
  type CreateTransactionDto,
  createTransactionSchema,
} from './dtos/create-transaction.dto';
import {
  type GetTransactionsQueryDto,
  getTransactionsQuerySchema,
} from './dtos/get-transactions-query.dto';

@Controller()
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
  ) {}

  @Post('transactions')
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @Body(new ZodValidationPipe(createTransactionSchema))
    input: CreateTransactionDto,
    @AuthenticatedUserId() authenticatedUserId: string,
    @Headers() rawHeaders: Record<string, string | string[] | undefined>,
  ) {
    if (input.user_id !== authenticatedUserId) {
      throw new ForbiddenException(
        'The informed user_id does not match the authenticated user.',
      );
    }

    const headers: CreateTransactionHeadersDto =
      createTransactionHeadersSchema.parse(rawHeaders);

    const transaction = await this.createTransactionUseCase.execute({
      userId: input.user_id,
      type: input.type,
      amount: input.amount,
      idempotencyKey: headers.idempotencyKey,
      description: input.description,
    });

    return transaction.toJson();
  }

  @Get('transactions')
  async getTransactions(
    @Query(new ZodValidationPipe(getTransactionsQuerySchema))
    query: GetTransactionsQueryDto,
    @AuthenticatedUserId() authenticatedUserId: string,
  ) {
    const type =
      query.type === TransactionType.CREDIT ||
      query.type === TransactionType.DEBIT
        ? query.type
        : undefined;

    const transactions = await this.getTransactionsUseCase.execute({
      userId: authenticatedUserId,
      type,
    });

    return transactions.map((transaction) => transaction.toJson());
  }
}
