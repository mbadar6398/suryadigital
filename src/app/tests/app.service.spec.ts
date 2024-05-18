import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '@src/app/app.service';
import { ConfigService } from '@src/configs/config.service';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

describe('App Service', () => {
  let appService: AppService;
  let configMock: DeepMockProxy<ConfigService>;

  beforeEach(async () => {
    configMock = mockDeep<ConfigService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService, { provide: ConfigService, useValue: configMock }],
    }).compile();

    appService = module.get<AppService>(AppService);
    mockReset(configMock);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('healthcheck', () => {
    it('should return a HealthCheckResponse object with version and commitHash properties', () => {
      const appService = new AppService(new ConfigService());
      const result = appService.healthCheck();
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('commitHash');
    });

    it('should return an object with empty string as version if configService.get("version") returns null', () => {
      const configService = new ConfigService();
      vi.spyOn(configService, 'get').mockReturnValueOnce('');
      const appService = new AppService(configService);
      const result = appService.healthCheck();
      expect(result.version).toBe('');
    });
  });
});
