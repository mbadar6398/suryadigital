import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MessageModule } from '@src/modules/message/message.module';

@Module({
  providers: [TasksService],
  imports: [MessageModule],
})
export class TasksModule {}
