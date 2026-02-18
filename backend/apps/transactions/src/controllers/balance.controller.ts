import { Controller, Get } from '@nestjs/common';

import { GetBalanceUseCase } from '../application/useCases/get-balance.use-case';
import { AuthenticatedUserId } from '../common/auth/authenticated-user-id.decorator';

@Controller()
export class BalanceController {
  constructor(private readonly getBalanceUseCase: GetBalanceUseCase) {}

  @Get('balance')
  async getBalance(@AuthenticatedUserId() authenticatedUserId: string) {
    const balance = await this.getBalanceUseCase.execute({
      userId: authenticatedUserId,
    });

    return { amount: Number(balance.toRaw()) };
  }
}
