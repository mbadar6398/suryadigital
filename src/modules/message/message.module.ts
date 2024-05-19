import { Module } from '@nestjs/common';
import { MessageService } from '@src/modules/message/message.service';
import { MessageRepository } from '@src/modules/message/message.repository';
import { PrismaModule } from '@src/libs/prisma/prisma.module';
import { MessageProcessor } from './message.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [],
  providers: [MessageService, MessageProcessor, MessageRepository],
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'message',
    }),
  ],
  exports: [MessageService, BullModule],
})
export class MessageModule {}
