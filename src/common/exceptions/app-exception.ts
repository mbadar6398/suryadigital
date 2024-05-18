import { HttpException, HttpStatus } from '@nestjs/common';

export class AppExceptionCode {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: HttpStatus,
  ) {}
}

export class AppException extends HttpException {
  private readonly code: string;
  private readonly httpStatus: HttpStatus;

  constructor(
    message: string,
    { code, httpStatus }: Omit<AppExceptionCode, 'message'>,
  ) {
    super(message, httpStatus);
    this.code = code;
    this.httpStatus = httpStatus;
  }

  getStatus(): number {
    return this.httpStatus;
  }

  getCode(): string {
    return this.code;
  }

  static fromCode(code: AppExceptionCode): AppException {
    return new AppException(code.message, code);
  }
}
