import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      //  * Changed for Session, Secure for SSL (Not Used). HttpOnly is false, so that other server requests can be served
      cookie: { secure: false, httpOnly: false, maxAge: 100000000000000 },
    }),
  );
  // * Changed for Session, Credentials: true
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
