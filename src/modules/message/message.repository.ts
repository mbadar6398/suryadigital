import { Injectable } from '@nestjs/common';
import { Message, MessageStatus } from '@prisma/client';
import { PrismaService } from '@src/libs/prisma/prisma.service';

export type CreateMessageRequestDto = Omit<
  Message,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & { id?: string };

@Injectable()
export class MessageRepository {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMessageRequestDto): Promise<Message> {
    return this.prisma.message.create({ data: dto });
  }

  async softDelete(user_id: string): Promise<void> {
    await this.prisma.message.updateMany({
      where: { user_id },
      data: { deleted_at: new Date() },
    });
  }

  async changeStatus(id: string, status: MessageStatus): Promise<void> {
    await this.prisma.message.update({
      where: { id },
      data: { status },
    });
  }

  async findScheduled(): Promise<Message[]> {
    return await this.prisma.message.findMany({
      where: {
        status: MessageStatus.SCHEDULED,
        deleted_at: null,
        scheduled_at: { lte: new Date() },
      },
      include: { user: true },
    });
  }
}
