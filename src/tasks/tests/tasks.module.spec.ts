import { Test } from '@nestjs/testing';
import { TasksModule } from '@src/tasks/tasks.module';
import { TasksService } from '@src/tasks/tasks.service';
import { describe, expect, it } from 'vitest';

describe('TasksModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [TasksModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(TasksService)).toBeInstanceOf(TasksService);
  });
});
