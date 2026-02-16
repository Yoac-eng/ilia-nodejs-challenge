import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticateUserUseCase } from './application/useCases/authenticate-user.use-case';
import { CreateUserUseCase } from './application/useCases/create-user.use-case';
import { DeleteUserUseCase } from './application/useCases/delete-user.use-case';
import { GetUserByIdUseCase } from './application/useCases/get-user-by-id.use-case';
import { UpdateUserUseCase } from './application/useCases/update-user.use-case';
import { BcryptHashProvider } from './infra/providers/bcrypt-hash.provider';
import { JwtTokenProvider } from './infra/providers/jwt-token.provider';
import { PrismaUserRepository } from './infra/repositories/prisma-user.repository';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController],
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
  ],
})
export class UsersModule {}
