import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(configuration().app.globalPrefix, { exclude: [''] });
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const ioAdapter = new IoAdapter(app);
  ioAdapter.createIOServer = (port: number, options?: ServerOptions): any => {
    const server = ioAdapter.createIOServer(port, {
      ...options,
      cors: {
        origin: true,
        credentials: true,
      },
    });
    return server;
  };

  app.useWebSocketAdapter(ioAdapter);

  // app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(configuration().app.port);

  console.log(`Application is running`);
}
bootstrap();
