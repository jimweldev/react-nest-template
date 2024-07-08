import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(configuration().app.globalPrefix, { exclude: [''] });
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(configuration().app.port);

  console.log(`Application is running`);
}
bootstrap();
