import { Test } from '@nestjs/testing';
import { UserModule } from '@src/modules/user/user.module';
import { UserService } from '@src/modules/user/user.service';
import { describe, expect, it } from 'vitest';

describe('UserModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(UserService)).toBeInstanceOf(UserService);
  });
});
