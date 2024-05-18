import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { CommonResponseCodes } from '@src/common/constants/response-codes.enum';
import { ResponseMessages } from '@src/common/constants/response-messages.enum';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  code: string;
  message: string;
  data: T;
}

@Injectable()
export class FormatResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        context.switchToHttp().getResponse().status(HttpStatus.OK);
        return {
          message: ResponseMessages.SUCCESS,
          code: CommonResponseCodes.SUCCESS,
          data: data ? data : null,
        };
      }),
    );
  }
}
