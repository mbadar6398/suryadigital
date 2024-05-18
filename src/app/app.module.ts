import { Logger, Module } from '@nestjs/common';
import { AppController } from '@src/app/app.controller';
import { AppService } from '@src/app/app.service';
import { ConfigModule } from '@src/configs/config.module';
import { UserModule } from '@src/modules/user/user.module';

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
