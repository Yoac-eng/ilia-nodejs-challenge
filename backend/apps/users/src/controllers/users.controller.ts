import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { AuthenticateUserUseCase } from '../application/useCases/authenticate-user.use-case';
import { CreateUserUseCase } from '../application/useCases/create-user.use-case';
import { DeleteUserUseCase } from '../application/useCases/delete-user.use-case';
import { GetUserByIdUseCase } from '../application/useCases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../application/useCases/update-user.use-case';
import { InternalOnly } from '../common/auth/auth-mode.decorator';
import { Public } from '../common/auth/public.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

import { type CreateUserDto, createUserSchema } from './dtos/create-user.dto';
import { type LoginDto, loginSchema } from './dtos/login.dto';
import { type UpdateUserDto, updateUserSchema } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async createUser(
    @Body(new ZodValidationPipe(createUserSchema)) input: CreateUserDto,
  ) {
    const user = await this.createUserUseCase.execute(input);
    return user.toJson();
  }

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  @Public()
  async authenticate(
    @Body(new ZodValidationPipe(loginSchema)) input: LoginDto,
  ) {
    const output = await this.authenticateUserUseCase.execute(input);
    return {
      user: output.user.toJson(),
      accessToken: output.accessToken,
    };
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.getUserByIdUseCase.execute({ id });
    return user.toJson();
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) input: UpdateUserDto,
  ) {
    const user = await this.updateUserUseCase.execute({ id, ...input });
    return user.toJson();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteUserUseCase.execute({ id });
  }

  @Get(':id/exists')
  @HttpCode(HttpStatus.OK)
  @InternalOnly()
  async checkUserExists(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ exists: boolean }> {
    const user = await this.getUserByIdUseCase.execute({ id });
    return { exists: !!user };
  }
}
