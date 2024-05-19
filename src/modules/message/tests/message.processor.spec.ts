import { Test, TestingModule } from '@nestjs/testing';
import { MessageProcessor } from '@src/modules/message/message.processor';
import { MessageService } from '@src/modules/message/message.service';
import { PrismaModule } from '@src/libs/prisma/prisma.module';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { describe, beforeEach, expect, it } from 'vitest';
import { BullModule } from '@nestjs/bull';

describe('Message Processor', () => {
  let processor: MessageProcessor;
  let serviceMock: DeepMockProxy<MessageService>;

  beforeEach(async () => {
    serviceMock = mockDeep<MessageService>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        BullModule.registerQueue({
          name: 'message',
        }),
      ],
      providers: [
        MessageProcessor,
        { provide: MessageService, useValue: serviceMock },
      ],
    }).compile();

    processor = module.get<MessageProcessor>(MessageProcessor);
    mockReset(serviceMock);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should call sendMessage and changeStatus with correct arguments when called with valid job data', async () => {
    serviceMock.sendMessage.mockResolvedValueOnce({
      data: {
        status: 'success',
        sentTime: new Date(),
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    serviceMock.changeStatus.mockResolvedValueOnce(undefined);

    const result = processor.handleSendMessage({
      id: 'message-id',
      data: {
        user: {
          email: 'mbadar6398@gmail.com',
        },
        text: 'Happy birthday Muhammad Badar! 🎉🎉🎉',
      },
    } as any);
    await expect(result).resolves.toStrictEqual(undefined);
    expect(serviceMock.sendMessage).toHaveBeenCalledOnce();
    expect(serviceMock.changeStatus).toHaveBeenCalledOnce();
  });

  it('should throw an error when failed to send message', async () => {
    serviceMock.sendMessage.mockRejectedValueOnce(new Error());

    const result = processor.handleSendMessage({
      id: 'message-id',
      data: {
        user: {
          email: 'mbadar6398@gmail.com',
        },
        text: 'Happy birthday Muhammad Badar! 🎉🎉🎉',
      },
    } as any);

    await expect(result).resolves.toStrictEqual(undefined);
    expect(serviceMock.sendMessage).toHaveBeenCalledOnce();
    expect(serviceMock.changeStatus).not.toHaveBeenCalledOnce();
  });

  it('should throw an error when failed to change status', async () => {
    serviceMock.sendMessage.mockResolvedValueOnce({
      data: {
        status: 'success',
        sentTime: new Date(),
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    serviceMock.changeStatus.mockRejectedValueOnce(new Error());

    const result = processor.handleSendMessage({
      id: 'message-id',
      data: {
        user: {
          email: 'mbadar6398@gmail.com',
        },
        text: 'Happy birthday Muhammad Badar! 🎉🎉🎉',
      },
    } as any);

    await expect(result).resolves.toStrictEqual(undefined);
    expect(serviceMock.sendMessage).toHaveBeenCalledOnce();
    expect(serviceMock.changeStatus).toHaveBeenCalledOnce();
  });
});
