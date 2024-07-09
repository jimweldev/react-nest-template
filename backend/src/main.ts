import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(configuration().app.globalPrefix, { exclude: [''] });
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(configuration().app.port);

  // Configure WebSocket server
  const ioAdapter = new IoAdapter(app);
  ioAdapter.createIOServer(3001);
  app.useWebSocketAdapter(ioAdapter);

  console.log(`Application is running`);
}
bootstrap();
