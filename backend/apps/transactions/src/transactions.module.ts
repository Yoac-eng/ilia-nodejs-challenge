import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { CreateTransactionUseCase } from './application/useCases/create-transaction.use-case';
import { GetBalanceUseCase } from './application/useCases/get-balance.use-case';
import { GetTransactionsUseCase } from './application/useCases/get-transactions.use-case';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { BalanceController } from './controllers/balance.controller';
import { TransactionsController } from './controllers/transactions.controller';
import { HttpUserProvider } from './infra/providers/http-user.provider';
import { PrismaTransactionRepository } from './infra/repositories/prisma-transaction.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.INTERNAL_JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TransactionsController, BalanceController],
  providers: [
    CreateTransactionUseCase,
    GetTransactionsUseCase,
    GetBalanceUseCase,
    PrismaTransactionRepository,
    HttpUserProvider,
    {
      provide: 'ITransactionRepository',
      useExisting: PrismaTransactionRepository,
    },
    {
      provide: 'IUserProvider',
      useExisting: HttpUserProvider,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class TransactionsModule {}
