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
});
