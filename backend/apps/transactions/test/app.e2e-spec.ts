import { randomUUID } from 'crypto';

import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppExceptionFilter } from '../src/common/filter/app-exception.filter';
import { TransactionType } from '../src/domain/enum/transaction-type.enum';
import { prisma } from '../src/infra/lib/prisma';
import { TransactionsModule } from '../src/transactions.module';

describe('Transaction Concurrency (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  const testUserId = '11111111-1111-4111-8111-111111111111';

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'ILIACHALLENGE';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TransactionsModule],
    })
      .overrideProvider('IUserProvider')
      .useValue({
        verifyUserExists: async () => true,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new AppExceptionFilter());
    await app.init();

    jwtService = new JwtService();
  });

  beforeEach(async () => {
    await cleanUserData(testUserId);
  });

  afterEach(async () => {
    await cleanUserData(testUserId);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should prevent double spending when multiple debit requests hit simultaneously', async () => {
    await prisma.accountBalance.upsert({
      where: { userId: testUserId },
      update: { balanceCents: 10_000n, updatedAt: new Date() },
      create: {
        userId: testUserId,
        balanceCents: 10_000n,
        updatedAt: new Date(),
      },
    });

    const token = await createUserToken(testUserId);

    const concurrentRequests = Array.from({ length: 5 }).map(() =>
      request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .set('x-idempotency-key', randomUUID())
        .send({
          user_id: testUserId,
          amount: 10_000,
          type: TransactionType.DEBIT,
        }),
    );

    const responses = await Promise.all(concurrentRequests);
    const successes = responses.filter((response) => response.status === 201);
    const failures = responses.filter((response) => response.status === 400);

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(4);

    const finalBalance = await prisma.accountBalance.findUnique({
      where: { userId: testUserId },
    });

    expect(finalBalance?.balanceCents).toBe(0n);
  });

  it('should process one transaction when idempotency key is reused concurrently', async () => {
    const token = await createUserToken(testUserId);
    const sharedIdempotencyKey = `idem-${randomUUID()}`;

    const concurrentRequests = Array.from({ length: 3 }).map(() =>
      request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .set('x-idempotency-key', sharedIdempotencyKey)
        .send({
          user_id: testUserId,
          amount: 5_000,
          type: TransactionType.CREDIT,
        }),
    );

    const responses = await Promise.all(concurrentRequests);
    const successfulStatuses = responses.filter(
      (response) => response.status === 201 || response.status === 200,
    );

    expect(successfulStatuses).toHaveLength(3);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: testUserId,
        idempotencyKey: sharedIdempotencyKey,
      },
    });
    expect(transactions).toHaveLength(1);

    const finalBalance = await prisma.accountBalance.findUnique({
      where: { userId: testUserId },
    });
    expect(finalBalance?.balanceCents).toBe(5_000n);
  });

  async function createUserToken(userId: string): Promise<string> {
    return jwtService.signAsync(
      { sub: userId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '5m',
      },
    );
  }

  async function cleanUserData(userId: string): Promise<void> {
    await prisma.ledgerEntry.deleteMany({ where: { userId } });
    await prisma.transaction.deleteMany({ where: { userId } });
    await prisma.accountBalance.deleteMany({ where: { userId } });
  }
});
