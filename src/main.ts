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
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  const effectivePort = process.env.PORT ?? 3000;
  const configService = app.get(ConfigService);

  const options = new DocumentBuilder()
    .setTitle('Surya Digital Test Api')
    .setDescription('This api documentation for testing purpose only.')
    .setVersion('1.0')
    .addServer('http://localhost:3000/api', 'Local environment')
    .addTag('User', 'User related operations')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

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

  await app.listen(effectivePort);
  logger.log(
    `Application is listening on PORT ${effectivePort}`,
    basename(__filename),
  );
};
bootstrap();
