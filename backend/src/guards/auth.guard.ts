import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      const authorizationHeader = request.headers.authorization;
      if (!authorizationHeader) {
        throw new Error('Authorization header missing');
      }

      const accessToken = authorizationHeader.split(' ')[1];
      const { id }: any = this.jwtService.verify(accessToken);

      const user = await this.usersRepository.findOne({
        where: { id },
      });

      if (!user) {
        response.status(401).json({ message: 'User not found' });
        return false;
      }

      request.user = user;

      //   const u: any = {
      //     roles: ['USER'],
      //   };

      //   request.user = u;

      return true;
    } catch (error) {
      response.status(401).json({ message: error.message });
      return false;
    }
  }
}
