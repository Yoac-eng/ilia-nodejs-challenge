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

import { CreateUserUseCase } from '../application/useCases/create-user.use-case';
import { DeleteUserUseCase } from '../application/useCases/delete-user.use-case';
import { GetAllUsersUseCase } from '../application/useCases/get-all-users.use-case';
import { GetUserByIdUseCase } from '../application/useCases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../application/useCases/update-user.use-case';
import { InternalOnly } from '../common/auth/auth-mode.decorator';
import { Public } from '../common/auth/public.decorator';
import { ZodValidationPipe } from '../common/pipe/zod-validation.pipe';
import { EntityNotFoundError } from '../domain/errors/entity-not-found.error';

import { type CreateUserDto, createUserSchema } from './dtos/create-user.dto';
import { type UpdateUserDto, updateUserSchema } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
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

  @Get()
  async getAllUsers() {
    const users = await this.getAllUsersUseCase.execute();
    return users.map((user) => user.toJson());
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
    try {
      await this.getUserByIdUseCase.execute({ id });
      return { exists: true };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return { exists: false };
      }

      throw error;
    }
  }
}
