import { HttpStatus } from '@nestjs/common/enums';
import { AppExceptionCode } from '@src/common/exceptions/app-exception';
import { CommonResponseCodes } from '@src/common/constants/response-codes.enum';
import { ResponseMessages } from '@src/common/constants/response-messages.enum';

export const InvalidRequest = new AppExceptionCode(
  CommonResponseCodes.INVALID_REQUEST,
  ResponseMessages.INVALID_REQUEST,
  HttpStatus.BAD_REQUEST,
);

export const Unauthorized = new AppExceptionCode(
  CommonResponseCodes.UNAUTHORIZED,
  ResponseMessages.UNAUTHORIZED,
  HttpStatus.UNAUTHORIZED,
);

export const Forbidden = new AppExceptionCode(
  CommonResponseCodes.FORBIDDEN,
  ResponseMessages.FORBIDDEN,
  HttpStatus.FORBIDDEN,
);

export const ResourceNotFound = new AppExceptionCode(
  CommonResponseCodes.NOT_FOUND,
  ResponseMessages.NOT_FOUND,
  HttpStatus.NOT_FOUND,
);

export const UnknownError = new AppExceptionCode(
  CommonResponseCodes.UNKNOWN_ERROR,
  ResponseMessages.UNKNOWN_ERROR,
  HttpStatus.INTERNAL_SERVER_ERROR,
);
