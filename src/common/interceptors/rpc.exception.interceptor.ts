import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { ApiResponseType } from 'types/global';
import { map } from 'rxjs/operators';

@Injectable()
export class RpcExceptionInterceptor<T> implements NestInterceptor {
  private logger = new Logger(RpcExceptionInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponseType<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // Successful response
        const status = response?.statusCode || HttpStatus.OK;

        if (data?.error) {
          return {
            status: data.error.code,
            result: null,
            error: {
              message:
                typeof data.error.error == 'object'
                  ? data.error.error[0]
                  : data.error.error,
            },
          };
        }

        return {
          status,
          result: data,
          error: null,
        };
      })
    );
  }
}
