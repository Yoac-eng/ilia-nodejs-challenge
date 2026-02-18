import { GetBalanceUseCase } from '../../src/application/useCases/get-balance.use-case';
import { Amount } from '../../src/domain/value-objects/amount.value-object';

import { BalanceController } from '../../src/controllers/balance.controller';

describe('BalanceController', () => {
  it('returns numeric amount for authenticated user', async () => {
    const getBalanceUseCase = {
      execute: jest.fn().mockResolvedValue(Amount.fromRaw(750n)),
    };
    const controller = new BalanceController(
      getBalanceUseCase as unknown as GetBalanceUseCase,
    );

    const result = await controller.getBalance('user-id');

    expect(getBalanceUseCase.execute).toHaveBeenCalledWith({ userId: 'user-id' });
    expect(result).toEqual({ amount: 750 });
  });
});

