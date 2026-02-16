import { Prisma } from '@generated/clients/users';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';

import { DomainError } from '../../domain/errors/domain.error';
import { EmailAlreadyInUseError } from '../../domain/errors/email-already-in-use.error';
import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: unknown;
}

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const mapped = this.mapException(exception);

    const body: ErrorResponse = {
      statusCode: mapped.statusCode,
      message: mapped.message,
      error: mapped.error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (mapped.details !== undefined) {
      body.details = mapped.details;
    }

    response.status(mapped.statusCode).json(body);
  }

  private mapException(
    exception: unknown,
  ): Omit<ErrorResponse, 'timestamp' | 'path'> {
    if (exception instanceof EntityNotFoundError) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
        error: 'Not Found',
      };
    }

    if (exception instanceof EmailAlreadyInUseError) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: exception.message,
        error: 'Conflict',
      };
    }

    if (exception instanceof InvalidCredentialsError) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: exception.message,
        error: 'Unauthorized',
      };
    }

    if (exception instanceof DomainError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        error: 'Bad Request',
      };
    }

    if (exception instanceof ZodError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed.',
        error: 'Bad Request',
        details: exception.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'A record with the provided unique field already exists.',
          error: 'Conflict',
        };
      }

      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Database request failed.',
        error: 'Bad Request',
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error.',
      error: 'Internal Server Error',
    };
  }
}
