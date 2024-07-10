// custom-socket-io-adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';

export class CustomSocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: [
          'http://localhost:3000',
          'https://react-nest-template.vercel.app',
        ],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    return server;
  }
}
