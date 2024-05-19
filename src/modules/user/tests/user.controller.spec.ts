import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@src/modules/user/user.controller';
import { UserService } from '@src/modules/user/user.service';
import { PrismaModule } from '@src/libs/prisma/prisma.module';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { describe, beforeEach, expect, it } from 'vitest';

describe('User Controller', () => {
  let controller: UserController;
  let serviceMock: DeepMockProxy<UserService>;

  beforeEach(async () => {
    serviceMock = mockDeep<UserService>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: serviceMock }],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockReset(serviceMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should not throwing error when no error occured', async () => {
      const body = {
        first_name: 'Muhammad',
        last_name: 'badar',
        email: 'mbadar6398@gmail.com',
        birth_date: '1998-03-06',
        timezone: 'Asia/Jakarta',
      };
      serviceMock.create.mockResolvedValueOnce();
      await expect(controller.create(body)).resolves.toStrictEqual(undefined);
    });

    it('should throw an error when error occured', async () => {
      const body = {
        first_name: 'Muhammad',
        last_name: 'badar',
        email: 'mbadar6398@gmail.com',
        birth_date: '1998-03-06',
        timezone: 'Asia/Jakarta',
      };
      serviceMock.create.mockRejectedValueOnce(new Error());
      await expect(controller.create(body)).rejects.toStrictEqual(new Error());
    });
  });

  describe('delete/:id', () => {
    it('should not throwing error when no error occured', async () => {
      serviceMock.delete.mockResolvedValueOnce();
      await expect(
        controller.delete({ id: '21312-213812-12381-128378' }),
      ).resolves.toStrictEqual(undefined);
    });

    it('should throw an error when error occured', async () => {
      serviceMock.delete.mockRejectedValueOnce(new Error());
      await expect(
        controller.delete({ id: '12832-3128-21512-12512' }),
      ).rejects.toStrictEqual(new Error());
    });
  });
});
