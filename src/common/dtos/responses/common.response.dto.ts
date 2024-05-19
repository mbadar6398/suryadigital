import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseCodes } from '@src/common/constants/response-codes.enum';
import { ResponseMessages } from '@src/common/constants/response-messages.enum';

export class NotFoundResponse {
  @ApiProperty({
    example: ResponseMessages.NOT_FOUND,
  })
  message?: string;
  @ApiProperty({
    example: CommonResponseCodes.NOT_FOUND,
  })
  code?: string;

  @ApiProperty({
    example: null,
  })
  data?: string;
}

export class InvalidRequestResponse {
  @ApiProperty({
    example: ResponseMessages.INVALID_REQUEST,
  })
  message?: string;
  @ApiProperty({
    example: CommonResponseCodes.INVALID_REQUEST,
  })
  code?: string;

  @ApiProperty({
    example: null,
  })
  data?: string;
}

export class SuccessResponse {
  @ApiProperty({
    example: ResponseMessages.SUCCESS,
  })
  message?: string;

  @ApiProperty({
    example: CommonResponseCodes.SUCCESS,
  })
  code?: string;
}

export class DeletedResponse {
  @ApiProperty({
    example: ResponseMessages.SUCCESS,
  })
  message?: string;

  @ApiProperty({
    example: CommonResponseCodes.SUCCESS,
  })
  code?: string;

  @ApiProperty({
    example: null,
  })
  data?: string;
}
