import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from '@src/app/app.service';
import { HealthCheckResponseDto } from '@src/app/dto/responses';
import { FormatResponseInterceptor } from '@src/common/interceptors/format-response.interceptor';

@UseInterceptors(FormatResponseInterceptor)
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/healthcheck')
  healthCheck(): HealthCheckResponseDto {
    return this.appService.healthCheck();
  }
}
