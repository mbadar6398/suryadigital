import { Logger, Module } from '@nestjs/common';
import { AppController } from '@src/app/app.controller';
import { AppService } from '@src/app/app.service';
import { ConfigModule } from '@src/configs/config.module';
import { UserModule } from '@src/modules/user/user.module';
import { MessageModule } from '@src/modules/message/message.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from '@src/tasks/tasks.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    UserModule,
    MessageModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
