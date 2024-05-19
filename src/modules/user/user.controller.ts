import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '@src/modules/user/user.service';
import { FormatResponseInterceptor } from '@src/common/interceptors/format-response.interceptor';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserRequestDto } from './dtos/requests';
import { SuccessResponse } from '@src/common/dtos/responses';

@UseInterceptors(FormatResponseInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ operationId: 'Create user' })
  @ApiOkResponse({ type: SuccessResponse })
  async create(@Body() dto: CreateUserRequestDto): Promise<void> {
    await this.userService.create({ ...dto });
  }

  @Delete('delete/:id')
  @ApiOperation({ operationId: 'Delete user' })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(@Param() params: { id: string }): Promise<void> {
    await this.userService.delete(params.id);
  }
}
