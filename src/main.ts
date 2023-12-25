import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppService } from './app.service';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { CustomExceptionFilter } from './common/exceptions/custom.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  ); // new UnprocessableEntityException(errors) new LaravelValidationException(errors)

  useContainer(app.select(AppModule), {
    fallback: true,
    fallbackOnErrors: true,
  });
  const appService = app.get(AppService);
  app.useGlobalFilters(new CustomExceptionFilter(appService));

  const port = appService.getServerPort();
  await app.listen(port);
}
bootstrap();
