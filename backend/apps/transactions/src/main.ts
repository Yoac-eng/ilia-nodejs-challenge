import { NestFactory } from '@nestjs/core';

import { AppExceptionFilter } from './common/filter/app-exception.filter';
import { SnakeCaseResponseInterceptor } from './common/interceptors/snake-case-response.interceptor';
import { TransactionsModule } from './transactions.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalInterceptors(new SnakeCaseResponseInterceptor());
  await app.listen(process.env.TRANSACTIONS_PORT ?? 3001);

  console.log(`
    Transactions microservice is running on port ${process.env.TRANSACTIONS_PORT ?? 3001}`);
}
bootstrap();
