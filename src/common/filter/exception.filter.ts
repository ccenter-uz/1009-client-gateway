import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.log(exception, 'ERROR EXCEPTION');

    let status: number;
    let message: string;

    // === JWT yoki Unauthorized error ===
    if (
      exception instanceof TokenExpiredError &&
      exception instanceof UnauthorizedException
    ) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    }

    // === Servicedan kelgan RPC errorlarni ham qo‘llab-quvvatlash ===
    else if (exception?.error?.statusCode) {
      // <-- 🟢 Yangi qo‘shildi
      status = exception.error.statusCode;
      message = exception.error.message;
    }

    // === Oddiy HttpException ===
    else if (exception?.response?.statusCode) {
      status = exception.response.statusCode;
      message =
        (typeof exception.response.message === 'string'
          ? exception.response.message
          : exception.response.message?.[0]) || 'Internal server error';
    }

    // === Default fallback ===
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
    }

    this.logger.debug(
      `Exception Filter: ${JSON.stringify(
        {
          status: 'error',
          result: null,
          error: {
            message: typeof message === 'string' ? message : message['message'],
          },
        },
        null,
        2
      )}`
    );

    response.status(status).json({
      status: status,
      result: null,
      error: {
        message: typeof message === 'string' ? message : message['message'],
      },
    });
  }
}
