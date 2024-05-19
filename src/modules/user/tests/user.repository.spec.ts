import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@src/configs/config.module';
import { UserRepository } from '@src/modules/user/user.repository';
import { PrismaModule } from '@src/libs/prisma/prisma.module';
import { describe, beforeEach, expect, it } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@src/libs/prisma/prisma.service';

describe('User Repository', () => {
  let userRepository: UserRepository;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, PrismaModule],
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    mockReset(prismaMock);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should return user data when no error occured', async () => {
      const dto = {
        user: {
          first_name: 'Muhammad',
          last_name: 'badar',
          email: 'mbadar6398@gmail.com',
          birth_date: '1998-03-06',
          timezone: 'Asia/Jakarta',
          deleted_at: null,
        },
      };

      const expectedResult = {
        id: '128eu-1298eh-e9h219d-219dh219',
        first_name: 'Muhammad',
        last_name: 'badar',
        email: 'mbadar6398@gmail.com',
        birth_date: '1998-03-06',
        timezone: 'Asia/Jakarta',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      prismaMock.user.create.mockResolvedValueOnce(expectedResult);

      const result = userRepository.create(dto.user);

      await expect(result).resolves.toStrictEqual({
        ...expectedResult,
        created_at: expect.anything(),
        updated_at: expect.anything(),
      });
      expect(prismaMock.user.create).toHaveBeenCalledOnce();
    });

    it('should throw error when unxpected error occured', async () => {
      const dto = {
        user: {
          first_name: 'Muhammad',
          last_name: 'badar',
          email: 'mbadar6398@gmail.com',
          birth_date: '1998-03-06',
          timezone: 'Asia/Jakarta',
          deleted_at: null,
        },
      };

      prismaMock.user.create.mockRejectedValueOnce(new Error());
      const result = userRepository.create(dto.user);

      await expect(result).rejects.toStrictEqual(new Error());
    });
  });

  describe('softDelete', () => {
    it('should delete user when no error occured', async () => {
      prismaMock.user.update.mockResolvedValueOnce({
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

      const result = userRepository.softDelete('128eu-1298eh-e9h219d-219dh219');

      await expect(result).resolves.toStrictEqual(undefined);
      expect(prismaMock.user.update).toHaveBeenCalledOnce();
    });

    it('should throw error when unxpected error occured', async () => {
      prismaMock.user.update.mockRejectedValueOnce(new Error());

      const result = userRepository.softDelete('128eu-1298eh-e9h219d-219dh219');

      await expect(result).rejects.toStrictEqual(new Error());
      expect(prismaMock.user.update).toHaveBeenCalledOnce();
    });
  });

  describe('findByEmail', () => {
    it('should return user data when no error occured', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
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

      const result = userRepository.findByEmail('mbadar6398@gmail.com');

      await expect(result).resolves.toStrictEqual({
        id: '128eu-1298eh-e9h219d-219dh219',
        first_name: 'Muhammad',
        last_name: 'badar',
        email: 'mbadar6398@gmail.com',
        birth_date: '1998-03-06',
        timezone: 'Asia/Jakarta',
        created_at: expect.anything(),
        updated_at: expect.anything(),
        deleted_at: null,
      });
      expect(prismaMock.user.findUnique).toHaveBeenCalledOnce();
    });

    it('should throw error when unxpected error occured', async () => {
      prismaMock.user.findUnique.mockRejectedValueOnce(new Error());

      const result = userRepository.findByEmail('mbadar6398@gmail.com');

      await expect(result).rejects.toStrictEqual(new Error());
      expect(prismaMock.user.findUnique).toHaveBeenCalledOnce();
    });
  });

  describe('findById', () => {
    it('should return user data when no error occured', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
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

      const result = userRepository.findById('128eu-1298eh-e9h219d-219dh219');

      await expect(result).resolves.toStrictEqual({
        id: '128eu-1298eh-e9h219d-219dh219',
        first_name: 'Muhammad',
        last_name: 'badar',
        email: 'mbadar6398@gmail.com',
        birth_date: '1998-03-06',
        timezone: 'Asia/Jakarta',
        created_at: expect.anything(),
        updated_at: expect.anything(),
        deleted_at: null,
      });
      expect(prismaMock.user.findUnique).toHaveBeenCalledOnce();
    });

    it('should throw error when unxpected error occured', async () => {
      prismaMock.user.findUnique.mockRejectedValueOnce(new Error());

      const result = userRepository.findById('128eu-1298eh-e9h219d-219dh219');

      await expect(result).rejects.toStrictEqual(new Error());
      expect(prismaMock.user.findUnique).toHaveBeenCalledOnce();
    });
  });
});
