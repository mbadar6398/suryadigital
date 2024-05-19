import { Test } from '@nestjs/testing';
import { MessageModule } from '@src/modules/message/message.module';
import { MessageService } from '@src/modules/message/message.service';
import { describe, expect, it } from 'vitest';

describe('MessageModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [MessageModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(MessageService)).toBeInstanceOf(MessageService);
  });
});
