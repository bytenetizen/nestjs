import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AppService } from '../../app.service';
import { FastifyReply } from 'fastify';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly appService: AppService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest(); //<Request>
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    const validationErrorMessages = this.getValidationErrors(exceptionResponse);

    const error = this.getErrorMessageByStatusCode(status);
    const timestamp = new Date().toISOString();

    const front = {
      statusCode: status,
      error: error,
      errors: validationErrorMessages || [],
      timestamp: timestamp,
      path: request.url,
      message: exception.message || 'Internal Server Error',
    };

    this.appService.setLogError({
      code: status,
      error: error,
      path: request.url,
      created_at: timestamp,
      front: JSON.stringify(front),
      stack: exception.stack,
      ip: this.getClientIp(request),
    });

    response.status(status).send(front);
  }

  private getValidationErrors(response: any): string[] {
    if (response && Array.isArray(response.message)) {
      return response.message.map((error: ValidationError) => {
        if (error instanceof ValidationError) {
          const firstValue = Object.values(error.constraints)[0];
          return {
            value: error.value,
            property: error.property,
            constraints: firstValue,
          };
        }
        return null;
      });
    }
    return [];
  }

  private getErrorMessageByStatusCode(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 422:
        return 'Check the request payload';
      case 500:
        return 'Internal Server Error';
      default:
        return 'Unprocessable Entity';
    }
  }

  private getClientIp(req): string | null {
    return (
      req.headers['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      null
    );
  }
}
