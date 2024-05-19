import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@src/configs/config.module';
import { MessageRepository } from '@src/modules/message/message.repository';
import { PrismaModule } from '@src/libs/prisma/prisma.module';
import { describe, beforeEach, expect, it } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import {
  Message,
  MessageStatus,
  MessageType,
  PrismaClient,
} from '@prisma/client';
import { PrismaService } from '@src/libs/prisma/prisma.service';

describe('Message Repository', () => {
  let messageRepository: MessageRepository;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, PrismaModule],
      providers: [
        MessageRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    messageRepository = module.get<MessageRepository>(MessageRepository);
    mockReset(prismaMock);
  });

  it('should be defined', () => {
    expect(messageRepository).toBeDefined();
  });

  describe('create', () => {
    it('should return message data when no error occured', async () => {
      const dto = {
        message: {
          text: 'Happy birthday Muhammad Badar',
          status: MessageStatus.SCHEDULED,
          scheduled_at: new Date(),
          sent_at: null,
          user_id: '128eu-1298eh-e9h219d-219dh219',
          type: MessageType.BIRTHDAY,
        },
      };

      const expectedResult = {
        id: '128eu-1298eh-e9h219d-219dh219',
        ...dto.message,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      prismaMock.message.create.mockResolvedValueOnce(expectedResult);

      const result = messageRepository.create(dto.message);

      await expect(result).resolves.toStrictEqual({
        ...expectedResult,
        created_at: expect.anything(),
        updated_at: expect.anything(),
      });
      expect(prismaMock.message.create).toHaveBeenCalledOnce();
    });
  });

  describe('softDelete', () => {
    it('should delete user when no error occured', async () => {
      prismaMock.message.updateMany.mockResolvedValueOnce({ count: 1 });

      const result = messageRepository.softDeleteByUserId(
        '128eu-1298eh-e9h219d-219dh219',
      );

      await expect(result).resolves.toStrictEqual(undefined);
      expect(prismaMock.message.updateMany).toHaveBeenCalledOnce();
    });
  });

  describe('changeStatus', () => {
    it('should delete user when no error occured', async () => {
      prismaMock.message.update.mockResolvedValueOnce({} as Message);

      const result = messageRepository.changeStatus(
        '128eu-1298eh-e9h219d-219dh219',
        MessageStatus.SENT,
      );

      await expect(result).resolves.toStrictEqual(undefined);
      expect(prismaMock.message.update).toHaveBeenCalledOnce();
    });
  });

  describe('findScheduled', () => {
    it('should delete user when no error occured', async () => {
      const expectedResponse = [
        {
          id: '128eu-1298eh-e9h219d-219dh219',
          text: 'Happy birthday Muhammad Badar',
        },
        {
          id: '128eu-1298eh-e9h219d-219dh211',
          text: 'Happy birthday John lennon',
        },
      ];

      prismaMock.message.findMany.mockResolvedValueOnce(
        expectedResponse as Message[],
      );

      const result = messageRepository.findScheduled();

      await expect(result).resolves.toStrictEqual(expectedResponse);
      expect(prismaMock.message.findMany).toHaveBeenCalledOnce();
    });
  });
});
