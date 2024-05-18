import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@src/app/app.controller';
import { AppService } from '@src/app/app.service';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { describe, beforeEach, expect, it } from 'vitest';
import { Logger } from '@nestjs/common';

describe('App Controller', () => {
  let controller: AppController;
  let serviceMock: DeepMockProxy<AppService>;

  beforeEach(async () => {
    serviceMock = mockDeep<AppService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: serviceMock }, Logger],
    }).compile();

    controller = module.get<AppController>(AppController);
    mockReset(serviceMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should receive health check status when success', async () => {
      serviceMock.healthCheck.mockResolvedValueOnce({
        version: '1.0',
        commitHash: '12dih129dh821dh2891d12',
      });
      await expect(controller.healthCheck()).resolves.toStrictEqual({
        version: '1.0',
        commitHash: '12dih129dh821dh2891d12',
      });
    });
  });
});
