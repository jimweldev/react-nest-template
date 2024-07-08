import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        'roles',
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const user: any = request.user;

      if (!user) {
        response.status(403).json({ message: 'User not found' });
        return false;
      }

      if (user.roles && user.roles.length === 0) {
        return requiredRoles.some((role) => user.roles.includes(role));
      }

      response.status(403).json({ message: 'User not authorized' });
      return false;
    } catch (error) {
      response.status(403).json({ message: error.message });
      return false;
    }
  }
}
