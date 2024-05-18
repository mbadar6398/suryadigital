import { ConfigService } from '@src/configs/config.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  InvalidRequest,
  ResourceNotFound,
  UnknownError,
} from '@src/common/exceptions/common.exception';
import { AppException } from '@src/common/exceptions/app-exception';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const isApp = exception instanceof AppException;

    if (isApp && isHttp) {
      return this.handleAppException(exception, response);
    } else if (!isApp && isHttp) {
      return this.handleHttpException(exception, response);
    } else {
      return this.handleUnknownError(exception, response, request);
    }
  }

  private handleAppException(exception: AppException, response: Response) {
    const errorCode = exception.getCode();
    const errorMessage =
      errorCode === '-2' ? InvalidRequest.message : exception.message;
    return response.status(exception.getStatus()).send({
      code: errorCode === '-2' ? InvalidRequest.code : errorCode,
      message: errorMessage,
      data: null,
    });
  }

  private handleHttpException(exception: HttpException, response: Response) {
    const statusCode = exception.getStatus();
    const errorMessage =
      statusCode === 404 ? ResourceNotFound.message : UnknownError.message;
    const errorCode =
      statusCode === 404 ? ResourceNotFound.code : UnknownError.code;

    return response.status(statusCode).send({
      code: errorCode,
      message: errorMessage,
      data: null,
    });
  }

  private handleUnknownError(
    exception: Error,
    response: Response,
    request: Request,
  ) {
    const defaultErrorCode = UnknownError.code;
    const defaultErrorMessage = this.configService.get('isDebug')
      ? exception.message
      : UnknownError.message;

    response.status(500).send({
      code: defaultErrorCode,
      message: defaultErrorMessage,
      data: null,
    });

    this.logger.error(
      `[Unhandled exception] traceId: ${request.traceId}, message: ${exception.message}, stack: ${exception.stack} `,
      this.constructor.name,
    );
  }
}
