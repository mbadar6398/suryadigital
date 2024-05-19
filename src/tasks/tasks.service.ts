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

  //   This will be executed every hour at the 0th minute.
  @Cron('25 * * * *')
  async handleScheduledMessage() {
    const message = await this.messageService.getScheduled();
    message.forEach((msg) => {
      console.log('queueing message', msg);
      this.messageQueue.add('sendMessage', msg);
    });
  }
}
