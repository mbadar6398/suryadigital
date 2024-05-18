import { Controller, UseInterceptors } from '@nestjs/common';
import { UserService } from '@src/modules/user/user.service';
import { FormatResponseInterceptor } from '@src/common/interceptors/format-response.interceptor';

@UseInterceptors(FormatResponseInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
