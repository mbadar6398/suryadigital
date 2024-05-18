import { ConfigService } from '@src/configs/config.service';
import { Injectable } from '@nestjs/common';
import { HealthCheckResponseDto } from '@src/app/dto/responses';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  healthCheck(): HealthCheckResponseDto {
    return {
      version: this.configService.get('version', '') || '',
      commitHash: this.configService.get('commitHash') || '',
    };
  }
}
