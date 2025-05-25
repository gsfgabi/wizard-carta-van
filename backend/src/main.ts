import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://frontend-3tdulkfc4-gabriellas-projects-4c874924.vercel.app', 
      'https://frontend-phi-swart.vercel.app'
    ], 
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  
  const config = new DocumentBuilder()
    .setTitle('API de Carta de Van Bancária')
    .setDescription('Documentação da API de carta de van bancária')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();