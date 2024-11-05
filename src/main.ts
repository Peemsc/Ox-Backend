import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
  .setTitle('OX Game API')
  .setDescription(`
    API for Tic-tac-toe game with OAuth authentication.
    
    Features:
    - Google OAuth login
    - Game creation and moves
    - Score tracking
    - Player statistics
  `)
  .setVersion('1.0')
  .addTag('Authentication', 'Google OAuth endpoints')
  .addTag('Game', 'Game-related endpoints')
  .addTag('User', 'User profile and leaderboard')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enhanced ValidationPipe setup
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      
    forbidNonWhitelisted: true, 
    transform: true,          
    transformOptions: {
      enableImplicitConversion: true  
    }
  }));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: 'http://localhost:3001', // frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3000);
}
bootstrap();