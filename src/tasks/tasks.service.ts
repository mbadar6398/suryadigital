import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MessageService } from '@src/modules/message/message.service';
import { Queue } from 'bull';

@Injectable()
export class TasksService {
  constructor(
    private messageService: MessageService,
    @InjectQueue('message') private readonly messageQueue: Queue,
  ) {}

  @Cron('0 * * * *')
  async handleScheduledMessage(): Promise<void> {
    const message = await this.messageService.getScheduled();
    message.forEach((msg) => {
      this.messageQueue.add('sendMessage', msg);
    });
  }
}
