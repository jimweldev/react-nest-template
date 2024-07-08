import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import configuration from '../config/configuration';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: configuration().jwt.accessToken.secret,
      signOptions: configuration().jwt.accessToken.signOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
