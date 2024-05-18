import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@src/configs/config.module';
import { UserService } from '@src/modules/user/user.service';
import { PrismaModule } from '@src/libs/prisma/prisma.module';
import { describe, beforeEach, expect, it } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { UserRepository } from '@src/modules/user/user.repository';

describe('User Service', () => {
  let userService: UserService;
  let repositoryMock: DeepMockProxy<UserRepository>;

  beforeEach(async () => {
    repositoryMock = mockDeep<UserRepository>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, PrismaModule],
      providers: [
        UserService,
        { provide: UserRepository, useValue: repositoryMock },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    mockReset(repositoryMock);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
