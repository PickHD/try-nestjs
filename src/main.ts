import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const port = process.env.APP_PORT || 3000;

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Try Services')
    .setDescription('contain various API for learn purposes')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('books')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
