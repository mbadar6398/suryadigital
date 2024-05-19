import { HttpStatus } from '@nestjs/common';
import { AppExceptionCode } from '@src/common/exceptions/app-exception';

export const EmailAlreadyExist = new AppExceptionCode(
  '100100',
  'Email already registered',
  HttpStatus.CONFLICT,
);
