import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@src/configs/config.service';

@Global()
@Module({
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
