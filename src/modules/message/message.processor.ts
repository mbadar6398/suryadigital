import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MessageService } from './message.service';
import { Logger } from '@nestjs/common';

@Processor('message')
export class MessageProcessor {
  constructor(private messageService: MessageService) {}

  @Process('sendMessage')
  async handleSendMessage(job: Job): Promise<void> {
    try {
      await this.messageService.sendMessage(job.data.user.email, job.data.text);
      await this.messageService.changeStatus(job.data.id, 'SENT');
    } catch (error) {
      Logger.error(error);
    }
  }
}
