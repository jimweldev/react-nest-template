import { Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { JwtService } from '@nestjs/jwt';
import configuration from '../config/configuration';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(@Req() req: Request, @Res() res: Response) {
    // return res.status(400).json({ message: 'All fields are required' });

    try {
      const { username, password }: AuthLoginDto = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const user = await this.userRepository.findOne({ where: { username } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const accessToken = this.generateToken(user);
      const refreshToken = this.generateToken(user, 'refreshToken');

      return res
        .status(200)
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: configuration().jwt.secure,
          sameSite: configuration().jwt.sameSite,
        })
        .json({ accessToken, user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async register(@Req() req: Request, @Res() res: Response) {
    try {
      const { username, password, confirm_password }: AuthRegisterDto =
        req.body;

      if (!username || !password || !confirm_password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      const existingUser = await this.userRepository.findOne({
        where: { username },
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.userRepository.create({
        username,
        password: hashedPassword,
      });

      await this.userRepository.save(newUser);

      const accessToken = this.generateToken(newUser);
      const refreshToken = this.generateToken(newUser, 'refreshToken');

      return res
        .status(201)
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: configuration().jwt.secure,
          sameSite: configuration().jwt.sameSite,
        })
        .json({ accessToken, user: newUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      let { refreshToken } = req.cookies;

      if (!refreshToken || typeof refreshToken === 'undefined') {
        return res.status(403).json({ error: 'Refresh token required' });
      }

      const { id }: any = this.jwtService.verify(refreshToken, {
        secret: configuration().jwt.refreshToken.secret,
      });

      const user = await this.userRepository.findOne({
        where: { id },
      });

      const accessToken = this.generateToken(user, 'accessToken');
      refreshToken = this.generateToken(user, 'refreshToken');

      res
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: configuration().jwt.secure,
          sameSite: configuration().jwt.sameSite,
        })
        .status(200)
        .json({ user, accessToken });
    } catch (error) {
      return res.status(204).json({ error: error.message });
    }
  }

  private generateToken(
    user: User,
    type: 'accessToken' | 'refreshToken' = 'accessToken',
  ) {
    // access token
    if (type === 'accessToken') {
      return this.jwtService.sign({ id: user.id });
    }

    // refresh token
    return this.jwtService.sign(
      { id: user.id },
      {
        expiresIn: configuration().jwt.refreshToken.signOptions.expiresIn,
        secret: configuration().jwt.refreshToken.secret,
      },
    );
  }
}
