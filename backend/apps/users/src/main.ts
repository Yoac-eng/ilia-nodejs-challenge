import { NestFactory } from '@nestjs/core';

import { AppExceptionFilter } from './common/filter/app-exception.filter';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  app.useGlobalFilters(new AppExceptionFilter());
  await app.listen(process.env.USERS_PORT ?? 3002);

  console.log(`
    Users microservice is running on port ${process.env.USERS_PORT ?? 3002}`);
}
bootstrap();
