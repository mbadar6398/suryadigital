import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@src/configs/config.module';
import { MessageService } from '@src/modules/message/message.service';
import { vi, describe, beforeEach, expect, it } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { MessageRepository } from '@src/modules/message/message.repository';
import axios from 'axios';
import { Message, MessageStatus, User } from '@prisma/client';

vi.mock('axios');

describe('User Service', () => {
  let messageService: MessageService;
  let repositoryMock: DeepMockProxy<MessageRepository>;

  beforeEach(async () => {
    repositoryMock = mockDeep<MessageRepository>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        MessageService,
        { provide: MessageRepository, useValue: repositoryMock },
      ],
    }).compile();

    messageService = module.get<MessageService>(MessageService);
    mockReset(repositoryMock);
  });

  it('should be defined', () => {
    expect(messageService).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should not throwing error when no error occured', async () => {
      const expectedResult = {
        data: {
          status: 'success',
          sentTime: new Date(),
        },
      };
      const mockData = expectedResult;
      (axios.post as any).mockResolvedValueOnce(mockData);

      const result = messageService.sendMessage(
        'mbadar6398@gmail.com',
        'Hello World',
      );

      await expect(result).resolves.toStrictEqual(expectedResult);
      expect(axios.post).toHaveBeenCalledOnce();
    });
  });

  describe('create', () => {
    it('should not throwing error when no error occured', async () => {
      const dto = {
        text: 'Happy birthday Muhammad badar! 🎉🎉🎉',
      };

      repositoryMock.create.mockResolvedValueOnce(dto as Message);
      const result = messageService.create(dto as Message);

      await expect(result).resolves.toStrictEqual(dto);
      expect(repositoryMock.create).toHaveBeenCalledOnce();
    });
  });

  describe('scheduleBirthdayMessage', () => {
    it('should not throwing error when no error occured', async () => {
      const dto = {
        text: 'Happy birthday Muhammad badar! 🎉🎉🎉',
      };

      repositoryMock.create.mockResolvedValueOnce(dto as Message);

      const result = messageService.scheduleBirthdayMessage({
        id: '128eu-1298eh-e9h219d-219dh219',
        first_name: 'Muhammad',
        last_name: 'badar',
        birth_date: '1998-03-06',
        timezone: 'Asia/Jakarta',
      } as User);

      await expect(result).resolves.toStrictEqual(dto);
      expect(repositoryMock.create).toHaveBeenCalledOnce();
    });
    it('shoulds not throwing error when no error occured', async () => {
      const result = messageService.scheduleBirthdayMessage({
        id: '128eu-1298eh-e9h219d-219dh219',
        first_name: 'Muhammad',
        last_name: 'badar',
        birth_date: '1998-03-06',
        timezone: 'Asia/Jakarta',
      } as User);

      await expect(result).resolves.toStrictEqual(undefined);
      expect(repositoryMock.create).toHaveBeenCalledOnce();
    });
  });

  describe('deleteByUserId', () => {
    it('should not throwing error when no error occured', async () => {
      repositoryMock.softDeleteByUserId.mockResolvedValueOnce(undefined);

      const result = messageService.deleteByUserId('userId');

      await expect(result).resolves.toStrictEqual(undefined);
      expect(repositoryMock.softDeleteByUserId).toHaveBeenCalledOnce();
    });
  });

  describe('getScheduled', () => {
    it('should not throwing error when no error occured', async () => {
      repositoryMock.findScheduled.mockResolvedValueOnce([]);

      const result = messageService.getScheduled();

      await expect(result).resolves.toStrictEqual([]);
      expect(repositoryMock.findScheduled).toHaveBeenCalledOnce();
    });
  });

  describe('changeStatus', () => {
    it('should not throwing error when no error occured', async () => {
      repositoryMock.changeStatus.mockResolvedValueOnce(undefined);

      const result = messageService.changeStatus('userId', MessageStatus.SENT);

      await expect(result).resolves.toStrictEqual(undefined);
      expect(repositoryMock.changeStatus).toHaveBeenCalledOnce();
    });
  });

  describe('getNextBirthday', () => {
    it('should return expected result with correct timezone', async () => {
      const birth_date = '1998-03-06';
      const timezone = 'Asia/Jakarta';
      const nextYear = false;

      const result = messageService.getNextBirthday(
        birth_date,
        timezone,
        nextYear,
      );
      const expectedResult = new Date('2024-03-06T02:00:00.000Z');
      expect(result).toEqual(expectedResult);
    });

    it('should return expected result with different timezone', async () => {
      const birth_date = '1998-03-06';
      const timezone = 'Asia/Makassar';
      const nextYear = false;

      const result = messageService.getNextBirthday(
        birth_date,
        timezone,
        nextYear,
      );
      const expectedResult = new Date('2024-03-06T01:00:00.000Z');
      expect(result).toEqual(expectedResult);
    });

    it('should return expected result with next year true', async () => {
      const birth_date = '1998-03-06';
      const timezone = 'Asia/Makassar';
      const nextYear = true;

      const result = messageService.getNextBirthday(
        birth_date,
        timezone,
        nextYear,
      );
      const expectedResult = new Date('2025-03-06T01:00:00.000Z');
      expect(result).toEqual(expectedResult);
    });
  });
});
