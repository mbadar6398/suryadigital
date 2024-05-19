import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@src/configs/config.module';
import { UserService } from '@src/modules/user/user.service';
import { describe, beforeEach, expect, it } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { UserRepository } from '@src/modules/user/user.repository';
import { MessageService } from '@src/modules/message/message.service';
import { EmailAlreadyExist } from '../user.exceptions';
import { AppException } from '@src/common/exceptions/app-exception';
import { ResourceNotFound } from '@src/common/exceptions/common.exception';
import { Message } from '@prisma/client';

describe('User Service', () => {
  let userService: UserService;
  let repositoryMock: DeepMockProxy<UserRepository>;
  let messageServiceMock: DeepMockProxy<MessageService>;

  beforeEach(async () => {
    repositoryMock = mockDeep<UserRepository>();
    messageServiceMock = mockDeep<MessageService>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        UserService,
        { provide: UserRepository, useValue: repositoryMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    mockReset(repositoryMock);
    mockReset(messageServiceMock);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should not throwing error when no error occured', async () => {
      const dto = {
        first_name: 'Muhammad',
        last_name: 'badar',
        email: 'mbadar6398@gmail.com',
        birth_date: '1998-12-12',
        timezone: 'Asia/Jakarta',
      };

      repositoryMock.findByEmail.mockResolvedValueOnce(null);

      repositoryMock.create.mockResolvedValueOnce({
        ...dto,
        id: '128eu-1298eh-e9h219d-219dh219',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
      });

      messageServiceMock.scheduleBirthdayMessage.mockResolvedValueOnce(
        {} as Message,
      );

      const result = userService.create(dto);

      await expect(result).resolves.toStrictEqual(undefined);
      expect(repositoryMock.findByEmail).toHaveBeenCalledOnce();
      expect(repositoryMock.create).toHaveBeenCalledOnce();
      expect(messageServiceMock.scheduleBirthdayMessage).toHaveBeenCalledOnce();
    });

    it('should not call scheduleBirthdayMessage if birth date before today', async () => {
      const dto = {
        first_name: 'Muhammad',
        last_name: 'badar',
        email: 'mbadar6398@gmail.com',
        birth_date: '1998-03-06',
        timezone: 'Asia/Jakarta',
      };

      repositoryMock.findByEmail.mockResolvedValueOnce(null);

      repositoryMock.create.mockResolvedValueOnce({
        ...dto,
        id: '128eu-1298eh-e9h219d-219dh219',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
      });

      messageServiceMock.scheduleBirthdayMessage.mockResolvedValueOnce(
        {} as Message,
      );

      const result = userService.create(dto);

      await expect(result).resolves.toStrictEqual(undefined);
      expect(repositoryMock.findByEmail).toHaveBeenCalledOnce();
      expect(repositoryMock.create).toHaveBeenCalledOnce();
      expect(
        messageServiceMock.scheduleBirthdayMessage,
      ).not.toHaveBeenCalledOnce();
    });

    it('should throwing EmailAlreadyExist when duplicated email', async () => {
      const dto = {
        first_name: 'Muhammad',
        last_name: 'badar',
        email: 'mbadar6398@gmail.com',
        birth_date: '1998-03-06',
        timezone: 'Asia/Jakarta',
      };
      const expectedError = AppException.fromCode(EmailAlreadyExist);

      repositoryMock.findByEmail.mockResolvedValueOnce({
        id: '128eu-1298eh-e9h219d-219dh219',
        first_name: 'Muhammad',
        last_name: 'badar',
        email: 'mbadar6398@gmail.com',
        birth_date: '1998-03-06',
        timezone: 'Asia/Jakarta',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });

      repositoryMock.create.mockResolvedValueOnce({
        ...dto,
        id: '128eu-1298eh-e9h219d-219dh219',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
      });

      messageServiceMock.scheduleBirthdayMessage.mockResolvedValueOnce(
        {} as Message,
      );

      const result = userService.create(dto);

      await expect(result).rejects.toStrictEqual(expectedError);
      expect(repositoryMock.findByEmail).toHaveBeenCalledOnce();
      expect(repositoryMock.create).not.toHaveBeenCalledOnce();
      expect(
        messageServiceMock.scheduleBirthdayMessage,
      ).not.toHaveBeenCalledOnce();
    });
  });

  describe('delete', () => {
    it('should not throwing error when no error occured', async () => {
      repositoryMock.findById.mockResolvedValueOnce({
        id: '128eu-1298eh-e9h219d-219dh219',
        first_name: 'Muhammad',
        last_name: 'badar',
        email: 'mbadar6398@gmail.com',
        birth_date: '1998-03-06',
        timezone: 'Asia/Jakarta',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });

      messageServiceMock.deleteByUserId.mockResolvedValueOnce(undefined);

      repositoryMock.softDelete.mockResolvedValueOnce(undefined);

      const result = userService.delete('userId');

      await expect(result).resolves.toStrictEqual(undefined);
      expect(repositoryMock.findById).toHaveBeenCalledOnce();
      expect(messageServiceMock.deleteByUserId).toHaveBeenCalledOnce();
      expect(repositoryMock.softDelete).toHaveBeenCalledOnce();
    });

    it('should throwing EmailAlreadyExist when duplicated email', async () => {
      const expectedError = AppException.fromCode(ResourceNotFound);

      repositoryMock.findById.mockResolvedValueOnce(null);

      messageServiceMock.deleteByUserId.mockResolvedValueOnce(undefined);

      repositoryMock.softDelete.mockResolvedValueOnce(undefined);

      const result = userService.delete('userId');

      await expect(result).rejects.toStrictEqual(expectedError);
      expect(repositoryMock.findById).toHaveBeenCalledOnce();
      expect(messageServiceMock.deleteByUserId).not.toHaveBeenCalledOnce();
      expect(repositoryMock.softDelete).not.toHaveBeenCalledOnce();
    });
  });
});
