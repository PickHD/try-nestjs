import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));

  const port = process.env.APP_PORT || 3000;

  await app.listen(port);
}
bootstrap();
