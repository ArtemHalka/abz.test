import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new WrapResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(
    session({
      secret: 'session-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 86400,
      },
    }),
  );
  app.enableCors({ credentials: true });
  const PORT = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(PORT);
}
bootstrap();
