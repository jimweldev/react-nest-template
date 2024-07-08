import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Req() req: Request, @Res() res: Response) {
    return this.authService.login(req, res);
  }

  @Post('register')
  register(@Req() req: Request, @Res() res: Response) {
    return this.authService.register(req, res);
  }

  @Post('refresh')
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(req, res);
  }
}
