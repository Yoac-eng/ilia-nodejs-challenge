import { Prisma } from '@generated/clients/transactions';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { DomainError } from '../../domain/errors/domain.error';
import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import { InsufficientFundsError } from '../../domain/errors/insufficient-funds.error';
import { ZodError } from 'zod';

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
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const mapped = this.mapException(exception);
    this.logException(exception, mapped.statusCode, request.url);

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
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return {
          statusCode,
          message: response,
          error: this.getHttpErrorLabel(statusCode),
        };
      }

      if (this.isRecord(response)) {
        const message = response.message;
        const error = response.error;
        return {
          statusCode,
          message: Array.isArray(message)
            ? message.join(', ')
            : typeof message === 'string'
              ? message
              : exception.message,
          error:
            typeof error === 'string'
              ? error
              : this.getHttpErrorLabel(statusCode),
        };
      }

      return {
        statusCode,
        message: exception.message,
        error: this.getHttpErrorLabel(statusCode),
      };
    }

    if (exception instanceof EntityNotFoundError) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
        error: 'Not Found',
      };
    }

    if (exception instanceof InsufficientFundsError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        error: 'Bad Request',
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

  private getHttpErrorLabel(statusCode: number): string {
    return HttpStatus[statusCode] ?? 'Http Error';
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private logException(
    exception: unknown,
    statusCode: number,
    path: string,
  ): void {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const errorName =
      exception instanceof Error ? exception.name : 'UnknownError';
    const message =
      exception instanceof Error ? exception.message : String(exception);
    const stack = exception instanceof Error ? exception.stack : undefined;
    const logMessage = `[${statusCode}] ${errorName}: ${message} (${path})`;

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(logMessage, stack);
      return;
    }

    this.logger.warn(logMessage);
  }
}
