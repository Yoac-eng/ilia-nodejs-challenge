import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthenticateUserUseCase } from '../application/useCases/authenticate-user.use-case';
import { Public } from '../common/auth/public.decorator';
import { ZodValidationPipe } from '../common/pipe/zod-validation.pipe';

import { type LoginDto, loginSchema } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Public()
  async authenticate(
    @Body(new ZodValidationPipe(loginSchema)) input: LoginDto,
  ) {
    const output = await this.authenticateUserUseCase.execute(input);
    return {
      user: output.user.toJson(),
      access_token: output.accessToken,
    };
  }
}
