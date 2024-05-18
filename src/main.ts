import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@src/app/app.module';
import {
  Logger,
  ValidationError,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { basename } from 'path';
import { AppException } from '@src/common/exceptions/app-exception';
import { InvalidRequest } from '@src/common/exceptions/common.exception';
import { ConfigService } from '@src/configs/config.service';
import { ErrorFilter } from '@src/common/filters/error-filter';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  const effectivePort = process.env.PORT ?? 3000;
  const configService = app.get(ConfigService);

  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

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

  app.useGlobalFilters(new ErrorFilter(configService, logger));

  app.setGlobalPrefix('api', { exclude: ['/'] });

  await app.listen(3000);
  logger.log(
    `Application is listening on PORT ${effectivePort}`,
    basename(__filename),
  );
};
bootstrap();
