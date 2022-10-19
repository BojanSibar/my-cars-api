// import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // not set up during E2E tests
  // so we move it to app.module.ts

  // app.use(
  //   cookieSession({
  //     keys: ['adasdasd'],
  //   }),
  // );

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // strip additional properties
  //   }),
  // );
  await app.listen(9999);
}
bootstrap();
