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
});
