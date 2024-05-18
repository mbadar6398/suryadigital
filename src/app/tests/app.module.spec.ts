import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app/app.module';
import { AppService } from '@src/app/app.service';
import { describe, expect, it } from 'vitest';

describe('AppModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(AppService)).toBeInstanceOf(AppService);
  });
});
