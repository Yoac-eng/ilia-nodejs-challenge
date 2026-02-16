import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticateUserUseCase } from './application/useCases/authenticate-user.use-case';
import { CreateUserUseCase } from './application/useCases/create-user.use-case';
import { DeleteUserUseCase } from './application/useCases/delete-user.use-case';
import { GetUserByIdUseCase } from './application/useCases/get-user-by-id.use-case';
import { UpdateUserUseCase } from './application/useCases/update-user.use-case';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { BcryptHashProvider } from './infra/providers/bcrypt-hash.provider';
import { JwtTokenProvider } from './infra/providers/jwt-token.provider';
import { PrismaUserRepository } from './infra/repositories/prisma-user.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    PrismaUserRepository,
    BcryptHashProvider,
    JwtTokenProvider,
    {
      provide: 'IUserRepository',
      useExisting: PrismaUserRepository,
    },
    {
      provide: 'IHashProvider',
      useExisting: BcryptHashProvider,
    },
    {
      provide: 'ITokenProvider',
      useExisting: JwtTokenProvider,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class UsersModule {}
