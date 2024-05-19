import { Injectable } from '@nestjs/common';
import { Message, MessageStatus, MessageType, User } from '@prisma/client';
import { MessageRepository } from '@src/modules/message/message.repository';
import axios, { AxiosResponse } from 'axios';
import { getYear, format } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

export type CreateMessageRequestDto = Omit<
  Message,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & { id?: string };

export interface SendMessageResponse {
  status: string;
  sentTime: Date;
}

@Injectable()
export class MessageService {
  constructor(private messageRepository: MessageRepository) {}

  async create(dto: CreateMessageRequestDto): Promise<Message> {
    return await this.messageRepository.create(dto);
  }

  async sendMessage(
    email: string,
    message: string,
  ): Promise<AxiosResponse<SendMessageResponse>> {
    return await axios.post(
      'https://email-service.digitalenvision.com.au/send-email',
      {
        email,
        message,
      },
    );
  }

  async scheduleBirthdayMessage(
    user: User,
    nextYear: boolean = false,
  ): Promise<Message> {
    const { id, first_name, last_name, birth_date, timezone } = user;
    const scheduled_at = this.getNextBirthday(birth_date, timezone, nextYear);

    return await this.create({
      user_id: id,
      text: `Hey, ${first_name} ${last_name} it's your birthday`,
      type: MessageType.BIRTHDAY,
      status: MessageStatus.SCHEDULED,
      scheduled_at,
      sent_at: null,
    });
  }

  async deleteByUserId(user_id: string): Promise<void> {
    await this.messageRepository.softDeleteByUserId(user_id);
  }

  async getScheduled(): Promise<Message[]> {
    return await this.messageRepository.findScheduled();
  }

  async changeStatus(id: string, status: MessageStatus): Promise<void> {
    return await this.messageRepository.changeStatus(id, status);
  }

  getNextBirthday(
    birth_date: string,
    timezone: string,
    nextYear: boolean,
  ): Date {
    const year = nextYear ? getYear(new Date()) + 1 : getYear(new Date());
    const dateFormat = `${year}-MM-dd 09:00:00`;
    const formattedDate = format(birth_date, dateFormat);
    return fromZonedTime(formattedDate, timezone);
  }
}
