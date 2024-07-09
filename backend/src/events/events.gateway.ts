import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EventsService } from './events.service';
import { Socket, Server } from 'socket.io';
import configuration from '../config/configuration';

interface UserSocket {
  socketId: string;
  userId: string;
}

@WebSocketGateway(configuration().app.socketPort, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private readonly eventsService: EventsService) {}

  @WebSocketServer() server: Server;

  private onlineUsers: UserSocket[] = [];

  handleConnection(client: Socket) {
    console.log('connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected', client.id);
    this.onlineUsers = this.onlineUsers.filter(
      (userSocket) => userSocket.socketId !== client.id,
    );
    this.server.emit('getOnlineUsers', this.onlineUsers);
  }

  // LOGIN
  @SubscribeMessage('login')
  handleLogin(@ConnectedSocket() socket: Socket, @MessageBody() userId: any) {
    const existingUser = this.onlineUsers.find(
      (userSocket) => userSocket.socketId === socket.id,
    );

    if (!existingUser) {
      const userSocket: UserSocket = { socketId: socket.id, userId };
      this.onlineUsers.push(userSocket);
      this.server.emit('getOnlineUsers', this.onlineUsers);
    }

    // Join the room named after the userId
    socket.join(userId);
  }

  // SEND MESSAGE
  @SubscribeMessage('sendMessage')
  handleSendMessage(@MessageBody() data: { userId: string; message: any }) {
    const { userId, message } = data;

    // Send a message to the room associated with the userId
    this.server.to(userId).emit('receiveMessage', message);
  }
}
