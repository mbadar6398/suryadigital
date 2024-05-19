import { Injectable } from '@nestjs/common';
import { Message, MessageStatus, MessageType, User } from '@prisma/client';
import { MessageRepository } from '@src/modules/message/message.repository';
import axios, { AxiosResponse } from 'axios';
import { fromZonedTime } from 'date-fns-tz';

export type CreateMessageRequestDto = Omit<
  Message,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & { id?: string };

@Injectable()
export class MessageService {
  constructor(private messageRepository: MessageRepository) {}

  async create(dto: CreateMessageRequestDto): Promise<Message> {
    return await this.messageRepository.create(dto);
  }

  async sendMessage(
    email: string,
    message: string,
  ): Promise<AxiosResponse<Message>> {
    return await axios.post('email-service.digitalenvision.com.au/send-email', {
      email,
      message,
    });
  }

  async scheduleBirthdayMessage(user: User): Promise<Message> {
    return await this.create({
      user_id: user.id,
      text: `Happy birthday ${user.first_name} ${user.last_name}! 🎉🎉🎉`,
      type: MessageType.BIRTHDAY,
      status: MessageStatus.SCHEDULED,
      scheduled_at: fromZonedTime(user.birth_date, user.timezone),
      sent_at: null,
    });
  }

  async deleteByUserId(user_id: string): Promise<void> {
    await this.messageRepository.softDelete(user_id);
  }

  async getScheduled(): Promise<Message[]> {
    return await this.messageRepository.findScheduled();
  }

  async changeStatus(id: string, status: MessageStatus): Promise<void> {
    return await this.messageRepository.changeStatus(id, status);
  }
}
