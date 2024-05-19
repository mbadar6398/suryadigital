import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@src/configs/config.module';
import { TasksService } from '@src/tasks/tasks.service';
import { PrismaModule } from '@src/libs/prisma/prisma.module';
import { describe, beforeEach, expect, it } from 'vitest';
import { DeepMockProxy, mockDeep, mockReset } from 'vitest-mock-extended';
import { MessageService } from '@src/modules/message/message.service';
import { Job, Queue } from 'bull';
import { Message } from '@prisma/client';

describe('User Service', () => {
  let tasksService: TasksService;
  let messageService: DeepMockProxy<MessageService>;
  let queueService: DeepMockProxy<Queue>;

  beforeEach(async () => {
    messageService = mockDeep<MessageService>();
    queueService = mockDeep<Queue>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, PrismaModule],
      providers: [
        TasksService,
        { provide: MessageService, useValue: messageService },
        {
          provide: 'BullQueue_message',
          useValue: queueService,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    mockReset(messageService);
    mockReset(queueService);
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  it('should retrieve scheduled messages and add them to the message queue', async () => {
    const scheduledMessages = [{ text: 'asd' }] as Message[];
    messageService.getScheduled.mockResolvedValueOnce(scheduledMessages);
    queueService.add.mockResolvedValueOnce({} as Job);

    const result = tasksService.handleScheduledMessage();

    await expect(result).resolves.toStrictEqual(undefined);
    expect(messageService.getScheduled).toHaveBeenCalledTimes(1);
    expect(queueService.add).toHaveBeenCalledTimes(1);
  });
});
