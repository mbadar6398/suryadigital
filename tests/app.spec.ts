import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ErrorFilter } from '@src/common/filters/error-filter';
import { ConfigService } from '@src/configs/config.service';
import { ConfigModule } from '@src/configs/config.module';
import { UserModule } from '@src/modules/user/user.module';
import { Reflector } from '@nestjs/core';
import { InvalidRequest } from '@src/common/exceptions/common.exception';
import { AppException } from '@src/common/exceptions/app-exception';
import { AppModule } from '@src/app/app.module';

describe('App', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, ConfigModule, UserModule],
      providers: [Logger],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new AppException(
            Object.values(validationErrors?.[0]?.constraints ?? {}).join(','),
            InvalidRequest,
          );
        },
      }),
    );
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api', { exclude: ['/'] });

    app.useGlobalFilters(
      new ErrorFilter(app.get(ConfigService), app.get(Logger)),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  describe('GET api/health-check', () => {
    it(`It should return 200 with expected response when success`, async () => {
      const result = await app.inject({
        method: 'GET',
        url: '/api/healthcheck',
      });
      const body = JSON.parse(result.body);

      expect(result.statusCode).toStrictEqual(200);
      expect(body.message).toStrictEqual('Success');
      expect(body.code).toStrictEqual('1');
      expect(body.data).toStrictEqual({
        version: '1.0.0',
        commitHash: '',
      });
    });

    it(`It should return 404 when endpoint not found`, async () => {
      const result = await app.inject({
        method: 'GET',
        url: '/api/notfound',
      });
      const body = JSON.parse(result.body);

      expect(result.statusCode).toStrictEqual(404);
      expect(body.message).toStrictEqual('Resource not found');
      expect(body.code).toStrictEqual('-3');
      expect(body.data).toStrictEqual(null);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
